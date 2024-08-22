sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'chatting/test/integration/FirstJourney',
		'chatting/test/integration/pages/ConversationList',
		'chatting/test/integration/pages/ConversationObjectPage',
		'chatting/test/integration/pages/MessageObjectPage'
    ],
    function(JourneyRunner, opaJourney, ConversationList, ConversationObjectPage, MessageObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('chatting') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheConversationList: ConversationList,
					onTheConversationObjectPage: ConversationObjectPage,
					onTheMessageObjectPage: MessageObjectPage
                }
            },
            opaJourney.run
        );
    }
);