sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/core/ComponentSupport"],
  function (Component) {
    "use strict";

    return Component.extend("documents.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },
    });
  },
);
