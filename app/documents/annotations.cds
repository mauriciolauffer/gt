using GenaiService as service from '../../srv/services';
annotate service.Documents with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'text',
                Value : text,
            },
            {
                $Type : 'UI.DataField',
                Label : 'embedding',
                Value : embedding,
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
            Label : 'text',
            Value : text,
        },
        {
            $Type : 'UI.DataField',
            Label : 'embedding',
            Value : embedding,
        },
    ],
);

