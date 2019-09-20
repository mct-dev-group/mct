const plug_twoInone = new Plug();
plug_twoInone.js_name = "plug_twoInone";
plug_twoInone.plug_name = "地图叠加";
plug_twoInone.plug_isOnMobile = true;

plug_twoInone.plug_activate = function() {
  // bt_twoInone.active();
};

plug_twoInone.plug_deactivate = function() {
  // bt_twoInone.deactivate();
};

plug_twoInone.plug_commands = [];
plug_twoInone.plug_commands[0] = new Command("houmen", 1, false, true);
plug_twoInone.plug_commands[1] = new Command("shenshan2", 2, false, true);
plug_twoInone.plug_commands[2] = new Command("shenshan3", 3, false, true);
plug_twoInone.plug_commands[3] = new Command("关闭", 4, false, true);

plug_twoInone.command_activate = function(command_id) {
  switch (command_id) {
    case plug_twoInone.plug_commands[0].command_id:
      bt_twoInone.active(houmen);
      {
        const [LayerGroup, View] = bt_twoInone.getLayerGroup(houmen);
        bt_twoInone.map.setView(View);
        bt_twoInone.map.setLayerGroup(LayerGroup);
        // bt_twoInone.addEventListener();
        searchBox_Vue.connUrl.fuzzyQuery =
          "http://192.168.0.250:8013/datamanage/v2/db/9/table/1/item/name/";
        searchBox_Vue.connUrl.mapToDetail =
          "http://192.168.0.250:8013/datamanage/v2/db/9/table/1/item/position";
      }
      break;
    case plug_twoInone.plug_commands[1].command_id:
      bt_twoInone.active(shenshan2);
      {
        const [LayerGroup, View] = bt_twoInone.getLayerGroup(shenshan2);
        bt_twoInone.map.setView(View);
        bt_twoInone.map.setLayerGroup(LayerGroup);
        // bt_twoInone.addEventListener();
        searchBox_Vue.connUrl.fuzzyQuery =
          "http://192.168.0.250:8013/datamanage/v2/db/10/table/1/item/name/";
        searchBox_Vue.connUrl.mapToDetail =
          "http://192.168.0.250:8013/datamanage/v2/db/10/table/1/item/position";
      }
      break;
    case plug_twoInone.plug_commands[2].command_id:
      bt_twoInone.active(shenshan3);
      {
        const [LayerGroup, View] = bt_twoInone.getLayerGroup(shenshan3);
        bt_twoInone.map.setView(View);
        bt_twoInone.map.setLayerGroup(LayerGroup);
        // bt_twoInone.addEventListener();
        searchBox_Vue.connUrl.fuzzyQuery =
          "http://192.168.0.250:8013/datamanage/v2/db/11/table/1/item/name/";
        searchBox_Vue.connUrl.mapToDetail =
          "http://192.168.0.250:8013/datamanage/v2/db/11/table/1/item/position";
      }
      break;
    case plug_twoInone.plug_commands[3].command_id:
      bt_twoInone.deactivate();
      break;
  }
  bt_Util.executeScript("Render\\ForceRedraw;");
};

