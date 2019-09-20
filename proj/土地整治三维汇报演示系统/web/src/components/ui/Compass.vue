<template>
  <div class="compass" id="compassBox"></div>
</template>

<script>
export default {
  name: 'compass',
  data () {
    return {
      img: null,
      cav: null
    }
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.img = new Image();
      this.img.src = '../../../assets/images/compass.png';

      this.canvas = document.createElement('canvas');
      this.cav = this.canvas.getContext('2d');

      document.getElementById("compassBox").appendChild(this.canvas);

      bt_event.addEventListener("Render\\FinalBlend", this.onRenderFinalBlend);
    },
    onRenderFinalBlend () {
      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;

      let cam_param = bt_Util.getCameraParam();
      let dx = cam_param.lookatPt.x - cam_param.cameraPt.x;
      let dy = cam_param.lookatPt.y - cam_param.cameraPt.y;
      let dz = cam_param.lookatPt.z - cam_param.cameraPt.z;
      if (dx == 0 && dy == 0) {
        dx = cam_param.upVec.x;
        dy = cam_param.upVec.y;
        if (dz > 0) {
          dy = -dy;
          dx = -dx;
        }
      }
      let rot = -Math.PI / 2 + Math.atan2(dy, dx);
      
      // this.cav.save();
      // this.cav.translate(this.img.width / 2, this.img.height / 2);
      // this.cav.rotate(rot);
      // this.cav.drawImage(this.img, -this.img.width/2, -this.img.height/2);
      // this.cav.restore();

      this.cav.translate(this.img.width / 2, this.img.height / 2);
      this.cav.rotate(rot);
      this.cav.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    }
  }
}
</script>

<style lang="scss" scoped>
.compass {
  z-index: 100;
  width: 84px;
  height: 84px;
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>