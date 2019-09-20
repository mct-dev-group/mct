/**
 * WFST工具
 * {
			"type": "Feature",
			"id": "point.1",
			"geometry": {
				"type": "Point",
				"coordinates": [
					571430.01881945,
					3825040.98040829
				]
			},
			"properties": {
				"objectid": 1,
				"bsm": 6860,
				"ysdm": "1000600100",
				"xzqdm": "410328201207",
				"xzqmc": "程岭村",
				"kzmj": 2146832.57,
				"jsmj": 2146832.55,
				"mssm": "00",
				"shape_leng": 8211.9185523,
				"shape_area": 2147103.67467,
				"orig_fid": 0
      }
      `<wfs:Update typeName="${this.option.typeName}">
        <wfs:Property>
            <wfs:Name>xzqmc</wfs:Name>
            <wfs:Value>测试更新413</wfs:Value>
        </wfs:Property>
        <ogc:Filter>
          <FeatureId fid="413" />
        </ogc:Filter>
      </wfs:Update>`
		}
 */
class WFSTHelper {
  /**
   * @constructor
   * @param {object} option
   * @param {string} option.url
   * @param {string} option.typeName
   * @param {string} option.projection
   * @param {string} option.geometryName
   */
  constructor(option) {
    this.option = option;
  }

  /**
   * 插入
   * @method insert
   * @param geojson - GeoJson对象
   */
  insert(geojson, callback) {
    const xml = this.getInsertParamString(geojson);

    $.ajax({
      url: this.option.url,
      type: 'post',
      data: xml,
      contentType: 'text/plain;charset=utf-8',
      dataType: 'text',
      success: (result) => {
        console.log(result);
        const r = this.parseTransactionResult(result);
        if (callback) callback (r);
      },
      error: function (error) {
        console.log(error);
      }
    })
  }

  /**
   * 更新
   * @method update
   * @param geojson
   */
  update(geojson, callback) {
    const xml = this.getUpdateParamString(geojson);

    $.ajax({
      url: this.option.url,
      type: 'post',
      data: xml,
      contentType: 'text/plain;charset=utf-8',
      dataType: 'text',
      success: (result) => {
        console.log(result);
        const r = this.parseTransactionResult(result);
        if (callback) callback (r);
      },
      error: function (error) {
        console.log(error);
      }
    })

  }

