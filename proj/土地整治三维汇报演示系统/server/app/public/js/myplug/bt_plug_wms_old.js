var _css = `<style>
.poi{
  background:url(../image/DefaultIcon.png); 
  background-position:center left; 
  background-repeat: no-repeat;
  height:16px;
  width:16px;
  line-height:10px;
  cursor: pointer;
}
.poi .pop {
  margin-left:16px; 
  font-size:9px; 
  white-space: nowrap;
  width:280px;
  background: #fff;
  color: #000; 
  border-radius: 3px;
  /* transform: translate(-116px,-140px); */
  transform: translate(-144px,-250px);
}
.poi .pop:after{
  border: solid transparent;
  content: ' ';
  height: 0;
  left: 45%;
  position: absolute;
  width: 0;
  border-width: 10px;
  border-top-color: #fff;
}

.poi .pop ul {
  min-height: 200px;
}

.poi .pop ul li{
  height:20px;
  line-height:20px;
  padding: 5px;
}</style>`

$('head').append(_css)
// wms服务
let bt_plug_wms = new Plug()

// 插件信息
bt_plug_wms.js_name = 'bt_plug_wms'
bt_plug_wms.plug_name = 'wms服务'
bt_plug_wms.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_wms.plug_commandOnly = true
bt_plug_wms.plug_isOnMobile = false

// 插件功能
bt_plug_wms.plug_commands = []
bt_plug_wms.plug_commands[0] = new Command("wms服务", 0, false, false)

bt_plug_wms.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      bt_plug_wmsHandle.addWMS()
      break
  
    default:
      break
  }
}

bt_plug_wms.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      bt_plug_wmsHandle.removeWMS()
      break
  
    default:
      break
  }
}

bt_plug_wms.plug_activate = () => {
  console.log('plug activated')
}

bt_plug_wms.plug_deactivate = () => {
  console.log('plug deactivated')
}

bt_PlugManager.insert_plug(bt_plug_wms);

var conf = {
  offsetx: 38588000,
  offsety: 2545000,
  // wms: {
  //   url: 'http://localhost:6080/arcgis/services/test2/MapServer/WMSServer',
  //   version: '1.1.1',
  //   format: 'image/png',
  //   layers: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
  //   queryLayers: '11,12,13,14,15,16,17,18,19,20',
  //   srs: 'EPSG:2362'
  // },
  wms: {
    url: 'http://localhost:6080/arcgis/services/chinapc/MapServer/WmsServer',
    version: '1.1.1',
    format: 'image/png',
    layers: '0',
    queryLayers: '0',
    srs: 'EPSG:2362'
  }
}

function renderMap () {
  if (bt_plug_wmsHandle.stop) {
    cancelAnimationFrame(bt_plug_wmsHandle.rafId)
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
  }else {
    // 获得参考点
    let p = bt_Util.screenToWorld(0,0);
    if (bt_plug_wmsHandle.lastP&&p.x != bt_plug_wmsHandle.lastP.x) { //不在同一位置 根据左上角的原点。判断3DMartix 是否移动过
      let view = bt_plug_wmsHandle.getView();
      let zero = view.zero;
      let vHeight = view.vHeight;

      // 计算 bbox 
      let x1 = zero.x - vHeight
      let y1 = zero.y - vHeight
      let x2 = zero.x + vHeight
      let y2 = zero.y + vHeight

      let bbox = x1+conf.offsetx
      bbox+=','+(y1 + conf.offsety)
      bbox+=','+(x2 + conf.offsetx)
      bbox+=','+(y2 + conf.offsety)

      // 获取容器大小
      let container = document.getElementById("bt_container");

      let cw = container.style.width.replace('px','')*2;
      let ch = container.style.height.replace('px','')*2;
      
      let urlStr = `${conf.wms.url}?SERVICE=WMS&VERSION=${conf.wms.version}&REQUEST=GetMap&FORMAT=${conf.wms.format}&TRANSPARENT=true&LAYERS=${conf.wms.layers}&SRS=${conf.wms.srs}&STYLES=&WIDTH=${cw}&HEIGHT=${ch}&BBOX=${bbox}`;
    
      let xhr = new XMLHttpRequest();
      xhr.onload = function () {
        let url = URL.createObjectURL(this.response)
        let image = new Image();
        image.onload = function () {
          const canv = document.createElement('canvas');
          const ctx = canv.getContext("2d");
          canv.width = image.width;
          canv.height = image.height;
          ctx.drawImage(image, 0, 0);
          bt_Util.SetGlobalOrthoTexture1(x1,y2,x2,y1,
            image.width,
            image.height,
            ctx.getImageData(0, 0, image.width, image.height).data
          );
          bt_Util.executeScript("Render\\ForceRedraw;")
          URL.revokeObjectURL(url)
          self.lastP = p
        }
        image.src = url;
      }
      xhr.open('GET',urlStr,true)
      xhr.responseType = 'blob';
      xhr.send();
    }
    bt_plug_wmsHandle.rafId = requestAnimationFrame(_.debounce(renderMap,1000))
  }
}



