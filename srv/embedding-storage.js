// const fs = require("node:fs");
const { writeFile, unlink } = require("node:fs/promises");
const cds = require("@sap/cds");
// const { INSERT, DELETE, SELECT } = cds.ql;
const { PDFDocument } = require("pdf-lib");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");

function getAiEmbeddingConfig() {
  const genAiHub = cds.env.requires["GENERATIVE_AI_HUB"];
  return {
    destinationName: genAiHub["EMBEDDING_MODEL_DESTINATION_NAME"],
    resourceGroup: genAiHub["EMBEDDING_MODEL_RESOURCE_GROUP"],
    deploymentUrl: genAiHub["EMBEDDING_MODEL_DEPLOYMENT_URL"],
    modelName: genAiHub["EMBEDDING_MODEL_NAME"],
    apiVersion: genAiHub["EMBEDDING_MODEL_API_VERSION"],
  };
}

async function preparePdf(tempDocLocation, stream) {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const pdfBytes = [];
  
      // Collect streaming PDF content
      stream.on("data", (chunk) => {
        pdfBytes.push(chunk);
      });
  
      // Wait for the file content stream to finish
      await new Promise((resolve, reject) => {
        stream.on("end", resolve);
        stream.on("error", reject);
      });
  
      // Convert to Buffer
      const pdfBuffer = Buffer.concat(pdfBytes);
  
      // Load PDF buffer into a document
      const externalPdfDoc = await PDFDocument.load(pdfBuffer);
  
      // Copy pages from external PDF document to the new document
      const pages = await pdfDoc.copyPages(
        externalPdfDoc,
        externalPdfDoc.getPageIndices()
      );
      pages.forEach((page) => {
        pdfDoc.addPage(page);
      });
  
      // Save the PDF document to a new file
      const pdfData = await pdfDoc.save();
      await writeFile(tempDocLocation, pdfData);
}

async function embeddingDocument(uuid, entities) {
  const { Files, DocumentChunk } = entities;
  const result = await cds
    .read(Files)
    .columns(["fileName", "content"])
    .where({ ID: uuid });
  if (result.length === 0) {
    throw new Error(`Document ${uuid} not found!`);
  }
  const tempDocLocation = __dirname + `/${result[0].fileName}`;
  try {

    await preparePdf(tempDocLocation, result[0].content);

    // Delete existing embeddings
    await cds.delete(DocumentChunk);

    // Load the document to langchain text loader
    const loader = new PDFLoader(tempDocLocation);
    const document = await loader.load();

    // Split the document into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
      addStartIndex: true,
    });

    const textChunks = await splitter.splitDocuments(document);
    const aiEmbeddingConfig = getAiEmbeddingConfig();
    const textChunkEntries = [];
    const vectorplugin = await cds.connect.to("cap-llm-plugin");
    // For each text chunk generate the embeddings
    /* for (const chunk of textChunks) {
      const embedding = await vectorplugin.getEmbedding(
        aiEmbeddingConfig,
        chunk.pageContent
      );
      const entry = {
        text_chunk: chunk.pageContent,
        metadata_column: result[0].fileName,
        embedding: array2VectorBuffer(embedding),
      };
      textChunkEntries.push(entry);
    }

    console.log("Inserting text chunks with embeddings into db.");
    // Insert the text chunk with embeddings into db
    const insertStatus =
      await INSERT.into(DocumentChunk).entries(textChunkEntries);
    if (!insertStatus) {
      throw new Error("Insertion of text chunks into db failed!");
    } */
  } catch (err) {
    throw new Error("Error while generating and storing vector embeddings.", {
      reason: err,
    });
  } finally {
    // Delete temp document
    deleteTempFile(tempDocLocation);
  }
}

// Helper method to convert embeddings to buffer for insertion
let array2VectorBuffer = (data) => {
  const sizeFloat = 4;
  const sizeDimensions = 4;
  const bufferSize = data.length * sizeFloat + sizeDimensions;

  const buffer = Buffer.allocUnsafe(bufferSize);
  // write size into buffer
  buffer.writeUInt32LE(data.length, 0);
  data.forEach((value, index) => {
    buffer.writeFloatLE(value, index * sizeFloat + sizeDimensions);
  });
  return buffer;
};

