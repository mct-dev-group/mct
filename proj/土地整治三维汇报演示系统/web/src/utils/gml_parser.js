/**
 * GML解析器
 * @class GMLParser
 */
class GMLParser {
  constructor () {
    this.geojson = null
  }

  /**
   * GML转GeoJson
   * @param {*} data - GML数据 
   * @return {Object} - GeoJson数据
   */
  gml2Geojson (data) {
    let xmlDoc, parser;
    if (typeof data == 'string') {
      try { //Internet Explorer
        // eslint-disable-next-line no-undef
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
  }
  getFeatureMembers (xmlDoc) {
    var tmp = xmlDoc.getElementsByTagName('gml:featureMember')
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].childNodes.length > 0) {
        this.getFeatureMemberChild(tmp[i].childNodes[0])
      }
    }
  }
  getFeatureMemberChild (child) {
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
  }
  getGeometry (node) {
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
  }
  getCoordinatesForPoint (item) {
    let coordinates = []
    let children = item.getElementsByTagName('gml:coordinates')
    if (children.length > 0) {
      let textArr = children[0].innerHTML.trim().split(',')
      for (let i of textArr) {
        coordinates.push(Number(i))
      }
      return coordinates
    }
  }
  getCoordinatesForLineString (item) {
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

  }
  getCoordinatesForMultiLineString (item) {
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
  }
  getCoordinatesForPolygon (item) {
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
  }
  getCoordinatesForMultiPolygon (item) {
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

export default GMLParser;