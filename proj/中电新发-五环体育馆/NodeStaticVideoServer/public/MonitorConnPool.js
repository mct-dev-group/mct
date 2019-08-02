let MonitorConnPool = {
  hls_pool: {},
  play: function(key, videoDOM, type) {
    let url = `http://${window.location.hostname}:3002/video/${key}/`;
    let SEQUENCE = 0;
    let SNCount = 0;
    let hls = null;
    if (Hls.isSupported()) {
      hls = new Hls({
        liveBackBufferLength: 0,
        levelLoadingMaxRetry: Infinity,
        levelLoadingMaxRetryTimeout: 5000
      });
      const id = `${key}_${type}`;
      MonitorConnPool.hls_pool[id] = hls;
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.attachMedia(videoDOM);
        videoDOM.play();
      });
      hls.on(Hls.Events.LEVEL_UPDATED, checkNeedRerun);
      hls.on(Hls.Events.DESTROYING, rerun);
    }
    function checkNeedRerun(evt, data) {
      let curentSN = data.details.startSN;
      if (curentSN < SEQUENCE || SNCount > 20) {
        hls.off(Hls.Events.LEVEL_UPDATED, checkNeedRerun);
        hls.destroy();
        return;
      }
      curentSN === SEQUENCE ? SNCount++ : (SNCount = 0);
      SEQUENCE = curentSN;
    }
    function rerun() {
      MonitorConnPool.play(key, videoDOM);
      console.log("reload", new Date().toLocaleString());
      return;
    }
  },
  stopLoadVideo: (key, type) => {
    const id = `${key}_${type}`;
    const hls = MonitorConnPool.hls_pool[id];
    if (hls) {
      hls.stopLoad();
      delete MonitorConnPool.hls_pool[id];
    }
  },
  checkVisibilityChange: () => {
    //console.log(document.visibilityState);
    if (document.visibilityState === "hidden") return;
    for (let hls in MonitorConnPool.hls_pool) {
      if (MonitorConnPool.hls_pool.hasOwnProperty(hls)) {
        MonitorConnPool.hls_pool[hls].destroy();
      }
    }
  }
};
document.addEventListener(
  "visibilitychange",
  MonitorConnPool.checkVisibilityChange
);
