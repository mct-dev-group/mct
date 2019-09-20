/**
 * 二维地图
 * @description 在三维场景中叠加wms服务；鼠标单击查询要素
 * @author sunpei
 */
$('head').append(`<style>
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
  }</style>`);

let bt_plug_wms = new Plug();

// 插件信息
bt_plug_wms.js_name = 'bt_plug_wms';
bt_plug_wms.plug_name = '二维地图';
// bt_plug_wms.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_wms.plug_commandOnly = true;
bt_plug_wms.plug_isOnMobile = false;

// 插件功能
bt_plug_wms.plug_commands = [];
bt_plug_wms.plug_commands[0] = new Command("所有", 0, false, false);
bt_plug_wms.plug_commands[1] = new Command("行政区", 1, false, false);
bt_plug_wms.plug_commands[2] = new Command("土地类型", 2, false, false);
bt_plug_wms.plug_commands[3] = new Command("斑点采集", 3, false, false);

bt_plug_wms.command_activate = commandID => {
  switch (commandID) {
    case 0:
      bt_plug_wms_handle.wms.layers = '0,1,2';
      bt_plug_wms_handle.wfs.typenames = 'Export_Output,tdlx,行政区';
      break;
    case 1:
      bt_plug_wms_handle.wms.layers = '0';
      bt_plug_wms_handle.wfs.typenames = '行政区';
      break;
    case 2:
      bt_plug_wms_handle.wms.layers = '1';
      bt_plug_wms_handle.wfs.typenames = 'tdlx';
      break;
    case 3:
      bt_plug_wms_handle.wms.layers = '2';
      bt_plug_wms_handle.wfs.typenames = 'Export_Output';
      break;
    default:
      break;
  }
  console.log('command activated: ' + commandID);
  bt_plug_wms_handle.addWMS();
}

bt_plug_wms.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      break;
    default:
      break;
  }
  console.log('command deactivated: ' + commandID);
  bt_plug_wms_handle.removeWMS();
}

bt_plug_wms.plug_activate = () => {
  console.log('plug activated');
}

bt_plug_wms.plug_deactivate = () => {
  console.log('plug deactivated');
}

bt_PlugManager.insert_plug(bt_plug_wms);


