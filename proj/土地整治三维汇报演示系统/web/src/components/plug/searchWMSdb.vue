<!-- 插件示例 -->
<template></template>

<script>
export default {
  name: "searchWMSdb",
  data() {
    return {};
  },
  mounted() {
    bt_event.addEventListener('GUIEvent\\KM\\OnMouseDbClick', this.onClick);
  },
  destroyed() {},
  methods: {
    onClick(e){
      if(this.$store.state.isPlugDeactivateAll){
        this.requestFeature(e);
      }
    },
    requestFeature(e) {
      // 获取分辨率
      const container = document.getElementById("bt_container");
      const res =
        this.getView().vHeight / container.style.height.replace("px", "");

      // 得到世界坐标系
      const { x, y, z } = bt_Util.screenToWorld(e[1], e[2]);

      let bbox = x - res * 2;
      bbox += "," + (y - res * 2);
      bbox += "," + (x + res * 2);
      bbox += "," + (y + res * 2);

      const { url, version, typenames, serverType } = config.services.wfs;

      let funcArr = [];
      function wfsQuery(typename) {
        return new Promise((resolve, reject) => {
          let outputformat = "";
          if (serverType && serverType == "geoserver")
            outputformat = "&outputFormat=application/json";

          const urlStr = `${url}?service=WFS&request=GetFeature&version=${version}&typename=${typename}&bbox=${bbox}${outputformat}`;

          $.ajax({
            url: urlStr,
            type: "get",
            dataType: "text",
            crossDomain: true,
            timeout: 5000,
            success: data => {
              if (serverType && serverType == "geoserver") {
                const gj = JSON.parse(data);
                resolve(gj);
              } else {
                const gmlParser = new GMLParser();
                const gj = gmlParser.gml2Geojson(data);
                resolve(gj);
              }
            },
            error: error => {
              reject(error);
              console.log(`wfs服务请求出错！！！`);
            }
          });
        });
      }
      for (let typename of typenames.split(",")) {
        funcArr.push(wfsQuery(typename));
      }
      Promise.all(funcArr).then(dataArr => {
        // 返回结果前清除上一次显示的结果
        for (let data of dataArr) {
          if (data.crs) {
            console.log(data.features[0].id);
            // this.$store.state.dbClickedLayer = data.features[0].id
            this.$store.commit('setdbClickedLayer', data.features[0].id);
            return;
          }
        }
      });
    },
    getView() {
      // 获取窗口信息
      let { cameraPt, lookatPt } = bt_Util.getCameraParam();
      let zero = { x: lookatPt.x, y: lookatPt.y, z: 0 }; // 视点位置
      let vHeight = 2 * Math.tan(0.5) * this.distance3(cameraPt, lookatPt); //窗口高度
      return {
        zero,
        vHeight
      };
    },
    distance3({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
      return Math.abs(
        Math.sqrt(
          Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
        )
      );
    }
  }
};
</script>

<style>
</style>