let camera_list=[];
/**
 * @description: 创建摄像头类
 */
function SurveillanceCamera(option){
    for (const key in option) {
        if (option.hasOwnProperty(key)) {
            this[key]= option[key];
        }
    }
    //计算坐标
    let position=LL2Geo(option.longitude,option.latitude);
    position.z=this.space_z;
    this.position=position;
    //给定默认值
    this.nearest_sight_distance=this.nearest_sight_distance||5;
    this.farthest_sight_distance=this.farthest_sight_distance||100;
    this.view_angle_y=this.view_angle_y||Math.PI/4;
    this.width_span_rate=this.width_span_rate||16/9;
    this.type=this.type||1;
}


/**
 * @description: 设置监控相机图标 
 */
function setIcon(id,type,position){
    let html=`<img id="camIcon_${id}" src="`;
    let url="";
    switch(type){
        //枪机
        case "1" :
		case "NULL" :
            url="image/1.png";
        break;
        //球机
        case "2":
            url="image/2.png";
        break;
    }
    html+=url;
    html+=`"/>`;
    bt_Plug_Annotation.setAnnotation("camIcon_"+id, position.x, position.y, position.z, -8, -8, html, false);
}


$.ajax({
    type: "get",
    // url: "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=",
    url: "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT * FROM ape",
    success: function (result) {        
        result.forEach(element => {
            camera_list.push(new SurveillanceCamera(element));            
        });        
    },error: function (error) {
        console.error(error);
    },
});