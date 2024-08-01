namespace capgenairag;

using {cuid} from '@sap/cds/common';

entity Documents : cuid {
    text      : String;
    // embedding : Vector(1536);
    embedding : String;
}
