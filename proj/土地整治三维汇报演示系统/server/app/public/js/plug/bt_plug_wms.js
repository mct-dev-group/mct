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
  max-height: 230px;
  overflow-y: auto;
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
// bt_plug_wms.plug_icon = 'ali-icon-ditu-dibiao'
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
  offsetx: 0,//38588000,
  offsety: 0,//2545000,
  // wms: {
  //   url: 'http://localhost:6080/arcgis/services/test2/MapServer/WMSServer',
  //   version: '1.1.1',
  //   format: 'image/png',
  //   layers: '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
  //   queryLayers: '11,12,13,14,15,16,17,18,19,20',
  //   srs: 'EPSG:2362'
  // },
  wms: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WMSServer',
    version: '1.1.1',
    format: 'image/png',
    layers: '0,1,2,3,4',
    queryLayers: '4,3,2,1,0',
    srs: 'EPSG:4546'
  },
  wfs: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WFSServer',
    version: '1.0.0',
    typenames: 'point,line,cjbd,tdlx,xzq',
    // typenames: 'MyMapService:cjbd',
    srs: 'EPSG:4546'
  }
}

conf = {
  offsetx: 0,
  offsety: 0,
  // wms: {
  //   url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning2/MapServer/WMSServer',
  //   version: '1.1.1',
  //   format: 'image/png',
  //   layers: '0,1,2',
  //   queryLayers: '2,1,0',
  //   srs: 'EPSG:4546'
  // },
  // wfs: {
  //   url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning2/MapServer/WFSServer',
  //   version: '1.0.0',
  //   typenames: 'cjbd,tdlx,xzq'
  // },
  wms: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WMSServer',
    version: '1.1.1',
    format: 'image/png',
    layers: '0,1,2',
    queryLayers: '2,1,0',
    srs: 'EPSG:4546'
  },
  wfs: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WFSServer',
    version: '1.0.0',
    typenames: 'Export_Output,tdlx,行政区'
  },
  // wms: {
  //   url: 'http://localhost:8080/geoserver/luoning/wms',
  //   version: '1.1.1',
  //   format: 'image/png',
  //   layers: 'luoning:xzq,luoning:tdlx,luoning:cjbd',
  //   srs: 'EPSG:4546'
  // },
  // wfs: {
  //   serverType: 'geoserver', // arcgis geoserver
  //   url: 'http://localhost:8080/geoserver/luoning/ows',
  //   version: '1.0.0',
  //   typenames: 'luoning:cjbd,luoning:tdlx,luoning:xzq'
  // },
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

      let cw = container.style.width.replace('px','');
      let ch = container.style.height.replace('px','');
      
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
          let data = ctx.getImageData(0, 0, image.width, image.height).data
          for (let i = 0; i < data.length; i = i + 4) {
            data[i+3] *= 0.5
          }
          bt_Util.SetGlobalOrthoTexture1(x1,y2,x2,y1,
            image.width,
            image.height,
            data //ctx.getImageData(0, 0, image.width, image.height).data
          );
          bt_Util.executeScript("Render\\ForceRedraw;")
          URL.revokeObjectURL(url)
          bt_plug_wmsHandle.lastP = p
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
  lightColor: '#189e08',
  addWMS: function() {
    this.stop = false
    renderMap();
    bt_Util.executeScript("Render\\RenderDataContex\\DataPump\\OsgScene\\SetTextureLodFactor 20;");
    bt_PlugManager.addEventListener('GUIEvent\\KM\\OnMouseClick',function(f){
      if (!bt_plug_wmsHandle.stop) {
        bt_plug_wmsHandle.clickEvent2(f)
      }
    })
  },
  removeWMS: function() {
    this.stop = true
    bt_Plug_Annotation.removeAnnotation('wms_poi_id')
    bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
  },
  clickEvent2: function (f) {
    var self = this
    // 获取分辨率
    let container = document.getElementById("bt_container");
    let res = this.getView().vHeight/container.style.height.replace('px','')
    var {x,y,z} = bt_Util.screenToWorld(f[1],f[2]);

    var bbox = (x-res*2+conf.offsetx)
    bbox+=','+(y-res*2+conf.offsety)
    bbox+=','+(x+res*2+conf.offsetx)
    bbox+=','+(y+res*2+conf.offsety)

    let funcArr = []
    function wfsQuery(typename) {
      return new Promise((resolve, reject) => {
        let outputFormat = ''
        if (conf.wfs.serverType&&conf.wfs.serverType == 'geoserver') {
          outputFormat = '&outputFormat=application/json'
        }
        let url = `${conf.wfs.url}?service=WFS&request=GetFeature&version=${conf.wfs.version}&typename=${typename}&bbox=${bbox}${outputFormat}`
        $.ajax({
          url: url,
          type: 'get',
          dataType: 'text',
          success: function(data) {
            if (conf.wfs.serverType&&conf.wfs.serverType == 'geoserver') {
              var gj = JSON.parse(data)
            } else {
              var gmlParser = new GMLParser()
              var gj = gmlParser.gml2Geojson(data)
            }
            resolve(gj)
          },
          error: function(error) {
            reject(error)
          }
        })
      })
    }
    for (let typename of conf.wfs.typenames.split(',')) {
      funcArr.push(wfsQuery(typename))
    }
    Promise.all(funcArr).then(function(dataArr){
      for (let data of dataArr) {
        // 根据typename顺序 取最前面的数据
        if (data.features.length > 0) {
          // self.setPop(data,x,y,z)
          self.setLight(data,x,y,z)
          break
        }
      }
    })
    
    // var url = `${conf.wfs.url}?service=WFS&request=GetFeature&version=${conf.wfs.version}&typename=${conf.wfs.typenames}&bbox=${bbox}`
    // if (url) {
    //   $.ajax({
    //     url: url,
    //     type: 'get',
    //     dataType: 'text',
    //     success: function(data) {
    //       var gmlParser = new GMLParser()
    //       var gj = gmlParser.gml2Geojson(data)
    //       self.setPop(gj,x,y,z)
    //       self.setLight(gj,x,y,z)
    //     }
    //   })
    // }
  },
  setPop: function(gj,x,y,z) {
    if (gj.features.length > 0) {
      // 取最后一个feature
      let fea = gj.features[gj.features.length -1]
      // 显示浮云框
      let html = "<div class='poi'>";
        html+= "<div class='pop'>"
        html += "<ul>";
        for (var i in fea.properties) {
          html += "<li>"+i+"："+fea.properties[i]+"</li>"
        }
        html +="</ul>"
        html += "</div>"
        html += "</div>"
        bt_Plug_Annotation.setAnnotation('wms_poi_id', x, y, z, -8, -16, html, false);
    } else {
        bt_Plug_Annotation.removeAnnotation('wms_poi_id')
    }
  }, 
  setLight: function(gj,x,y,z) {
    if (gj.features.length > 0) {
      // 取最后一个feature
      let fea = gj.features[gj.features.length -1]
      // 高亮
      let type = fea.geometry.type
      let allPointArr = []
      let allPoint = ''
      let len = 0
      switch (type) {
        case "MultiPolygon":
          let coordinates = fea.geometry.coordinates
          // 多面情况下 判断当前鼠标点位置 高亮当前区域
          for (let i = 0; i < coordinates.length; i++ ) {
            // 判断xy是否再面上
            let bl = insidePolygon([x,y],coordinates[i][0])
            if (bl) {
              this.setPop(gj,x,y,z)
              for (let j = 0; j < coordinates[i].length; j++) {
                // 轮廓线点数
                len += coordinates[i][j].length
                for (let k = 0; k < coordinates[i][j].length; k++) {
                  allPointArr.push(coordinates[i][j][k][0])
                  allPointArr.push(coordinates[i][j][k][1])
                }
              } 
              break
            }
          }

          // for (let i = 0; i < coordinates.length; i++ ) {
          //   for (let j = 0; j < coordinates[i].length; j++) {
          //     // 轮廓线点数
          //     len += coordinates[i][j].length
          //     for (let k = 0; k < coordinates[i][j].length; k++) {
          //       allPointArr.push(coordinates[i][j][k][0])
          //       allPointArr.push(coordinates[i][j][k][1])
          //     }
          //   }
          // }
          allPoint = allPointArr.join(' ')
          //执行单体化高亮命令
          let str = `Render\\RenderDataContex\\SetOsgAttribBox 0 9999 ${this.lightColor} ${len} ${allPoint};`
			    bt_Util.executeScript(str);
          break;
      
        default:
          this.setPop(gj,x,y,z)    
          bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;")

          break;
      }
    } else {
        bt_Plug_Annotation.removeAnnotation('wms_poi_id')
    }
    
    
    


  },
  clickEvent: function(f) {
    console.log(f)
    let self = this
    // 获取分辨率
    let container = document.getElementById("bt_container");
    let res = this.getView().vHeight/container.style.height.replace('px','')
    var {x,y,z} = bt_Util.screenToWorld(f[1],f[2]);

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
          bt_Plug_Annotation.setAnnotation('wms_poi_id', x, y, z, -8, -16, html, false);
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


/**
 * 判断点是否在几何图形内 钟如意 15:49:00
 * @param testPoint
 * @param points
 * @return
 */
// function insidePolygon(testPoint, points) {
//     let x = parseFloat(testPoint.x), y = parseFloat(testPoint.y);
//     let inside = false;
//     for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
//         let xi = parseFloat(points[i].x), yi = parseFloat(points[i].y);
//         let xj = parseFloat(points[j].x), yj = parseFloat(points[j].y);

//         let intersect = ((yi > y) !== (yj > y))
//             && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
//         if (intersect)
//             inside = !inside;
//     }

//     return inside;
// }

function insidePolygon(testPoint, points) {
  let x = testPoint[0], y = testPoint[1]
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++){
    let xi = points[i][0], yi = points[i][1];
    let xj = points[j][0], yj = points[j][1];

    let intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
  }
  return inside;
}


