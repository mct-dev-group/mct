<template>
  <div class="matrix" id="bt_container">
    <canvas id="canvasgl" tabindex="0"></canvas>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
  name: "matrix",
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //初始化bt_a
      on_bt_a_post();

      BT_RenderFrame();

      bt_event.canvasgl_GUI_init();

      bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\SetClientCacheSize 0 256;");

      // bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\OpenOsgScene mc://http://" + location.hostname + ":8989/ gwh/GWH.osgb.pb;");
      // bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\OpenModelScene mc://http://" + location.hostname + ":8989/ cam1.pb;");
      // bt_Util.executeScript("Render\\Camera\\JumpTo 547300.000000 3374948.750000 431.889771;");

      // bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\OpenOsgScene mc://http://192.168.0.250:9005/pb/ index.pb;");
            
      // bt_Util.executeScript('Render\\CameraControl\\FlyTo2 536900 3804500 50;');

      bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\OpenOsgScene mc://http://192.168.0.250:9006/pb/ index.pb;");
	    bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\OpenOsgScene mc://http://192.168.0.250:9006/terrain/ terrain.osgb.pb;");
	  
	    bt_Util.executeScript('Render\\CameraControl\\FlyTo3 524437 3959195 9542 524462 3961135 136.673102 5000;');
    }
  }
};
</script>

<style lang="scss" scoped>
#bt_container {
  position: absolute;
  overflow: hidden;
  width: 500px;
  height: 500px;
  left: 0px;
  top: 0px;

  #canvasgl {
    position: absolute;
    left: 0px;
    top: 0px;
  }
}
</style>