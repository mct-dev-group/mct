<template>
  <div class="layerControl">
    <h3 class="title">{{title}}</h3>
    <div class="main">
      <el-checkbox-group class="checkBox" v-model="checkedLayers">
        <el-checkbox
          class="checkItem"
          v-for="layer in layerList"
          :label="layer.value"
          :key="layer.value"
        >{{layer.title}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import WMSHelper from "@/utils/wms_helper";
export default {
  name: "layercontrol",
  data() {
    return {
      title: "图层控制",
      wms: null,
      layerList: [],
      checkedLayers: [],
      // 高亮颜色
      lightColor: "#189e08",
      // 是否正在发送请求
      sendingRequest: false,
      // 相机在上一次请求图片时的位置
      lastP: null
    };
  },
  watch: {
    // 监听当前选中图层变化
    checkedLayers(val) {
      if (val.length > 0) {
        this.requestImage();
      } else {
        bt_Util.SetGlobalOrthoTexture1(
          -9999999999,
          -9999999999,
          -9999999999,
          -9999999999,
          1,
          1,
          []
        );
        bt_Util.executeScript("Render\\ForceRedraw;");
      }
      console.log(`当前选中的图层：${val.toString()}`);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.wms = config.services.wms;
      this.getLayerList();
      // 激活场景事件
      bt_event.addEventListener("Render\\BeforeRender", this.onBeforRender);
      // 添加二维图层 请求状态恢复默认 fasle
      this.sendingRequest = false;
      this.requestImage();
    },
    getLayerList() {
      this.layerList = this.wms.layers;
    },
    onBeforRender() {
      if (this.sendingRequest) {
        console.log(`正在发送请求中...`);
        return;
      }

      // 获取相机位置
      const p = bt_Util.getCameraParam().cameraPt;
      // 如果当前相机位置和上一次请求图片时相机位置相等 则不再请求 直接return
      if (
        this.lastP &&
        this.lastP.x == p.x &&
        this.lastP.y == p.y &&
        this.lastP.z == p.z
      )
        return;
      // 更新相机位置
      this.lastP = p;
      // 发送请求
      this.requestImage();
    },
    requestImage() {
      if (this.checkedLayers && this.checkedLayers.length > 0) {
        // 请求状态设为true
        this.sendingRequest = true;

        const view = this.getView();
        const zero = view.zero;
        const vHeight = view.vHeight;

        // 计算 bbox
        const x1 = zero.x - vHeight;
        const y1 = zero.y - vHeight;
        const x2 = zero.x + vHeight;
        const y2 = zero.y + vHeight;

        let bbox = x1;
        bbox += "," + y1;
        bbox += "," + x2;
        bbox += "," + y2;

        // 获取容器大小
        const container = document.getElementById("bt_container");
        const width = container.style.width.replace("px", "") * 2;
        const height = container.style.height.replace("px", "") * 2;

        // 图层顺序（按照列表顺序排序）
        let layerArr = [];
        let layers = this.wms.layers;
        for (let i = 0; i < layers.length; i++) {
          if (this.checkedLayers.includes(layers[i].value)) {
            layerArr.push(layers[i].value);
          }
        }

        const wmsHelper = new WMSHelper({
          url: this.wms.url,
          layers: layerArr.join(","),
          format: this.wms.format,
          srs: this.wms.srs
        });
        wmsHelper.getRect(bbox, width, height, data => {
          for (let i = 0; i < data.length; i = i + 4) {
            data[i + 3] *= 0.5;
          }
          bt_Util.SetGlobalOrthoTexture1(x1, y2, x2, y1, width, height, data);
          bt_Util.executeScript("Render\\ForceRedraw;");

          // 请求完成 状态设为 false
          this.sendingRequest = false;
        });
      }
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

<style lang="scss" scoped>
.layerControl {
  background: white;
  width: 250px;
  height: 300px;
  position: absolute;
  right: 30px;
  top: 100px;
  border-radius: 5px;

  .title {
    background: #409eff;
    text-align: center;
    padding: 8px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    color: white;
    font-size: 20px;
  }

  .main {
    margin-top: 20px;

    .checkBox {
      display: flex;
      flex-direction: column;

      .checkItem {
        margin: 10px 20px;
      }
    }
  }
}
</style>