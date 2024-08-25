using {capgenairag as db} from '../db/schema';

service EmbeddingStorageService  {
  entity DocumentChunk as
    projection on db.DocumentChunk
    excluding {
      embedding
    };

  entity Files as projection on db.Files;

  action   storeEmbeddings(uuid : String) returns String;
  action deleteEmbeddings()             returns String;
}