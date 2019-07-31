﻿let camera_list = [{
    id:"43000001001321224022",
    IP:"100.85.224.17",
    type:2,
    name:"镜头\\01SDF",
    position:{x:512273.57,y:3391044.83,z:35.87},
    state:"正常",
    pitch:0,
    roll:0,
    viewMinDistance:5,
    viewMaxDistance:40,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224016",
    IP:"100.85.224.20",
    type:1,
    name:"镜头02sdf",
    position:{x:512370.15,y:3390914.68,z:35.88},
    state:"正常",
    pitch:0,
    roll:-Math.PI,
    viewMinDistance:10,
    viewMaxDistance:50,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224020",
    IP:"100.85.224.14",
    type:1,
    name:"镜头03sD",
    position:{x:512318,y:3390872.49,z:46.41},
    state:"正常",
    pitch:Math.PI/5,
    roll:-Math.PI/4,
    viewMinDistance:5,
    viewMaxDistance:80,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224017",
    IP:"100.85.224.21",
    type:1,
    name:"镜头03",
    position:{x:512332,y:3390817.49,z:46.41},
    state:"正常",
    pitch:Math.PI/5,
    roll:-Math.PI/2,
    viewMinDistance:5,
    viewMaxDistance:100,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224019",
    IP:"100.85.224.22",
    type:1,
    name:"sdf",
    position:{x:512308,y:3390892.49,z:46.41},
    state:"正常",
    pitch:Math.PI/5,
    roll:0,
    viewMinDistance:5,
    viewMaxDistance:100,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224014",
    IP:"100.85.224.18",
    type:1,
    name:"镜asdf头03",
    position:{x:512378,y:3390872.49,z:46.41},
    state:"正常",
    pitch:-Math.PI/7,
    roll:Math.PI,
    viewMinDistance:5,
    viewMaxDistance:100,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224018",
    IP:"100.85.224.16",
    type:1,
    name:"镜头wer03",     
    position:{x:512328,y:3390872.49,z:46.41},
    state:"正常",
    pitch:-Math.PI/6,
    roll:Math.PI/2,
    viewMinDistance:5,
    viewMaxDistance:50,
    fov:Math.PI/4,
    aspect:16/9
},{
    id:"43000001001321224021",
    IP:"100.85.224.19",
    type:1,
    name:"镜头qwe03",           
    position:{x:512318,y:3390862.49,z:46.41},
    state:"正常",
    pitch:Math.PI/6,
    roll:Math.PI/4,
    viewMinDistance:5,
    viewMaxDistance:50,
    fov:Math.PI/4,
    aspect:16/9
}
];

/**
 * @description: 设置监控相机图标 
 */
function setIcon(id,type,position){
    let html=`<img src="`;
    let url="";
    switch(type){
        //枪机
        case 1 :
            url="image/1.png";
        break;
        //球机
        case 2:
            url="image/2.png";
        break;
    }
    html+=url;
    html+=`"/>`;
    bt_Plug_Annotation.setAnnotation("camIcon_"+id, position.x, position.y, position.z, -8, -8, html, false);
}


$.ajax({
    type: "get",
    url: "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT * FROM ape",
    success: function (result) {
        result.forEach((elem,index) => {
            camera_list[index].name=elem.name;
            let position=LL2Geo(elem.longitude,elem.latitude);
            position.z="50";
            camera_list[index].position=position;
        });
    },error: function (error) {
        console.error(error);
    },
});