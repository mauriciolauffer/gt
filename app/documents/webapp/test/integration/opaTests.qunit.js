sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'documents/test/integration/FirstJourney',
		'documents/test/integration/pages/DocumentsList',
		'documents/test/integration/pages/DocumentsObjectPage'
    ],
    function(JourneyRunner, opaJourney, DocumentsList, DocumentsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('documents') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDocumentsList: DocumentsList,
					onTheDocumentsObjectPage: DocumentsObjectPage
                }
            },
            opaJourney.run
        );
    }
);