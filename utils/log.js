const writelog = require("writelog");

module.exports.writelog = function(key, content) {
  /* if (Config.env === "dev") {
     return;
     }*/
  writelog(key, content);
};
