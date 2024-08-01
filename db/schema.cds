namespace capgenairag;

using {cuid, managed} from '@sap/cds/common';

entity Documents : cuid {
    text      : String;
    // embedding : Vector(1536);
    embedding       : String; // for local test with SQLite only
}

entity Conversation {
    key cID              : UUID not null;
        userID           : String;
        creation_time    : Timestamp;
        last_update_time : Timestamp;
        title            : String;
        to_messages      : Composition of many Message
                               on to_messages.cID = $self;
}

entity Message {
    key cID           : Association to Conversation;
    key mID           : UUID not null;
        role          : String;
        content       : LargeString;
        creation_time : Timestamp;
}

entity DocumentChunk {
    text_chunk      : LargeString;
    metadata_column : LargeString;
    // embedding       : Vector(1536);
    embedding       : String; // for local test with SQLite only
}

entity Files : cuid, managed {
    @Core.MediaType  : mediaType  @Core.ContentDisposition.Filename: fileName
    content   : LargeBinary;
    @Core.IsMediaType: true
    mediaType : String;
    fileName  : String;
    size      : String;
}