bt_plug_wmsHandle = {
  lastP: {x: 0}, //场景移动参考点最后停留的位置
  rafId: null, // requestAnimateFrame id,
  stop: false,
  addWMS: function() {
    this.stop = false
    renderMap();
    bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\SetTextureLodFactor 20;");
    bt_PlugManager.addEventListener('GUIEvent\\KM\\OnMouseClick',function(f){
      if (!bt_plug_wmsHandle.stop) {
        bt_plug_wmsHandle.clickEvent(f)
      }
    })
  },
  removeWMS: function() {
    this.stop = true
    bt_Plug_Annotation.removeAnnotation('wms_poi_id')
  },
  clickEvent: function(f) {
    console.log(f)
    // 获取分辨率
    let container = document.getElementById("bt_container");
    let res = this.getView().vHeight*2/container.style.height.replace('px','')
    var {x,y} = bt_Util.screenToWorld(f[1],f[2]);

    var bbox = (x-res*20+conf.offsetx)
    bbox+=','+(y-res*20+conf.offsety)
    bbox+=','+(x+res*20+conf.offsetx)
    bbox+=','+(y+res*20+conf.offsety)
    var url =  `${conf.wms.url}?SERVICE=WMS&VERSION=${conf.wms.version}&REQUEST=GetFeatureInfo&FORMAT=${conf.wms.format}&TRANSPARENT=true&QUERY_LAYERS=${conf.wms.queryLayers}&LAYERS=${conf.wms.layers}&INFO_FORMAT=application/geojson&FEATURE_COUNT=50&X=50&Y=50&SRS=${conf.wms.srs}&STYLES=&WIDTH=101&HEIGHT=101&BBOX=${bbox}`
    $.ajax({
      type:'get',
      url: url,
      success: function(data) {
        var feas = eval('('+data+')').features
        if (feas.length>0){
          var html = "<div class='poi'>";
            html+= "<div class='pop'>"
            html += "<ul>";
          var fea = feas[0]
          for (var i in fea.properties) {
            html += "<li>"+i+"："+fea.properties[i]+"</li>"
          }
          html +="</ul>"
          html += "</div>"
          html += "</div>"
          bt_Plug_Annotation.setAnnotation('wms_poi_id', x, y, 0, -8, -16, html, false);
        } else {
          bt_Plug_Annotation.removeAnnotation('wms_poi_id')
        }
      }
    })
  },
  getView: function() { // 获取窗口信息
    let { cameraPt, lookatPt } = bt_Util.getCameraParam();
    let zero = { x: lookatPt.x, y: lookatPt.y, z: 0 }; // 视点位置
    let vHeight = 2*Math.tan(0.5) * this.distance3(cameraPt, zero); //窗口高度
    return {
      zero,
      vHeight
    }
  },
  distance3: function({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    return Math.abs(
      Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
      )
    );
  }
}