  /**
   * 删除
   * @method delete
   * @param fid
   */
  delete(fid, callback) {
    const xml = this.getDeleteParamString(fid);
    $.ajax({
      url: this.option.url,
      type: 'post',
      data: xml,
      contentType: 'text/plain;charset=utf-8',
      dataType: 'text',
      success: (result) => {
        console.log(result);
        const r = this.parseTransactionResult(result);
        if (callback) callback (r);
      },
      error: function (error) {
        console.log(error);
      }
    })
  }
  getInsertParamString(geojson) {
    const { properties, geometry } = geojson;
    let str = `
      <wfs:Insert>
        <${this.option.typeName}>`;
    // 属性信息
    for (let i in properties) {
      if (properties[i]) {
        str += `
          <${i}>${properties[i]}</${i}>`;
      }
    }
    // 空间信息
    const coordinates = geometry.coordinates;
    if (coordinates) {
      switch (geometry.type.toUpperCase()) {
        case 'POINT':
          str += `
            <${this.option.geometryName}>
              <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#${this.option.projection.split(':')[1]}">
                <gml:coordinates decimal="." cs="," ts=" ">${coordinates.join(',')}</gml:coordinates>
              </gml:Point>
            </${this.option.geometryName}>`;
          break;
        case 'LINESTRING':
          str += `
            <${this.option.geometryName}>
              <gml:LineString srsName="http://www.opengis.net/gml/srs/epsg.xml#${this.option.projection.split(':')[1]}">
                <gml:coordinates>
                  ${coordinates.join(' ')}
                </gml:coordinates>
              </gml:LineString>
            </${this.option.geometryName}>`;
          break;
        case 'MULTILINESTRING':
          str += `
            <${this.option.geometryName}>
              <gml:MultiLineString srsName="http://www.opengis.net/gml/srs/epsg.xml#${this.option.projection.split(':')[1]}">`;
          for (let i = 0; i < coordinates.length; i++) {
            str += `
              <gml:lineStringMember>
                <gml:LineString>
                  <gml:coordinates>
                    ${coordinates[i].join(' ')}
                  </gml:coordinates>
                </gml:LineString>
              </gml:lineStringMember>`;
          }
          str += `
              </gml:MultiLineString>
            </${this.option.geometryName}>
          `;
            break;
        case 'POLYGON':
          str += `
            <${this.option.geometryName}>
              <gml:Polygon srsName="http://www.opengis.net/gml/srs/epsg.xml#${this.option.projection.split(':')[1]}">`; 
            for (let i = 0; i < coordinates.length; i++) {
              if (i == 0) { // 外环
                str += `
                  <gml:outerBoundaryIs>
                    <gml:LinearRing>
                      <gml:coordinates decimal="." cs="," ts=" ">
                        ${coordinates[i].join(' ')}
                      </gml:coordinates>
                    </gml:LinearRing>
                  </gml:outerBoundaryIs>
                `;
              } else { // 内环
                str += `
                  <gml:innerBoundaryIs>
                    <gml:LinearRing>
                      <gml:coordinates decimal="." cs="," ts=" ">
                        ${coordinates[i].join(' ')}
                      </gml:coordinates>
                    </gml:LinearRing>
                  </gml:innerBoundaryIs>
                `;
              }
            }
          str += `
              </gml:Polygon>
            </${this.option.geometryName}>
            `;
          break;
        case 'MULTIPOLYGON':
          str += `
            <${this.option.geometryName}>
              <gml:MultiPolygon srsName="http://www.opengis.net/gml/srs/epsg.xml#${this.option.projection.split(':')[1]}">`;    
            for (let j = 0; j < coordinates.length; j++) {
              str += `
                <gml:polygonMember>
                  <gml:Polygon>`;
              for (let k = 0; k < coordinates[j].length; k++) {
                if (k == 0) { // 外环
                  str += `
                    <gml:outerBoundaryIs>
                      <gml:LinearRing>
                        <gml:coordinates decimal="." cs="," ts=" ">
                          ${coordinates[j][k].join(' ')}
                        </gml:coordinates>
                      </gml:LinearRing>
                    </gml:outerBoundaryIs>
                  `;
                } else { // 内环
                  str += `
                    <gml:innerBoundaryIs>
                      <gml:LinearRing>
                        <gml:coordinates decimal="." cs="," ts=" ">
                          ${coordinates[j][k].join(' ')}
                        </gml:coordinates>
                      </gml:LinearRing>
                    </gml:innerBoundaryIs>
                  `;
                }
              }
              str += `
                  </gml:Polygon>
                </gml:polygonMember>`;
            }
          str += `
              </gml:MultiPolygon>
            </${this.option.geometryName}>`;
          break;
        default:
          break;
      }
    }
    str += `
        </${this.option.typeName}>
      </wfs:Insert>`;

    return this.getTranscationString(str);
  }

