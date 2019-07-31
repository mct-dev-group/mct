let initMonitoringContainer={
    guids:[],//保存视频的guid
    lastXY:{},//上次的点击点世界坐标
    linesOfViewFrustum:[],
    monitoringContainerVue:null,
    videoModalId:"",//记录模态框播放的视频ID
    icons:[],
    init:function(){
        this.appendDOM();
        this.creatVue();
        setTimeout(()=>{            
            this.activate(0);
            //初始化图标
            this.setIcon();
        },2000);
         
    },
    /**
     * @description: 平面上两点距离
     */
    getDistance2D:function (p1,p2) {
        return Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2));
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
    appendDOM:function(){
        $("head").append(`<style>
            /* #monitoringContainer{
                position: fixed;
                top:5%;
                right:5%;
            } */
            .realTimeMonitoring{
                width: 100%;
                height:200px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                align-content:space-around;
            }
            .bgcolor-eee{
                background-color:  #eee !important;
            }
            div.videoItemBox{
                width:160px;
                height: 90px;
                background: rgb(59, 58, 58);
                margin-bottom:3px;
                position:relative;
            }
            div.videoItemBox>div{
                height: 100%;
                text-align: center;
                line-height: 90px;
                font-size: 18px;
                color:rgb(240, 240, 240);
            }
            div.videoItemBox>video{
                width:160px;
                height:90px;
                cursor:pointer;
            }
            div.videoItemBox>span{
                position:absolute;
                right:1px;
                bottom:1px;
                z-index:10;
                color:#fff;
            }
            div.monitoringList{
                width: 100%;
            }
            .current-row > td {
                /*     background: rgba(0, 158, 250, 0.219) !important; */
                background: rgba(0, 0, 0, 0.3) !important;
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
            .realTimeMonitoring_videoInfo{
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
                transform:translate(-50%,-50%);
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
        $("body").append(`<div class="tContainer" id="monitoringBox">
            <div class="tContainer-header">
                <div class="tContainer-header-icon bgImage-monitoring"></div>
                <div class="tContainer-header-title">实时监控/监控列表</div>                
            </div>
            <div class="tContainer-content">
                <div id="monitoringContainer">
                    <el-tabs type="border-card"  v-model="activeName" stretch >
                        <el-tab-pane label="实时监控" name="0">
                            <div class="realTimeMonitoring">
                                <div class="videoItemBox">
                                    <div>暂无视频</div>
                                </div>
                                <div class="videoItemBox">
                                    <div>暂无视频</div>
                                </div>
                                <div class="videoItemBox">
                                    <div>暂无视频</div>
                                </div>
                                <div class="videoItemBox">
                                    <div>暂无视频</div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="监控列表" name="1">
                            <div class="monitoringList">
                                <el-input placeholder="请输入监控相机名称" size="small" @input="handleInput">
                                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                                <el-table
                                    :data="cams"
                                    style="width: 100%;"
                                    height="163"
                                    highlight-current-row
                                    size="small"
                                    @row-click="handleItemClick"
                                    :default-sort = "{prop: 'name'}"
                                    >
                                    <el-table-column
                                        type="index"
                                        :index="indexMethod"
                                        label="序号"
                                        align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="名称"
                                        show-overflow-tooltip
                                        sortable
                                        align="center"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="guid"
                                        label="GUID"
                                        show-overflow-tooltip
                                        align="center"
                                    >
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>`);
    },
    creatVue:function(){
        if($("#monitoringContainer").length!==0){
            this.monitoringContainerVue=new Vue({
                el:"#monitoringContainer",
                data:{
                    activeName:"0",
                    cams: camera_list,
                    lastCamId:null,//上一个在视锥体ID
                    timer:null,//防抖定时器
                },
                watch:{
                    activeName:function (val) {
                        switch(val){
                            case "0" :
                                initMonitoringContainer.deactivate(1);
                                initMonitoringContainer.activate(0);

                            break;
                            case "1" :
                                initMonitoringContainer.deactivate(0);
                                initMonitoringContainer.activate(1);
                            break;
                        }
                    }
                },
                methods:{
                    handleInput(val){
                        let th=this;
                        this.timer&&clearTimeout(this.timer);
                        this.timer=setTimeout(function(){
                            if(val===""){//清空输入
                                th.cams=camera_list;
                            }else{ //输入内容
                                th.cams=camera_list.filter(option=>{
                                    return option.name.toLowerCase().indexOf(val.toLowerCase())!==-1;
                                });
                            }
                        },300);
                    },
                    handleItemClick(cam){
                        if(this.lastCamId){
                            //清除上一个视锥体
                            for(let i=1;i<13;i++){
                                bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj planePart"+i+"_"+this.lastCamId+" 16;");
                            }
                            //清除上一个视频
                            bt_Plug_Annotation.removeAnnotation("videoContainer-"+this.lastCamId);
                            MonitorConnPool.stopLoadVideo(this.lastCamId,1);
                        }
                        this.lastCamId=cam.guid;
                        //画出视锥体
                        initMonitoringContainer.paintViewFrustum(cam);
                        //视角
                       /*  let maxPoints=initMonitoringContainer.getRotatedPoint(cam.farthest_sight_distance,cam.view_angle_y,cam.pitch_angle,cam.deflection_angle,cam.width_span_rate);
                        let worldPoints=maxPoints.map(elem=>{
                            return {x:cam.position.x*1+elem.x,
                                    y:cam.position.y*1+elem.y,
                                    z:cam.position.z*1+elem.z,}
                        });
                        let centerPointX=worldPoints.reduce((a,b)=>{
                            return {x:a.x+b.x};
                        }).x;
                        let centerPointY=worldPoints.reduce((a,b)=>{
                            return {y:a.y+b.y};
                        }).y;
                        let centerPointZ=worldPoints.reduce((a,b)=>{
                            return {z:a.z+b.z};
                        }).z;
                        //视锥体最远距离面中心
                        let centerPoint={
                            x:centerPointX/4,
                            y:centerPointY/4,
                            z:centerPointZ/4
                        };
                        bt_Util.executeScript(`Render\\CameraControl\\FlyTo2 ${centerPoint.x} ${centerPoint.y} ${centerPoint.z};`);*/
                        bt_Util.executeScript(`Render\\CameraControl\\FlyTo2 ${cam.position.x} ${cam.position.y} ${cam.position.z};`);
                        //视频框点击事件处理函数
                        let handleClick=function(){
                            //打开视频详情
                            initMonitoringContainer.openVideoModal(cam);
                        }
                        //创建并播放视频
                        initMonitoringContainer.createAndPlayFloatVideo(2,cam,handleClick);
                    },
                    indexMethod(index) {
                        return index +1;
                    }
                },
            });
        }
    },
    setIcon:function(){
        camera_list.forEach(val=>{
            if($("#camIcon_"+val.guid).length===0){
                setIcon(val.guid,val.type,val.position);
                this.icons.push("camIcon_"+val.guid);
            }
        });
    },
    removeIcon:function(){
        this.icons.forEach(function (elem) {
            bt_Plug_Annotation.removeAnnotation(elem);
        });
        this.icons=[];
    },
    activate:function(id){
        switch(id){
            case 0 ://实时监控
                let lookatPt=bt_Util.getCameraParam().lookatPt;                
                this.cameraInRange(lookatPt,100);
                // this.printRangeLines(lookatPt,100);
                bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", this.handleMouseDown);
                bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", this.handleMouseUp);
                bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", this.handleDbclick);
            break;
            case 1 ://监控列表

            break;
        }        
    },
    deactivate:function(id){
        switch(id){
            case 0 ://实时监控
                bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\DelRenderObj listModeLine1 8;`);
                bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\DelRenderObj listModeLine2 8;`);
                bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\DelRenderObj listModeLine3 8;`);
                bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\DelRenderObj listModeLine4 8;`);
                bt_Util.executeScript("Render\\ForceRedraw;");
                bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", this.handleMouseDown);
                bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", this.handleMouseUp);
                bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.handleDbclick);

                //清除标注和视锥体
                this.clearAnnotationsAndViewFrustum();

                this.videoModalId&&MonitorConnPool.stopLoadVideo(this.videoModalId,2);
            break;
            case 1 ://监控列表
                let lastCamId=this.monitoringContainerVue.lastCamId;
                if(lastCamId){
                    //清除上一个视锥体
                    for(let i=1;i<13;i++){
                        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj planePart"+i+"_"+lastCamId+" 16;");
                    }
                    //清除上一个视频
                    bt_Plug_Annotation.removeAnnotation("videoContainer-"+lastCamId);
                    MonitorConnPool.stopLoadVideo(lastCamId,1);
                }
                bt_Util.executeScript("Render\\ForceRedraw;");

                this.videoModalId&&MonitorConnPool.stopLoadVideo(this.videoModalId,2);
            break;
        }       
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
     * @description: 根据相机参数画出视锥体
     */
    paintViewFrustum:function(option){
        let p_x=option.position.x;
        let p_y=option.position.y;
        let p_z=option.position.z;
        //远平面顶点坐标
        let maxPoints=this.getRotatedPoint(option.farthest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);
        //近平面顶点坐标
        let minPoints=this.getRotatedPoint(option.nearest_sight_distance,option.view_angle_y,option.pitch_angle,option.deflection_angle,option.width_span_rate);
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
        this.videoModalId=option.guid;
        $("#closeVideoModal").on("click",function(e){
            closeClick&&closeClick(e);
            $("#cameraVideo-large").attr("src","");
            MonitorConnPool.stopLoadVideo(initMonitoringContainer.videoModalId,2);
            $("#videoModal").hide();
        });
    },
    handleMouseDown:function(ep){
        initMonitoringContainer.lastXY.x=ep[1];
        initMonitoringContainer.lastXY.y=ep[2];
    },
    handleMouseUp:function(ep){
        if( ep[1]!==initMonitoringContainer.lastXY.x || ep[2]!==initMonitoringContainer.lastXY.y ){
            let lookatPt=bt_Util.getCameraParam().lookatPt;
            initMonitoringContainer.cameraInRange(lookatPt,100);
            // initMonitoringContainer.printRangeLines(lookatPt,100);
        }
    },
    handleDbclick:function(){
        setTimeout(function(){
            let lookatPt=bt_Util.getCameraParam().lookatPt;
            initMonitoringContainer.cameraInRange(lookatPt,100);
            // initMonitoringContainer.printRangeLines(lookatPt,100);
        },1001);
    },
    clearAnnotationsAndViewFrustum:function(){
        //移除之前的video
        this.guids.forEach(val=>{
            bt_Plug_Annotation.removeAnnotation("videoContainer-"+val);
            MonitorConnPool.stopLoadVideo(val,1);
        });
        this.guids=[];
        //移除视锥体
        this.linesOfViewFrustum.forEach(val=>{
            for(let i=1;i<13;i++){
                bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj planePart"+i+"_"+val+" 16;");
            }
        });
        this.linesOfViewFrustum=[];
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    cameraInRange:function(point,rangeX,rangeY){//范围内的监控相机
        rangeX=rangeX||50;
        rangeY=rangeY||50;
        let filterCameras=camera_list.filter(elem=>{
            let startX=point.x-rangeX/2;
            let startY=point.y-rangeY/2;
            let endX=point.x+rangeX/2;
            let endY=point.y+rangeY/2;
            return elem.position.x>=startX&&elem.position.x<=endX&&elem.position.y>=startY&&elem.position.y<=endY;
        });
        //按照距离排序
        filterCameras.sort((a,b)=>{
            let d1=initMonitoringContainer.getDistance2D(point,a.position);
            let d2=initMonitoringContainer.getDistance2D(point,b.position);
            return d1-d2;
        });
        $("div.videoItemBox").html(`<div>暂无视频</div>`).removeClass("bgcolor-eee");
        this.guids.forEach(elem=>{
            MonitorConnPool.stopLoadVideo(elem,1);
        });
        this.clearAnnotationsAndViewFrustum();
        let final=filterCameras.slice(0,4);
        final.forEach((elem,i)=>{
            //画出视锥体
            initMonitoringContainer.paintViewFrustum(elem);
            //存入相机ID，根据ID删除视锥体
            this.linesOfViewFrustum.push(elem.guid);
            this.videoOfListMode(elem,i);
            let html=`<div class="videoContainer" id="videoContainer-${elem.guid}">
                <div class="videoInfo realTimeMonitoring_videoInfo">${elem.description.slice(0,4)} - ${elem.guid.slice(-4)}</div>
            </div>`;
            bt_Plug_Annotation.setAnnotation("videoContainer-"+elem.guid, elem.position.x, elem.position.y, elem.position.z, -42, -36, html, false);
            this.guids.push(elem.guid);
        });
    },
    videoOfListMode:function(option,index){
        let html=`<video id="video-${option.guid}"  poster="image/loading.gif"></video><span>${option.description.slice(0,4)} - ${option.guid.slice(-4)}</span>`;
        $($("div.videoItemBox")[index]).html(html);
        MonitorConnPool.play(option.guid,document.getElementById("video-"+option.guid),1);
        $(`#video-${option.guid}`).parents("div.videoItemBox").off("click").addClass("bgcolor-eee");
        $(`#video-${option.guid}`).parents("div.videoItemBox").on("click",function(){
            initMonitoringContainer.openVideoModal(option);
        });
    },
    printRangeLines:function(point,rangeX,rangeY){//画出范围线
        rangeX=rangeX||50;
        rangeY=rangeY||50;
        let p1={},
        p2={};

        p1.x=point.x-rangeX/2;
        p1.y=point.y+rangeY/2;

        p2.x=point.x+rangeX/2;
        p2.y=point.y-rangeY/2;

        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj listModeLine1 4 1 " + p1.x +" "+ p1.y +" "+ point.z +" 8 2 2 0.000000 0.000000 0.000000 255 255 255 255 " + (rangeX)+ " " + (0) + " "+ (0)+" 255 255 0 255 0 1 0;");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj listModeLine2 4 1 " + p1.x +" "+ p1.y +" "+ point.z +" 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (0)+ " " + (-rangeY) + " "+ (0)+" 255 255 0 255 0 1 0;");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj listModeLine3 4 1 " + p2.x +" "+ p2.y +" "+ point.z +" 8 2 2 0.000000 0.000000 0.000000 255 255 255 255 " + (0)+ " " +(rangeY) + " "+ (0)+" 255 255 0 255 0 1 0;");
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\AddRenderObj listModeLine4 4 1 " + p2.x +" "+ p2.y +" "+ point.z +" 8 2 2 0.000000 0.000000 0.000000 255 255 0 255 " + (-rangeX)+ " " + (0) + " "+ (0)+" 255 255 0 255 0 1 0;");
        // bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\AddWLine listModeLine1 3 ${p1.x} ${p1.y} ${point.z} 2 0.000000 0.000000 0.000000 255 255 255 ${rangeX} 0.000000 0.000000 120 200 120  0;`);
        // bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\AddWLine listModeLine2 3 ${p1.x} ${p1.y} ${point.z} 2 0.000000 0.000000 0.000000 255 255 255 0 ${-rangeY} 0.000000 120 200 120  0;`);
        // bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\AddWLine listModeLine3 3 ${p2.x} ${p2.y} ${point.z} 2 0.000000 0.000000 0.000000 255 255 255 0 ${rangeY} 0.000000 120 200 120  0;`);
        // bt_Util.executeScript(`Render\\RenderDataContex\\DynamicFrame\\AddWLine listModeLine4 3 ${p2.x} ${p2.y} ${point.z} 2 0.000000 0.000000 0.000000 255 255 255 ${-rangeX} 0.000000 0.000000 120 200 120  0;`);
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
}