let bt_plug_wms_handle = {
  offsetx: 0,
  offsety: 0,
  wms: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WMSServer',
    version: '1.1.1',
    format: 'image/png',
    layers: '0,1,2',
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
  lightColor: '#189e08',
  // 是否已发送请求
  sendingRequest: false,
  // 相机在上一次请求图片的位置
  lastP: null,
  onBeforRender() {
    if (bt_plug_wms_handle.sendingRequest) return;
    bt_plug_wms_handle.requestImage();
  },
  onClick(e) {
    bt_plug_wms_handle.requestFeature(e);
  },
  addWMS() {
    // 激活场景事件
    bt_PlugManager.addEventListener("Render\\BeforeRender", bt_plug_wms_handle.onBeforRender);
    bt_PlugManager.addEventListener('GUIEvent\\KM\\OnMouseClick', bt_plug_wms_handle.onClick);

    // 添加二维图层 请求状态恢复默认 fasle
    bt_plug_wms_handle.sendingRequest = false;

    this.requestImage();
  },
  removeWMS() {
    // 移除场景事件
    bt_PlugManager.removeEventListener("Render\\BeforeRender", bt_plug_wms_handle.onBeforRender);
    bt_PlugManager.removeEventListener('GUIEvent\\KM\\OnMouseClick', bt_plug_wms_handle.onClick);
    // 移除显示的数据
    this.hideData();
    // 移除wms图片纹理
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
    // 更新相机位置 为默认值 null
    this.lastP = null;
  },
  requestImage() {
    // 获取相机位置
    const p = bt_Util.getCameraParam().cameraPt;

    // 如果当前相机位置和上一次请求图片时相机位置相等 则不再请求 直接return
    if (this.lastP && this.lastP.x == p.x && this.lastP.y == p.y && this.lastP.z == p.z) return;

    // 更新相机位置
    this.lastP = p;

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

    let bbox = x1 + this.offsetx;
    bbox += ',' + (y1 + this.offsety);
    bbox += ',' + (x2 + this.offsetx);
    bbox += ',' + (y2 + this.offsety);

    // 获取容器大小
    const container = document.getElementById("bt_container");

    const cw = container.style.width.replace('px', '') * 2;
    const ch = container.style.height.replace('px', '') * 2;

    const { url, version, format, layers, srs } = this.wms;

    // 图片请求地址
    const urlStr = `${url}?SERVICE=WMS&VERSION=${version}&REQUEST=GetMap&FORMAT=${format}&TRANSPARENT=true&LAYERS=${layers}&SRS=${srs}&STYLES=&WIDTH=${cw}&HEIGHT=${ch}&BBOX=${bbox}`;

    const xhr = new XMLHttpRequest();
    // 图片请求结果处理
    xhr.onload = () => {
      const url = URL.createObjectURL(xhr.response)
      const image = new Image();
      image.onload = () => {
        const canv = document.createElement('canvas');
        const ctx = canv.getContext("2d");
        canv.width = image.width;
        canv.height = image.height;
        ctx.drawImage(image, 0, 0);
        const data = ctx.getImageData(0, 0, image.width, image.height).data
        for (let i = 0; i < data.length; i = i + 4) {
          data[i + 3] *= 0.5
        }
        bt_Util.SetGlobalOrthoTexture1(x1, y2, x2, y1,
          image.width,
          image.height,
          data //ctx.getImageData(0, 0, image.width, image.height).data
        );
        bt_Util.executeScript("Render\\ForceRedraw;");
        // 清除图片
        URL.revokeObjectURL(url);

        // 请求完成 状态设为 false
        this.sendingRequest = false;
      }
      image.src = url;
    }
    xhr.open('GET', urlStr, true);
    xhr.timeout = 5000;
    xhr.responseType = 'blob';
    xhr.send();

  },
  requestFeature(e) {
    // 获取分辨率
    const container = document.getElementById("bt_container");
    const res = this.getView().vHeight / container.style.height.replace('px', '');

    // 得到世界坐标系
    const { x, y, z } = bt_Util.screenToWorld(e[1], e[2]);

    let bbox = (x - res * 2 + this.offsetx);
    bbox += ',' + (y - res * 2 + this.offsety);
    bbox += ',' + (x + res * 2 + this.offsetx);
    bbox += ',' + (y + res * 2 + this.offsety);

    const { url, version, typenames, serverType } = this.wfs;

    let funcArr = []
    function wfsQuery(typename) {
      return new Promise((resolve, reject) => {

        let outputformat = '';
        if (serverType && serverType == 'geoserver') outputformat = '&outputFormat=application/json';

        const urlStr = `${url}?service=WFS&request=GetFeature&version=${version}&typename=${typename}&bbox=${bbox}${outputformat}`;

        $.ajax({
          url: urlStr,
          type: 'get',
          dataType: 'text',
          timeout: 5000,
          success: (data) => {
            if (serverType && serverType == 'geoserver') {
              const gj = JSON.parse(data);
              resolve(gj);
            } else {
              const gmlParser = new GMLParser();
              const gj = gmlParser.gml2Geojson(data);
              resolve(gj);
            }

          },
          error: (error) => {
            reject(error);
          }
        })
      })
    }
    for (let typename of typenames.split(',')) {
      funcArr.push(wfsQuery(typename));
    }
    Promise.all(funcArr).then((dataArr) => {
      // 返回结果前清除上一次显示的结果
      this.hideData();
      for (let data of dataArr) {
        // 根据typename顺序 取最前面的数据
        if (data.features.length > 0) {
          this.showData(data, x, y, z);
          return;
        }
      }
    })
  },
  showData(data, x, y, z) {
    const feature = data.features[data.features.length - 1];
    this.setPop(feature, x, y, z);
    this.setLight(feature, x, y, z);
  },
  hideData() {
    // 移除高亮和标注
    bt_Plug_Annotation.removeAnnotation('wms_poi_id');
    bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
  },
  setPop(feature, x, y, z) {
    let html = "<div class='poi'>";
    html += "<div class='pop'>"
    html += "<ul>";
    for (let i in feature.properties) {
      html += "<li>" + i + "：" + feature.properties[i] + "</li>"
    }
    html += "</ul>"
    html += "</div>"
    html += "</div>"
    bt_Plug_Annotation.setAnnotation('wms_poi_id', x, y, z, -8, -16, html, false);
  },
  setLight(feature, x, y, z) {
    let type = feature.geometry.type;
    let allPointArr = []
    let allPoint = ''
    let len = 0
    switch (type) {
      case "MultiPolygon":
        const coordinates = feature.geometry.coordinates;
        // 多面情况下 判断当前鼠标点位置 高亮当前区域
        for (let i = 0; i < coordinates.length; i++) {
          // 判断xy是否再面上
          const bl = this.insidePolygon([x, y], coordinates[i][0]);
          if (bl) {
            for (let j = 0; j < coordinates[i].length; j++) {
              // 轮廓线点数
              len += coordinates[i][j].length
              for (let k = 0; k < coordinates[i][j].length; k++) {
                allPointArr.push(coordinates[i][j][k][0]);
                allPointArr.push(coordinates[i][j][k][1]);
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

        allPoint = allPointArr.join(' ');
        //执行单体化高亮命令
        let str = `Render\\RenderDataContex\\SetOsgAttribBox -10 9999 ${this.lightColor} ${len} ${allPoint};`
        bt_Util.executeScript(str);
        break;

      default:
        bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");

        break;
    }
  },
  getView() { // 获取窗口信息
    let { cameraPt, lookatPt } = bt_Util.getCameraParam();
    let zero = { x: lookatPt.x, y: lookatPt.y, z: 0 }; // 视点位置
    let vHeight = 2 * Math.tan(0.5) * this.distance3(cameraPt, zero); //窗口高度
    return {
      zero,
      vHeight
    }
  },
  distance3({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    return Math.abs(
      Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
      )
    );
  },
  insidePolygon(testPoint, points) {
    const x = testPoint[0], y = testPoint[1]
    let inside = false
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i][0], yi = points[i][1];
      const xj = points[j][0], yj = points[j][1];

      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }
}


function GMLParser(data) {
  var o = {
    geojson: null,
    gml2Geojson: function (data) {
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
    getFeatureMembers: function (xmlDoc) {
      var tmp = xmlDoc.getElementsByTagName('gml:featureMember')
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].childNodes.length > 0) {
          this.getFeatureMemberChild(tmp[i].childNodes[0])
        }
      }
    },
    getFeatureMemberChild: function (child) {
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
    getGeometry: function (node) {
      let child = node.childNodes
      let geometry = {}
      if (child.length > 0) {
        let featureType = child[0].nodeName.split(":").pop()
        switch (featureType) {
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
    getCoordinatesForPoint: function (item) {
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
          for (let j of textArr2) {
            tmpArr.push(Number(j))
          }
          coordinates.push(tmpArr)
        }
      }
      return coordinates

    },
    getCoordinatesForMultiLineString: function (item) {
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
    getCoordinatesForPolygon: function (item) {
      let coordinates = []
      let children = item.getElementsByTagName('gml:coordinates')
      if (children.length > 0) {
        for (let child of children) {
          let coordinates2 = []
          let textArr = child.innerHTML.trim().split(' ')
          for (let i of textArr) {
            let tmpArr = []
            let textArr2 = i.split(',')
            for (let j of textArr2) {
              tmpArr.push(Number(j))
            }
            coordinates2.push(tmpArr)
          }
          coordinates.push(coordinates2)
        }
      }
      return coordinates
    },
    getCoordinatesForMultiPolygon: function (item) {
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

