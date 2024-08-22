sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'chatting',
            componentId: 'MessageObjectPage',
            contextPath: '/Conversation/to_messages'
        },
        CustomPageDefinitions
    );
});