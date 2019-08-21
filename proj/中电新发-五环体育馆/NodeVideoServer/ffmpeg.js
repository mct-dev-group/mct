const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { getTokens, getRtspUrls, vmsLogout } = require("./rtsp");
const { writeLog, fileMtimeDiff } = require("./utils");
const { command1, command2, connWhiteList } = require("./config");

const ffmpeg = {
  task: {
    isRunning: false,
    IDs: new Set()
  },
  conn_pool: new Map(),
  TIMEDIFF: 10000,
  token: null,
  addToTask(ID) {
    const directoryPath = path.join(__dirname, `public/video/${ID}`);
    const filePath = path.join(__dirname, `public/video/${ID}/${ID}.m3u8`);
	try {
      fs.readdirSync(directoryPath);
    } catch (error) {
      fs.mkdirSync(directoryPath);
    }
    const conn_item = {
      id: ID,
      url: "",
      handle: null,
      dirPath: directoryPath,
      filePath: filePath,
      timeStamp: Date.now()
    };
    ffmpeg.task.IDs.add(ID);
    ffmpeg.conn_pool.set(ID, conn_item);
  },
  checkTaskForRun() {
	if(ffmpeg.task.IDs.size > 0){
		setTimeout(ffmpeg.checkTaskForRun,10)
	}else{
		setTimeout(ffmpeg.checkTaskForRun,100)
	}
    ffmpeg.task.IDs.forEach(ID => {
      if (ffmpeg.task.isRunning) return;
	  console.log(ID)
      ffmpeg.task.isRunning = true;
	  ffmpeg.task.IDs.delete(ID);
	  console.log('forrun')
      ffmpeg.runFfmpeg(ID);
    });
  },
  async runFfmpeg(ID) {
    const rtspUrl = await getRtspUrls(ID);
	if(!ffmpeg.conn_pool.get(ID)) {
		ffmpeg.task.isRunning = false;
		return;
	};
	
    // const outFd = fs.openSync(path.join(directoryPath, "ffmpegOut.Log"), "a");
    // const errFd = fs.openSync(path.join(directoryPath, "ffmpegErr.Log"), "a");

    const spawnOptions = [...command1, rtspUrl, ...command2, ffmpeg.conn_pool.get(ID).filePath];
    const handle = child_process.spawn("ffmpeg", spawnOptions, {
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: false,
      detached: false
    });
    handle.on("exit", (code, signal) => {
      console.log("exit", code, signal);
      if (code === 1) {
        console.error("RTSP stream exited with error");
      }
    });
    // handle.stdout.on("data", data => {
    //   console.log("out data", `stdout${data}`);
    // });
    // handle.stderr.on("data", data => {
    //   console.log("ffmpeg", `stderr${data}`);
    // });
    writeLog(
      ffmpeg.conn_pool.get(ID).dirPath + "/log.txt",
      rtspUrl + " " + new Date().toLocaleString() + "\n"
    );
	ffmpeg.conn_pool.get(ID).handle = handle;
	ffmpeg.conn_pool.get(ID).url = rtspUrl;
    ffmpeg.task.isRunning = false;
  },
  cheackFfmpegForEnd() {
    const conn_need_to_end = [];
    ffmpeg.conn_pool.forEach(c => {
      if (connWhiteList.includes(c.id)) return;
	  if (!c.handle) return;
      if (Date.now() - c.timeStamp > ffmpeg.TIMEDIFF) {
        console.log("end..." + c.id);
        conn_need_to_end.push(c);
      }
      if (fileMtimeDiff(c.dirPath) > 10000) {
        child_process.spawn("taskkill", ["/pid", c.handle.pid, "/f", "/t"]);
        ffmpeg.addToTask(c.id);
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
	  if(ffmpeg.conn_pool.has(id)){
			ffmpeg.conn_pool.get(id).timeStamp = Date.now();
	  }
  }
};
module.exports = ffmpeg;
