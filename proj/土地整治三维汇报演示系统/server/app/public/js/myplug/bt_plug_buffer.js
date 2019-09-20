/**
 * 缓冲分析
 * @description 缓冲分析（基于wfs服务）
 * @author sunpei
 */
$('head').append(`<style>
  .buffer_poi{
    background:url(../image/DefaultIcon.png); 
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
    /* transform: translate(-116px,-140px); */
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
  }

  .buffer_poi .pop ul li{
    height:20px;
    line-height:20px;
    padding: 5px;
  }</style>`);

let bt_plug_buffer = new Plug();

// 插件信息
bt_plug_buffer.js_name = 'bt_plug_buffer';
bt_plug_buffer.plug_name = '缓冲分析';
// bt_plug_buffer.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_buffer.plug_commandOnly = true;
bt_plug_buffer.plug_isOnMobile = false;

// 插件功能
bt_plug_buffer.plug_commands = [];
bt_plug_buffer.plug_commands[0] = new Command("点缓冲", 0, false, false);
bt_plug_buffer.plug_commands[1] = new Command("线缓冲", 1, false, false);
bt_plug_buffer.plug_commands[2] = new Command("面缓冲", 2, false, false);
bt_plug_buffer.plug_commands[3] = new Command("失活控件", 3, false, false);

bt_plug_buffer.command_activate = commandID => {
  switch (commandID) {
    case 0:
      bt_plug_buffer_handle.startBufferQuery('point');
      break;
    case 1:
      bt_plug_buffer_handle.startBufferQuery('line');
      break;
    case 2:
      bt_plug_buffer_handle.startBufferQuery('polygon');
      break;
    case 3:
      bt_plug_buffer_handle.deactivateBufferQuery();
      break;
    default:
      break;
  }
  console.log('command activated: ' + commandID);
}

bt_plug_buffer.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      break;
    default:
      break;
  }
  console.log('command deactivated: ' + commandID);
}

bt_plug_buffer.plug_activate = () => {
  console.log('plug activated')
}

bt_plug_buffer.plug_deactivate = () => {
  console.log('plug deactivated')
  bt_plug_buffer_handle.closeQuery();
}

bt_PlugManager.insert_plug(bt_plug_buffer);

bt_plug_buffer_handle = {
  wfs: {
    url: 'http://192.168.0.250:6080/arcgis/services/luoning/luoning/MapServer/WFSServer',
    version: '1.0.0',
    typename: 'point'
  },
  drawType: null,
  bufferWidth: 100,
  lightColor: '#189e08',
  pointArr: [],
  pos_lenth: 0, //标注长度
  onClick (e) {
    if (e[0] == 0) { // 鼠标左键单击
      const px = e[1], py = e[2];
      const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
      const posArr = QueryPoint[0].split(" ");
      bt_plug_buffer_handle.rmovePos(); // 移除标注

      if (posArr[0] == 1) { // 击中场景
        const type = bt_plug_buffer_handle.drawType;
        const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
        switch (type) {
          case 'point':
            bt_plug_buffer_handle.pointArr = [{x, y, z}];
            bt_plug_buffer_handle.handleData(type);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_plug_buffer_handle.onDbClick);
            break;
          case 'line':
          case 'polygon':
            bt_plug_buffer_handle.pointArr.push({x, y, z});
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_buffer_handle.onMouseMove);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_plug_buffer_handle.onDbClick);
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
    const type = bt_plug_buffer_handle.drawType;
    switch (type) {
      case 'line':
      case　'polygon':
        let pointArrTmp = bt_plug_buffer_handle.pointArr.concat([{x, y, z}]);
        if (type == 'polygon') {
          const originPoint = bt_plug_buffer_handle.pointArr[0];
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
      bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_plug_buffer_handle.onDbClick);
      bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_buffer_handle.onMouseMove);

      const px = e[1], py = e[2];
      const QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + px + " " + py + ";");
      const posArr = QueryPoint[0].split(" ");

      if (posArr[0] == 1) { // 击中场景
        const type = bt_plug_buffer_handle.drawType;
        const x = Number(posArr[1]), y = Number(posArr[2]), z = Number(posArr[3]);
        switch (type) {
          case 'line':
            bt_plug_buffer_handle.pointArr.push({x, y, z});
            bt_plug_buffer_handle.handleData(type);
            break;
          case 'polygon':
            const originPoint = bt_plug_buffer_handle.pointArr[0];
            bt_plug_buffer_handle.pointArr.push({x, y, z});
            bt_plug_buffer_handle.pointArr.push(originPoint);
            bt_plug_buffer_handle.handleData(type);
            break;
          default:
            break;
        }
        // 清除绘制线段
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj buffer_lineOrPolygon 8;");
        // 清空点集合
        bt_plug_buffer_handle.pointArr = [];
      }
    }
  },
  // 开启缓冲查询 type = 'point' | 'line' | 'polygon'
  startBufferQuery (type) {
    this.drawType = type;
    this.pointArr = [];
    // 清除高亮效果
    bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
    // 移除标注
    this.rmovePos();
    // 激活鼠标单击事件
    bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_buffer_handle.onClick);
  },
  closeQuery () {
    // 清除高亮效果
    bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
    // 移除标注
    this.rmovePos();
    // 事件失活
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_buffer_handle.onClick);
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_buffer_handle.onMouseMove);
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_plug_buffer_handle.onDbClick);
  },
  deactivateBufferQuery () {
    // 事件失活
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_buffer_handle.onClick);
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_buffer_handle.onMouseMove);
    bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_plug_buffer_handle.onDbClick);
    // 激活pos事件
    
    $(document).on('click', '.buffer_poi', bt_plug_buffer_handle.posEvent);
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

    const pointStr = bt_plug_buffer_handle.convertToStr(coordinates);
    const len = coordinates.length;

    // 设置高亮
    bt_plug_buffer_handle.setLight(pointStr, len);
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
  posEvent () {
    $('.buffer_poi .pop').hide();
    $(this).find('.pop').show();
  },
  rmovePos () {
    $(document).off('click', '.buffer_poi', bt_plug_buffer_handle.posEvent);
    for (let i = 0; i < this.pos_lenth; i++) {
      bt_Plug_Annotation.removeAnnotation('buffer_poi_'+i);
    }
    this.pos_lenth = 0;
  }
}