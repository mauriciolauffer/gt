using {capgenairag as db} from '../db/schema';

service EmbeddingStorageService  {
  entity DocumentChunk as
    projection on db.DocumentChunk
    excluding {
      embedding
    };

  entity Files @(restrict: [{
    grant: [
      'READ',
      'WRITE',
      'UPDATE',
      'DELETE'
    ],
    where: 'createdBy = $user'
  }])                  as projection on db.Files;

  action   storeEmbeddings(uuid : String) returns String;
  function deleteEmbeddings()             returns String;

}

/* annotate EmbeddingStorageService.DocumentChunk with
@odata.draft.enabled
@Capabilities.Updatable : false;

annotate EmbeddingStorageService.Files with
@odata.draft.enabled
@Capabilities.Updatable : false; */