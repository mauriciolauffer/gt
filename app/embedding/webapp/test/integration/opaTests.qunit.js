sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'embedding/test/integration/FirstJourney',
		'embedding/test/integration/pages/FilesList',
		'embedding/test/integration/pages/FilesObjectPage'
    ],
    function(JourneyRunner, opaJourney, FilesList, FilesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('embedding') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheFilesList: FilesList,
					onTheFilesObjectPage: FilesObjectPage
                }
            },
            opaJourney.run
        );
    }
);