const bt_twoInone = {
  isOn: false,
  lastFrameZoom: undefined,
  renderDone: false,
  syncCount: 0,
  renderRoadCount: 0,
  offsetx: 38588000,
  offsety: 2545000,
  map: undefined,
  requestId: undefined,
  center: [],
  resolution: 0,

  active: function(config) {
    bt_twoInone.isOn = true;
    if (bt_twoInone.map) return;
    const { cameraPt, lookatPt } = bt_Util.getCameraParam();
    const container = document.getElementById("bt_container");
    var zero = { x: lookatPt.x, y: lookatPt.y, z: 0 };
    let camHight = Math.tan(0.5) * bt_twoInone.distance3(cameraPt, zero) * 5;
    bt_twoInone.resolution =
      camHight / container.style.height.replace("px", "");
    $("body").append(
      ` <div id="mapContainer"><div id="map" class="map"></div></div>`
    );
    bt_twoInone.initMap(config);
  },
  deactivate: function() {
    bt_twoInone.isOn = false;
    bt_twoInone.map = undefined;
    const el = document.getElementById("mapContainer");
    el.remove();
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
  },
  initMap: function(config) {
    const [_, View, layer] = bt_twoInone.getLayerGroup(config);
    bt_twoInone.map = new ol.Map({
      layers: [layer],
      target: "map",
      view: View
    });
    bt_twoInone.addEventListener();
    bt_twoInone.viewSync();
  },
  addEventListener: function() {
    bt_twoInone.map.on(
      "postrender",
      lodash.debounce(bt_twoInone.randerRoads, 50)
    );
    bt_twoInone.map.on(
      "postrender",
      lodash.debounce(() => {
        bt_twoInone.renderDone = true;
      }, 10)
    );
  },
  viewSync: function() {
    if (bt_twoInone.renderDone) {
      const { x } = bt_Util.screenToWorld(0, 0);
      if (
        bt_twoInone.lastFrameZoom != x &&
        bt_twoInone.map.getCoordinateFromPixel([0, 0])
      ) {
        const { cameraPt, lookatPt } = bt_Util.getCameraParam();
        const container = document.getElementById("bt_container");
        var zero = { x: lookatPt.x, y: lookatPt.y, z: 0 };
        let camHight =
          Math.tan(0.5) * bt_twoInone.distance3(cameraPt, zero) * 2.5;
        bt_twoInone.resolution =
          camHight / container.style.height.replace("px", "");
        bt_twoInone.center = [
          lookatPt.x + bt_twoInone.offsetx,
          lookatPt.y + bt_twoInone.offsety
        ];
        openlayerView.animate({
          center: bt_twoInone.center,
          duration: 0,
          resolution:
            bt_twoInone.resolution < 0.7 ? 0.7 : bt_twoInone.resolution
        });
        bt_twoInone.renderDone = false;
        bt_twoInone.lastFrameZoom = x;
      }
    }
    bt_twoInone.requestId = window.requestAnimationFrame(bt_twoInone.viewSync);
  },

  randerRoads: function(evt) {
    if (!bt_twoInone.isOn) return;
    const mapElement = document.getElementsByClassName("ol-unselectable")[0];
    let [w, h] = bt_twoInone.map.getSize();
    let ciw = mapElement.width;
    let cih = mapElement.height;
    const canvas = mapElement.getContext("2d");
    const cw = bt_twoInone.map.getCoordinateFromPixel([0, 0]);
    const ch = bt_twoInone.map.getCoordinateFromPixel([w, h]);
    let imgdata = canvas.getImageData(0, 0, ciw, cih).data;
    bt_Util.SetGlobalOrthoTexture1(
      cw[0] - bt_twoInone.offsetx,
      cw[1] - bt_twoInone.offsety,
      ch[0] - bt_twoInone.offsetx,
      ch[1] - bt_twoInone.offsety,
      ciw,
      cih,
      imgdata
    );
    bt_Util.executeScript("Render\\ForceRedraw;");
    bt_twoInone.renderDone = true;
  },
  getLayerGroup: function(config) {
    const { lookatPt } = bt_Util.getCameraParam();
    bt_twoInone.center = [
      lookatPt.x + bt_twoInone.offsetx,
      lookatPt.y + bt_twoInone.offsety
    ];
    proj4.defs(config.projectionCode, config.projectionDef);
    ol.proj.proj4.register(proj4);
    const projection = ol.proj.get(config.projectionCode);
    openlayerView = new ol.View({
      center: bt_twoInone.center,
      // resolutions: config.resolutions,
      projection: projection,
      resolution: bt_twoInone.resolution
    });
    const tileGridWMTS = new ol.tilegrid.WMTS({
      //分辨率，每级对应的分辨率，可在arcgis server的mapserver最后面找到
      resolutions: config.resolutions,
      //原点
      origin: config.origin,
      tileSize: config.tileSize,
      //每级对应的id，与分辨率数组长度一致，必填。可在WMTS描述文档的<ows:Identifier>找到
      matrixIds: config.matrixIds
    });
    const smOption = {
      crossOrigin: config.crossOrigin,
      // name: "test",
      tileGrid: tileGridWMTS,
      matrixSet: config.matrixSet,
      projection: projection,
      layer: config.layer,
      style: config.style,
      version: config.version,
      format: config.format,
      transition: config.transition,
      opaque: config.opaque,
      requestEncoding: config.requestEncoding,
      //路径可以在WMTS描述文档里面的<ResourceURL>里找到
      url: config.url
    };
    var layer = new ol.layer.Tile({
      source: new ol.source.WMTS(smOption),
      opacity: 0.5
    });
    var layerGroup = new ol.layer.Group({
      layers: [layer]
    });
    return [layerGroup, openlayerView, layer];
  },
  distance3: function({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
    return Math.abs(
      Math.sqrt(
        Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
      )
    );
  }
};

const shenshan2 = {
  resolutions: [
    132.2919312505292,
    66.1459656252646,
    33.0729828126323,
    16.933367200067735,
    8.466683600033868,
    4.233341800016934,
    2.116670900008467,
    1.0583354500042335,
    0.5291677250021167,
    0.26458386250105836
  ],
  projectionCode: "EPSG:2362",
  projectionDef:
    "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=esriMeters +no_defs",
  origin: [3.28768e7, 1.00021e7],
  tileSize: 256,
  matrixIds: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  center: [3.861653934509063e7, 2512462.0367300953],
  crossOrigin: "*",
  name: "test",
  matrixSet: "default028mm",
  layer: "shenshan2",
  style: "default",
  version: "1.0.0",
  format: "image/png",
  transition: 1,
  opaque: 0.5,
  requestEncoding: "REST",
  url:
    "http://192.168.0.195:6080/arcgis/rest/services/shenshan2/shenshan2/MapServer/WMTS/tile/1.0.0/shenshan2_shenshan2/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
};

const shenshan3 = {
  resolutions: [
    2116.670900008467,
    1058.3354500042335,
    529.1677250021168,
    264.5838625010584,
    132.2919312505292
  ],
  projectionCode: "EPSG:2362",
  projectionDef:
    "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=esriMeters +no_defs",
  origin: [3.2697442599785e7, 1.0181457400215e7],
  tileSize: 256,
  matrixIds: ["0", "1", "2", "3", "4"],
  crossOrigin: "*",
  // name: "test",
  matrixSet: "default028mm",
  layer: "shenshan3",
  style: "default",
  version: "1.0.0",
  format: "image/png",
  transition: 0,
  opaque: 0,
  requestEncoding: "REST",
  url:
    "http://192.168.0.195:6080/arcgis/rest/services/shenshan3/shenshan3/MapServer/WMTS/tile/1.0.0/shenshan3_shenshan3/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
};

const houmen = {
  resolutions: [
    16.933367200067735,
    8.466683600033868,
    4.233341800016934,
    2.116670900008467,
    1.0583354500042335
  ],
  projectionCode: "EPSG:2362",
  projectionDef:
    "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=esriMeters +no_defs",
  origin: [3.28768e7, 1.00021e7],
  tileSize: 256,
  matrixIds: ["0", "1", "2", "3", "4"],
  // center:[3.861653934509063e7, 2512462.0367300953],
  crossOrigin: "*",
  // name: "test",
  matrixSet: "default028mm",
  layer: "houmen",
  style: "default",
  version: "1.0.0",
  format: "image/png",
  transition: 0,
  opaque: 0,
  requestEncoding: "REST",
  url:
    "http://192.168.0.195:6080/arcgis/rest/services/houmen/houmen/MapServer/WMTS/tile/1.0.0/houmen_houmen/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png"
};

$(function() {
  $("head").append(
    `
    <style>
    #mapContainer {
      float: right;
      overflow: hidden;
      height: 200vh;
      width: 200vw;
    }
    .map {
      overflow: hidden;
      /* display: none; */
      float: left;
      height: 200vh;
      width: 200vw;
    }
    .ol-unselectable {
      overflow: hidden;
    }
    .ol-viewport{
      z-index: -1;
    }
    </style>`
  );
});

bt_PlugManager.insert_plug(plug_twoInone);
