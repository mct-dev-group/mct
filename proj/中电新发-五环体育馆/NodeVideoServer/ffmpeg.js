const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { getTokens, getRtspUrls } = require("./rtsp");
const { writeLog } = require("./utils");
const { command1, command2 } = require("./config");

module.exports = {
  async runFfmpeg(ID) {
    const token = await getTokens();
    const rtspUrl = await getRtspUrls(token, ID);
    const directoryPath = path.join(__dirname, `public/video/${ID}`);
    const filePath = path.join(__dirname, `public/video/${ID}/${ID}.m3u8`);
    try {
      fs.readdirSync(directoryPath);
    } catch (error) {
      fs.mkdirSync(directoryPath);
    }
    const spawnOptions = [...command1, rtspUrl, ...command2, filePath];
    const handle = child_process.spawn("ffmpeg", spawnOptions, {
      detached: false
    });
    handle.on("exit", (code, signal) => {
      console.log("exit", code, signal);
      if (code === 1) {
        console.error("RTSP stream exited with error");
      }
    });
    handle.stdout.on("data", data => {
      console.log("out data", `stdout${data}`);
    });
    handle.stderr.on("data", data => {
      console.log("ffmpeg", `stderr${data}`);
    });
    writeLog(
      directoryPath + "/log.txt",
      rtspUrl + " " + new Date().toLocaleString() + "\n"
    );
    return {
      id: ID,
      url: srcUrl,
      handle,
      dirPath: directoryPath,
      filePath: filePath
    };
  }
};
