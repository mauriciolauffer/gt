using {capgenairag as db} from '../db/schema';

service GenaiService @(requires: 'authenticated-user') {
    entity Documents as projection on db.Documents;
}
