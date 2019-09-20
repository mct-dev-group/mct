//固定信息卡片在地图右下角展示

$('body').append(
	'<div class="instanceSelect">' +
		'<div class="info_card">' +
			'<div class="table_box">' +
				'<p>{{tableData[0].label}} {{tableData[0].content}}</p>' +
				'<p>{{tableData[1].label}} {{tableData[1].content}}</p>' +
				'<p>{{tableData[2].label}} {{tableData[2].content}}</p>' +
				'<p>{{tableData[3].label}} {{tableData[3].content}}</p>' +
			'</div>' +
		'</div>' +
		'<el-dialog :title="instance_moreInfo_title" :visible.sync="instance_level_1_moreInfo_visible" width="841px" top="100px">' +
			'<el-table :data="level_1_tableData" :border="instance_moreInfo_showBoder" :show-header="instance_moreInfo_showHeader" style="width: 801px">' +
			    '<el-table-column prop="column_1" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_2" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_3" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_4" width="200px"></el-table-column>' +
		  	'</el-table>' +
		'</el-dialog>' +
		'<el-dialog :title="instance_moreInfo_title" :visible.sync="instance_level_2_moreInfo_visible" width="1241px" top="50px">' +
		  	'<el-table :data="level_2_tableData" :border="instance_moreInfo_showBoder" :show-header="instance_moreInfo_showHeader" style="width: 1201px">' +
			    '<el-table-column prop="column_1" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_2" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_3" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_4" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_5" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_6" width="200px"></el-table-column>' +
		  	'</el-table>' +
		'</el-dialog>' +
		'<el-dialog :title="instance_moreInfo_title" :visible.sync="instance_level_3_moreInfo_visible" width="841px" top="200px">' +
		  	'<el-table :data="level_3_tableData" :border="instance_moreInfo_showBoder" :show-header="instance_moreInfo_showHeader" style="width: 801px">' +
			    '<el-table-column prop="column_1" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_2" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_3" width="200px"></el-table-column>' +
			    '<el-table-column prop="column_4" width="200px"></el-table-column>' +
		  	'</el-table>' +
		'</el-dialog>' +
	'</div>'
)

$('.info_card').css({
	'position': 'absolute',
	'display': 'none',
	'width': '400px',
	'z-index': '300',
	'border-radius': '5px 0 0 5px',
	'background-color': 'rgba(0, 0, 0, 0.8)',
	'right': '0',
	'bottom': '0'
});

$('.table_box').css({
	'position': 'relative',
	'float': 'left',
	'margin-left': '35px',
	'width': '300px',
	'height': '230px',
	'color': 'white',
});

$('.table_box p').css({
	'margin-top': '30px',
	'margin-right': '20px',
	'font-size': '14px',
});

//创建插件对象
let bt_plug_instanceSelect = new Plug();

