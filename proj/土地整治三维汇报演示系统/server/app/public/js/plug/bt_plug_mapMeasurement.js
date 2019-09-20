//最新版本：2019.01.03
let bt_plug_mapMeasurement = new Plug();							//创建插件对象
	bt_plug_mapMeasurement.js_name = "bt_plug_mapMeasurement";		//插件文件名
	bt_plug_mapMeasurement.plug_name = "地图测量";					//插件名
	bt_plug_mapMeasurement.plug_icon = "ali-icon-ditu-dibiao";		//插件图标
	bt_plug_mapMeasurement.plug_commandOnly = true;					//插件内功能保持唯一开启
	bt_plug_mapMeasurement.plug_isOnMobile = true;					//插件可在移动设备上使用
	
	//插件功能集合
	bt_plug_mapMeasurement.plug_commands = [];
	//创建功能对象，参数: new Commands(command_name, command_id, command_isActive, command_isOnce)
	bt_plug_mapMeasurement.plug_commands[0] = new Command("点测量", 1, false, false); 	
	bt_plug_mapMeasurement.plug_commands[1] = new Command("线测量", 2, false, false); 
	
	//点测量
	let bt_plug_posQuery = bt_plug_mapMeasurement.plug_commands[0];
	//线测量
	let bt_plug_distMeasurement = bt_plug_mapMeasurement.plug_commands[1];
	
	//点测量功能增加字段
	bt_plug_posQuery.annotations = [];	
	bt_plug_posQuery.MouseListener = function MouseListener(ep) {	//监听鼠标事件单击事件
		if(bt_PlugManager.mobileDevice){
		//如果是移动设备
			//单击鼠标左键时
			if(ep[0] == 0) {
				let x = ep[1];
				let y = ep[2];
				let QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + x + " " + y + ";");
				let posArr = QueryPoint[0].split(" ");
				//如果单击集中场景
				if(posArr[0] == 1) {
					let point_x = Math.round(posArr[1]*100)/100;	//取小数点后两位
					let point_y = Math.round(posArr[2]*100)/100;	//取小数点后两位
					let point_z = Math.round(posArr[3]*100)/100;	//取小数点后两位
					bt_Plug_Annotation.removeAnnotation("oldP");
					bt_plug_posQuery.annotations = [];	
					bt_plug_posQuery.annotations[0] = point_x;
					bt_plug_posQuery.annotations[1] = point_y;
					bt_plug_posQuery.annotations[2] = point_z;
					bt_Plug_Annotation.setAnnotation("p", posArr[1], posArr[2], posArr[3], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px; line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + "(" + point_x + ", " + point_y + ", " + point_z + ")" + "</span></div>", false);
					bt_Util.executeScript("Render\\ForceRedraw;");
				}
			}
		}else{
		//如果是PC端
			//单击鼠标左键时
			if(ep[0] == 0) {
				let x = ep[1];
				let y = ep[2];
				let QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + x + " " + y + ";");
				let posArr = QueryPoint[0].split(" ");
				//如果单击集中场景
				if(posArr[0] == 1) {
					let point_x = Math.round(posArr[1]*100)/100;	//取小数点后两位
					let point_y = Math.round(posArr[2]*100)/100;	//取小数点后两位
					let point_z = Math.round(posArr[3]*100)/100;	//取小数点后两位
					bt_Plug_Annotation.removeAnnotation("oldP");
					bt_plug_posQuery.annotations = [];	
					bt_plug_posQuery.annotations[0] = point_x;
					bt_plug_posQuery.annotations[1] = point_y;
					bt_plug_posQuery.annotations[2] = point_z;
					bt_Plug_Annotation.setAnnotation("p", posArr[1], posArr[2], posArr[3], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px; line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + "(" + point_x + ", " + point_y + ", " + point_z + ")" + "</span></div>", false);
					bt_Util.executeScript("Render\\ForceRedraw;");
				}
			}
		}
		
	};
	
	//线测量功能增加字段
	bt_plug_distMeasurement.time = 0; 								//点击次数
	bt_plug_distMeasurement.i = 0; 									//线段和标注id（自增）
	bt_plug_distMeasurement.i_Arr = []; 							//id集合
	bt_plug_distMeasurement.pointA_X = 0;							//线段顶点A的x坐标
	bt_plug_distMeasurement.pointA_Y = 0;							//线段顶点A的y坐标
	bt_plug_distMeasurement.pointA_Z = 0; 							//线段顶点A的z坐标
	bt_plug_distMeasurement.pointB_X = 0;							//线段顶点B的x坐标
	bt_plug_distMeasurement.pointB_Y = 0;							//线段顶点B的y坐标
	bt_plug_distMeasurement.pointB_Z = 0; 							//线段顶点B的z坐标
	bt_plug_distMeasurement.pointPos = []; 							//顶点坐标集合
	bt_plug_distMeasurement.old_pointPos = [];						//旧的顶点坐标集合
	bt_plug_distMeasurement.m = 0; 									//顶点坐标集合索引
	bt_plug_distMeasurement.annotations = []; 						//标注坐标及距离集合
	bt_plug_distMeasurement.old_annotations = []; 					//旧的标注坐标及距离集合
	bt_plug_distMeasurement.distFromA = ''; 						//顶点间距离（从顶点A开始）
	bt_plug_distMeasurement.distFromB = ''; 						//顶点间距离（从顶点B开始）
	bt_plug_distMeasurement.distAll = ''; 							//顶点间距离总和
	bt_plug_distMeasurement.click_btID = 0; 						//鼠标单击时的按键ID
	bt_plug_distMeasurement.click_x = 0; 							//鼠标单击时的x坐标
	bt_plug_distMeasurement.click_y = 0; 							//鼠标单击时的y坐标
	bt_plug_distMeasurement.down_btID = 0; 							//鼠标按键按下时的按键ID
	bt_plug_distMeasurement.down_x = 0; 							//鼠标按键按下时的x坐标
	bt_plug_distMeasurement.down_y = 0; 							//鼠标按键按下时的y坐标
	bt_plug_distMeasurement.up_btID = 0; 							//鼠标按键弹起时的按键ID
	bt_plug_distMeasurement.up_x = 0; 								//鼠标按键弹起时的x坐标
	bt_plug_distMeasurement.up_y = 0; 								//鼠标按键弹起时的y坐标
	bt_plug_distMeasurement.alreadyDbClick = false;					//更改双击状态
	
	//将屏幕坐标转世界坐标，输出世界坐标数组[x,y,z]，以鼠标按键抬起时为准
	bt_plug_distMeasurement.posArr = function posArr() {
		let x = bt_plug_distMeasurement.up_x;
		let y = bt_plug_distMeasurement.up_y;
		let QueryPoint = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + x + " " + y + ";");
		return QueryPoint[0].split(" ");
	};
	
	//储存并设置顶点A
	bt_plug_distMeasurement.setPointA = function setPointA() {
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m] = new Array();
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[1]);
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[2]);
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[3]);
		bt_plug_distMeasurement.pointA_X = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][0];
		bt_plug_distMeasurement.pointA_Y = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][1];
		bt_plug_distMeasurement.pointA_Z = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][2];
	}
	
	//储存并设置顶点B
	bt_plug_distMeasurement.setPointB = function setPointB() {
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m] = new Array();
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[1]);
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[2]);
		bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[3]);
		bt_plug_distMeasurement.pointB_X = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][0];
		bt_plug_distMeasurement.pointB_Y = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][1];
		bt_plug_distMeasurement.pointB_Z = bt_plug_distMeasurement.pointPos[bt_plug_distMeasurement.m][2];
	}
	
	//设置标注并显示线段距离（从顶点A开始）
	bt_plug_distMeasurement.setAnnotationFromPointA = function setAnnotationFromPointA() {
		//计算空间坐标系中两点间的距离
		let num = Math.sqrt(Math.pow(bt_plug_distMeasurement.pointB_X - bt_plug_distMeasurement.pointA_X, 2) + Math.pow(bt_plug_distMeasurement.pointB_Y - bt_plug_distMeasurement.pointA_Y, 2) + Math.pow(bt_plug_distMeasurement.pointB_Z - bt_plug_distMeasurement.pointA_Z, 2));
		//如果是移动设备，当i = 0时，只存在从顶点A出发的线段
		if (bt_PlugManager.mobileDevice && bt_plug_distMeasurement.i === 0) {
			//从顶点B出发到顶点A的线段长度为0
			bt_plug_distMeasurement.distFromB = 0;
		//如果是PC端，当i = 1时，只存在从顶点A出发的线段
		} else if (!bt_PlugManager.mobileDevice && bt_plug_distMeasurement.i === 1) {
			//从顶点B出发到顶点A的线段长度为0
			bt_plug_distMeasurement.distFromB = 0;
		}
		//从顶点A出发到顶点B的线段长度，取小数点后两位
		bt_plug_distMeasurement.distFromA = Math.floor(num * 100) / 100;
		//当前线段总长，线段AB + 线段BA
		bt_plug_distMeasurement.distAll = bt_plug_distMeasurement.distFromA + bt_plug_distMeasurement.distFromB; 
		//线段总长赋值给前一变量
		bt_plug_distMeasurement.distFromA = bt_plug_distMeasurement.distAll;
		//记录标注坐标及线段距离
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m] = new Array();
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[1]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[2]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[3]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.distAll.toFixed(2));
		//设置标注
		if (bt_PlugManager.mobileDevice && bt_plug_distMeasurement.i === 0) {
			//判断如果是移动设备，且当i = 0时，开启线测量后，第一次单击时设置标注只显示图标，不显示数据
			bt_Plug_Annotation.setAnnotation("p" + bt_plug_distMeasurement.i, bt_plug_distMeasurement.posArr()[1], bt_plug_distMeasurement.posArr()[2], bt_plug_distMeasurement.posArr()[3], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'></span></div>", false);
		} else {
			//判断如果是PC端
			bt_Plug_Annotation.setAnnotation("p" + bt_plug_distMeasurement.i, bt_plug_distMeasurement.posArr()[1], bt_plug_distMeasurement.posArr()[2], bt_plug_distMeasurement.posArr()[3], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + bt_plug_distMeasurement.distAll.toFixed(2) + "</span></div>", false);
		}
		//强制刷新重绘
		bt_Util.executeScript("Render\\ForceRedraw;");
	};
	
	//设置标注并显示线段距离（从顶点B开始）
	bt_plug_distMeasurement.setAnnotationFromPointB = function setAnnotationFromPointB() {
		//计算空间坐标系中两点间的距离
		let num = Math.sqrt(Math.pow(bt_plug_distMeasurement.pointA_X - bt_plug_distMeasurement.pointB_X, 2) + Math.pow(bt_plug_distMeasurement.pointA_Y - bt_plug_distMeasurement.pointB_Y, 2) + Math.pow(bt_plug_distMeasurement.pointA_Z - bt_plug_distMeasurement.pointB_Z, 2));
		//从顶点B出发到顶点A的线段长度，取小数点后两位
		bt_plug_distMeasurement.distFromB = Math.floor(num * 100) / 100; 
		//当前线段总长，线段AB + 线段BA
		bt_plug_distMeasurement.distAll = bt_plug_distMeasurement.distFromA + bt_plug_distMeasurement.distFromB;
		//线段总长赋值给前一变量
		bt_plug_distMeasurement.distFromB = bt_plug_distMeasurement.distAll;
		//记录标注坐标及线段距离
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m] = new Array();
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[1]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[2]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.posArr()[3]);
		bt_plug_distMeasurement.annotations[bt_plug_distMeasurement.m].push(bt_plug_distMeasurement.distAll.toFixed(2));
		//设置标注
		bt_Plug_Annotation.setAnnotation("p" + bt_plug_distMeasurement.i, bt_plug_distMeasurement.posArr()[1], bt_plug_distMeasurement.posArr()[2], bt_plug_distMeasurement.posArr()[3], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + bt_plug_distMeasurement.distAll.toFixed(2) + "</span></div>", false);
		//强制刷新重绘
		bt_Util.executeScript("Render\\ForceRedraw;");
	};
	
	//渲染线段（从顶点A开始）
	bt_plug_distMeasurement.addLineFromPointA = function addLineFromPointA () {
		//如果是PC端
		if(!bt_PlugManager.mobileDevice){
			let event = window.event;
			//记录鼠标按键抬起时的坐标
			bt_plug_distMeasurement.up_x = event.clientX;
			bt_plug_distMeasurement.up_y = event.clientY;
		}
		//计算顶点B的世界坐标
		bt_plug_distMeasurement.pointB_X = bt_plug_distMeasurement.posArr()[1];
		bt_plug_distMeasurement.pointB_Y = bt_plug_distMeasurement.posArr()[2];
		bt_plug_distMeasurement.pointB_Z = bt_plug_distMeasurement.posArr()[3];
		//如果事件发生范围在场景内
		if(bt_plug_distMeasurement.posArr()[0] == 1) { 
			//设置标注并显示线段距离（从顶点A开始）
			bt_plug_distMeasurement.setAnnotationFromPointA();
			//如果是移动端，且i > 0时
			if (bt_PlugManager.mobileDevice && bt_plug_distMeasurement.i > 0) {
				//渲染线段
				bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj line" + bt_plug_distMeasurement.i + " 4 1 " + bt_plug_distMeasurement.pointA_X + " " + bt_plug_distMeasurement.pointA_Y + " " + bt_plug_distMeasurement.pointA_Z + " 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (bt_plug_distMeasurement.pointB_X - bt_plug_distMeasurement.pointA_X) + " " + (bt_plug_distMeasurement.pointB_Y - bt_plug_distMeasurement.pointA_Y) + " " + (bt_plug_distMeasurement.pointB_Z - bt_plug_distMeasurement.pointA_Z) + " 255 255 0 255 0 1 0; ");
			//如果是PC端
			} else if (!bt_PlugManager.mobileDevice) {
				//渲染线段
				bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj line" + bt_plug_distMeasurement.i + " 4 1 " + bt_plug_distMeasurement.pointA_X + " " + bt_plug_distMeasurement.pointA_Y + " " + bt_plug_distMeasurement.pointA_Z + " 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (bt_plug_distMeasurement.pointB_X - bt_plug_distMeasurement.pointA_X) + " " + (bt_plug_distMeasurement.pointB_Y - bt_plug_distMeasurement.pointA_Y) + " " + (bt_plug_distMeasurement.pointB_Z - bt_plug_distMeasurement.pointA_Z) + " 255 255 0 255 0 1 0; ");
			}
			//强制刷新重绘
			bt_Util.executeScript("Render\\ForceRedraw;");
		}
	};
	
	//渲染线段（从顶点B开始）
	bt_plug_distMeasurement.addLineFromPointB = function addLineFromPointB () {
		//如果是PC端
		if(!bt_PlugManager.mobileDevice){
			let event = window.event;
			//记录鼠标按键抬起时的坐标
			bt_plug_distMeasurement.up_x = event.clientX;
			bt_plug_distMeasurement.up_y = event.clientY;
		}
		//计算顶点A的世界坐标
		bt_plug_distMeasurement.pointA_X = bt_plug_distMeasurement.posArr()[1];
		bt_plug_distMeasurement.pointA_Y = bt_plug_distMeasurement.posArr()[2];
		bt_plug_distMeasurement.pointA_Z = bt_plug_distMeasurement.posArr()[3];
		//如果事件发生范围在场景内
		if(bt_plug_distMeasurement.posArr()[0] == 1) { 
			//设置标注并显示线段距离（从顶点B开始）
			bt_plug_distMeasurement.setAnnotationFromPointB();
			//渲染线段
			bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj line" + bt_plug_distMeasurement.i + " 4 1 " + bt_plug_distMeasurement.pointB_X + " " + bt_plug_distMeasurement.pointB_Y + " " + bt_plug_distMeasurement.pointB_Z + " 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (bt_plug_distMeasurement.pointA_X - bt_plug_distMeasurement.pointB_X) + " " + (bt_plug_distMeasurement.pointA_Y - bt_plug_distMeasurement.pointB_Y) + " " + (bt_plug_distMeasurement.pointA_Z - bt_plug_distMeasurement.pointB_Z) + " 255 255 0 255 0 1 0; ");
			//强制刷新重绘
			bt_Util.executeScript("Render\\ForceRedraw;");
		}
	};
	
	//清除渲染
	bt_plug_distMeasurement.clearAll = function clearAll () {
		//清除上一次渲染
		for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
			bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj line" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
			bt_Plug_Annotation.removeAnnotation("p" + bt_plug_distMeasurement.i_Arr[i]);
			bt_Util.executeScript("Render\\ForceRedraw;");
		}
		//清除保留的渲染
		for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
			bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj oldLine" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
			bt_Plug_Annotation.removeAnnotation("oldP" + bt_plug_distMeasurement.i_Arr[i]);
			bt_Util.executeScript("Render\\ForceRedraw;");
		}
		//如果有保存的旧的数据
		if(bt_plug_distMeasurement.old_pointPos.length > 0) { 
			//清除旧的渲染
			for(let i = 0; i + 1 < bt_plug_distMeasurement.old_pointPos.length; i++) {
				//清除线段渲染
				bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj oldLine" + i + " 8;");
				//清除标注渲染
				bt_Plug_Annotation.removeAnnotation("oldP" + i);
				//强制渲染重绘
				bt_Util.executeScript("Render\\ForceRedraw;");
			}
		}
		//将id号码放入数组，方便后续注销操作
		bt_plug_distMeasurement.i_Arr = [];
		bt_plug_distMeasurement.i_Arr[0] = 0;
	}
	
	//双击后的操作
	bt_plug_distMeasurement.afterDbClick = function afterDbClick () {
		//如果单击时的坐标与上一次单击时的坐标相同，判断为双击，移除监听
		bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA);
		bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
		bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.clearAll); 
		//重置点击次数和id
		bt_plug_distMeasurement.time = 0;
		bt_plug_distMeasurement.i = 0;
		//保存旧的数据（至少渲染了一条线段时）
		if (bt_plug_distMeasurement.pointPos.length > 1) {
			bt_plug_distMeasurement.old_pointPos = bt_plug_distMeasurement.pointPos;
			bt_plug_distMeasurement.old_annotations = bt_plug_distMeasurement.annotations;
		}
		//更改双击状态
		bt_plug_distMeasurement.alreadyDbClick = true;
	}
	
	if(bt_PlugManager.mobileDevice){	
	/**------------------------------------------如果是移动设备-----------------------------------------------**/
		//查询两顶点间距离
		bt_plug_distMeasurement.distMeasure = function distMeasure () {
			//限定事件发生范围在场景内
			if(bt_plug_distMeasurement.posArr()[0] == 1) { 
				//第一次单击时
				if(bt_plug_distMeasurement.time === 0) {
					//判断当i = 0 且鼠标双击状态为false时
					if(bt_plug_distMeasurement.i === 0) { 
						//更改点击次数
						bt_plug_distMeasurement.time = 1;
						/**-----------------清除渲染，重置数据-----------------**/
						//清除上一次渲染
						for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
							bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj line" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
							bt_Plug_Annotation.removeAnnotation("p" + bt_plug_distMeasurement.i_Arr[i]);
							bt_Util.executeScript("Render\\ForceRedraw;");
						}
						//清除保留的渲染
						for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
							bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj oldLine" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
							bt_Plug_Annotation.removeAnnotation("oldP" + bt_plug_distMeasurement.i_Arr[i]);
							bt_Util.executeScript("Render\\ForceRedraw;");
						}
						//重置相关数据
						bt_plug_distMeasurement.i_Arr = [];
						bt_plug_distMeasurement.pointPos = [];
						bt_plug_distMeasurement.annotations = [];
						bt_plug_distMeasurement.m = 0;
						/**--------------------重新开始渲染-------------------**/
						//储存并设置顶点A
						bt_plug_distMeasurement.setPointA(); 
						//渲染从顶点A出发的线段
						bt_plug_distMeasurement.addLineFromPointA();
						//将id号码放入数组，方便后续注销操作
						bt_plug_distMeasurement.i_Arr.push(bt_plug_distMeasurement.i); 
						//顶点集合索引自增
						bt_plug_distMeasurement.m += 1;
						//线段与标注id自增
						bt_plug_distMeasurement.i += 1;
					}
					//判断当i > 1时，即第二次点击之后，如果点击的点与上一次点击的位置不同
					if(bt_plug_distMeasurement.i > 1) { 
						//更改点击次数
						bt_plug_distMeasurement.time = 1;
						//储存并设置顶点A
						bt_plug_distMeasurement.setPointA();
						//渲染从顶点B出发的线段
						bt_plug_distMeasurement.addLineFromPointB();
						//将id号码放入数组，方便后续注销操作
						bt_plug_distMeasurement.i_Arr.push(bt_plug_distMeasurement.i); 
						//顶点集合索引自增
						bt_plug_distMeasurement.m += 1;
						//线段与标注id自增
						bt_plug_distMeasurement.i += 1;
					}
					//监听双击事件
					bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", function(ep) { 
						//判断如果双击的是鼠标左键
						if(ep[0] == 0) {
							//保存旧的数据
							bt_plug_distMeasurement.old_pointPos = bt_plug_distMeasurement.pointPos;
							bt_plug_distMeasurement.old_annotations = bt_plug_distMeasurement.annotations;
							//将time和i重置
							bt_plug_distMeasurement.time = 0;
							bt_plug_distMeasurement.i = 0;
						};
					});
				} else {
					//第二次单击时，更改点击状态
					bt_plug_distMeasurement.time = 0;
					//移除第一次点击时的标注
					bt_Plug_Annotation.removeAnnotation("p0");
					//储存并设置顶点B
					bt_plug_distMeasurement.setPointB(); 
					//渲染从顶点A出发的线段
					bt_plug_distMeasurement.addLineFromPointA();
					//将id号码放入数组，方便后续注销操作
					bt_plug_distMeasurement.i_Arr.push(bt_plug_distMeasurement.i); 
					//顶点集合索引自增
					bt_plug_distMeasurement.m += 1;
					//线段与标注id自增
					bt_plug_distMeasurement.i += 1;
				};
			}
		};
		//监听鼠标事件
		bt_plug_distMeasurement.MouseListener = function MouseListener(ep) {
			//如果单击的是鼠标左键
			if(ep[0] == 0){
				//记录鼠标点击位置
				bt_plug_distMeasurement.up_x = ep[1];
				bt_plug_distMeasurement.up_y = ep[2];
				//执行单击事件
				bt_plug_distMeasurement.distMeasure()
				for (let i = 0; i < bt_plug_distMeasurement.pointPos.length; i++) {
					console.log(bt_plug_distMeasurement.pointPos[i])
				}
				
			}
		};
	} else {	
	/**---------------------------------------------如果是PC端-------------------------------------------------**/
		//查询两顶点间距离
		bt_plug_distMeasurement.distMeasure = function distMeasure() {
			//限定事件发生范围在场景内
			if(bt_plug_distMeasurement.posArr()[0] == 1) { 
				//第一次单击时
				if(bt_plug_distMeasurement.time === 0) {
					//更改双击状态
					bt_plug_distMeasurement.alreadyDbClick = false;
					//判断当i = 0 且鼠标双击状态为false时
					if(bt_plug_distMeasurement.i === 0 && bt_plug_distMeasurement.alreadyDbClick === false) { 
						//更改点击次数
						bt_plug_distMeasurement.time = 1;
						/**-----------------清除渲染，重置数据-----------------**/
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.clearAll); 
						//重置相关数据
						bt_plug_distMeasurement.pointPos = [];
						bt_plug_distMeasurement.annotations = [];
						bt_plug_distMeasurement.m = 0;
						/**--------------------重新开始渲染-------------------**/
						//储存并设置顶点A
						bt_plug_distMeasurement.setPointA(); 
						//监听鼠标移动事件（线段方向跟随鼠标位置），动态渲染线段，从顶点A开始
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA); 
						//记录当前点击的坐标
						bt_plug_distMeasurement.click_x = event.clientX;
						bt_plug_distMeasurement.click_y = event.clientY;
						//顶点集合索引自增
						bt_plug_distMeasurement.m += 1;
						//线段与标注id自增
						bt_plug_distMeasurement.i += 1;
					}
					//判断当i > 1时，即第二次点击之后，如果单击时的坐标与上一次点击的位置不同
					if (bt_plug_distMeasurement.i > 1 && bt_plug_distMeasurement.click_x !== event.clientX && bt_plug_distMeasurement.click_y !== event.clientY) { 
						//更改点击次数
						bt_plug_distMeasurement.time = 1;
						//移除鼠标移动监听并渲染线段
						bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
						//储存并设置顶点A
						bt_plug_distMeasurement.setPointA();
						//监听鼠标移动事件（线段方向跟随鼠标位置），动态渲染线段，从顶点A开始
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA);
						//记录当前点击的坐标
						bt_plug_distMeasurement.click_x = event.clientX;
						bt_plug_distMeasurement.click_y = event.clientY;
						//将id号码放入数组，方便后续注销操作
						bt_plug_distMeasurement.i_Arr.push(bt_plug_distMeasurement.i); 
						//顶点集合索引自增
						bt_plug_distMeasurement.m += 1;
						//线段与标注id自增
						bt_plug_distMeasurement.i += 1;
						
					//判断当i > 1时，即第二次点击之后，如果单击时的坐标与上一次单击时的坐标相同，判断为双击	
					} else if (bt_plug_distMeasurement.i > 1 && bt_plug_distMeasurement.click_x === event.clientX && bt_plug_distMeasurement.click_y === event.clientY) {
						//执行双击之后的操作
						bt_plug_distMeasurement.afterDbClick();
					}
				//第二次单击时
				} else {
					//如果第二次单击时的坐标与上一次单击时的坐标不同
					if (bt_plug_distMeasurement.click_x !== event.clientX && bt_plug_distMeasurement.click_y !== event.clientY){
						//更改点击次数
						bt_plug_distMeasurement.time = 0;
						//更改双击状态
						bt_plug_distMeasurement.alreadyDbClick = false;
						//移除鼠标移动监听并渲染线段
						bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.clearAll);
						bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA); 
						//储存并设置顶点B
						bt_plug_distMeasurement.setPointB();
						//监听鼠标移动事件（线段方向跟随鼠标位置），动态渲染线段，从顶点B开始
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
						//记录当前点击的坐标
						bt_plug_distMeasurement.click_x = event.clientX;
						bt_plug_distMeasurement.click_y = event.clientY;
						//将id号码放入数组，方便后续注销操作
						bt_plug_distMeasurement.i_Arr.push(bt_plug_distMeasurement.i); 
						//顶点集合索引自增
						bt_plug_distMeasurement.m += 1;
						//线段与标注id自增
						bt_plug_distMeasurement.i += 1;
						
					//如果单击时的坐标与上一次单击时的坐标相同，判断为双击
					} else if (bt_plug_distMeasurement.click_x === event.clientX && bt_plug_distMeasurement.click_y === event.clientY) {
						//执行双击之后的操作
						bt_plug_distMeasurement.afterDbClick();
					}
				}
			}
		};
		//监听鼠标事件
		bt_plug_distMeasurement.MouseListener = function MouseListener(down) {
			//参数赋值
			down = window.event;
			//按键ID赋值
			bt_plug_distMeasurement.down_btID = down.button;
			//记录鼠标按下时的位置
			bt_plug_distMeasurement.down_x = down.clientX;
			bt_plug_distMeasurement.down_y = down.clientY;
			//如果鼠标按下的是左键
			if(bt_plug_distMeasurement.down_btID  === 0) {
				//当i > 0 且 time = 1 时，移除鼠标移动监听（防止鼠标按住移动时标注精度不准）
				if(bt_plug_distMeasurement.i > 0 && bt_plug_distMeasurement.time === 1){
					//移除监听
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA);
				//当i > 0 且 time = 1 时，移除鼠标移动监听（防止鼠标按住移动时标注精度不准）
				}else if(bt_plug_distMeasurement.i > 0 && bt_plug_distMeasurement.time === 0){
					//移除监听
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
				}
				bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", function(up){
					//当i > 0 且 time = 1 时，还原鼠标监听，继续动态渲染线段
					if(bt_plug_distMeasurement.i > 0 && bt_plug_distMeasurement.time === 1){
						//还原监听
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA);
					//当i > 0 且 time = 0 时，还原鼠标监听，继续动态渲染线段
					}else if(bt_plug_distMeasurement.i > 0 && bt_plug_distMeasurement.time === 0){
						//还原监听
						bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
					}
					//参数赋值
					up = window.event;
					//按键ID赋值
					bt_plug_distMeasurement.up_btID = up.button;
					//记录鼠标抬起时的位置
					bt_plug_distMeasurement.up_x = up.clientX;
					bt_plug_distMeasurement.up_y = up.clientY;
					//如果鼠标按下和抬起的位置相同，则判断为单击
					if(bt_plug_distMeasurement.down_x === bt_plug_distMeasurement.up_x && bt_plug_distMeasurement.down_y === bt_plug_distMeasurement.up_y && bt_plug_distMeasurement.up_btID === 0){
						//执行单击时的操作
						bt_plug_distMeasurement.distMeasure();
						//强制渲染重绘
						bt_Util.executeScript("Render\\ForceRedraw;");
					}
				});
			}
		};
	}
	
	//插件功能的开启方法
	bt_plug_mapMeasurement.command_activate = function(commandID){
		//匹配功能ID
		switch (commandID){
			//点测量
			case 1:	
				//如果点坐标不为空
				if(bt_plug_posQuery.annotations.length > 0){
					//恢复上次查询的点位置标注及数据
					bt_Plug_Annotation.setAnnotation("oldP", bt_plug_posQuery.annotations[0], bt_plug_posQuery.annotations[1], bt_plug_posQuery.annotations[2], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + "(" + bt_plug_posQuery.annotations[0] + ", " + bt_plug_posQuery.annotations[1] + ", " + bt_plug_posQuery.annotations[2] + ")" + "</span></div>", false);
					//强制渲染重绘
					bt_Util.executeScript("Render\\ForceRedraw;");
				}
				//监听鼠标点击事件
				bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_posQuery.MouseListener);
				console.log("点测量开启");
				break;
			//线测量
			case 2:	
				//如果是移动设备
				if(bt_PlugManager.mobileDevice){
					for (let i = 0; i < bt_plug_distMeasurement.pointPos.length; i++) {
						console.log(bt_plug_distMeasurement.pointPos[i])
					}
					//打开插件时恢复保留的上次渲染
					if(bt_plug_distMeasurement.pointPos.length > 0) { 
						for(let i = 0; i + 1 < bt_plug_distMeasurement.pointPos.length; i++) {
							//恢复线段渲染
							bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj oldLine" + i + " 4 1 " + bt_plug_distMeasurement.pointPos[i][0] + " " + bt_plug_distMeasurement.pointPos[i][1] + " " + bt_plug_distMeasurement.pointPos[i][2] + " 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (bt_plug_distMeasurement.pointPos[i + 1][0] - bt_plug_distMeasurement.pointPos[i][0]) + " " + (bt_plug_distMeasurement.pointPos[i + 1][1] - bt_plug_distMeasurement.pointPos[i][1]) + " " + (bt_plug_distMeasurement.pointPos[i + 1][2] - bt_plug_distMeasurement.pointPos[i][2]) + " 255 255 0 255 0 1 0; ");
							//恢复标注渲染（从第二个标注开始）
							bt_Plug_Annotation.setAnnotation("oldP" + i, bt_plug_distMeasurement.annotations[i + 1][0], bt_plug_distMeasurement.annotations[i + 1][1], bt_plug_distMeasurement.annotations[i + 1][2], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + bt_plug_distMeasurement.annotations[i + 1][3] + "</span></div>", false);
							//强制渲染重绘
							bt_Util.executeScript("Render\\ForceRedraw;");
						}
					}
					bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_distMeasurement.MouseListener);
				//如果是PC端
				}else{
					bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_plug_distMeasurement.MouseListener);
					//打开插件时恢复保留的上次渲染
					if(bt_plug_distMeasurement.old_pointPos.length > 0) { 
						for(let i = 0; i + 1 < bt_plug_distMeasurement.old_pointPos.length; i++) {
							//恢复线段渲染
							bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj oldLine" + i + " 4 1 " + bt_plug_distMeasurement.old_pointPos[i][0] + " " + bt_plug_distMeasurement.old_pointPos[i][1] + " " + bt_plug_distMeasurement.old_pointPos[i][2] + " 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (bt_plug_distMeasurement.old_pointPos[i + 1][0] - bt_plug_distMeasurement.old_pointPos[i][0]) + " " + (bt_plug_distMeasurement.old_pointPos[i + 1][1] - bt_plug_distMeasurement.old_pointPos[i][1]) + " " + (bt_plug_distMeasurement.old_pointPos[i + 1][2] - bt_plug_distMeasurement.old_pointPos[i][2]) + " 255 255 0 255 0 1 0; ");
							//恢复标注渲染
							bt_Plug_Annotation.setAnnotation("oldP" + i, bt_plug_distMeasurement.old_annotations[i + 1][0], bt_plug_distMeasurement.old_annotations[i + 1][1], bt_plug_distMeasurement.old_annotations[i + 1][2], -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + bt_plug_distMeasurement.old_annotations[i + 1][3] + "</span></div>", false);
							//强制渲染重绘
							bt_Util.executeScript("Render\\ForceRedraw;");
						}
					}
				}
				console.log("线测量开启");
				break;
		}
	}
	
	//插件功能的关闭方法
	bt_plug_mapMeasurement.command_deactivate = function(commandID){
		switch (commandID){
			//点测量
			case 1:
				bt_Plug_Annotation.removeAnnotation("p");
				bt_Plug_Annotation.removeAnnotation("oldP");
				bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_posQuery.MouseListener);
				console.log("点测量关闭");
				break;
			//线测量
			case 2:
				//如果是移动设备
				if(bt_PlugManager.mobileDevice){	
					for (let i = 0; i < bt_plug_distMeasurement.pointPos.length; i++) {
						console.log(bt_plug_distMeasurement.pointPos[i])
					}
					//移除监听
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_plug_distMeasurement.MouseListener);
					//清除渲染
					for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) { 
						bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj line" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
						bt_Plug_Annotation.removeAnnotation("p" + bt_plug_distMeasurement.i_Arr[i]);
					};
					//清除保留的渲染
					for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
						bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj oldLine" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
						bt_Plug_Annotation.removeAnnotation("oldP" + bt_plug_distMeasurement.i_Arr[i]);
					}
					//重置相关数据
					bt_plug_distMeasurement.time = 0;
					bt_plug_distMeasurement.i = 0;
					//强制刷新重绘
					bt_Util.executeScript("Render\\ForceRedraw;");
				//如果是PC端
				}else{
					//移除监听
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointA);
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.addLineFromPointB);
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_plug_distMeasurement.clearAll);
					bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_plug_distMeasurement.MouseListener);
					//清除渲染
					for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) { 
						bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj line" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
						bt_Plug_Annotation.removeAnnotation("p" + bt_plug_distMeasurement.i_Arr[i]);
					};
					//清除保留的渲染
					for(let i = 0; i < bt_plug_distMeasurement.i_Arr.length; i++) {
						bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj oldLine" + bt_plug_distMeasurement.i_Arr[i] + " 8;");
						bt_Plug_Annotation.removeAnnotation("oldP" + bt_plug_distMeasurement.i_Arr[i]);
					}
					//如果关闭插件前没有双击结束渲染
					if (bt_plug_distMeasurement.alreadyDbClick === false) {
						//移除最后一条线段和标注
						let n = bt_plug_distMeasurement.i_Arr.length;
						bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj line" + n + " 8;");
						bt_Plug_Annotation.removeAnnotation("p" + n);
						//保存旧的数据（至少渲染了一条线段时）
						if (bt_plug_distMeasurement.pointPos.length > 1) {
							bt_plug_distMeasurement.old_pointPos = bt_plug_distMeasurement.pointPos;
							bt_plug_distMeasurement.old_annotations = bt_plug_distMeasurement.annotations;
						}
					}
					//重置相关数据
					bt_plug_distMeasurement.time = 0;
					bt_plug_distMeasurement.i = 0;
					//更改双击状态
					bt_plug_distMeasurement.alreadyDbClick = false;
					//强制刷新重绘
					bt_Util.executeScript("Render\\ForceRedraw;");
				}
				console.log("线测量关闭");
				break;
		}
	}

bt_PlugManager.insert_plug(bt_plug_mapMeasurement);