  /**
   * @method getUpdateParamString
   * @param {object} geojson
   */
  getUpdateParamString(geojson) {
    const { properties, geometry } = geojson;
    let str = `<wfs:Update typeName="${this.option.typeName}">`;
    // 属性信息
    for (const i in properties) {
      str += `
        <wfs:Property>
          <wfs:Name>${i}</wfs:Name>
          <wfs:Value>${properties[i]}</wfs:Value>
        </wfs:Property>`;
    }
    // 空间信息
    const coordinates = geometry.coordinates;
    str += `
      <wfs:Property>
        <wfs:Name>${this.option.geometryName}</wfs:Name>
        <wfs:Value>`;
    switch (geometry.type.toUpperCase()) {
      case 'POINT':
        str += `
          <gml:Point srsName="${this.option.projection}">
            <gml:coordinates>${coordinates.join(',')}</gml:coordinates>
          </gml:Point>`;
        break;
      case 'LINESTRING':
          str += `
          <gml:LineString srsName="${this.option.projection}">
            <gml:coordinates>
              ${coordinates.join(' ')}
            </gml:coordinates>
          </gml:LineString>`;
        break;
      case 'MULTILINESTRING':
        str += `
          <gml:MultiLineString srsName="${this.option.projection}>`;
          for (let i = 0; i < coordinates.length; i++) {
            str += `
              <gml:lineStringMember>
                <gml:LineString>
                  <gml:coordinates>
                    ${coordinates[i].join(' ')}
                  </gml:coordinates>
                </gml:LineString>
              </gml:lineStringMember>`;
          }
        str += `
          </gml:MultiLineString>`;
        break;
      case 'POLYGON':
        str += `
          <gml:Polygon srsName="${this.option.projection}">
        `;
        for (let i = 0; i < coordinates.length; i++) {
          if (i == 0) { // 外环
            str += `
              <gml:outerBoundaryIs>
                <gml:LinearRing>
                  <gml:coordinates decimal="." cs="," ts=" ">
                    ${coordinates[i].join(' ')}
                  </gml:coordinates>
                </gml:LinearRing>
              </gml:outerBoundaryIs>
            `;
          } else { // 内环
            str += `
              <gml:innerBoundaryIs>
                <gml:LinearRing>
                  <gml:coordinates decimal="." cs="," ts=" ">
                    ${coordinates[i].join(' ')}
                  </gml:coordinates>
                </gml:LinearRing>
              </gml:innerBoundaryIs>
            `;
          }
        }
        str += `
          </gml:Polygon>
        `;
        break;
      case 'MULTIPOLYGON':
        str += `
          <gml:MultiPolygon srsName="${this.option.projection}">
        `;
        for (let j = 0; j < coordinates.length; j++) {
          str += `
            <gml:polygonMember>
              <gml:Polygon>`;
          for (let k = 0; k < coordinates[j].length; k++) {
            if (k == 0) { // 外环
              str += `
                <gml:outerBoundaryIs>
                  <gml:LinearRing>
                    <gml:coordinates decimal="." cs="," ts=" ">
                      ${coordinates[j][k].join(' ')}
                    </gml:coordinates>
                  </gml:LinearRing>
                </gml:outerBoundaryIs>
              `;
            } else { // 内环
              str += `
                <gml:innerBoundaryIs>
                  <gml:LinearRing>
                    <gml:coordinates decimal="." cs="," ts=" ">
                      ${coordinates[j][k].join(' ')}
                    </gml:coordinates>
                  </gml:LinearRing>
                </gml:innerBoundaryIs>
              `;
            }
          }

          str += `
             </gml:Polygon>
            </gml:polygonMember>`;
        }
        str += `
          </gml:MultiPolygon>
        `;
        break;
      default:
        break;
    }
    str += `
        </wfs:Value>
      </wfs:Property>`;
    // 过滤器 只过滤fid
    str += `
    <ogc:Filter>
      <FeatureId fid="${geojson.id}" />
    </ogc:Filter>`;

    str += `</wfs:Update>`;

    return this.getTranscationString(str);
  }

  /**
   * @method getDeleteParamString
   * @param {*} fid 
   */
  getDeleteParamString(fid) {
    const str =
      `<wfs:Delete typeName="${this.option.typeName}"> 
        <ogc:Filter>
          <ogc:FeatureId fid="${fid}" />
        </ogc:Filter>    
      </wfs:Delete>`;

    return this.getTranscationString(str);
  }

  getTranscationString(str) {
    const xml =
      `<?xml version="1.0" ?>
      <wfs:Transaction
        version="1.0.0"
        service="WFS"
        xmlns:opengis="http://www.cetusOpengis.com"
        xmlns:wfs="http://www.opengis.net/wfs"
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:gml="http://www.opengis.net/gml"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-basic.xsd">
        ${str}
      </wfs:Transaction>`;
    return xml;
  }

  /**
   * 解析要素事务操作的响应结果
   * @method parseTransactionResult
   * @param {Xml} result - xml  
   */
  parseTransactionResult(result) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(result, "text/xml");
    // 返回fid
    const featureIdEle = xmlDoc.getElementsByTagName('ogc:FeatureId');
    const fid = $(featureIdEle).attr('fid');
    // 返回状态
    const statusEle = xmlDoc.getElementsByTagName('wfs:Status');
    const successEle = statusEle[0].getElementsByTagName('wfs:SUCCESS')
    return {
      fid,
      code: successEle ? 1 : 0,
      msg: successEle ? 'success' : 'failed'
    }
  }
}
export default WFSTHelper;