<!-- 地图测量 -->
<script>
import { guid } from '@/utils/common';
export default {
  name: "plug_measurement",
  data() {
    return {
      drawEnd: false,
      drawType: null,
      pointArr: [],
      pointArrTmp: [],
      movePoint: null, //当前鼠标移动的点
      linePrevRresult: 0,
      linePointIdArr: []
    };
  },
  render () {},
  mounted () {
    this.$store.dispatch('addPlug', {
      name: this.$options.name,
      value: this,
      title: '地图测量',
      isIndependent: true, // 是否是单独的功能
      isActive: false,
      icon: 'fa fa-pencil-square-o',
      children: [
        {
          title: '点测量',
          type: 'point',
          icon: 'fa fa-circle-o',
          isActive: false
        },
        {
          title: '线测量',
          type: 'line',
          icon: 'fa fa-vine',
          isActive: false
        }
      ]
    });
  },
  destroyed () {
    this.$store.dispatch('removePlug', this.$options.name);
  },
  methods: {
    onClick (e) {
      if (e[0] == 0) { // 鼠标左键单击
        const px = e[1], py = e[2];
        const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
        const posArr = QueryPoint[0].split(" ");
        if (posArr[0] == 1) { // 击中场景
          const type = this.drawType;
          const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
          switch (type) {
            case 'point':
              this.pointArr = [{x, y, z}];
              this.drawData();
              break;
            case 'line':
              if (this.drawEnd) {
                this.drawEnd = false;
                this.pointArr = [];
                this.linePrevRresult = 0;
                this.removePos();
              }
              this.pointArr.push({x, y, z});
              if (this.pointArr.length > 1) {
                this.addPoint();
              }
              bt_event.addEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);
              bt_event.addEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
              break;
            default:
              break;
          }
        }
      }
    },
    onMouseMove (e) {
      const px = e[0], py = e[1];
      const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
      const posArr = QueryPoint[0].split(" ");
      const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
      const type = this.drawType;
      switch (type) {
        case 'line':
          this.movePoint = {x, y, z};
          this.pointArrTmp = this.pointArr.concat([{x, y, z}]);
          this.drawData();
          break;
        default:
          break;
      }
    },
    onDbClick (e) {
      if (e[0] == 0) { // 鼠标左键单击
        const px = e[1], py = e[2];
        const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
        const posArr = QueryPoint[0].split(" ");
        if (posArr[0] == 1) { // 击中场景
          // 移除鼠标移动和双击事件
          bt_event.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
          bt_event.removeEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);
          this.drawEnd = true;
          this.pointArr.push(this.movePoint);
          this.addPoint()
        }
      }
    },
    activate (type) {
      this.drawType = type;
      this.pointArr = [];
      // 激活鼠标单击事件
      bt_event.addEventListener("GUIEvent\\KM\\OnMouseClick", this.onClick);
    },
    deactivate () {
      this.removePos();
      bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj measurement_line 8;");
    },
    drawData () {
      const type = this.drawType;
      switch (type) {
        case 'point':
          this.addPoint()
          break;
        case 'line':
          let pointArrTmp = this.pointArrTmp;
          // 计算顶点个数
          const vertex_count = pointArrTmp.length;
          // 计算索引个数
          const index_count = vertex_count == 1 ? 1 : 2*(vertex_count -1); 
          // 计算索引
          let indexStr = `(`;
          for (let i = 0; i < pointArrTmp.length -1; i++) {
            indexStr += `${i},${i+1},`;
          }
          indexStr = indexStr.substr(0, indexStr.length -1);
          indexStr += `)`;
          let pointStr = ``;
          for (const point of pointArrTmp) {
            pointStr += ` (${point.x},${point.y},${point.z},255,255,0,255)`;
          }
          //渲染线段
          const line_id = 'measurement_line'
          const scriptStr = `Render\\RenderDataContex\\DynamicFrame\\AddRenderObj ${line_id} 4 1 (0,0,0) 8 ${vertex_count} ${index_count} ${pointStr} ${indexStr} 0;`;
          bt_Util.executeScript(scriptStr);
          bt_Util.executeScript(`Render\\ForceRedraw;`);
          break;
        default:
          break;
      }
    },
    addPoint () {
      const type = this.drawType;
      switch (type) {
        case 'point':
          const [{x, y, z}] = this.pointArr; 
          let html = `<div style="background:url(assets/images/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;">
                        <span style="margin-left:16px; font-size:9px; white-space: nowrap;">(${x}, ${y}, ${z})</span>
                      </div>`;
          const point_id = 'measurement_point'
          this.linePointIdArr.push(point_id);
          bt_Plug_Annotation.setAnnotation(point_id , x, y, z, -8, -16, html, false);
          break;
        case 'line':
          const pointArr = this.pointArr;
          // 添加距离量算结果
          const endPoint = pointArr[pointArr.length -1];
          const startPoint = pointArr[pointArr.length -2];

          this.linePrevRresult += Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2) + Math.pow(endPoint.z- startPoint.z, 2));
          this.linePrevRresult = Math.floor(this.linePrevRresult * 100) / 100;

          let html_point = `<div style="background:url(assets/images/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;">
                        <span style="margin-left:16px; font-size:9px; white-space: nowrap;">${this.linePrevRresult}</span>
                      </div>`;
          const line_point_id = 'measurement_line_point' + (pointArr.length-1);
          this.linePointIdArr.push(line_point_id);
          const lastP = pointArr[pointArr.length -1];
          bt_Plug_Annotation.setAnnotation(line_point_id , lastP.x, lastP.y, lastP.z, -8, -16, html_point, false);
          bt_Util.executeScript(`Render\\ForceRedraw;`);
          break;
        default:
          break;
      }
    },
    removePos () {
      for (let i = 0; i < this.linePointIdArr.length; i++) {
        const id = this.linePointIdArr[i];
        bt_Plug_Annotation.removeAnnotation(id);
      }
      this.linePointIdArr = [];
    }
  }
}
</script>

<style>
</style>