// Helper method to delete file if it already exists
function deleteTempFile(filePath) {
  return unlink(filePath);
}

module.exports = class Embedding extends cds.ApplicationService {
  init() {
    const { Files, DocumentChunk } = this.entities;

    this.after("UPDATE", Files, async (results, req) => {
      embeddingDocument(results.ID, this.entities);
    });

    /* this.on("UPDATExxx", Files, async (req) => {
      console.dir("on Files..........");
      console.dir(req.data);
      await embeddingDocumentFromRequest(req.data.content, this.entities);
    }); */

    /* this.on("storeEmbeddings", async (req) => {
      try {
        const { uuid } = req.data;
        const { Files, DocumentChunk } = this.entities;
        const vectorplugin = await cds.connect.to("cap-llm-plugin");
        let textChunkEntries = [];

        // Check if document exists
        const isDocumentPresent = await SELECT.from(Files).where({ ID: uuid });
        if (isDocumentPresent.length === 0) {
          throw new Error(
            `Document with uuid:  ${uuid} not yet persisted in database!`
          );
        }

        // Load pdf from HANA and create a temp pdf doc
        const result = await SELECT("content").from(Files, uuid);
        const stream = result.content;
        // const stream = await db.stream(SELECT('content').from(Files, uuid));
        const fileName = await SELECT("fileName")
          .from(Files)
          .where({ ID: uuid });
        const tempDocLocation = __dirname + `/${fileName[0].fileName}`;

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        const pdfBytes = [];

        // Read PDF content and store it in pdfBytes array
        stream.on("data", (chunk) => {
          pdfBytes.push(chunk);
        });

        // Wait for the stream to finish
        await new Promise((resolve, reject) => {
          stream.on("end", () => {
            resolve();
          });
        });

        // Convert pdfBytes array to a single Buffer
        const pdfBuffer = Buffer.concat(pdfBytes);

        // Load PDF data into a document
        const externalPdfDoc = await PDFDocument.load(pdfBuffer);

        // Copy pages from external PDF document to the new document
        const pages = await pdfDoc.copyPages(
          externalPdfDoc,
          externalPdfDoc.getPageIndices()
        );
        pages.forEach((page) => {
          pdfDoc.addPage(page);
        });

        // Save the PDF document to a new file
        const pdfData = await pdfDoc.save();
        await fs.writeFileSync(tempDocLocation, pdfData);

        console.log(
          "Temporary PDF File restored and saved to:",
          tempDocLocation
        );

        // Delete existing embeddings
        await DELETE.from(DocumentChunk);

        // Load the document to langchain text loader
        const loader = new PDFLoader(tempDocLocation);
        const document = await loader.load();

        // Split the document into chunks
        console.log("Splitting the document into text chunks.");
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1500,
          chunkOverlap: 150,
          addStartIndex: true,
        });

        const textChunks = await splitter.splitDocuments(document);
        console.log(`Documents split into ${textChunks.length} chunks.`);

        console.log("Generating the vector embeddings for the text chunks.");
        const aiEmbeddingConfig = getAiEmbeddingConfig();
        // For each text chunk generate the embeddings
        for (const chunk of textChunks) {
          const embedding = await vectorplugin.getEmbedding(
            aiEmbeddingConfig,
            chunk.pageContent
          );
          const entry = {
            text_chunk: chunk.pageContent,
            metadata_column: fileName,
            embedding: array2VectorBuffer(embedding),
          };
          textChunkEntries.push(entry);
        }

        console.log("Inserting text chunks with embeddings into db.");
        // Insert the text chunk with embeddings into db
        const insertStatus =
          await INSERT.into(DocumentChunk).entries(textChunkEntries);
        if (!insertStatus) {
          throw new Error("Insertion of text chunks into db failed!");
        }

        // Delete temp document
        deleteIfExists(tempDocLocation);
      } catch (error) {
        // Handle any errors that occur during the execution
        console.log(
          "Error while generating and storing vector embeddings:",
          error
        );
        throw error;
      }
      return "Embeddings stored successfully!";
    }); */

    this.on("deleteEmbeddings", async () => {
      try {
        await cds.delete(DocumentChunk);
      } catch (err) {
        throw new Error("Error deleting the embeddings from db.", {
          reason: err,
        });
      }
    });

    return super.init();
  }
};
