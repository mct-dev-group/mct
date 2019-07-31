const Koa = require("koa");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const child_process = require("child_process");
const router = require("./router");
const serve = require("koa-static");
const { runFfmpeg } = require("./ffmpeg");
const { getAPES } = require("./rtsp");
const { fileMtimeDiff } = require("./utils");
const PORT = 3002;

const app = new Koa();
app.use(cors());
app.use(bodyParser());

async function serveVideo() {
  const additionalGuids = {
    "43000001001321224014": 1,
    "43000001001321224016": 1,
    "43000001001321224017": 1,
    "43000001001321224018": 1,
    "43000001001321224019": 1,
    "43000001001321224020": 1,
    "43000001001321224021": 1,
    "43000001001321224022": 1,
    "43000001001321224132": 1,
    "43000001001321224133": 1,
    "43000001001321224134": 1,
    "43000001001321224135": 1,
    "43000001001321226071": 1,
    "43000001001321226072": 1,
    "43000001001321226073": 1,
    "43000001001321226074": 1,
    "43000001001321224018": 1,
    "43000001001321224020": 1,
    "43000001001321223248": 1,
    "43000001001321224249": 1,
    "43000001001321224243": 1,
    "43000001001321224245": 1,
    "43000001001321224251": 1,
    "43000001001321225142": 1,
    "43000001001321225151": 1
  };
  let guids = await getAPES();
  guids = guids.map(g => g.guid);
  guids.forEach(g => (additionalGuids[g] = 1));
  let streamItems = [];
  for (let guid in additionalGuids) {
    if (additionalGuids.hasOwnProperty(guid)) {
      streamItems.push(runFfmpeg(guid));
    }
  }
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
}

serveVideo();

app.use(serve("./public"));
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

console.log("server running on port " + PORT);
