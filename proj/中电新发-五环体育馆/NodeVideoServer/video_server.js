const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const child_process = require("child_process");
const router = require("./router");
const serve = require("koa-static");
const { checkTaskForRun, cheackFfmpegForEnd, addToTask } = require("./ffmpeg");
const { getAPES } = require("./rtsp");
const { connWhiteList } = require("./config");
const { fileMtimeDiff } = require("./utils");
const PORT = 3002;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

async function serveVideo() {
  connWhiteList.forEach(guid => {
    addToTask(guid);
  });
  //heartBeatTest
  checkTaskForRun();
  setInterval(cheackFfmpegForEnd, 10000);
}

serveVideo();

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log("server running on port " + PORT);
