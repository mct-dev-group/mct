var _css = `<style>
/* 封控点 start */
.poi_blockade{
  background:url(../image/DefaultIcon.png); 
  background-position:center left; 
  background-repeat: no-repeat;
  height:16px;
  width:16px;
  line-height:10px;
  cursor: pointer;
}
.poi_blockade .blockade_pop {
  margin-left:16px; 
  font-size:9px; 
  white-space: nowrap;
  width:280px;
  background: #fff;
  color: #000; 
  border-radius: 3px;
  /* transform: translate(-116px,-140px); */
  transform: translate(-144px,-140px);
  display: none;
}
.poi_blockade .blockade_pop:after{
  border: solid transparent;
  content: ' ';
  height: 0;
  left: 45%;
  position: absolute;
  width: 0;
  border-width: 10px;
  border-top-color: #fff;
}

.poi_blockade .blockade_pop h3 {
  height:30px;
  line-height:30px;
  background: #409EFF;
  padding-left: 10px;
  color: #fff;
  font-weight: 700;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  display: inline-block;width: 280px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}

.poi_blockade .blockade_pop h3 span.closePop{
  position: absolute;
  right: 16px;
  cursor:pointer;
}

.poi_blockade .blockade_pop ul{
  min-height: 100px;
}

.poi_blockade .blockade_pop ul li{
  height:20px;
  line-height:20px;
  padding: 5px;
  width: 280px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
/* 封控点 end */
</style>`

$('head').append(_css)
// 封控线
let bt_plug_blockade = new Plug()

// 插件信息
bt_plug_blockade.js_name = 'bt_plug_blockade'
bt_plug_blockade.plug_name = '封控线'
// bt_plug_blockade.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_blockade.plug_commandOnly = true
bt_plug_blockade.plug_isOnMobile = false

// 插件功能
bt_plug_blockade.plug_commands = []
// bt_plug_blockade.plug_commands[0] = new Command("封控线", 0, false, false)

bt_plug_blockade.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      break
  
    default:
      break
  }
}

bt_plug_blockade.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command deactivated: ' + commandID)
      break
  
    default:
      break
  }
}

bt_plug_blockade.plug_activate = () => {
  console.log('plug activated')
	blockadeHandle.addPoi()
}

bt_plug_blockade.plug_deactivate = () => {
  console.log('plug deactivated')
	blockadeHandle.removeTL();
	for (let i = 0; i < lineId_arr.length; i++) {
		let str = "Render\\RenderDataContex\\DynamicFrame\\\DelWLine  "+lineId_arr[i]+";"
		bt_Util.executeScript(str)
	}
	for (let i = 0; i < poiId_arr.length; i++) {
		bt_Plug_Annotation.removeAnnotation(poiId_arr[i]);
	}
	bt_Util.executeScript("Render\\ForceRedraw;")
}

bt_PlugManager.insert_plug(bt_plug_blockade);

var poiId_arr =[];
var lineId_arr = [];
var blockadeHandle = {
	addTL: function () {
		let image = new Image();
		image.id = "blockade_tl";
		image.src = "../../image/blockade_tl.png";
		image.style.position = "absolute";
		image.style.right ="600px";
		image.style.bottom = "20px";
		
		$('body').append(image);
	},
	removeTL: function () {
		$("#blockade_tl").remove();
	},
  addPoi: function () {
		this.addTL();
		poiId_arr =[];
		lineId_arr = [];
    // var url= "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT l.*,p.longitude,p.latitude FROM as_local_blockade_line l LEFT JOIN as_local_blockade_point p ON l.id = p.blockade_line_id"
		var url= "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT l.*, t.line_type as typeName FROM as_local_blockade_line l left join as_local_blockade_line_type t on l.line_type = t.line_num";
    $.ajax({
      url: url,
      type:'GET',
      success: function(data){
        if (data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						let typeName = data[i].typeName
						var url = "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT * FROM as_local_blockade_point where blockade_line_id = '" + data[i].id + "' ORDER BY serial_number";
						$.ajax({
							url: url,
							type: 'GET',
							success: function (data) {
								for (let i = 0; i < data.length; i++) {
									let ll = LL2Geo(data[i].longitude,data[i].latitude);
									let html= `<div class='poi_blockade'></div>`;
									let poiId =  blockadeHandle.guid();
									bt_Plug_Annotation.setAnnotation(poiId, ll.x, ll.y, 20, -8, -16, html, false);
									poiId_arr.push(poiId);
								}
								let lineColor = '50 101 190';
								switch (typeName){
									case '消防':
										lineColor = '50 101 190';
										break;
									case '反恐':
										lineColor = '240 117 34';
										break;
									case '疏散':
										lineColor = '173 173 173';
										break;
									case '抓逃':
										lineColor = '253 196 0';
										break;
									default:
										break;
								}
								// 线
								// 顶点个数
								const vertex_count = data.length;
								// 顶点列表
								let vertex_list = '';
								for (let point of data) {
									let ll = LL2Geo(point.longitude,point.latitude);
									vertex_list += ` ${ll.x} ${ll.y} 20 ${lineColor}`;
								}
								let line_id =  blockadeHandle.guid();//data[0].blockade_line_id;
								lineId_arr.push(line_id);
								//渲染线段
								const scriptStr = `Render\\RenderDataContex\\DynamicFrame\\AddWLine ${line_id} 4 0 0 0 ${vertex_count} ${vertex_list} 0;`;
								bt_Util.executeScript(scriptStr);
								
								bt_Util.executeScript(`Render\\ForceRedraw;`);
								// return;
								// // 计算顶点个数
								// const vertex_count = data.length;
								// // 计算索引个数
								// const index_count = vertex_count == 1 ? 1 : 2*(vertex_count -1); 
								// // 计算索引
								// let indexStr = `(`;
								// for (let i = 0; i < data.length -1; i++) {
								// 	indexStr += `${i},${i+1},`;
								// }
								// indexStr = indexStr.substr(0, indexStr.length -1);
								// indexStr += `)`;
								// let pointStr = ``;
								// for (const point of data) {
								// 	let ll = LL2Geo(point.longitude,point.latitude);
								// 	// pointStr += ` (${ll.x},${ll.y},20,255,255,0,255)`;
								// 	pointStr += ` (${ll.x},${ll.y},20,${lineColor})`;
								// }
								// let line_id =  blockadeHandle.guid();//data[0].blockade_line_id;
								// lineId_arr.push(line_id);
								// //渲染线段
								// const scriptStr = `Render\\RenderDataContex\\DynamicFrame\\AddRenderObj ${line_id} 4 1 (0,0,0) 8 ${vertex_count} ${index_count} ${pointStr} ${indexStr} 0;`;
								// bt_Util.executeScript(scriptStr);
								// 
								// bt_Util.executeScript(`Render\\ForceRedraw;`);
							}
						})
					}
        }
      }
    })
  }
}

blockadeHandle.guid = function() {
	function s () {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s() + s() + '_' + s()
}
