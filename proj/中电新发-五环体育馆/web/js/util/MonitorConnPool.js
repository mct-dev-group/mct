/**
 * Monitor hls video player adapter
 */
let MonitorConnPool = {
  hls_video_url: `http://${window.location.hostname}:3002/video/`,
  remote_conn_url: `http://${window.location.hostname}:3002/`,
  intervalList: {},
  hls_pool: {},
  /**
   * @prame {string} key              monitor's GUID
   * @prame {DOM Object} videoDOM     video dom object which you want to play video with
   * @prame {string} type             video play type tag
   *
   * @return {void}
   */
  play: (key, videoDOM, type) => {
    $.ajax({
      data: { key: key },
      type: "GET",
      dataType: "JSON",
      contentType: "application/json",
      scriptCharset: "utf-8",
      url: MonitorConnPool.remote_conn_url + "monitor/key",
      error: function(error) {
        console.error(error);
      },
      success: function(result) {
        let isRunning = result.data;
        if (isRunning) {
          let temp_sign = 0;
          let tempInterval = setInterval(() => {
            $.ajax({
              data: { key: key },
              type: "GET",
              dataType: "JSON",
              contentType: "application/json",
              scriptCharset: "utf-8",
              url: MonitorConnPool.remote_conn_url + "monitor/ready",
              error: function(error) {
                console.error(error);
				temp_sign++;
			    if (temp_sign > 50) {
                    clearInterval(tempInterval);
					MonitorConnPool.shutOffHeartBeatDetection(key, type)
				}
              },
              success: function(result) {
                if (parseInt(result.code) === 200) {
                  if (Hls.isSupported()) {
                    let video = videoDOM;
                    if (typeof video !== "object") {
                      console.error(
                        "second args videoDOM must be a document obj."
                      );
                      return false;
                    }
					MonitorConnPool.startHeartBeatDetection(key, type);
                    let SEQUENCE = 0;
                    let SNCount = 0;
                    let hls = null;
                    hls = new Hls({
                      liveBackBufferLength: 0,
                      levelLoadingMaxRetry: Infinity,
                      levelLoadingMaxRetryTimeout: 5000
                    });
                    const id = `${key}_${type}`;
                    MonitorConnPool.hls_pool[id] = hls;
                    hls.loadSource(MonitorConnPool.hls_video_url + key + "/");
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                      hls.attachMedia(video);
                      video.play();
                    });
                    hls.on(Hls.Events.LEVEL_UPDATED, checkNeedRerun);
                    hls.on(Hls.Events.DESTROYING, rerun);
                    clearInterval(tempInterval);
                    
                    function checkNeedRerun(evt, data) {
                      let curentSN = data.details.startSN;
                      if (curentSN < SEQUENCE || SNCount > 20) {
                        hls.off(Hls.Events.LEVEL_UPDATED, checkNeedRerun);
                        hls.destroy();
                        SNCount = 0;
                        return;
                      }
                      curentSN === SEQUENCE ? SNCount++ : (SNCount = 0);
                      SEQUENCE = curentSN;
                    }
                    function rerun() {
                      //MonitorConnPool.shutOffHeartBeatDetection(key, type);
                      MonitorConnPool.play(key, videoDOM, type);
                      console.log("reload", new Date().toLocaleString());
                      return;
                    }
                  }
                } else {
                  temp_sign++;
                  if (temp_sign > 50) {
					  MonitorConnPool.shutOffHeartBeatDetection(key, type)
                    clearInterval(tempInterval);
                  }
                }
              }
            });
          }, 300);
        }
      }
    });
  },
  /**
   * 开启心跳检测
   * @param id --- 该video的id，与VMS中的id保持一致
   * @param type --- video的类型
   */
  startHeartBeatDetection: (id, type) => {
    let list_id = id + "_" + type;
    if (MonitorConnPool.intervalList[list_id]) return true;
    let heartBeatObj = setInterval(() => {
      $.ajax({
        data: "",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        scriptCharset: "utf-8",
        url:
          MonitorConnPool.remote_conn_url +
          "monitor/" +
          id +
          "/heartBeatDetection",
        error: function(error) {
          console.error(error);
        },
        success: function(result) {}
      });
    }, 1000 * 4);
    MonitorConnPool.intervalList[list_id] = {};
    MonitorConnPool.intervalList[list_id] = heartBeatObj;
  },
  /**
   * 关闭心跳检测
   * @param id --- 该video的id，与VMS中的id保持一致
   * @param type --- video的类型
   */
  shutOffHeartBeatDetection: (id, type) => {
    let list_id = id + "_" + type;
    let heartBeatObj = MonitorConnPool.intervalList[list_id];
    if (heartBeatObj) {
      clearInterval(heartBeatObj);
      delete MonitorConnPool.intervalList[list_id];
    } else {
      console.error(
        "no heartbeat detection could be found when id = " + list_id + "."
      );
    }
  },
  /**
   * 停止视频加载
   * @param id --- 该video的id，与VMS中的id保持一致
   * @param type --- video的类型
   */
  stopLoadVideo: (id, type) => {
    let list_id = id + "_" + type;
    let hls = MonitorConnPool.hls_pool[list_id];
    if (hls) {
      hls.stopLoad();
      delete MonitorConnPool.hls_pool[list_id];
      MonitorConnPool.shutOffHeartBeatDetection(id, type);
    }
  },
  /**
   * 检测窗口变化是否为 visible->hidden 以重载视频
   */
  checkVisibilityChangeforRerun: () => {
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
  MonitorConnPool.checkVisibilityChangeforRerun
);
