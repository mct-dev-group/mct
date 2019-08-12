const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const child_process = require("child_process");
const router = require("./router");
const serve = require("koa-static");
const { runFfmpeg, reRun } = require("./ffmpeg");
const { getAPES, getTokens, getRtspUrls } = require("./rtsp");
const { fileMtimeDiff } = require("./utils");
console.log(router);
const PORT = 3002;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

async function serveVideo() {
  let guids = await getAPES();
    if (guids.length === 0) {
    console.log("\x1B[31m%s\x1B[0m", "No test video mp4 files!");
    process.exit();
    return;
  }
  // guids = guids.map(g => g.guid);
  const token = await getTokens();
  const rtspUrls = await getRtspUrls(token, guids);
  // console.log(guids, token, rtspUrls);
  let streamItems = rtspUrls.map((url, i) => {
    return runFfmpeg(url, guids[i]);
  });
  streamItems = await Promise.all(streamItems);
  const interval = setInterval(async () => {
    streamItems = await streamItems.map(async item => {
      if (fileMtimeDiff(item.dirPath) > 10000) {
        child_process.spawn("taskkill", ["/pid", item.handle.pid, "/f", "/t"]);
        return await runFfmpeg(item.url, item.id);
      } else {
        return item;
      }
    });
    streamItems = await Promise.all(streamItems);
  }, 10000);
}

serveVideo();

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log("server running on port " + PORT);
