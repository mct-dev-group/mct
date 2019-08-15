const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const router = new Router();
const { runFfmpeg, updateConnTimestamp, conn_pool } = require("./ffmpeg");
const { getFileCount } = require("./utils");

/**
 * get .ts file
 */
router.get("/video/:id/:file", async (ctx, next) => {
  const id = ctx.params.id;
  const file = ctx.params.file;
  const src = fs.createReadStream(
    path.join(__dirname, `public/video/${id}/${file}`)
  );
  ctx.response.set("content-type", "video/mp2t");
  ctx.set("Cache-Control", "no-cache");
  ctx.body = src;
  next();
  return;
});

/**
 * get .m3u8 file
 */
router.get("/video/:id/", async (ctx, next) => {
  const id = ctx.params.id;
  const src = fs.createReadStream(
    path.join(__dirname, `public/video/${id}/${id}.m3u8`)
  );
  ctx.response.set("content-type", "application/vnd.apple.mpegurl");
  ctx.set("Cache-Control", "no-cache");
  ctx.body = src;
  next();
  return;
});

/**
 * check is hls video raedy
 */
router.get("/monitor/ready", async (ctx, next) => {
  const id = ctx.request.query.key;
  updateConnTimestamp(id);
  let fileCount = getFileCount(id);
  if (fileCount > 2) {
    ctx.status = 200;
    ctx.body = {
      code: "200",
      msg: "this monitor is ready.",
      data: null
    };
  } else {
    //ctx.status = 400;
    ctx.body = {
      code: "400",
      msg: "this monitor is not ready.",
      data: null
    };
  }
  next();
  return;
});

/**
 * update heart beat timestamp
 */
router.get(`/monitor/:id/heartBeatDetection`, async (ctx, next) => {
  const id = ctx.params.id;
  updateConnTimestamp(id);
  ctx.set("Cache-Control", "no-cache");
  ctx.status = 200;
  ctx.body = {
    code: "200",
    msg: "timestamp updated.",
    data: null
  };
  next();
  return;
});

router.get("/monitor/key", async (ctx, next) => {
  console.log(1111, conn_pool);
  const ID = ctx.request.query.key;
  console.log(ID);
  ctx.set("Cache-Control", "no-cache");
  const conn = conn_pool.get(ID);
  console.log(conn)
  if (conn) {
    conn.timeStamp = Date.now();
  } else {
    try {
      await runFfmpeg(ID);
    } catch (error) {
      //ctx.status = 400;
      ctx.body = {
        code: "400",
        msg: "run ffmpeg error " + error.toString(),
        data: false
      };
      next();
      return;
    }
  }
  ctx.status = 200;
  ctx.body = {
    code: "200",
    msg: "run ffmpeg succeeded.",
    data: true
  };
  next();
  return;
});
module.exports = router;
