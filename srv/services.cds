using {capgenairag as db} from '../db/schema';

service GenaiService {
    entity Documents as projection on db.Documents;
}
