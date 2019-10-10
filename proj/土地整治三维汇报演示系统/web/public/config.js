/**
 * 配置文件
 * @description 写法： config.xxx = {}
 */
var config = {};

// 图层控制
config.services = {
  wms: {
    url: 'http://192.168.0.250:8888/geoserver/qibin/wms',
    version: '1.1.1',
    format: 'image/png',
    srs: 'EPSG:4547',
    layers: [
      {
        title: '行政乡',
        value: 'qibin:country'
      },
      {
        title: '行政村',
        value: 'qibin:village'
      },
      {
        title: '潜力斑点',
        value: 'qibin:spot'
      },
      {
        title: '规划斑点',
        value: 'qibin:plan'
      }
    ]
  },
  wfs: {
    url: 'http://192.168.0.250:8888/geoserver/qibin/wfs',
    version: '1.0.0',
    typenames: 'plan,spot,village,country',
    serverType: 'geoserver'
  }
}
//上传
config.server='http://localhost:7001/';