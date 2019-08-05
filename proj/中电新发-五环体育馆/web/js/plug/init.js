$(function(){
    //三维导航 CSS
    let scenesGuideBoxStyle=`<style>
        .scenesGuide{
            padding: 20px 10px;
            padding-bottom: 10px;
        }
        .scenesGuide>li{
            height: 114px;
        }
        .scenesGuide>li:first-child{
            margin-bottom: 10px;
        }
        .scenesGuide>li>div:first-child{
            margin-bottom: 10px;
        }
        .scenesGuide span{
            display: inline-block;
            width: 80px;
            padding: 8px 12px;
            margin-right: 10px;
            border-radius:50px;
            color:#fff;
            background: linear-gradient(#629bca, #123c5d);
            text-align: center;
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }
        .scenesGuide>li>div:first-child>span{
            display: inline-block;
            padding: 8px 22px;
            border-radius:50px;
            color:#2e6f9a;
            background: linear-gradient(#ffffff, #c8c7c7);
            font-size:18px;
        }
        .scenesGuide>li>div:first-child>span.lineSwitch{
            display:none;
            color:#fff;
        }
        .scenesGuide>li>div:first-child>span.lineSwitch-start{            
            background:linear-gradient(#B4F293,  #67C23A);            
        }
        .scenesGuide>li>div:first-child>span.lineSwitch-stop{                
            background:linear-gradient(#E58383,  #e4393c);      
        }
    </style>`;
    //三维导航 html
    let scenesGuideBoxHtml=`<div class="tContainer" id="scenesGuideBox">
        <div class="tContainer-header">
            <div class="tContainer-header-icon bgImage-guide"></div>
            <div class="tContainer-header-title">三维导览</div>
            <div class="tContainer-header-btn "></div>
        </div>
        <div class="tContainer-content">
            <ul class="scenesGuide">
                <li class="scenesGuide-hotPoint">
                    <div>
                        <span>热点</span>
                    </div>
                    <div>
                        <span id="hotPoint_playground">运动场</span>
                        <span id="hotPoint_gym">运动馆</span>
                        <span id="hotPoint_natatorium">游泳馆</span>
                        <span>……</span>
                    </div>
                </li>
                <li class="scenesGuide-line">
                    <div>
                        <span>线路</span>
                        <span class="lineSwitch lineSwitch-start">开始</span>
                        <span class="lineSwitch lineSwitch-stop">暂停</span>
                    </div>
                    <div>
                        <span id="line_globalLine">全局线路</span>
                        <span id="line_mainRoad">主干道</span>
                        <span id="line_stadium">体育场</span>
                        <span>……</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>`;
    //右侧导航栏  html
    let sideNavContainerHtml=`<div id="sideNavContainer" class="sideNavContainer">
        <div class="sideNavContainer-title">全息三维实景视频管控系统</div>
        <ul class="sideNavContainer-nav" id="sideNavContainer-nav">
            <li class="bgImage-guide sideNav-isActive" data-type="1">
                导航
            </li>
            <li class="bgImage-activity sideNav-isActive" data-type="2">
                指挥
            </li>
            <li class="bgImage-monitoring sideNav-isActive" data-type="3">
                监控          
            </li>
            <li class="bgImage-warning sideNav-isActive" data-type="4">
                告警
            </li>
            <li class="bgImage-mode" data-type="5">
                模式
            </li>
        </ul>
    </div>`;
    $("head").append(scenesGuideBoxStyle);
    $("body").append(sideNavContainerHtml);
    $("body").append(scenesGuideBoxHtml);
    //热点 按钮事件
    $("#hotPoint_playground").on("click",function(){
        bt_Util.executeScript(`Render\\CameraControl\\FlyTo3 512248.794747 3390994.890152 327.007706 512248.745137 3391002.469934 35.859993 1000;`);
        plug_panoramicVideoFusion.command_activate(5);
        plug_panoramicVideoFusion.command_activate(1);
    });
    $("#hotPoint_gym").on("click",function(){
        bt_Util.executeScript(`Render\\CameraControl\\FlyTo3 512368.521807 3391157.754046 349.411843 512368.472197 3391165.333828 58.26413 1000;`);
        plug_panoramicVideoFusion.command_activate(5);
        plug_panoramicVideoFusion.command_activate(2);
    });
    $("#hotPoint_natatorium").on("click",function(){
        bt_Util.executeScript(`Render\\CameraControl\\FlyTo3 512135.637384 3391160.085443 334.112037 512135.637384 3391160.085443 59.349115 1000;`);
        plug_panoramicVideoFusion.command_activate(5);
        plug_panoramicVideoFusion.command_activate(3);
    });
    //线路 按钮事件
    let pathRoaming={
        data:{
            pathRoamingRate: 0.03,
            pathRoamingLength: 0,
            pathRoamingLHeight: 20,
            pathRoamingLViewHeight: -15,
            viewToCameraDistance: 20,
            pointList:null
        },
        pointLists:{
            globalLine:[
                {"x":"512386.761182","y":"3390867.626144","z":"35.902451"},
                {"x":"512393.237986","y":"3390930.445522","z":"36.102432"},
                {"x":"512407.036586","y":"3391033.214557","z":"35.902451"},
                {"x":"512410.345586","y":"3391078.493270","z":"40.851040"},
                {"x":"512429.956618","y":"3391136.161296","z":"35.702470"},
                {"x":"512439.195755","y":"3391175.365156","z":"43.101743"},
                {"x":"512438.657091","y":"3391223.590651","z":"36.102432"},
                {"x":"512392.632641","y":"3391233.291837","z":"36.102432"},
                {"x":"512201.629551","y":"3391216.996734","z":"35.902451"},
                {"x":"512053.296832","y":"3391219.286457","z":"35.702470"},
                {"x":"512032.712555","y":"3391213.468328","z":"35.902451"},
                {"x":"512024.246857","y":"3391112.511830","z":"43.101740"},
                {"x":"512023.406327","y":"3391052.522713","z":"35.702470"},
                {"x":"512023.409806","y":"3390995.336652","z":"35.702470"},
                {"x":"512035.254912","y":"3390915.482882","z":"35.702470"},
                {"x":"512045.812909","y":"3390866.488012","z":"35.702470"},
                {"x":"512076.224343","y":"3390861.192203","z":"35.702470"},
                {"x":"512259.461827","y":"3390856.752066","z":"35.702470"},
                {"x":"512359.723683","y":"3390850.054367","z":"35.702470"},
                {"x":"512375.916689","y":"3390850.198653","z":"35.702470"},
                {"x":"512378.267004","y":"3390864.993526","z":"35.902451"}
            ],
            mainRoad:[
                {"x":"511941.110326","y":"3391107.390702","z":"36.476227"},
                {"x":"511973.182302","y":"3391102.651984","z":"39.593854"},
                {"x":"512013.843872","y":"3391110.057089","z":"43.038341"},
                {"x":"512050.042487","y":"3391117.300067","z":"43.084092"},
                {"x":"512087.331536","y":"3391117.702192","z":"43.084092"},
                {"x":"512133.176023","y":"3391111.507695","z":"43.084092"},
                {"x":"512171.674875","y":"3391118.550499","z":"43.084092"},
                {"x":"512226.768753","y":"3391143.945868","z":"43.084094"},
                {"x":"512264.559937","y":"3391157.115624","z":"43.084096"},
                {"x":"512299.959172","y":"3391154.010419","z":"43.084094"},
                {"x":"512320.191357","y":"3391124.279649","z":"43.084092"},
                {"x":"512368.790283","y":"3391089.622109","z":"43.084092"},
                {"x":"512378.446352","y":"3391041.742628","z":"43.084089"},
                {"x":"512377.462636","y":"3390994.648211","z":"43.073297"},
                {"x":"512337.709456","y":"3390914.394648","z":"43.084084"},
                {"x":"512307.058943","y":"3390892.036745","z":"43.078445"},
                {"x":"512265.716940","y":"3390870.067981","z":"35.879163"},
                {"x":"512192.648478","y":"3390872.014753","z":"35.879164"},
                {"x":"512162.228737","y":"3390894.442828","z":"40.934355"},
                {"x":"512140.840135","y":"3390934.501318","z":"43.078449"},
                {"x":"512118.798516","y":"3390998.087019","z":"43.078448"},
                {"x":"512122.848928","y":"3391067.048493","z":"43.078453"},
                {"x":"512115.603936","y":"3391086.751471","z":"43.078455"},
                {"x":"512106.822778","y":"3391103.166283","z":"43.078456"}
            ],
            stadium:[
                {"x":"512223.878905","y":"3390944.384822","z":"35.874414"},
                {"x":"512245.134189","y":"3390945.160512","z":"35.874414"},
                {"x":"512257.863342","y":"3390945.243826","z":"35.874414"},
                {"x":"512269.621514","y":"3390946.116899","z":"35.874414"},
                {"x":"512277.347879","y":"3390949.994993","z":"35.874414"},
                {"x":"512282.993949","y":"3390954.029852","z":"35.874414"},
                {"x":"512284.120857","y":"3390978.097982","z":"35.874415"},
                {"x":"512284.937437","y":"3390995.632204","z":"35.874415"},
                {"x":"512285.271371","y":"3391024.092892","z":"35.874415"},
                {"x":"512285.606611","y":"3391045.073755","z":"35.874415"},
                {"x":"512283.788235","y":"3391056.414077","z":"35.874415"},
                {"x":"512280.327871","y":"3391060.858316","z":"35.874415"},
                {"x":"512273.902759","y":"3391063.469772","z":"35.874415"},
                {"x":"512245.252467","y":"3391064.610818","z":"35.874415"},
                {"x":"512224.185150","y":"3391064.306794","z":"35.874415"},
                {"x":"512218.452031","y":"3391063.106860","z":"35.874415"},
                {"x":"512215.232827","y":"3391060.266916","z":"35.874415"},
                {"x":"512212.629734","y":"3391052.979178","z":"35.874415"},
                {"x":"512212.722803","y":"3391039.370051","z":"35.874415"},
                {"x":"512213.716734","y":"3391024.103938","z":"35.874415"},
                {"x":"512213.906530","y":"3390985.225092","z":"35.874415"},
                {"x":"512213.303442","y":"3390961.040917","z":"35.874414"},
                {"x":"512213.900554","y":"3390948.630210","z":"35.874414"},
                {"x":"512215.894184","y":"3390945.635448","z":"35.874414"},
                {"x":"512219.937598","y":"3390944.239371","z":"35.874414"}
            ]
        },
        startPathRoaming:function(type){
            pathRoaming.deactivateStartPathRoaming();
            let distance = 0,pointList=pathRoaming.pointLists[type];
            for (let i = 1,len=pointList.length; i < len; i++) {
                distance += Math.sqrt(Math.pow(pointList[i].x - pointList[i - 1].x, 2) + Math.pow(pointList[i].y - pointList[i - 1].y, 2) + Math.pow(pointList[i].z - pointList[i - 1].z, 2));
            }
            pathRoaming.data.lineLength = distance;
            pathRoaming.data.pointList=pointList;

            $("span.lineSwitch-start").off("click").hide();
            $("span.lineSwitch-stop").off("click").show();

            $("span.lineSwitch-stop").on("click",function(){
                $(this).hide();
                $("span.lineSwitch-start").show();
                pathRoaming.removeEvents();
            });
            $("span.lineSwitch-start").on("click",function(){
                $(this).hide();
                $("span.lineSwitch-stop").show();
                pathRoaming.data.preDate = new Date().getTime();
                pathRoaming.addEvents();
            });
            this.data.preDate = new Date().getTime();
            this.addEvents();
        },
        deactivateStartPathRoaming:function(){
            this.removeEvents();

            this.data.rotationAngle = 0;
            this.data.pathRoamingRate=0.01;
            this.data.pathRoamingLength=0;
            this.data.pathRoamingLHeight=20;
            this.data.pathRoamingLViewHeight=-15;
            this.data.viewToCameraDistance=20;
            this.data.pointList=null;
        },
        addEvents:function(){
            bt_PlugManager.addEventListener("Render\\BeforeRender", this.beforeRender);
            bt_Util.executeScript("Render\\ForceRedraw;");
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseWheel", this.pathRoaming_mouseWheel);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", this.changeAngle_mouseDown);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", this.changeAngle_mouseMove);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", this.changeAngle_mouseUp);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseClick", this.disable_click);
            bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", this.disable_DBClick);
        },
        removeEvents:function(){
            bt_PlugManager.removeEventListener("Render\\BeforeRender", this.beforeRender);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseWheel", this.pathRoaming_mouseWheel);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", this.changeAngle_mouseDown);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", this.changeAngle_mouseMove);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", this.changeAngle_mouseUp);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", this.disable_click);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", this.disable_DBClick);
        },
        beforeRender: () => {
            let pointList = pathRoaming.data.pointList;
            let pathRoamingLength = pathRoaming.data.pathRoamingLength;
            if (!pathRoamingLength) pathRoamingLength = 0;
            let preDate = pathRoaming.data.preDate;
            if (!preDate) preDate = new Date().getTime() - 33;
            let cameraPoint = pathRoaming.getSiteByDistance(pathRoamingLength, pointList);
            let viewPoint = pathRoaming.getSiteByDistance(pathRoamingLength + pathRoaming.data.viewToCameraDistance, pointList);
            let height = pathRoaming.data.pathRoamingLHeight;
            let viewHeight = pathRoaming.data.pathRoamingLViewHeight;
            let rate = pathRoaming.data.pathRoamingRate;
            let distance = pathRoaming.data.lineLength;
            let rotationAngle = pathRoaming.data.rotationAngle;
            if (!rotationAngle) rotationAngle = 0;            
            if (pathRoamingLength >= distance + 50) {
                $("span.lineSwitch-start").off("click");
                $("span.lineSwitch-stop").off("click");
                $("span.lineSwitch-stop").hide();
                pathRoaming.deactivateStartPathRoaming();
                bt_Util.executeScript("Render\\ForceRedraw;");
                return true;
            }
    
            if (cameraPoint && viewPoint) {
    
                let rotationX = (viewPoint.x - cameraPoint.x) * Math.cos(rotationAngle) - (viewPoint.y - cameraPoint.y) * Math.sin(rotationAngle) + cameraPoint.x;
                let rotationY = (viewPoint.y - cameraPoint.y) * Math.cos(rotationAngle) - (viewPoint.x - cameraPoint.x) * Math.sin(rotationAngle) + cameraPoint.y;
                viewPoint = {x: rotationX, y: rotationY, z: viewPoint.z};
    
                viewPoint.z = (viewPoint.z + parseFloat(height) + parseFloat(viewHeight));
    
                viewPoint.x = (viewPoint.x - cameraPoint.x) * 5 + cameraPoint.x;
                viewPoint.y = (viewPoint.y - cameraPoint.y) * 5 + cameraPoint.y;
                viewPoint.z = ((viewPoint.z - cameraPoint.z) * 5 + cameraPoint.z) * 0.5;
    
                //调整视角
                bt_Util.executeScript("Render\\Camera\\SetParam " + cameraPoint.x + " " + cameraPoint.y + " " + (cameraPoint.z + parseFloat(height)) + " "
                    + viewPoint.x + " " + viewPoint.y + " " + viewPoint.z + " 0 0 1 1;");
            }
    
            let currentDate = new Date().getTime();
            pathRoamingLength += rate * (currentDate - preDate);
            pathRoaming.data.perIncrease = rate * (currentDate - preDate);
            pathRoaming.data.preDate = currentDate;
            pathRoaming.data.pathRoamingLength = pathRoamingLength;            
            pathRoaming.data.rotationAngle = rotationAngle;
            bt_Util.executeScript("Render\\ForceRedraw;");
        },
        pathRoaming_mouseWheel: (e) => {
            let height = pathRoaming.data.pathRoamingLHeight;
            height = height - e[0] * 1;
            pathRoaming.data.pathRoamingLHeight = height;
            return true;
        },
        disable_click: () => {
            return true;
        },
        disable_DBClick: () => {
            return true;
        },
        changeAngle_mouseDown: (ep) => {
            if (ep[0] !== 2) return false;
            pathRoaming.data.changeAngle_mouseDown = ep[1] + " " + ep[2];
            return true;
        },
        changeAngle_mouseMove: (e) => {
            let mouseDownSite = pathRoaming.data.changeAngle_mouseDown;
            if (!mouseDownSite) return true;
            mouseDownSite = mouseDownSite.split(" ");
            let viewHeight = pathRoaming.data.pathRoamingLViewHeight;
            pathRoaming.data.pathRoamingLViewHeight = (viewHeight - (parseFloat(e[1]) - parseFloat(mouseDownSite[1])).toFixed(4) * 0.1) * 0.5;
    
            let changeAngle_mouseMoveX = pathRoaming.data.changeAngle_mouseMoveX;
            if (!changeAngle_mouseMoveX) {
                changeAngle_mouseMoveX = e[0];
                pathRoaming.data.changeAngle_mouseMoveX = changeAngle_mouseMoveX;
            } else {
                let rotationAngle = pathRoaming.data.rotationAngle;
                if (!rotationAngle) rotationAngle = 0;
                let perX = e[0] - changeAngle_mouseMoveX;
                let angle = Math.asin(Math.abs(perX) / parseFloat(pathRoaming.data.viewToCameraDistance)) * 0.15;
                if (perX > 0) {
                    rotationAngle -= angle;
                } else {
                    rotationAngle += angle;
                }
                pathRoaming.data.rotationAngle = rotationAngle;
                pathRoaming.data.changeAngle_mouseMoveX = e[0];
            }
    
            return true;
        },
        changeAngle_mouseUp: () => {
            pathRoaming.data.changeAngle_mouseDown = null;
            return true;
        },
        getSiteByDistance: (distance, pointList) => {
            let perLength = 0;
            for (let j = 1; j < pointList.length; j++) {
                let newPerLength = perLength + Math.sqrt(Math.pow(pointList[j].x - pointList[j - 1].x, 2) + Math.pow(pointList[j].y - pointList[j - 1].y, 2) + Math.pow(pointList[j].z - pointList[j - 1].z, 2));
                if (newPerLength > distance) {
                    let percent = (distance - perLength) / (newPerLength - perLength);
                    let x = (parseFloat(pointList[j].x) - parseFloat(pointList[j - 1].x)) * percent + parseFloat(pointList[j - 1].x);
                    let y = (parseFloat(pointList[j].y) - parseFloat(pointList[j - 1].y)) * percent + parseFloat(pointList[j - 1].y);
                    let z = (parseFloat(pointList[j].z) - parseFloat(pointList[j - 1].z)) * percent + parseFloat(pointList[j - 1].z);
                    return {x: x, y: y, z: z};
                } else {
                    perLength = newPerLength;
                }
            }
        },
    };
    $("#line_globalLine").on("click", function () {
        pathRoaming.startPathRoaming("globalLine");
    });
    $("#line_mainRoad").on("click", function () {
        pathRoaming.startPathRoaming("mainRoad");
    });
    $("#line_stadium").on("click", function () {
        pathRoaming.startPathRoaming("stadium");
    });

    //导航按钮事件
    $("#sideNavContainer-nav").on("click",function(e){
        if($(e.target).prop("tagName")!=="LI") return;
        $(e.target).hasClass("sideNav-isActive")?$(e.target).removeClass("sideNav-isActive"):$(e.target).addClass("sideNav-isActive");
        switch($(e.target).data("type")){
            case 1://导航
                if($("#scenesGuideBox").is(":hidden")){
                    $("#scenesGuideBox").show();
                }else{
                    $("#scenesGuideBox").hide();
                    $("span.lineSwitch-start").off("click");
                    $("span.lineSwitch-stop").off("click");
                    $("span.lineSwitch-start").hide();
                    $("span.lineSwitch-stop").hide();
                    pathRoaming.deactivateStartPathRoaming();
                    bt_Util.executeScript("Render\\ForceRedraw;");
                }
            break;
            case 2://指挥
                if($("#keyActivity").length===0||$("#keyActivity").is(":hidden")){
                    plug_activity.plug_activate();
                    $("#keyActivity").show();                    
                }else{
                    $("#keyActivity").hide();
                    plug_activity.plug_deactivate();
                }
            break;
            case 3://监控
                if($("#monitoringBox").is(":hidden")){
                    $("#monitoringBox").show();
                    initMonitoringContainer.activate(parseInt(initMonitoringContainer.monitoringContainerVue.activeName));
                    initMonitoringContainer.setIcon();
                }else{
                    $("#monitoringBox").hide();
                    initMonitoringContainer.deactivate(parseInt(initMonitoringContainer.monitoringContainerVue.activeName));
                    initMonitoringContainer.removeIcon();
                }                
            break;
            case 4://告警
                if($("#warnningBox").is(":hidden")){
                    $("#warnningBox").show();
                    bt_plug_warnning.command_activate(0);
                }else{
                    $("#warnningBox").hide();
                    bt_plug_warnning.command_deactivate(0);
                }
            break;
            case 5://模式
				if($('.plugManager').is(":hidden")){
					$('.plugManager').show();
				}else{
					$('.plugManager').hide();
				}				
            break;
            default:
                console.error("Can't get type");
        }
    });
    //初始化实时监控和相机列表
    initMonitoringContainer.init();	
})