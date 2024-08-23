sap.ui.define(
  ["sap/base/Log", "sap/ui/core/mvc/Controller"],
  function (Log, BaseController) {
    "use strict";

    const logger = Log.getLogger("ai-workshop-embed");

    return BaseController.extend("chat.controller.App", {
      onAfterItemAdded: async function (evt) {
        const item = evt.getParameter("item");
        try {
          const response = await this.createEntity(item);
          this.uploadContent(item, response.ID);
        } catch (err) {
          logger.error(err);
          throw new Error("Upload error.", { reason: err });
        }
      },

      onUploadCompleted: function (evt) {
        const oUploadSet = evt.getSource();
        oUploadSet.removeAllIncompleteItems();
        oUploadSet.getBinding("items").refresh();
      },

      createEntity: async function (item) {
        window.xxx = item;
        const data = {
          ID: window.crypto.randomUUID(),
          mediaType: item.getMediaType(),
          fileName: item.getFileName(),
          size: item.getFileObject().size.toString(),
        };
        const url =
          this.getOwnerComponent().getManifestEntry("sap.app").dataSources
            .fileService.uri + "Files";
        const payload = data;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("fetch error...");
        }
      },

      uploadContent: function (item, id) {
        // debugger
        // var url = `/odata/v4/embedding-storage/Files(${id})/content`;
        const url = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.fileService.uri + `Files(${id})/content`;
        item.setUploadUrl(url);
        var oUploadSet = this.byId("uploadSet");
        oUploadSet.setHttpRequestMethod("PUT");
        oUploadSet.uploadItem(item);
      },
    });
  }
);
