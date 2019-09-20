<!-- 缓冲分析 -->
<script>
import GMLParser from '@/utils/GMLParser';
export default {
  name: 'plug_bufferquery',
  data () {
    return {
      wfs: {
        url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WFSServer',
        version: '1.0.0',
        typename: 'point'
      },
      drawType: null,
      bufferWidth: 10,
      lightColor: '#189e08',
      pointArr: [],
      pos_length: 0, //标注长度
    }
  },
  render () {},
  mounted () {
    this.$store.dispatch('addPlug', {
      name: this.$options.name,
      value: this,
      title: '缓冲分析',
      isActive: false,
      isIndependent: true, // 是否是单独的功能
      icon:'fa fa-search',
      children: [
        {
          title: '点缓冲',
          type: 'point',
          icon: 'fa fa-circle-o',
          isActive: false
        },
        {
          title: '线缓冲',
          type: 'line',
          icon: 'fa fa-vine',
          isActive: false
        },
        {
          title: '面缓冲',
          type: 'polygon',
          icon: 'fa fa-square-o',
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
        this.removePos(); // 移除标注

        if (posArr[0] == 1) { // 击中场景
          const type = this.drawType;
          const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
          switch (type) {
            case 'point':
              this.pointArr = [{x, y, z}];
              this.handleData(type);
              bt_event.addEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
              break;
            case 'line':
            case 'polygon':
              this.pointArr.push({x, y, z});
              bt_event.addEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);
              bt_event.addEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
              break;
            default:
              break;
          }
        }
      } else if (e[0] == 2) { // 鼠标右键结束绘制 激活标注点击事件
        // 事件失活
        bt_event.removeEventListener("GUIEvent\\KM\\OnMouseClick", this.onClick);
        bt_event.removeEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);
        bt_event.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
        // 清除绘制线段
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj buffer_lineOrPolygon 8;");
        // 激活pos事件
        $(document).on('click', '.buffer_poi', this.posEvent);
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
        case　'polygon':
          let pointArrTmp = this.pointArr.concat([{x, y, z}]);
          if (type == 'polygon') {
            const originPoint = this.pointArr[0];
            pointArrTmp = pointArrTmp.concat([originPoint])
          }
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
          const scriptStr = `Render\\RenderDataContex\\DynamicFrame\\AddRenderObj buffer_lineOrPolygon 4 1 (0,0,0) 8 ${vertex_count} ${index_count} ${pointStr} ${indexStr} 0;`;
          bt_Util.executeScript(scriptStr);
          bt_Util.executeScript(`Render\\ForceRedraw;`);
          break;
        default:
          break;
      }
    },
    onDbClick (e) {
      if (e[0] == 0) { // 鼠标左键单击

        // 移除鼠标移动和双击事件
        bt_event.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
        bt_event.removeEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);

        const px = e[1], py = e[2];
        const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
        const posArr = QueryPoint[0].split(" ");

        if (posArr[0] == 1) { // 击中场景
          const type = this.drawType;
          const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
          switch (type) {
            case 'line':
              this.pointArr.push({x, y, z});
              this.handleData(type);
              break;
            case 'polygon':
              const originPoint = this.pointArr[0];
              this.pointArr.push({x, y, z});
              this.pointArr.push(originPoint);
              this.handleData(type);
              break;
            default:
              break;
          }
          // 清除绘制线段
          bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj buffer_lineOrPolygon 8;");
          // 清空点集合
          this.pointArr = [];
        }
      }
    },
    /**
     * type = 'point' | 'line' | 'polygon' | 'close'
     */
    activate (type) {
      this.$notify({
        title: '操作提示！！！',
        message: '点击鼠标右键结束绘制。',
        offset: 100
      });
      this.drawType = type;
      this.pointArr = [];
      // 激活鼠标单击事件
      bt_event.addEventListener("GUIEvent\\KM\\OnMouseClick", this.onClick);
    },
    deactivate () {
      // 清除高亮效果
      bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
      // 移除标注
      this.removePos();
      // 事件失活
      bt_event.removeEventListener("GUIEvent\\KM\\OnMouseClick", this.onClick);
      bt_event.removeEventListener("GUIEvent\\KM\\OnMouseMove", this.onMouseMove);
      bt_event.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.onDbClick);
    },
    handleData (type) {
      const pointArr = this.pointArr;
      let wktTmp ='';
      for (const point of pointArr) {
        wktTmp += `${point.x} ${point.y},`;
      }
      wktTmp = wktTmp.substr(0, wktTmp.length -1);

      let wkt = null;
      switch (type) {
        case 'point':
          wkt = `POINT (${wktTmp})`;
          break;
        case 'line':
          wkt = `LINESTRING (${wktTmp})`;
          break;
        case 'polygon':
          wkt = `POLYGON ((${wktTmp}))`;
          break;
        default:
          break;
      }
      
      // 计算缓冲边界
      const reader = new jsts.io.WKTReader();
      const jstsGeom = reader.read(wkt);
      const buffered = jstsGeom.buffer(this.bufferWidth);
      const coordinates = buffered.getCoordinates();

      const pointStr = this.convertToStr(coordinates);
      const len = coordinates.length;

      // 设置高亮
      this.setLight(pointStr, len);
      this.requestFeature(pointStr);
    },
    convertToStr (coordinates) {
      let pointArr = [];
      for (const ite of coordinates) {
        const tmpArr = [ite.x, ite.y];
        pointArr = pointArr.concat(tmpArr);
      }
      return pointArr.join(' ');
    },
    setLight (pointStr, len) {
      //执行单体化高亮命令
      const str = `Render\\RenderDataContex\\SetOsgAttribBox -10 9999 ${this.lightColor} ${len} ${pointStr};`
      bt_Util.executeScript(str);
    },
    requestFeature (pointStr) {
      const pointArr = pointStr.split(' ');
      let polygon =  ``;
      for (let i = 0; i < pointArr.length; i+=2) {
        polygon += `${pointArr[i]},${pointArr[i+1]} `;
      }
      const { url, version, typename, serverType } = this.wfs;
      let outputformat = '';
      if (serverType && serverType == 'geoserver') outputformat = '&outputFormat=application/json';
      const filter = `<ogc:Filter><ogc:Intersects><ogc:PropertyName>Shape</ogc:PropertyName><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates>${polygon}</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></ogc:Intersects></ogc:Filter>`;
      const urlStr = `${url}?service=WFS&request=GetFeature&version=${version}&typename=${typename}&filter=${filter}${outputformat}`;

      $.ajax({
        url: urlStr,
        type: 'get',
        dataType: 'text',
        timeout: 5000,
        success: (data) => {
          if (serverType && serverType == 'geoserver') {
            const gj = JSON.parse(data);
            this.showPos(gj);
          } else {
            const gmlParser = new GMLParser();
            const gj = gmlParser.gml2Geojson(data);          
            this.showPos(gj);
          }
        },
        error: (error) => {
          console.log(error);
        }
      })
    },
    showPos (data) {
      const features = data.features;
      this.pos_lenth = features.length;
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const [x, y] = feature.geometry.coordinates;
        // 求交得到当前点的高度z值
        const result = bt_Util.executeScript(`Render\\CameraControl\\LineIntersect ${x} ${y} -10 ${x} ${y} 8848;`);
        const resultArr = result[0].split(' ');
        const z = resultArr[0] == 1 ? resultArr[3] : 10;
        let html = "<div class='buffer_poi'>";
          html += "<div class='pop'>";
          html += "<ul>";
          for (let i in feature.properties) {
            html += "<li>" + i + "：" + feature.properties[i] + "</li>";
          }
          html += "</ul>";
          html += "</div>";
          html += "</div>";
          
        bt_Plug_Annotation.setAnnotation('buffer_poi_'+i, x, y, z, -8, -16, html, false);
      }
    },
    posEvent (e) {
      $('.buffer_poi .pop').hide();
      $(e.currentTarget).find('.pop').show();
      $('.bt_ui_element').css({'z-index':10})
      $(e.currentTarget).parent().parent().css({'z-index':11});
    },
    removePos () {
      $(document).off('click', '.buffer_poi', this.posEvent);
      for (let i = 0; i < this.pos_lenth; i++) {
        bt_Plug_Annotation.removeAnnotation('buffer_poi_'+i);
      }
      this.pos_lenth = 0;
    }
  }
}
</script>

<style>
  .buffer_poi{
    background:url(../../../public/assets/images/DefaultIcon.png); 
    background-position:center left; 
    background-repeat: no-repeat;
    height:16px;
    width:16px;
    line-height:10px;
    cursor: pointer;
  }
  .buffer_poi .pop {
    display: none;
    margin-left:16px; 
    font-size:9px; 
    white-space: nowrap;
    width:280px;
    background: #fff;
    color: #000; 
    border-radius: 3px;
    transform: translate(-144px,-250px);
  }
  .buffer_poi .pop:after{
    border: solid transparent;
    content: ' ';
    height: 0;
    left: 45%;
    position: absolute;
    width: 0;
    border-width: 10px;
    border-top-color: #fff;
  }

  .buffer_poi .pop ul {
    max-height: 230px;
    overflow-y: auto;
    margin: 0;
    list-style: none;
  }

  .buffer_poi .pop ul li{
    height:20px;
    line-height:20px;
    padding: 5px;
  }
</style>