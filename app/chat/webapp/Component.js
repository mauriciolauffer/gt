/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "chat/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("chat.Component", {
            metadata: {
                manifest: "json",
                interfaces: ["sap.ui.core.IAsyncContentCreation"]
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                console.dir(this.getModel())
                this.getModel('ui').setProperty("/", {
                    sessionId: crypto.randomUUID(),
                    enabled: true,
                    busy: false
                });
                this.getModel('chat').setProperty("/", []);
            }
        });
    }
);