function GMLParser (data) {
  var o = {
    geojson: null,
    gml2Geojson: function(data) {
      let xmlDoc;
      if (typeof data == 'string') {
        try { //Internet Explorer
          xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
          xmlDoc.async = "false"
          xmlDoc.loadXML(data)
        } catch (e) {
          try { //Firefox, Mozilla, Opera, etc.
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(data, "text/xml");
          } catch (e) {
            alert(e.message)
          }
        }
      } else {
        xmlDoc = data
      }
      this.geojson = {
        "type": "FeatureCollection",
        "features": []
      }
      this.getFeatureMembers(xmlDoc)
      return this.geojson
    },
    getFeatureMembers: function(xmlDoc){
      var tmp = xmlDoc.getElementsByTagName('gml:featureMember')
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].childNodes.length > 0) {
          this.getFeatureMemberChild(tmp[i].childNodes[0])
        }
      }
    },
    getFeatureMemberChild: function(child) {
      let feature = {
        "type": "Feature",
        "properties": {}
      }
      let items = child.childNodes
      for (let i = 0; i < items.length; i++) {
        let item = items[i]
        let filedName = item.nodeName.split(":").pop();
        if (filedName == 'Shape') { // 几何信息
          feature.geometry = this.getGeometry(item)
        } else { // 属性信息
          feature.properties[filedName] = item.innerHTML
        }
      }
      this.geojson.features.push(feature)
    },
    getGeometry: function(node) {
      let child = node.childNodes
      let geometry = {}
      if (child.length > 0) {
        let featureType = child[0].nodeName.split(":").pop()
        switch (featureType){
          case 'Point':
            geometry.coordinates = this.getCoordinatesForPoint(child[0]) 
            break
          case 'LineString':
            geometry.coordinates = this.getCoordinatesForLineString(child[0])
            break
          case 'MultiLineString':
            geometry.coordinates = this.getCoordinatesForMultiLineString(child[0])
            break
          case 'Polygon':
            geometry.coordinates = this.getCoordinatesForPolygon(child[0])
            break
          case 'MultiPolygon':
            geometry.coordinates = this.getCoordinatesForMultiPolygon(child[0])
            break
          default:
            break
        }
        geometry.type = featureType
      }
      return geometry
    },
    getCoordinatesForPoint: function(item){
      let coordinates = []
      let children = item.getElementsByTagName('gml:coordinates')
      if (children.length > 0) {
        let textArr = children[0].innerHTML.trim().split(',')
        for (let i of textArr) {
          coordinates.push(Number(i))
        }
        return coordinates
      }
    },
    getCoordinatesForLineString: function (item) {
      let coordinates = []
      let children = item.getElementsByTagName('gml:coordinates')
      if (children.length > 0) {
        let textArr = children[0].innerHTML.split(' ')
        for (let i of textArr) {
          let tmpArr = []
          let textArr2 = i.split(',')
          for (let j of textArr2){
            tmpArr.push(Number(j))
          }
          coordinates.push(tmpArr)
        }
      }
      return coordinates
      
    },
    getCoordinatesForMultiLineString: function(item){
      let coordinates = []
      let children = item.getElementsByTagName('gml:lineStringMember')
      if (children.length > 0) {
        for (let child of children) {
          if (child.childNodes.length > 0) {
            coordinates.push(this.getCoordinatesForLineString(child.childNodes[0]))
          }
        }
      }
      return coordinates
    },
    getCoordinatesForPolygon: function(item){
      let coordinates = []
      let children = item.getElementsByTagName('gml:coordinates')
      if (children.length > 0) {
        for (let child of children) {
          let coordinates2 = []
          let textArr = child.innerHTML.trim().split(' ')
          for (let i of textArr) {
            let tmpArr = []
            let textArr2 = i.split(',')
            for (let j of textArr2){
              tmpArr.push(Number(j))
            }
            coordinates2.push(tmpArr)
          }
          coordinates.push(coordinates2)
        }
      }
      return coordinates
    },
    getCoordinatesForMultiPolygon: function(item){
      let coordinates = []
      let children = item.getElementsByTagName('gml:polygonMember')
      if (children.length > 0) {
        for (let child of children) {
          if (child.childNodes.length > 0) {
            coordinates.push(this.getCoordinatesForPolygon(child.childNodes[0]))
          }
        }
      }
      return coordinates
    }
  }
  return o
}

