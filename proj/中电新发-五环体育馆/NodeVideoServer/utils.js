const { DBLink } = require("./config");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
module.exports = {
  async searchDB(sql) {
    try {
      return await fetch(`${DBLink}?sql=${sql}`, {
        header: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  fileMtimeDiff(dirPath) {
    const now = Date.now();
    const mtime = fs.statSync(dirPath).mtimeMs;
    return now - mtime;
  },
  writeLog(filePath, content) {
    fs.appendFileSync(filePath, content);
  }
};
