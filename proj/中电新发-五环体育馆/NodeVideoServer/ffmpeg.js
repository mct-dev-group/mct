const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { getTokens, getRtspUrls, vmsLogout } = require("./rtsp");
const { writeLog } = require("./utils");
const { command1, command2, connWhiteList } = require("./config");

const ffmpeg = {
  conn_pool: new Map(),
  TIMEDIFF: 10000,
  async runFfmpeg(ID) {
    const token = await getTokens();
    const rtspUrl = await getRtspUrls(token, ID);
    vmsLogout(token);
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
    const conn_item = {
      id: ID,
      url: rtspUrl,
      handle,
      dirPath: directoryPath,
      filePath: filePath,
      timeStamp: Date.now()
    };
    ffmpeg.conn_pool.set(ID, conn_item);
    return conn_item;
  },
  cheackFfmpegForEnd() {
    const conn_need_to_end = [];
    ffmpeg.conn_pool.forEach(c => {
      if (connWhiteList.includes(c.id)) return;
	  console.log("END",Date.now() - c.timeStamp)
      if (Date.now() - c.timeStamp > ffmpeg.TIMEDIFF) {
        console.log("end..." + c.id);
        conn_need_to_end.push(c);
      }
    });
    //kill and delete
    conn_need_to_end.forEach(c => {
      // c.handle.stdin.pause(); //not working
      // c.handle.kill(); //not working
      ffmpeg.conn_pool.delete(c.id);
      child_process.spawn("taskkill", ["/pid", c.handle.pid, "/f", "/t"]);
      fse.remove(path.join(__dirname, `public/video/${c.id}`), () => {
        console.log(`${c.id} removed`);
      });
    });
  },
  updateConnTimestamp(id) {
    const conn = ffmpeg.conn_pool.get(id);
	if(conn){
		conn.timeStamp = Date.now();
	}
  }
};
module.exports = ffmpeg