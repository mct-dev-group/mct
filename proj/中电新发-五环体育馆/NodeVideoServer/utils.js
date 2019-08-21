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
  },
  getFileCount(id) {
	  try{
		const directoryPath = path.join(__dirname, `public/video/${id}`);
		if (fs.existsSync(directoryPath)) {
		  const files = fs.readdirSync(directoryPath);
		  return files.filter(f => f.includes(".ts")).length;
		} else {
		  return 0;
		}  
	  }catch(err){
		  console.log(err);
		  return 0;
	  }
  }
};
