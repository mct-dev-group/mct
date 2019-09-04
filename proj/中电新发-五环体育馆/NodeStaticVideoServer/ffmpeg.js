const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { getRtspUrls } = require("./rtsp");
const { writeLog, fileMtimeDiff } = require("./utils");
const { commandStaticFile1, commandStaticFile2, connWhiteList } = require("./config");

const ffmpeg = {
  task: {
    isRunning: false,
    IDs: new Set()
  },
  conn_pool: new Map(),
  TIMEDIFF: 10000,
  token: null,
  /**
   * 添加ID到任务列表
   */
  addToTask(ID) {
    if (ffmpeg.hasEffectiveConnItem(ID)) return;
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
  /**
   * 顺序执行任务列表中的任务
   */
  checkTaskForRun() {
    if (ffmpeg.task.IDs.size > 0) {
      setTimeout(ffmpeg.checkTaskForRun, 10);
    } else {
      setTimeout(ffmpeg.checkTaskForRun, 100);
    }
    ffmpeg.task.IDs.forEach(ID => {
      if (ffmpeg.task.isRunning) return;
      ffmpeg.task.isRunning = true;
      ffmpeg.task.IDs.delete(ID);
      ffmpeg.runFfmpeg(ID);
    });
  },
  /**
   * 运行ffmpeg
   */
  async runFfmpeg(ID) {
    const rtspUrl = await getRtspUrls(ID);
    const conn_item = ffmpeg.conn_pool.get(ID);
    if (!conn_item) {
      ffmpeg.task.isRunning = false;
      return;
    }
    const spawnOptions = [
      ...commandStaticFile1,
      rtspUrl,
      ...commandStaticFile2,
      conn_item.filePath
    ];
    const handle = child_process.spawn("ffmpeg", spawnOptions, {
      stdio: ["ignore", process.stdout, "ignore"],
      windowsHide: false,
      detached: false
    });
    // handle.stdout.on("data", data => {
    //   console.log("out data", `stdout${data}`);
    // });
    // handle.stderr.on("data", data => {
    //   console.log("ffmpeg", `stderr${data}`);
    // });
    handle.on("exit", (code, signal) => {
      console.log("exit", code, signal);
      if (code === 1) {
        console.error("RTSP stream exited with error");
      }
    });
    writeLog(
      conn_item.dirPath + "/log.txt",
      rtspUrl + " " + new Date().toLocaleString() + "\n"
    );
    conn_item.handle = handle;
    conn_item.url = rtspUrl;
    ffmpeg.task.isRunning = false;
  },
  /**
   * 检查心跳是否断开或.ts文件是否在更新，以关闭或重启ffmpeg
   */
  cheackFfmpegForEnd() {
    const conn_need_to_end = [];
    ffmpeg.conn_pool.forEach(c => {
      if (!c.handle) return;
      if (!connWhiteList.includes(c.id)) {
        if (!ffmpeg.isLiveConnItem(c)) {
          console.log("end..." + c.id);
          conn_need_to_end.push(c);
          return;
        }
      }
      if (!ffmpeg.isEffectiveConnItem(c)) {
        child_process.spawn("taskkill", ["/pid", c.handle.pid, "/f", "/t"]);
        ffmpeg.addToTask(c.id);
      }
    });
    //kill and delete
    conn_need_to_end.forEach(c => {
      ffmpeg.conn_pool.delete(c.id);
      child_process.spawn("taskkill", ["/pid", c.handle.pid, "/f", "/t"]);
      try {
        fse.remove(path.join(__dirname, `public/video/${c.id}`), () => {
          console.log(`${c.id} removed`);
        });
      } catch (err) {
        console.log(err);
      }
    });
  },
  hasEffectiveConnItem(ID) {
    const conn_item = ffmpeg.conn_pool.get(ID);
    if (!conn_item) return false;
    return ffmpeg.isEffectiveConnItem(conn_item);
  },
  isEffectiveConnItem(conn_item) {
    return fileMtimeDiff(conn_item.dirPath) < 10000;
  },
  isLiveConnItem(conn_item) {
    return Date.now() - conn_item.timeStamp < 10000;
  },
  updateConnTimestamp(id) {
    if (ffmpeg.conn_pool.has(id)) {
      ffmpeg.conn_pool.get(id).timeStamp = Date.now();
    }
  }
};
module.exports = ffmpeg;
