const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const Router = require("koa-router");
const fetch = require("node-fetch");
const PORT = 3000;
const { commandStaticFile1, commandStaticFile2 } = require("./config");

const app = new Koa();
app.use(cors());
app.use(bodyParser());
const router = new Router();
//let ID;
let conn_pool = [];
let badConn = [];

router.get("/monitor/key", async (ctx, next) => {
  const ID = ctx.request.query.key;
  console.log(ID);
  const token = await getToken();
  const conn = conn_pool.filter(c => c.id == ID);
  if (token && conn.length) {
    conn[0].timeStamp = Date.now();
    ctx.body = {
      code: "200",
      msg: "get camera broadcasting address success.",
      data: conn[0].url
    };
    //console.log(12,ctx.body)
  } else if (token) {
    const srcUrl = await getServeUrl(token, ID);
    const url = `http://localhost:${PORT}/video/${ID}/${ID}.m3u8`;
    console.log(srcUrl);
    if (srcUrl && !conn_pool.filter(c => c.id == ID).length && ID) {
      const stream = await runFfmpeg(srcUrl, ID);
      // if (ID == "43000001001321224016") console.time("43000001001321224016");
      stream.on("exit", (code, signal) => {
        console.log("exit", code, signal);
        if (ID == "43000001001321224016") {
          console.log(ID, Date.now());
          // console.timeEnd("43000001001321224016");
        }
        if (code === 1) {
          console.error("RTSP stream exited with error");
        }
      });
      stream.stdout.on("data", data => {
        //console.log('out data', data)
        console.log("out data", `stdout${data}`);
        //global.process.stderr.write(data)
      });
      stream.stderr.on("data", data => {
        console.log("ffmpeg", `stderr${data}`);
      });
      console.log("add pool");
      const conn_item = {
        id: ID,
        url: url,
        handle: stream,
        timeStamp: Date.now()
      };
      conn_pool.push(conn_item);
    }
    ctx.set("Cache-Control", "no-cache");
    ctx.body = {
      code: "200",
      msg: "get camera broadcasting address success.",
      data: url
    };
  } else {
    console.log("no token");
  }
  next();
  return;
});

router.get("/monitor/ready", async (ctx, next) => {
  const id = ctx.request.query.key;
  updateConnTimestamp(id);
  let fileCount = getFileCount(id);
  if (fileCount > 1) {
    ctx.body = {
      code: "200",
      msg: "this monitor is ready.",
      data: null
    };
  } else {
    ctx.body = {
      code: "400",
      msg: "this monitor is not ready.",
      data: null
    };
  }
  return;
});

router.get(`/monitor/:id/heartBeatDetection`, async (ctx, next) => {
  const id = ctx.params.id;
  updateConnTimestamp(id);
  ctx.body = {
    code: "200",
    msg: "timeStamp updated.",
    data: null
  };
  return;
});

function updateConnTimestamp(id) {
  const conn = conn_pool.filter(c => c.id == id);
  if (conn.length) {
    conn[0].timeStamp = Date.now();
  }
}

async function getToken() {
  //if (testEnv)
  return "1234";
  // let basicAuthParams = auth_username + ":" + auth_password;
  // basicAuthParams = Buffer.from(basicAuthParams).toString("base64");
  // let res = await fetch(VMS_userLoginURL, {
  //   headers: {
  //     Authorization: "Basic " + basicAuthParams,
  //     "Content-Type": "application/json"
  //   }
  // });
  // return res.headers.get("auth-token");
}

function getFileCount(key) {
  const directoryPath = path.join(__dirname, `public/video/${key}`);
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath);
    return files.filter(f => f.includes(".ts")).length;
  } else {
    return 0;
  }
}

async function getServeUrl(token, ID) {
  //if (testEnv) {
  const directoryPath = path.join(__dirname, `public/test_video/${ID}.mp4`);
  return directoryPath;
  //}
  // let ipRes = await fetch(VMS_DeviceGetIPCLinkInfoURL, {
  //   method: "POST",
  //   body: JSON.stringify({ ipcID: ID }),
  //   headers: {
  //     "auth-token": token,
  //     "Content-Type": "application/json"
  //   }
  // });
  // ipRes = await ipRes.json();
  // const serverIP = ipRes.ipcLinkInfo.serverIP;
  // if (!serverIP) return false;
  // console.log(ipRes);
  // return "rtsp://" + serverIP + ":10554/guid=" + ID;
}

async function runFfmpeg(srcUrl, ID) {
  console.log("testEnv", ID);
  const directoryPath = path.join(__dirname, `public/video/${ID}`);
  try {
    fs.readdirSync(directoryPath);
  } catch (error) {
    fs.mkdirSync(directoryPath);
  }
  // const spawnOptions = [
  //   ...command1,
  //   srcUrl,
  //   ...command2,
  //   path.join(__dirname, `public/video/${ID}/${ID}.m3u8`)
  // ];
  // console.log("srcUrl", srcUrl);
  const testSpawnOptions = [
    ...commandStaticFile1,
    srcUrl,
    ...commandStaticFile2,
    path.join(__dirname, `public/video/${ID}/${ID}.m3u8`)
  ];
  console.log(path.join(__dirname, `public/video/${ID}/${ID}.m3u8`));
  // return child_process.exec(
  // `ffmpeg ${command1} ${srcUrl} ${command2} C:/20190605汇报/NodejsFfmpegToHls/public/video/${ID}/${ID}.m3u8`,
  // {
  // detached: false
  // },
  // (error, stdout, stderr) => {
  // if (error) {
  // console.error(`exec error: ${error}`);
  // return;
  // }
  // console.log(`stdout: ${stdout}`);
  // console.log(`stderr: ${stderr}`);
  // }
  // );
  // if (testEnv) {
  // console.log("testEnv", ID);
  return child_process.spawn("ffmpeg", testSpawnOptions, {
    detached: false
  });
  // }
  // return child_process.spawn("ffmpeg", spawnOptions, {
  //   detached: false
  // });
}

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());

function timer() {
  console.log("timer is running");
  setInterval(() => {
    const conn_need_to_end = [];
    conn_pool = conn_pool.filter(c => {
      if (Date.now() - c.timeStamp > 10000) {
        console.log("end..." + c.id);
        conn_need_to_end.push(c);
        return false;
      } else {
        return true;
      }
    });
    //kill and delete
    conn_need_to_end.map(c => {
      c.handle.stdin.pause(); //not working
      c.handle.kill(); // not working
      child_process.spawn("taskkill", ["/pid", c.handle.pid, "/f", "/t"]);
      fse.remove(path.join(__dirname, `public/video/${c.id}`), () => {
        console.log(`${c.id} removed`);
      });
    });
  }, 20000);
}
timer();
app.listen(PORT);
