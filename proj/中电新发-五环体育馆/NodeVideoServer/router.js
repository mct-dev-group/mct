const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const router = new Router();

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

module.exports = router;
