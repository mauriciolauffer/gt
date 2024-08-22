using EmbeddingStorageService as service from '../../srv/embedding-storage';
annotate service.Files with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'content',
                Value : content,
            },
            {
                $Type : 'UI.DataField',
                Label : 'mediaType',
                Value : mediaType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'fileName',
                Value : fileName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'size',
                Value : size,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'content',
            Value : content,
        },
        {
            $Type : 'UI.DataField',
            Label : 'mediaType',
            Value : mediaType,
        },
        {
            $Type : 'UI.DataField',
            Label : 'fileName',
            Value : fileName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'size',
            Value : size,
        },
    ],
);

