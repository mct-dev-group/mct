const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router");
const serve = require("koa-static");
const { checkTaskForRun, cheackFfmpegForEnd, addToTask } = require("./ffmpeg");
const { connWhiteList } = require("./config");
const PORT = 3002;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

async function serveVideo() {
  connWhiteList.forEach(guid => {
    addToTask(guid);
  });
  checkTaskForRun();
  setInterval(cheackFfmpegForEnd, 10000);
}

serveVideo();

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log("server running on port " + PORT);
