const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const child_process = require("child_process");
const router = require("./router");
const serve = require("koa-static");
const { runFfmpeg, cheackFfmpegForEnd } = require("./ffmpeg");
const { getAPES } = require("./rtsp");
const { connWhiteList } = require("./config");
const { fileMtimeDiff } = require("./utils");
const PORT = 3002;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

async function serveVideo() {
  let streamItems = [];
  connWhiteList.forEach(guid => {
    streamItems.push(runFfmpeg(guid));
  });
  streamItems = await Promise.all(streamItems);
  const interval = setInterval(async () => {
    streamItems = streamItems.map(async item => {
      if (fileMtimeDiff(item.dirPath) > 10000) {
        child_process.spawn("taskkill", ["/pid", item.handle.pid, "/f", "/t"]);
        return await runFfmpeg(item.id);
      } else {
        return item;
      }
    });
    streamItems = await Promise.all(streamItems);
  }, 10000);
  //heartBeatTest
  setInterval(cheackFfmpegForEnd, 20000);
}

serveVideo();

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log("server running on port " + PORT);