//声明插件vue实例
bt_plug_instanceSelect.instanceSelect = 
new Vue({
	el: '.instanceSelect',
	data: {
		/*-------------接口base_url------------*/
		url_by_id: `http://${location.hostname}:${location.port}/attrs/getById`,//'http://'+window.location.hostname+':8086/madcat/anren/v1/item',					//根据id查找item
		url_by_parent_id:`http://${location.hostname}:${location.port}/attrs/getByParentId`,//'http://'+window.location.hostname+':8086/madcat/anren/v1/item/children',	//根据parent_id查找item
		url_by_position: `http://${location.hostname}:${location.port}/attrs/getByPosition`,//'http://'+window.location.hostname+':8086/madcat/anren/v1/item/position',		//根据x、y、z坐标查找所有点击到的item
		
		/*-------------接口其他参数-------------*/
		instance_id: null,			//data参数：id (Integer)
		instance_parent_id: null,	//data参数：parent_id (Integer)
		instance_position: {},		//data参数：position (Object)
		ajax_dataType: 'json',		//数据传递类型
		ajax_type: 'post',			//数据传递方式
		respond_successfully: null,	//数据请求状态
		
		/*--------------信息卡片数据------------*/
		tableData: [{					
			label: '',
			content: ''
		}, {
			label: '',
			content: ''
		}, {
			label: '',
			content: ''
		}, {
			label: '',
			content: ''
		}],
		
		/*--------------详情弹窗数据------------*/
		instance_moreInfo_title: '详细信息',			//详情弹窗标题
		instance_moreInfo_showBoder: true,			//是否显示表格边框
		instance_moreInfo_showHeader: false,		//是否显示表头
		instance_level_1_moreInfo_visible: false,	//是否显示详情弹窗
		instance_level_2_moreInfo_visible: false,	//是否显示详情弹窗
		instance_level_3_moreInfo_visible: false,	//是否显示详情弹窗
		level_1_tableData: [],
		level_2_tableData: [],
		level_3_tableData: [],
		
		/*-------------光标相关数据-------------*/
		setInt: null,				//定时器
		setTim: null,				//计时器
		mouseX: 0,					//光标当前X轴位置
		mouseY: 0,					//光标当前Y轴位置
		oldMouseX: 0,				//光标上一时间点X轴位置
		oldMouseY: 0,				//光标上一时间点Y轴位置
		mouse_stay: false,			//光标是否停留
		mouse_move: false,			//光标是否移动
		mouse_action: '',			//光标动作状态
		
		/*-----------坐标系间转换参数-----------*/
		posArr: [],					//参数点数组
		hit: 0,						//击中标志
		paramsX: 0,					//参数X
		paramsY: 0,					//参数Y
		paramsZ: 0,					//参数Z
		old_posArr: [],				//旧的参数点数组
		old_hit: 0,					//旧的击中标志
		old_paramsX: 0,				//旧的参数X
		old_paramsY: 0,				//旧的参数Y
		old_paramsZ: 0,				//旧的参数Z
		
		/*-----------单体属性高亮参数-----------*/
		instance: null,							//单体数据
		instance_box_minZ: -10,					//轮廓盒底部高程
		instance_box_maxZ: 0,					//轮廓盒顶部高程
		instance_box_color: '#BA55D3',			//轮廓盒高亮颜色
		instance_box_pointNum: 0,				//轮廓线点数
		instance_box_pointPos: '',				//轮廓点坐标字符串
		instance_box_allLineID: [],				//单体轮廓线集合
		instance_line_color: '0 255 255 255',	//单体轮廓线颜色
	},
	mounted () {
		let that = this;
		//插件参数
		bt_plug_instanceSelect.js_name = "bt_plug_instanceSelect";		//插件文件名
		bt_plug_instanceSelect.plug_name = "单体查询";					//插件名
		bt_plug_instanceSelect.plug_icon = "ali-icon-sousuofangda";		//插件图标
		bt_plug_instanceSelect.plug_commandOnly = true;					//插件内功能保持唯一开启
	
		//插件功能集合
		bt_plug_instanceSelect.plug_commands = [];
		
		//创建功能对象，参数: new Command(command_name, command_id, command_isActive, command_isOnce)
		bt_plug_instanceSelect.plug_commands[0] = new Command("根据光标位置查询", 1, false, false); 	
//		bt_plug_instanceSelect.plug_commands[1] = new Command("根据parentID查询", 2, false, false);
//		bt_plug_instanceSelect.plug_commands[2] = new Command("综合查询", 3, false, false); 
		
		//插件功能的开启方法
		bt_plug_instanceSelect.command_activate = function(command_id){
			//匹配功能ID
			switch (command_id){
				//根据光标位置查询单体
				case bt_plug_instanceSelect.plug_commands[0].command_id:
					console.log("光标位置查询开启");
					//监听鼠标移动事件
					bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", that.getMousePosition);
					//监听鼠标双击事件
					bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", that.onMouseDbClick);
					//定时查询光标
					that.setInt = setInterval(that.getMouseState, 200);
					break;
					
				//根据parentID查询单体
				case bt_plug_instanceSelect.plug_commands[1].command_id:
					console.log("parentID查询开启");
					break;
					
				//综合查询单体
				case bt_plug_instanceSelect.plug_commands[2].command_id:
					console.log("综合查询开启");
					break;
				
			}
		}
		
		//插件功能的关闭方法
		bt_plug_instanceSelect.command_deactivate = function(command_id){
			//匹配功能ID
			switch (command_id){
				//根据光标位置查询单体
				case bt_plug_instanceSelect.plug_commands[0].command_id:
					console.log("光标位置查询关闭");
					//移除鼠标移动监听
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", that.getMousePosition);
					//移除监听鼠标双击事件
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", that.onMouseDbClick);
					//清除定时查询光标
					window.clearInterval(that.getMouseState);
					//取消单体高亮
					that.offInstanceBoxLight();
					//移除单体轮廓线
					that.offInstanceBoxLine();
					//隐藏信息卡片
					$('.info_card').fadeOut();
					//重置所有数据
					that.reset();
					break;
				
				//根据parentID查询单体	
				case bt_plug_instanceSelect.plug_commands[1].command_id:
					console.log("parentID查询关闭");
					break;
				
				//综合查询单体	
				case bt_plug_instanceSelect.plug_commands[2].command_id:
					console.log("综合查询关闭");
					break;
			}
		}
	},
	methods: {
		//获取光标当前位置及对应空间坐标系位置
		getMousePosition (ep) {
			let that = this;
			that.mouseX = ep[0];
			that.mouseY = ep[1];
			let scp = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + parseInt(that.mouseX) + " " + parseInt(that.mouseY) + ";");
			that.posArr = scp[0].split(' ');
			that.hit = that.posArr[0];
			that.paramsX = that.posArr[1];
			that.paramsY = that.posArr[2];
			that.paramsZ = that.posArr[3];
		},
		//获取光标移动状态
		getMouseState () {
			let that = this;
			//当光标存在上一时间点位置时，通过光标位置判断光标是否停留在原地
			if (that.oldMouseX !== 0 && that.oldMouseY !== 0) {
				//如果鼠标停留（约值）
				if (Math.abs(that.old_paramsX - that.paramsX) < 5 &&
					Math.abs(that.old_paramsY - that.paramsY) < 5 &&
					Math.abs(that.old_paramsY - that.paramsY) < 5) {
					//更改光标停留状态
					that.mouse_stay = true;
					//更改光标移动状态
					that.mouse_move = false;
					//屏幕坐标系转世界坐标系
					that.position_screenToWorld();
					//如果未请求数据
					if (that.respond_successfully === false) {
						//执行对应查找模式
						that.selectInstance_by_position();
					}
				//如果鼠标移动
				} else {
					//更改光标停留状态
					that.mouse_stay = false;
					//更改光标移动状态
					that.mouse_move = true;
					//数据请求状态更改为false
					that.respond_successfully = false;
				}
			}
			//储存光标当前位置及对应空间坐标系位置（旧位置）
			that.oldMouseX = that.mouseX;
			that.oldMouseY = that.mouseY;
			let scp = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + parseInt(that.oldMouseX) + " " + parseInt(that.oldMouseY) + ";");
			that.old_posArr = scp[0].split(' ');
			that.old_hit = that.posArr[0];
			that.old_paramsX = that.posArr[1];
			that.old_paramsY = that.posArr[2];
			that.old_paramsZ = that.posArr[3];
		},
		//屏幕坐标系转世界坐标系
		position_screenToWorld () {
			let that = this;
			let scp = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + parseInt(that.oldMouseX) + " " + parseInt(that.oldMouseY) + ";");
			that.posArr = scp[0].split(' ');
			that.hit = that.posArr[0];
			that.paramsX = that.posArr[1];
			that.paramsY = that.posArr[2];
			that.paramsZ = that.posArr[3];
			that.instance_position = {
				'x': parseFloat(that.paramsX),
				'y': parseFloat(that.paramsY),
				'z': parseFloat(that.paramsZ),
			}
		},
		//根据id查找item
		selectInstance_by_id () {
			let that = this;
			$.ajax({
				url: that.url_by_id,
				data: that.instance_id,
				dataType: that.ajax_dataType,
				type: that.ajax_type,
				async: false,
				success: function(res) {
					//判断如果光标查询到单体
					if(res.data.length > 0) {
						//如果单体数量为一个
						if (res.data.length <= 1) {
							console.log(res.data)
						//如果单体数量为多个
						} else {
							console.log(res.data)
						}
					//判断如果光标没有查询到单体
					} else {
						
					}
				}
			})
		},
		//根据parent_id查找item
		selectInstance_by_parent_id () {
			let that = this;
			$.ajax({
				url: that.url_by_parent_id,
				data: that.instance_parent_id,
				dataType: that.ajax_dataType,
				type: that.ajax_type,
				async: false,
				success: function(res) {
					//判断如果光标查询到单体
					if(res.data.length > 0) {
						//如果单体数量为一个
						if (res.data.length <= 1) {
							console.log(res.data)
						//如果单体数量为多个
						} else {
							console.log(res.data)
						}
					//判断如果光标没有查询到单体
					} else {
						
					}
				}
			})
		},
		//根据x、y、z坐标查找所有光标查询到的item
		selectInstance_by_position () {
			let that = this;
			$.ajax({
				url: that.url_by_position,
				data: that.instance_position,
				dataType: that.ajax_dataType,
				type: that.ajax_type,
				async: false,
				success: function(res) {
					//判断如果光标查询到单体
					if(res.data.length > 0) {
						//如果单体数量为一个
						if (res.data.length <= 1) {
							//轮廓线颜色
							that.instance_line_color = '0 255 255 255';
							//如果上一次保存的单体数据为空
							if (that.instance === null) {
								//保存单体数据
								that.instance = res.data[0];
								//高亮单体
								that.setInstanceBoxLight();
								//显示信息卡片
								that.setInstance_info_card();
							//如果上一次保存的单体数据不为空，且返回的单体与上一次保存的单体数据不同
							} else if ((that.instance !== null) && (res.data[0].id !== that.instance.id)) {
								//取消当前的单体高亮
								that.offInstanceBoxLight();
								//移除当前的单体轮廓线
								that.offInstanceBoxLine();
								//保存单体数据
								that.instance = res.data[0];
								//高亮单体
								that.setInstanceBoxLight();
								//显示信息卡片
								that.setInstance_info_card();
							//如果上一次保存的单体数据不为空，且返回的单体与上一次保存的单体数据相同	
							} else if ((that.instance !== null) && (res.data[0].id === that.instance.id)) {
								console.log('查询的单体相同')
							};
						//如果单体数量为多个
						} else {
							//按照单体level级别从低到高排序：level值越大级别越低
							res.data.sort(function (a,b) {
							    return b.level - a.level;
							});
							//轮廓线颜色
							if (res.data[0].level === 3) {
								that.instance_line_color = '255 0 0 255';
							} else {
								that.instance_line_color = '0 255 255 255';
							}
							//如果上一次保存的单体数据为空
							if (that.instance === null) {
								//保存级别最低的单体数据
								that.instance = res.data[0];
								//显示级别最低的单体轮廓线
								that.setInstanceBoxLine();
								//高亮单体
								that.setInstanceBoxLight();
								//显示信息卡片
								that.setInstance_info_card();
							//如果上一次保存的单体数据不为空，且返回的级别最低的单体与上一次保存的单体数据不同
							} else if ((that.instance !== null) && (res.data[0].id !== that.instance.id)) {
								//取消当前的单体高亮
								that.offInstanceBoxLight();
								//移除当前的单体轮廓线
								that.offInstanceBoxLine();
								//保存级别最低的单体数据
								that.instance = res.data[0];
								//显示级别最低的单体轮廓线
								that.setInstanceBoxLine();
								//高亮单体
								that.setInstanceBoxLight();
								//显示信息卡片
								that.setInstance_info_card();
							//如果上一次保存的单体数据不为空，且返回的单体与上一次保存的单体数据相同	
							} else if ((that.instance !== null) && (res.data[0].id === that.instance.id)) {
								console.log('查询的单体相同')
							}
						}
					//判断如果光标没有查询到单体
					} else {
						//取消单体高亮
						that.offInstanceBoxLight();
						//移除单体轮廓线
						that.offInstanceBoxLine();
						//隐藏信息卡片
						$('.info_card').fadeOut();
						//重置清空单体数据
						that.instance = null;
					}
					//数据请求状态更改为true
					that.respond_successfully = true;
				}
			})
		},
		//单体化属性高亮
		setInstanceBoxLight () {
			let that = this;
			//声明一个空数组存放所有轮廓点的X、Y、Z值
			let arr_allPoints = [];
			//声明一个空数组存放所有轮廓点的X、Y值
			let arr_allPosition = [];
			//解析单体的contour数据
			let contour = that.instance.contour;
			contour = contour.replace('MULTIPOLYGON Z (((', '').replace(')))', '');
			let contour_level = contour.indexOf('),(')
			//如果单体中有环
			if (contour_level > -1) {
				//解环
				contour = contour.split('),(');
				//通过逗号分隔字符串，将各个点保存为数组：[[x2 y2 z2],[X2 Y2 Z2],....,[Xn Yn Zn]]
				arr_allPoints = contour[0].split(',');
				
			//如果单体中没有环
			} else if (contour_level < 0) {
				//通过逗号分隔字符串，将各个点保存为数组：[[x2 y2 z2],[X2 Y2 Z2],....,[Xn Yn Zn]]
				arr_allPoints = contour.split(',');
			}
			//遍历轮廓点
			for (let i = 0; i < arr_allPoints.length; i++) {
				//通过' '分隔字符串，将各个点的X、Y、Z值保存为数组：[[x2,y2,z2],[X2,Y2,Z2],....,[Xn,Yn,Zn]]
				arr_allPoints[i] = arr_allPoints[i].split(' ');
				//去除每个点的Z值
				arr_allPoints[i].splice(2,1);
				//将每个点的X、Y值放入空数组arr_allPosition
				arr_allPosition.push(arr_allPoints[i][0], arr_allPoints[i][1]);
			}
			//单体参数赋值
			that.instance_box_minZ = that.instance.minZ;
			that.instance_box_maxZ = that.instance.maxZ;
			that.instance_box_pointNum = arr_allPoints.length;
			that.instance_box_pointPos = arr_allPosition.join(' ');
			//执行单体化高亮命令
			bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox " + that.instance_box_minZ + " " + that.instance_box_maxZ + " " + that.instance_box_color + " " + that.instance_box_pointNum + " " + that.instance_box_pointPos + ";");
		},
		//取消单体化属性高亮
		offInstanceBoxLight () {
			bt_Util.executeScript("Render\\RenderDataContex\\SetOsgAttribBox 0;");
		},
		//渲染线段
		setLine (arr_allPoints, line_id) {
			let that = this;
			//遍历轮廓点
			for (let i = 0; i < arr_allPoints.length; i++) {
				//通过' '分隔字符串，将各个点的X、Y、Z值保存为数组：[[x2,y2,z2],[X2,Y2,Z2],....,[Xn,Yn,Zn]]
				arr_allPoints[i] = arr_allPoints[i].split(' ');
			}
			let instance_box_pointPos = arr_allPoints;		//轮廓点集合
			let x1 = '', y1 = '', z1 = '';					//原点坐标
			let x2 = '', y2 = '', z2 = '';					//顶点坐标
			let points = [];								//顶点列表
			let points_num = 0;								//顶点数量
			let points_index = '0';							//索引列表
			let points_indexNum = 0;						//索引数量
			//绘制轮廓线
			for (let i = 0; i < instance_box_pointPos.length; i++) {
				//线段原点数据
				x1 = instance_box_pointPos[0][0]; y1 = instance_box_pointPos[0][1]; z1 = that.paramsZ;
				//线段顶点数据
				x2 = instance_box_pointPos[i][0]; y2 = instance_box_pointPos[i][1]; z2 = that.paramsZ; 
				//顶点列表
				points.push("(" + (x2 - x1) + " " + (y2 - y1) + " " + (z2 - z1) + " " + that.instance_line_color + ")");
				//索引列表
				if (i > 0) {
					points_index += (' ' + (i) + ' ' + (i));
				}
			}
			//如果首尾两点坐标相同
			if (instance_box_pointPos[0][0] === instance_box_pointPos[instance_box_pointPos.length - 1][0] &&
				instance_box_pointPos[0][1] === instance_box_pointPos[instance_box_pointPos.length - 1][1] &&
				instance_box_pointPos[0][2] === instance_box_pointPos[instance_box_pointPos.length - 1][2] ) {
				//索引列表首尾不相连
				points_index += ('');
			//如果首尾两点坐标不同
			} else {
				//索引列表首尾相连
				points_index += (' ' + 0);
			}
			points_num = points.length;
			points = points.join(' ');
			points_indexNum = points_index.split(' ').length;
			//渲染线段
			bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj instance_box_line_" + line_id + " 4 1 " + x1 + " " + y1 + " " + z1 + " 16 " + points_num + ' ' + points_indexNum + points + points_index + " 0;");
		},
		//显示单体轮廓线
		setInstanceBoxLine () {
			let that = this;
			//线段id
			let line_id = 0;
			//线段集合
			let line_Arr = [];
			//声明一个空数组存放所有轮廓点的X、Y、Z值
			let arr_allPoints = [];
			//解析单体的contour数据
			let contour = that.instance.contour;
			contour = contour.replace('MULTIPOLYGON Z (((', '').replace(')))', '');
			let contour_level = contour.indexOf('),(')
			//如果单体中有环
			if (contour_level > -1) {
				//解环
				contour = contour.split('),(');
				//通过逗号分隔字符串，将各个点保存为数组：[[x2 y2 z2],[X2 Y2 Z2],....,[Xn Yn Zn]]
				for (let i = 0; i < contour.length; i++) {
					arr_allPoints = contour[i].split(',');
					//储存线段id
					line_Arr.push(line_id);
					//渲染线段
					that.setLine(arr_allPoints, line_id);
					//线段id自增
					line_id += 1;
				}
			//如果单体中没有环
			} else if (contour_level < 0) {
				//通过逗号分隔字符串，将各个点保存为数组：[[x2 y2 z2],[X2 Y2 Z2],....,[Xn Yn Zn]]
				arr_allPoints = contour.split(',');
				//储存线段id
				line_Arr.push(line_id);
				//渲染线段
				that.setLine(arr_allPoints, line_id);
			}
			that.instance_box_allLineID = line_Arr;
		},
		//移除单体轮廓线
		offInstanceBoxLine () {
			let that = this;
			//移除已渲染的线段
			for (let i = 0; i < that.instance_box_allLineID.length; i++) {
				let line_id = that.instance_box_allLineID[i];
				bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj instance_box_line_" + line_id + " 16;");
			}
			//清空轮廓线集合
			that.instance_box_allLineID = [];
		},
		//获取单体信息并显示信息卡片
		setInstance_info_card () {
			let that = this;
			if (that.hit == 1) {
				//获取info_card数据
				let keyArr = JSON.parse(that.instance.meta);
				if (keyArr["行政区名称"]) {
					that.tableData[0].label = "ID：";
					that.tableData[0].content = keyArr["ID"];
					that.tableData[1].label = "行政区代码：";
					that.tableData[1].content = keyArr["行政区代码"];
					that.tableData[2].label = "行政区名称：";
					that.tableData[2].content = keyArr["行政区名称"];
					that.tableData[3].label = "面积：";
					that.tableData[3].content = keyArr["计算面积"];
				} else if (keyArr["地类名称"]) {
					that.tableData[0].label = "ID：";
					that.tableData[0].content = keyArr["ID"];
					that.tableData[1].label = "座落：";
					that.tableData[1].content = keyArr["座落单位名"];
					that.tableData[2].label = "地类名称：";
					that.tableData[2].content = keyArr["地类名称"];
					that.tableData[3].label = "面积：";
					that.tableData[3].content = keyArr["图斑面积"];
				} else if (keyArr["flmc"]) {
					that.tableData[0].label = "FID：";
					that.tableData[0].content = keyArr["FID_"];
					that.tableData[1].label = "OBJECTID：";
					that.tableData[1].content = keyArr["OBJECTID"];
					that.tableData[2].label = "地类名称：";
					that.tableData[2].content = keyArr["flmc"];
					that.tableData[3].label = "面积：";
					that.tableData[3].content = parseFloat(keyArr["SHAPE_Area"]).toFixed(2);
				}
				//显示信息卡片
				$('.info_card').fadeIn();
			}
		},
		//获取单体详细信息
		setInstance_moreInfo_window () {
			let that = this;
			//获取instance详细信息
			let keyArr = JSON.parse(that.instance.meta);
			if (that.instance.level === '1') {
				//加载level_1的instance详细信息
				that.level_1_tableData = [{
		          	column_1: 'ID：',
		          	column_2: keyArr["ID"],
		          	column_3: 'mpArea：',
		          	column_4: keyArr["mpArea"], 
		        }, {
		          	column_1: '标识码：',
		          	column_2: keyArr["标识码"],
		          	column_3: '项目号：',
		          	column_4: keyArr["项目号"], 
		        }, {
		          	column_1: 'FROM_STATE：',
		          	column_2: keyArr["FROM_STATE"],
		          	column_3: 'TO_STATEID：',
		          	column_4: keyArr["TO_STATEID"], 
		        }, {
		          	column_1: 'mpPerimete：',
		          	column_2: keyArr["mpPerimete"],
		          	column_3: '批准文号：',
		          	column_4: keyArr["批准文号"], 
		        }, {
		          	column_1: '控制面积：',
		          	column_2: keyArr["控制面积"],
		          	column_3: '描述说明：',
		          	column_4: keyArr["描述说明"], 
		        }, {
		          	column_1: '更新说明：',
		          	column_2: keyArr["更新说明"],
		          	column_3: '要素代码：',
		          	column_4: keyArr["要素代码"],  
		        }, {
		          	column_1: '计算面积：',
		          	column_2: keyArr["计算面积"],
		          	column_3: '变更记录号：',
		          	column_4: keyArr["变更记录号"], 
		        }, {
		          	column_1: '行政区代码：',
		          	column_2: keyArr["行政区代码"],
		          	column_3: '行政区名称：',
		          	column_4: keyArr["行政区名称"], 
		        }]
			} else if (that.instance.level === '2') {
				//加载level_2的instance详细信息
				that.level_2_tableData = [{
		          	column_1: 'ID：',
		          	column_2: keyArr["ID"],
		          	column_3: 'mpArea：',
		          	column_4: keyArr["mpArea"], 
		          	column_5: '图幅号：',
		          	column_6: keyArr["图幅号"],
		        }, {
		          	column_1: '标识码：',
		          	column_2: keyArr["标识码"], 
		          	column_3: '项目号：',
		          	column_4: keyArr["项目号"],
		          	column_5: 'FROM_STATE：',
		          	column_6: keyArr["FROM_STATE"], 
		        }, {
		          	column_1: 'TO_STATEID：',
		          	column_2: keyArr["TO_STATEID"],
		          	column_3: 'mpPerimete：',
		          	column_4: keyArr["mpPerimete"], 
		          	column_5: '图斑编号：',
		          	column_6: keyArr["图斑编号"],
		        }, {
		          	column_1: '图斑面积：',
		          	column_2: keyArr["图斑面积"], 
		          	column_3: '地类名称：',
		          	column_4: keyArr["地类名称"],
		          	column_5: '地类备注：',
		          	column_6: keyArr["地类备注"], 
		        }, {
		          	column_1: '地类编码：',
		          	column_2: keyArr["地类编码"],
		          	column_3: '扣除类型：',
		          	column_4: keyArr["扣除类型"], 
		          	column_5: '批准文号：',
		          	column_6: keyArr["批准文号"],
		        }, {
		          	column_1: '更新说明：',
		          	column_2: keyArr["更新说明"], 
		          	column_3: '权属性质：',
		          	column_4: keyArr["权属性质"],
		          	column_5: '耕地类型：',
		          	column_6: keyArr["耕地类型"],  
		        }, {
		          	column_1: '要素代码：',
		          	column_2: keyArr["要素代码"],
		          	column_3: '变更记录号：',
		          	column_4: keyArr["变更记录号"], 
		          	column_5: '图斑地类面：',
		          	column_6: keyArr["图斑地类面"], 
		        }, {
		          	column_1: '图斑预编号：',
		          	column_2: keyArr["图斑预编号"], 
		          	column_3: '土地分类编：',
		          	column_4: keyArr["土地分类编"],
		          	column_5: '座落单位代：',
		          	column_6: keyArr["座落单位代"], 
		        }, {
		          	column_1: '座落单位名：',
		          	column_2: keyArr["座落单位名"],
		          	column_3: '扣除地类系：',
		          	column_4: keyArr["扣除地类系"], 
		          	column_5: '扣除地类编：',
		          	column_6: keyArr["扣除地类编"],
		        }, {
		          	column_1: '扣除地类面：',
		          	column_2: keyArr["扣除地类面"], 
		          	column_3: '整治新增耕：',
		          	column_4: keyArr["整治新增耕"],
		          	column_5: '新增建设用：',
		          	column_6: keyArr["新增建设用"], 
		        }, {
		          	column_1: '新增耕地类：',
		          	column_2: keyArr["新增耕地类"],
		          	column_3: '新增耕地经：',
		          	column_4: keyArr["新增耕地经"], 
		          	column_5: '权属单位代：',
		          	column_6: keyArr["权属单位代"],
		        }, {
		          	column_1: '权属单位名：',
		          	column_2: keyArr["权属单位名"], 
		          	column_3: '线状地物面：',
		          	column_4: keyArr["线状地物面"],
		          	column_5: '耕地坡度级：',
		          	column_6: keyArr["耕地坡度级"], 
		        }, {
		          	column_1: '补充耕地经：',
		          	column_2: keyArr["补充耕地经"],
		          	column_3: '零星地物面：',
		          	column_4: keyArr["零星地物面"],
		        }]
			} else if (that.instance.level === '3') {
				//加载level_3的instance详细信息
				that.level_3_tableData = [{
		          	column_1: 'FID_：',
		          	column_2: keyArr["FID_"],
		          	column_3: 'flmc：',
		          	column_4: keyArr["flmc"], 
		        }, {
		          	column_1: 'erdiao：',
		          	column_2: keyArr["erdiao"],
		          	column_3: 'RefName：',
		          	column_4: keyArr["RefName"], 
		        }, {
		          	column_1: 'OBJECTID：',
		          	column_2: keyArr["OBJECTID"],
		          	column_3: 'SHAPE_Area：',
		          	column_4: keyArr["SHAPE_Area"], 
		        }, {
		          	column_1: 'SHAPE_Leng：',
		          	column_2: keyArr["SHAPE_Leng"],
		        }]
			}
		},
		//鼠标双击事件
		onMouseDbClick (ep) {
			let that = this;
			//如果双击的是鼠标左键
			if (ep[0] === 0) {
				//获取单体详细信息
				that.setInstance_moreInfo_window();
				//显示详情弹窗
				if (that.instance.level === '1') {
					that.instance_level_1_moreInfo_visible = true;
				} else if (that.instance.level === '2') {
					that.instance_level_2_moreInfo_visible = true;
				} else if (that.instance.level === '3') {
					that.instance_level_3_moreInfo_visible = true;
				}
			}
		},
		//重置所有数据
		reset () {
			let that = this;
			/*-------------接口其他参数-------------*/
			that.instance_id = null;			//data参数：id (Integer)
			that.instance_parent_id = null;		//data参数：parent_id (Integer)
			that.instance_position = {};		//data参数：position (Object)
			that.ajax_dataType = 'json';		//数据传递类型
			that.ajax_type = 'get';				//数据传递方式
			that.respond_successfully = null;		//数据请求状态
			
			/*--------------信息卡片数据------------*/
			tableData = [];
			
			/*--------------详情弹窗数据------------*/
			instance_moreInfo_title = '详细信息';			//详情弹窗标题
			instance_moreInfo_showBoder = true;				//是否显示表格边框
			instance_moreInfo_showHeader = false;			//是否显示表头
			instance_level_1_moreInfo_visible = false;		//是否显示详情弹窗
			instance_level_2_moreInfo_visible = false;		//是否显示详情弹窗
			instance_level_3_moreInfo_visible = false;		//是否显示详情弹窗
			level_1_tableData = [];
			level_2_tableData = [];
			level_3_tableData = [];
			
			/*-------------光标相关数据-------------*/
			that.setInt = null;					//定时器
			that.setTim = null;					//计时器
			that.mouseX = 0;					//光标当前X轴位置
			that.mouseY = 0;					//光标当前Y轴位置
			that.oldMouseX = 0;					//光标上一时间点X轴位置
			that.oldMouseY = 0;					//光标上一时间点Y轴位置
			that.mouse_stay = false;			//光标是否停留
			that.mouse_move = false;			//光标是否移动
			
			/*-----------坐标系间转换参数-----------*/
			that.posArr = [];					//参数点数组
			that.paramsX = 0;					//参数X
			that.paramsY = 0;					//参数Y
			that.paramsZ = 0;					//参数Z
			that.old_posArr = [];				//旧的参数点数组
			that.old_hit = 0;					//旧的击中标志
			that.old_paramsX = 0;				//旧的参数X
			that.old_paramsY = 0;				//旧的参数Y
			that.old_paramsZ = 0;				//旧的参数Z
				
			/*-----------单体属性高亮参数-----------*/
			that.instance = null;						//单体数据
			that.instance_box_minZ = -10;				//轮廓盒底部高程
			that.instance_box_maxZ = 0;					//轮廓盒顶部高程
			that.instance_box_color = '#BA55D3';		//轮廓盒高亮颜色
			that.instance_box_pointNum = 0;				//轮廓线点数
			that.instance_box_pointPos = '';			//轮廓点坐标字符串
			that.instance_box_allLineID = [];			//单体轮廓线集合
		}
	}
})

//向插件管理器注册插件
bt_PlugManager.insert_plug(bt_plug_instanceSelect);