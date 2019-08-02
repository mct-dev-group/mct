const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const router = new Router();

router.get("/video/:id/:file", async (ctx, next) => {
  const id = ctx.params.id;
  const file = ctx.params.file;
  let src;
  try {
    src = fs.createReadStream(
      path.join(__dirname, `public/video/${id}/${file}`)
    );
  } catch (error) {
    console.log(error);
  }
  ctx.response.set("content-type", "video/mp2t");
  ctx.set("Cache-Control", "no-cache");
  ctx.body = src;
  next();
  return;
});

router.get("/video/:id/", async (ctx, next) => {
  const id = ctx.params.id;
  let src;
  try {
    console.log("id", id);
    src = fs.createReadStream(
      path.join(__dirname, `public/video/${id}/${id}.m3u8`)
    );
    const mtime = fs.statSync(
      path.join(__dirname, `public/video/${id}/${id}.m3u8`)
    ).mtime;
    console.log(mtime.getTime());
  } catch (error) {
    console.log(error);
  }
  ctx.response.set("content-type", "application/vnd.apple.mpegurl");
  ctx.set("Cache-Control", "no-cache");
  ctx.body = src;
  next();
  return;
});

module.exports = router;
