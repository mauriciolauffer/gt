const cds = require("@sap/cds");
const ORIGINS = { "*": 1 };
/* cds.on("bootstrap", (app) =>
  app.use((req, res, next) => {
    res.set("access-control-allow-origin", "*");
    if (req.method === "OPTIONSxxx")
      // preflight request
      return res
        .set("access-control-allow-methods", "GET,HEAD,PUT,PATCH,POST,DELETE")
        .end();
    next();
  })
); */

module.exports = cds.server; // > delegate to default server.js
