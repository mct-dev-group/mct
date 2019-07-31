const commonFunOfVideo={
    videoModalId:"",//记录模态框播放的视频ID
    /**
     * @description: 将视频相关的CSS样式添加进页面
     */
    appendVideoStyle:function(){
        if($("#videoRelevantStyle").length>0) return;
        $("head").append(`<style id="videoRelevantStyle">
            .zIndex{
                z-index:11 !important;
            }
            .videoContainer{
                box-sizing: border-box;                
                background-color: rgba(255,255,255,0.9);
                border-radius: 3px;
                cursor:pointer;
                position:relative;
            }
            .videoContainer::after{/*倒三角*/
                content:"";
                position: absolute;
                width:0;
                height:0;
                border-width: 8px;
                border-color: #eee transparent  transparent transparent;
                border-style: solid;
                border-bottom-width:0;
                left:50%;
                bottom:-8px;
                transform: translateX(-50%);
            }
            .videoInfo{
                width:80px;
                height:20px;
                line-height:20px;
                font-size:14px;
                white-space: nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            .intelligentTracking_videoInfo{                
                margin:2px;
                color:#1296db;
                text-align:center;
            }
            .monitoringList_videoInfo{                
                margin:0;
                position:absolute;
                z-index:11;                
                top:2px;
                left:2px;
                color:rgba(50,50,50,0.3);
            }
            .cameraVideo{
                width: 160px;
                height: 90px;
                vertical-align:middle;
            }
            .videoModal{/*模态框*/
                width: 100%;
                height: 100%;
                position: fixed;
                z-index: 200;
                background-color: rgba(0, 0, 0, 0.5);           
                box-sizing: border-box;
            }
            .videoContainer-large{
                padding: 5px 5px;                
                background-color: #eee;
                border-radius: 5px;
                position: absolute;
                top:50%;
                left:50%;
                transform:translate(-50%,-50%)
            }            
            .videoInfo-large{
                padding-bottom: 5px;
            }
            .videoInfo-large>.header{
                text-align:center;                
                height: 40px;
                line-height:40px;
                border-bottom:1px solid #4B4B4B;
            }
            .videoInfo-large>.header>span{
                font-size:24px;
                color:#1296db;
            }
            .flexBox{
                display:flex;
                flex-wrap: nowrap;
                justify-content: flex-start;
            }
            .flexBox>div:first-child{
                width:30%;
            }
            .flexBox>div:last-child{
                width:70%;
            }
            .flexBox p{
                font-size:16px;
                margin:3px 0;
                margin-left:5px;
            }
            .flexBox p span{
                font-size:16px;
            }
            .flexBox>div:first-child{
                text-align:center;
                padding:5px;
            }
            .flexBox img{
                height:80px;
            }
            .cameraVideo-large{                
                width:1067px;
                height:600px;
            }
            .closeVideoModal{
                float:right;            
                width: 40px;
                height: 40px;                                                         
                text-align: center;
                line-height: 40px;
                vertical-align:middle;                
                cursor: pointer;
            }        
            .closeVideoModal>.iconfont{
                font-size: 20px;
                color: #1296db;
            }            
        </style>`);
    },
    /**
     * @description: 空间上两点距离
     */
    getDistance:function (p1,p2) {
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2)+Math.pow(p1.z-p2.z,2));
    },
    /**
     * @description: 向量积
     */
    CrossProduct:function (a,b){//向量积
        return {
            x:a.y*b.z-b.y*a.z,
            y:a.z*b.x-a.x*b.z,
            z:a.x*b.y-a.y*b.x
        }
    },
    /**
     * @description: 数量积
     */
    DotProduct:function (a,b){//数量积
        return a.x*b.x+a.y*b.y+a.z*b.z;
    },
    /**
     * @description: 归一化
     */
    Normalize:function (p){//归一化
        var len=Math.sqrt(p.x*p.x+p.y*p.y+p.z*p.z);        
        return {
            x:p.x/len,
            y:p.y/len,
            z:p.z/len
        };
    },
    /**
     * @description: 根据相机参数获取近平面或远平面的坐标点
     */
    getRotatedPoint:function(distance,fov,pitch,roll,aspect){
        /* 顺时针旋转
        x1 = x0 * cosB + y0 * sinB,
        y1 = -x0 * sinB + y0 * cosB*/  
        /* 逆时针旋转 
        x1 = x0 * cosB - y0 * sinB,
        y1 = x0 * sinB + y0 * cosB*/

        let _pitch=Math.round(pitch*100)/100;
        if(_pitch>Math.PI){
            _pitch-=2*Math.PI;
        }else if(_pitch<-Math.PI){
            _pitch+=2*Math.PI;
        }
        //处理反向的情况
        if((Math.abs(_pitch)>Math.round((Math.PI/2)*100)/100&&Math.abs(_pitch)<=Math.round(Math.PI*100)/100)){
            roll=-roll;
        }
        const tan_fov=Math.tan(fov/2);
        const sin_pitch=Math.sin(pitch);
        const cos_pitch=Math.cos(pitch);
        const sin_roll=Math.sin(roll);
        const cos_roll=Math.cos(roll);

        const minZ=-distance*tan_fov;
        const maxZ=distance*tan_fov;
        const minY=-distance*tan_fov*aspect;
        const maxY=distance*tan_fov*aspect;

        let result=[];
        let p1_init={},p2_init={},p3_init={},p4_init={};
        p1_init.x=distance;
        p1_init.y=maxY;
        p1_init.z=maxZ;

        p2_init.x=distance;
        p2_init.y=minY;
        p2_init.z=maxZ;

        p3_init.x=distance;
        p3_init.y=minY;
        p3_init.z=minZ;

        p4_init.x=distance;
        p4_init.y=maxY;
        p4_init.z=minZ;

        //pitch
        let p1_pitched={}, p2_pitched={}, p3_pitched={}, p4_pitched={};
        
        p1_pitched.x= p1_init.x*cos_pitch - p1_init.z*sin_pitch;
        p1_pitched.y= p1_init.y;
        p1_pitched.z= p1_init.x*sin_pitch+ p1_init.z*cos_pitch;

        p2_pitched.x= p2_init.x*cos_pitch - p2_init.z*sin_pitch;
        p2_pitched.y= p2_init.y;
        p2_pitched.z= p2_init.x*sin_pitch+ p2_init.z*cos_pitch;

        p3_pitched.x= p3_init.x*cos_pitch - p3_init.z*sin_pitch;
        p3_pitched.y= p3_init.y;
        p3_pitched.z= p3_init.x*sin_pitch+ p3_init.z*cos_pitch;

        p4_pitched.x= p4_init.x*cos_pitch - p4_init.z*sin_pitch;
        p4_pitched.y= p4_init.y;
        p4_pitched.z= p4_init.x*sin_pitch+ p4_init.z*cos_pitch;

        //roll
        let p1_rolled={}, p2_rolled={}, p3_rolled={}, p4_rolled={};

        p1_rolled.x=p1_pitched.x*cos_roll - p1_pitched.y*sin_roll;
        p1_rolled.y=p1_pitched.x*sin_roll + p1_pitched.y*cos_roll;
        p1_rolled.z=p1_pitched.z;

        p2_rolled.x=p2_pitched.x*cos_roll - p2_pitched.y*sin_roll;
        p2_rolled.y=p2_pitched.x*sin_roll + p2_pitched.y*cos_roll;
        p2_rolled.z=p2_pitched.z;

        p3_rolled.x=p3_pitched.x*cos_roll - p3_pitched.y*sin_roll;
        p3_rolled.y=p3_pitched.x*sin_roll + p3_pitched.y*cos_roll;
        p3_rolled.z=p3_pitched.z;

        p4_rolled.x=p4_pitched.x*cos_roll - p4_pitched.y*sin_roll;
        p4_rolled.y=p4_pitched.x*sin_roll + p4_pitched.y*cos_roll;
        p4_rolled.z=p4_pitched.z;

        result.push(p1_rolled);
        result.push(p2_rolled);
        result.push(p3_rolled);
        result.push(p4_rolled);
        
        return result;
    },
    /**
     * @description: 判断点是否在视锥体内,option为相机参数
     */
    isInViewFrustum:function(point,option){//
        let sideNormalVectors=[];//侧边平面的法向量
        let frontAndBehindNormalVectors=[];//前后平面的法向量        
        let p={x:point.x-option.position.x,y:point.y-option.position.y,z:point.z-option.position.z};//相对坐标
        //远平面顶点坐标
        let maxPoints=commonFunOfVideo.getRotatedPoint(option.farthest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);
        //近平面顶点坐标
        let minPoints=commonFunOfVideo.getRotatedPoint(option.nearest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);
               
        let normalVectors=[];
        //上平面
        let up1={x:maxPoints[0].x-maxPoints[1].x,y:maxPoints[0].y-maxPoints[1].y,z:maxPoints[0].z-maxPoints[1].z};
        let up2={x:minPoints[1].x-maxPoints[1].x,y:minPoints[1].y-maxPoints[1].y,z:minPoints[1].z-maxPoints[1].z};
        let up=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(up1,up2));
        sideNormalVectors.push(up);
        normalVectors.push(up);
        //右平面
        let right1={x:minPoints[1].x-maxPoints[1].x,y:minPoints[1].y-maxPoints[1].y,z:minPoints[1].z-maxPoints[1].z};
        let right2={x:maxPoints[2].x-maxPoints[1].x,y:maxPoints[2].y-maxPoints[1].y,z:maxPoints[2].z-maxPoints[1].z};        
        let right=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(right1,right2));
        sideNormalVectors.push(right);
        normalVectors.push(right);
        //前平面
        let front1={x:minPoints[0].x-minPoints[1].x,y:minPoints[0].y-minPoints[1].y,z:minPoints[0].z-minPoints[1].z};
        let front2={x:minPoints[2].x-minPoints[1].x,y:minPoints[2].y-minPoints[1].y,z:minPoints[2].z-minPoints[1].z};
        let front=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(front1,front2));
        frontAndBehindNormalVectors.push(front);
        normalVectors.push(front);
        //下平面
        let bottom1={x:maxPoints[2].x-maxPoints[3].x,y:maxPoints[2].y-maxPoints[3].y,z:maxPoints[2].z-maxPoints[3].z};
        let bottom2={x:minPoints[3].x-maxPoints[3].x,y:minPoints[3].y-maxPoints[3].y,z:minPoints[3].z-maxPoints[3].z};
        let bottom=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(bottom1,bottom2));
        sideNormalVectors.push(bottom);
        normalVectors.push(bottom);
        //左平面
        let left1={x:maxPoints[0].x-minPoints[0].x,y:maxPoints[0].y-minPoints[0].y,z:maxPoints[0].z-minPoints[0].z};
        let left2={x:minPoints[3].x-minPoints[0].x,y:minPoints[3].y-minPoints[0].y,z:minPoints[3].z-minPoints[0].z};
        let left=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(left1,left2));
        sideNormalVectors.push(left);
        normalVectors.push(left);        
        //后平面
        let behind1={x:maxPoints[0].x-maxPoints[3].x,y:maxPoints[0].y-maxPoints[3].y,z:maxPoints[0].z-maxPoints[3].z};
        let behind2={x:maxPoints[2].x-maxPoints[3].x,y:maxPoints[2].y-maxPoints[3].y,z:maxPoints[2].z-maxPoints[3].z};
        let behind=commonFunOfVideo.Normalize(commonFunOfVideo.CrossProduct(behind1,behind2));
        frontAndBehindNormalVectors.push(behind);
        normalVectors.push(behind);

        let dotProduct=normalVectors.map((elem,i)=>{
            if(i<3){//上，右，前平面使用同一个顶点引向P的向量
                let v1={x:p.x-minPoints[1].x,y:p.y-minPoints[1].y,z:p.z-minPoints[1].z};
                return  commonFunOfVideo.DotProduct(v1,elem);
            }else{//下，左，后平面使用同一个顶点引向P的向量
                let v2={x:p.x-maxPoints[3].x,y:p.y-maxPoints[3].y,z:p.z-maxPoints[3].z};
                return  commonFunOfVideo.DotProduct(v2,elem);
            }
        });
        //大于0说面在视锥体外部
        let outsideCount=dotProduct.filter((elem)=>{
            return elem>0;
        });
        //等于零说明在顶点上
        let isPointOnVertex=dotProduct.some((elem)=>{
            return elem===0;
        });
        return outsideCount.length<=0||isPointOnVertex?true:false;       
    },
    /**
     * @description: 根据相机参数画出视锥体
     */
    paintViewFrustum:function(option){//
        let p_x=option.position.x;
        let p_y=option.position.y;
        let p_z=option.position.z;        
        //远平面顶点坐标
        let maxPoints=commonFunOfVideo.getRotatedPoint(option.farthest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);
        //近平面顶点坐标
        let minPoints=commonFunOfVideo.getRotatedPoint(option.nearest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);            
        //远                        
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart1_"+option.guid+" 1 1 (" + (1*p_x+maxPoints[0].x) + " " + (1*p_y+maxPoints[0].y)+ " " + (1*p_z+maxPoints[0].z) + ") 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (maxPoints[1].x-maxPoints[0].x) + " " +  (maxPoints[1].y-maxPoints[0].y)  + " " + (maxPoints[1].z-maxPoints[0].z)  + " 255 255 0 100) ("+(maxPoints[2].x-maxPoints[0].x) + " " +  (maxPoints[2].y-maxPoints[0].y)  + " " + (maxPoints[2].z-maxPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart2_"+option.guid+" 1 1 (" + (1*p_x+maxPoints[0].x) + " " + (1*p_y+maxPoints[0].y)+ " " + (1*p_z+maxPoints[0].z) + ") 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(maxPoints[3].x-maxPoints[0].x) + " " +  (maxPoints[3].y-maxPoints[0].y)  + " " + (maxPoints[3].z-maxPoints[0].z)+" 255 255 0 100) ("+(maxPoints[2].x-maxPoints[0].x) + " " +  (maxPoints[2].y-maxPoints[0].y)  + " " + (maxPoints[2].z-maxPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        //近           
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart3_"+option.guid+" 1 1 " + (1*p_x+minPoints[0].x) + " " + (1*p_y+minPoints[0].y)+ " " + (1*p_z+minPoints[0].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (minPoints[1].x-minPoints[0].x) + " " +  (minPoints[1].y-minPoints[0].y)  + " " + (minPoints[1].z-minPoints[0].z)  + " 255 255 0 100) ("+(minPoints[2].x-minPoints[0].x) + " " +  (minPoints[2].y-minPoints[0].y)  + " " + (minPoints[2].z-minPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart4_"+option.guid+" 1 1 " + (1*p_x+minPoints[0].x) + " " + (1*p_y+minPoints[0].y)+ " " + (1*p_z+minPoints[0].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(minPoints[3].x-minPoints[0].x) + " " +  (minPoints[3].y-minPoints[0].y)  + " " + (minPoints[3].z-minPoints[0].z)+" 255 255 0 100) ("+(minPoints[2].x-minPoints[0].x) + " " +  (minPoints[2].y-minPoints[0].y)  + " " + (minPoints[2].z-minPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        //上
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart5_"+option.guid+" 1 1 " + (1*p_x+maxPoints[0].x) + " " + (1*p_y+maxPoints[0].y)+ " " + (1*p_z+maxPoints[0].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (maxPoints[1].x-maxPoints[0].x) + " " +  (maxPoints[1].y-maxPoints[0].y)  + " " + (maxPoints[1].z-maxPoints[0].z)  + " 255 255 0 100) ("+(minPoints[1].x-maxPoints[0].x) + " " +  (minPoints[1].y-maxPoints[0].y)  + " " + (minPoints[1].z-maxPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart6_"+option.guid+" 1 1 " + (1*p_x+maxPoints[0].x) + " " + (1*p_y+maxPoints[0].y)+ " " + (1*p_z+maxPoints[0].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(minPoints[0].x-maxPoints[0].x) + " " +  (minPoints[0].y-maxPoints[0].y)  + " " + (minPoints[0].z-maxPoints[0].z)+" 255 255 0 100) ("+(minPoints[1].x-maxPoints[0].x) + " " +  (minPoints[1].y-maxPoints[0].y)  + " " + (minPoints[1].z-maxPoints[0].z)+" 255 255 0 100) (0 1 2) 1; ");
        //右            
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart7_"+option.guid+" 1 1 " + (1*p_x+maxPoints[1].x) + " " + (1*p_y+maxPoints[1].y)+ " " + (1*p_z+maxPoints[1].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (maxPoints[2].x-maxPoints[1].x) + " " +  (maxPoints[2].y-maxPoints[1].y)  + " " + (maxPoints[2].z-maxPoints[1].z)  + " 255 255 0 100) ("+(minPoints[2].x-maxPoints[1].x) + " " +  (minPoints[2].y-maxPoints[1].y)  + " " + (minPoints[2].z-maxPoints[1].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart8_"+option.guid+" 1 1 " + (1*p_x+maxPoints[1].x) + " " + (1*p_y+maxPoints[1].y)+ " " + (1*p_z+maxPoints[1].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(minPoints[1].x-maxPoints[1].x) + " " +  (minPoints[1].y-maxPoints[1].y)  + " " + (minPoints[1].z-maxPoints[1].z)+" 255 255 0 100) ("+(minPoints[2].x-maxPoints[1].x) + " " +  (minPoints[2].y-maxPoints[1].y)  + " " + (minPoints[2].z-maxPoints[1].z)+" 255 255 0 100) (0 1 2) 1; ");
        //下            
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart9_"+option.guid+" 1 1 " + (1*p_x+maxPoints[3].x) + " " + (1*p_y+maxPoints[3].y)+ " " + (1*p_z+maxPoints[3].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (maxPoints[2].x-maxPoints[3].x) + " " +  (maxPoints[2].y-maxPoints[3].y)  + " " + (maxPoints[2].z-maxPoints[3].z)  + " 255 255 0 100) ("+(minPoints[2].x-maxPoints[3].x) + " " +  (minPoints[2].y-maxPoints[3].y)  + " " + (minPoints[2].z-maxPoints[3].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart10_"+option.guid+" 1 1 " + (1*p_x+maxPoints[3].x) + " " + (1*p_y+maxPoints[3].y)+ " " + (1*p_z+maxPoints[3].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(minPoints[3].x-maxPoints[3].x) + " " +  (minPoints[3].y-maxPoints[3].y)  + " " + (minPoints[3].z-maxPoints[3].z)+" 255 255 0 100) ("+(minPoints[2].x-maxPoints[3].x) + " " +  (minPoints[2].y-maxPoints[3].y)  + " " + (minPoints[2].z-maxPoints[3].z)+" 255 255 0 100) (0 1 2) 1; ");
        //左            
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart11_"+option.guid+" 1 1 " + (1*p_x+maxPoints[3].x) + " " + (1*p_y+maxPoints[3].y)+ " " + (1*p_z+maxPoints[3].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) (" + (maxPoints[0].x-maxPoints[3].x) + " " +  (maxPoints[0].y-maxPoints[3].y)  + " " + (maxPoints[0].z-maxPoints[3].z)  + " 255 255 0 100) ("+(minPoints[0].x-maxPoints[3].x) + " " +  (minPoints[0].y-maxPoints[3].y)  + " " + (minPoints[0].z-maxPoints[3].z)+" 255 255 0 100) (0 1 2) 1; ");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj planePart12_"+option.guid+" 1 1 " + (1*p_x+maxPoints[3].x) + " " + (1*p_y+maxPoints[3].y)+ " " + (1*p_z+maxPoints[3].z) + " 16 3 3 (0.000000 0.000000 0.000000 255 255 0 100) ("+(minPoints[3].x-maxPoints[3].x) + " " +  (minPoints[3].y-maxPoints[3].y)  + " " + (minPoints[3].z-maxPoints[3].z)+" 255 255 0 100) ("+(minPoints[0].x-maxPoints[3].x) + " " +  (minPoints[0].y-maxPoints[3].y)  + " " + (minPoints[0].z-maxPoints[3].z)+" 255 255 0 100) (0 1 2) 1; ");
    },
    /**
     * @description: 生成并播放悬浮视频
     */
    createAndPlayFloatVideo:function(type,option,handleClick){
        let html=`<div class="videoContainer" id="videoContainer-${option.guid}">
                    <div class="videoInfo">${option.description.slice(0,4)} - ${option.guid.slice(-4)}</div>
                    <video class="cameraVideo" id="cameraVideo-${option.guid}" poster="image/loading.gif"></video>
            </div>`;
        //添加视频元素
        bt_Plug_Annotation.setAnnotation("videoContainer-"+option.guid, option.position.x, option.position.y, option.position.z, 0, 0, html, false);
        
        //绑定点击事件
        $("#videoContainer-"+option.guid).parents("div.bt_ui_element").on("click",handleClick);

        switch(type){
            case 1:  //智能追踪-悬浮模式                
                $(`#cameraVideo-${option.guid}`).hide();
                $(`#cameraVideo-${option.guid}`).prev().addClass("intelligentTracking_videoInfo");
                //视频容器保持在点的正上方,高宽固定
                bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_x=-42;
                bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_y=-34;
                //鼠标移入
                $("#videoContainer-"+option.guid).parents("div.bt_ui_element")[0].addEventListener("mouseenter",function(){
                    $(`#cameraVideo-${option.guid}`).show();
                    $(`#cameraVideo-${option.guid}`).prev().hide();

                    $(this).addClass("zIndex");
                    $(this).siblings(".bt_ui_element").removeClass("zIndex");

                    bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_x=-80;
                    bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_y=-102;

                    $(this).css({top:$(this).offset().top-68,left:$(this).offset().left-38});
                    //播放
                    MonitorConnPool.play(option.guid,document.getElementById("cameraVideo-"+option.guid),1);
                });
                $("#videoContainer-"+option.guid).parents("div.bt_ui_element")[0].addEventListener("mouseleave",function(){
                    $(`#cameraVideo-${option.guid}`).hide();
                    $(`#cameraVideo-${option.guid}`).prev().show();
                    //视频容器保持在点的正上方,高宽固定
                    bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_x=-42;
                    bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_y=-34;

                    $(this).css({top:$(this).offset().top+68,left:$(this).offset().left+38});
                    $(`#cameraVideo-${option.guid}`).attr({src:""});
                });
            break;
            case 2:  //监控列表
                $(`#cameraVideo-${option.guid}`).prev().addClass("monitoringList_videoInfo");
                bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_x=-80;
                bt_Plug_Annotation.annotations["videoContainer-"+option.guid].shift_y=-102;                
                //播放
                MonitorConnPool.play(option.guid,document.getElementById("cameraVideo-"+option.guid),1);
            break;
        };                        
        //强制刷新，防止设置的偏移无效
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    /**
     * @description: 打开视频模态框
     */
    openVideoModal:function (option,closeClick){
        //判断是否模态框是否存在，不存在则新建
        if($("#videoModal").length===0){
            $("body").append(`<div class="videoModal" id="videoModal">
                <div class="videoContainer-large">
                    <div class="videoInfo-large">
                        <div class="header">
                            <div class="closeVideoModal" title="关闭"  id="closeVideoModal">
                                <span class="iconfont ali-icon-guanbi"></span>
                            </div>
                            <span class="cam_title"></span>
                        </div>
                        <div class="flexBox">
                            <div>
                                <img src="image/camera.jpg" />
                            </div>
                            <div>
                                <p>ID：<span class="cam_id"></span></p>
                                <p>名称：<span class="cam_name"></span></p>
                                <p>guid：<span class="cam_guid"></span></p>
                            </div>
                        </div>
                    </div>
                    <video class="cameraVideo-large" id="cameraVideo-large" poster="image/loading-large.gif"></video>
                </div>
                </div>`);
        }else{
            $("#videoModal").show();
        }
        $("span.cam_title").text(`${option.description.slice(0,4)} - ${option.guid.slice(-4)}`);
        $("span.cam_name").text(option.name);
        $("span.cam_id").text(option.id);
        $("span.cam_guid").text(option.guid);
        //播放视频
        MonitorConnPool.play(option.guid,document.getElementById("cameraVideo-large"),2);
        commonFunOfVideo.videoModalId=option.guid;
        $("#closeVideoModal").on("click",function(e){
            closeClick&&closeClick(e);
            $("#cameraVideo-large").attr("src","");
            MonitorConnPool.stopLoadVideo(commonFunOfVideo.videoModalId,2);
            $("#videoModal").hide();
        });
    },
};