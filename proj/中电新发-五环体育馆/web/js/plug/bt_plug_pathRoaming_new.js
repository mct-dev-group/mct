let plug_pathRoaming = new Plug();
plug_pathRoaming.js_name = 'plug_pathRoaming';
plug_pathRoaming.plug_name = '路径漫游';
plug_pathRoaming.plug_commands[0] = new Command('编辑路径点', 1, false, false);
plug_pathRoaming.plug_commands[1] = new Command('开始漫游', 2, false, false);
plug_pathRoaming.plug_commands[2] = new Command('导入路径数据', 3, false, true);
plug_pathRoaming.plug_commands[3] = new Command('导出路径数据', 4, false, true);

plug_pathRoaming.command_activate = (command_id) => {
    switch (command_id) {
        case plug_pathRoaming.plug_commands[0].command_id:
            bt_pathRoaming_func.deactivateStartPathRoaming();
            bt_pathRoaming_func.activateCollectPathPoint();
            break;
        case plug_pathRoaming.plug_commands[1].command_id:
            bt_pathRoaming_func.deactivateCollectPathPoint();
            bt_pathRoaming_func.activeStartPathRoaming();
            break;
        case plug_pathRoaming.plug_commands[2].command_id:
            bt_pathRoaming_func.importPathRoamingData();
            break;
        case plug_pathRoaming.plug_commands[3].command_id:
            bt_pathRoaming_func.exportPathRoamingData();
            break;
    }
};

plug_pathRoaming.plug_activate = () => {

    if (bt_pathRoaming_func.data.localDataFile) {
        $.ajax({
            data: "",
            type: "GET",
            dataType: "JSON",
            contentType: "application/json",
            scriptCharset: "utf-8",
            url: bt_pathRoaming_func.data.localDataFile,
            error: function (error) {
                let list = error.responseText.split('\r\n');
                if (!list[list.length - 1]) {
                    list.length = list.length - 1;
                }
                let pointList = [];
                for (let i = 0; i < list.length; i++) {
                    pointList.push(JSON.parse(list[i]));
                }
                $("#PathRoamingImportPointFile").val("");
                bt_pathRoaming_func.data.pointList = pointList;
                bt_pathRoaming_func.deactivateCollectPathPoint();
                bt_pathRoaming_func.deactivateStartPathRoaming();
            },
            success: function (result) {
                console.log("success:" + result);
            }
        });
    }
};


plug_pathRoaming.plug_deactivate = () => {
    bt_pathRoaming_func.deactivateStartPathRoaming();
    bt_pathRoaming_func.deactivateCollectPathPoint();
};

bt_PlugManager.insert_plug(plug_pathRoaming);

let bt_pathRoaming_func = {

    data: {
        pathRoamingRate: 0.03,
        mileage: 1000,
        pathRoamingLength: 0,
        pathRoamingLHeight: 20,
        pathRoamingLViewHeight: -15,
        viewToCameraDistance: 20,
        localDataFile: null
    },

    activateCollectPathPoint: () => {
        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.collectPathPointMouseDown);
        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.collectPathPointMouseUp);
        bt_Util.executeScript("Render\\ForceRedraw;");

        $(document).unbind("keydown").keydown(function (e) {
            let keyCode = e.keyCode || e.which || e.charCode;
            let ctrlKey = e.ctrlKey || e.metaKey;
            if (ctrlKey && keyCode === 90) {
                //Ctrl + Z
                let pointList = bt_pathRoaming_func.data.pointList;
                if (pointList && pointList.length > 0) {
                    bt_pathRoaming_func.clearPointAndLine(pointList);
                    pointList.splice(pointList.length - 1, 1);
                    bt_pathRoaming_func.drawPointAndLine(pointList);
                }
                bt_Util.executeScript("Render\\ForceRedraw;");
                return false;
            } else if (ctrlKey && keyCode === 68) {
                //Ctrl + D  删除所有边界线和标注点
                let pointList = bt_pathRoaming_func.data.pointList;
                bt_pathRoaming_func.clearPointAndLine(pointList);
                bt_pathRoaming_func.data.pointList = [];
                bt_Util.executeScript("Render\\ForceRedraw;");
                return false;
            }
        });

        //弹出组合键提示框
        if (bt_pathRoaming_func.data.collectPointListTipsDiv) bt_pathRoaming_func.data.collectPointListTipsDiv.close();
        let manual_tips_div = bt_PlugManager.$notify({
            title: '组合键提示',
            dangerouslyUseHTMLString: true,
            customClass: 'manual_tips_div',
            message: 'Ctrl + Z：删除最后一个边界点<br/>Ctrl + D：删除所有边界点',
            type: 'success',
            position: 'top-right',
            duration: 0,
            showClose: false
        });
        $(".manual_tips_div").css("opacity", "0.8");
        bt_pathRoaming_func.data.collectPointListTipsDiv = manual_tips_div;

        //若pointList不为空，则绘制路径
        let pointList = bt_pathRoaming_func.data.pointList;
        if (pointList && pointList.length > 0) bt_pathRoaming_func.drawPointAndLine(pointList);

    },
    deactivateCollectPathPoint: () => {
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.collectPathPointMouseDown);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.collectPathPointMouseUp);
        bt_pathRoaming_func.clearPointAndLine(bt_pathRoaming_func.data.pointList);
        bt_Util.executeScript("Render\\ForceRedraw;");
        $(document).unbind("keydown");
        if (bt_pathRoaming_func.data.collectPointListTipsDiv) bt_pathRoaming_func.data.collectPointListTipsDiv.close();
    },
    collectPathPointMouseDown: (ep) => {
        if (ep[0] === 0) {
            bt_pathRoaming_func.data.mouseDownPoint = {x: ep[1], y: ep[2]};
        }
    },
    collectPathPointMouseUp: (ep) => {
        if (ep[0] === 0) {
            let mouseDownPoint = bt_pathRoaming_func.data.mouseDownPoint;
            if (Math.abs(ep[1] - mouseDownPoint.x) < 2 && Math.abs(ep[2] - mouseDownPoint.y) < 2) {
                let point = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + ep[1] + " " + ep[2] + ";");
                point = point[0].split(" ");
                if (point[0] == 1) {
                    let pointList = bt_pathRoaming_func.data.pointList;
                    //若pointList未定义则表明为第一个点，则添加鼠标移动的监听事件,并清除之前的数据
                    if (!pointList || pointList.length < 1) {
                        pointList = [];
                        bt_pathRoaming_func.clearPointAndLine(bt_pathRoaming_func.data.pointList);
                    }
                    pointList.push({x: point[1], y: point[2], z: point[3]});
                    bt_pathRoaming_func.data.pointList = pointList;
                    bt_pathRoaming_func.drawPointAndLine(pointList);
                }
            }
        }
    },
    drawPointAndLine: (pointList) => {
        let lineStr = "Render\\RenderDataContex\\DynamicFrame\\AddRenderObj PathRoamingSignLine 4 1 " + pointList[0].x + " " + pointList[0].y + " " + pointList[0].z
            + " 8 " + pointList.length + " " + (pointList.length - 1) * 2 + " ";
        let indexStr = "";
        for (let i = 0; i < pointList.length; i++) {
            //设置坐标点
            bt_Plug_Annotation.setAnnotation("PathRoamingSign" + i, pointList[i].x, pointList[i].y, pointList[i].z, -8, -16, "<div style='background:url(image/DefaultIcon.png); " +
                "background-position:center left; background-repeat: no-repeat; height:16px; line-height:10px;'>" +
                "<span style='margin-left:16px; font-size:9px; white-space: nowrap;'>路径点" +
                (i + 1) + "</span></div>", false);
            //设置线顶点、索引点
            lineStr += (pointList[i].x - pointList[0].x) + " " + (pointList[i].y - pointList[0].y) + " " + (pointList[i].z - pointList[0].z) + " 255 255 0 255 ";
            if (i < pointList.length - 1) {
                indexStr += i + " " + (i + 1) + " ";
            }
        }
        lineStr += indexStr + "0;";
        bt_Util.executeScript(lineStr);
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    clearPointAndLine: (pointList) => {
        if (!pointList) return;
        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj PathRoamingSignLine 8;");
        for (let i = 0; i < pointList.length; i++) {
            bt_Plug_Annotation.removeAnnotation("PathRoamingSign" + i);
        }
    },
    activeStartPathRoaming: () => {
        if (!bt_pathRoaming_func.data.pointList) {
            bt_PlugManager.$message.error('暂无路径点可供漫游，请采集路径点或导入路径数据后再尝试开始漫游。');
            return false;
        }

        let htmlStr = '<div class="pathRoamingDiv" style="overflow-y: auto;"><el-button-group>' +
            '<el-button type="primary" size="small" class="pathRoamingStart" @click="startFunc">{{controlText}}</el-button>' +
            '<el-button type="primary" size="small" class="pathRoamingSpeedUp" @click="speedUpFunc">加速</el-button>' +
            '<el-button type="primary" size="small" class="pathRoamingSlowDown" @click="slowDownFunc">减速</el-button>' +
            '</el-button-group>' +
            '<el-table :data="tableData" style="width: 100%;text-align: center;" height="550px">' +
            '  <el-table-column prop="index" label="序号" width="50px">' +
            '  </el-table-column>' +
            '  <el-table-column prop="site" label="里程点">' +
            '  </el-table-column>' +
            '  <el-table-column label="操作">' +
            '  <template slot-scope="scope">' +
            '  <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">设为起点</el-button>' +
            '  </template>' +
            '  </el-table-column>' +
            '</el-table>' +
            '</div>';
        let manual_tips_div2 = bt_PlugManager.$notify({
            title: '里程列表',
            dangerouslyUseHTMLString: true,
            customClass: 'manual_tips_div2',
            message: htmlStr,
            type: 'success',
            position: 'bottom-right',
            duration: 0,
            showClose: false
        });
        $(".manual_tips_div2").css({"opacity": "0.8", "max-height": "70%", "width": "360px"});
        $(".el-notification__group").css({"width": "100%", "margin": "5px"});
        bt_pathRoaming_func.data.startPathRoamingTipsDiv = manual_tips_div2;

        let pointList = bt_pathRoaming_func.data.pointList;
        let distance = 0;
        let mileage = bt_pathRoaming_func.data.mileage;
        let pathRoamingPointList = [];
        bt_pathRoaming_func.data.pathRoamingLength = 0;
        pathRoamingPointList.push({index: 1, site: "起点", point: pointList[0], distance: 0});
        for (let i = 1; i < pointList.length; i++) {
            distance = distance + Math.sqrt(Math.pow(pointList[i].x - pointList[i - 1].x, 2) + Math.pow(pointList[i].y - pointList[i - 1].y, 2) + Math.pow(pointList[i].z - pointList[i - 1].z, 2));
        }
        bt_pathRoaming_func.data.lineLength = distance;
        for (let i = 0; i < distance / mileage; i++) {
            if ((i + 1) * mileage < distance) {
                let point = bt_pathRoaming_func.getSiteByDistance((i + 1) * mileage, pointList);
                pathRoamingPointList.push({
                    index: pathRoamingPointList.length + 1,
                    site: (i + 1) * mileage + "米",
                    point: point,
                    distance: (i + 1) * mileage
                });
            }
        }
        let finalDistance = distance > 50 ? distance - 50 : distance - 25;
        pathRoamingPointList.push({
            index: pathRoamingPointList.length + 1,
            site: "终点",
            point: pointList[pointList.length - 1],
            distance: finalDistance
        });

        bt_pathRoaming_func.data.pathRoamingPointList = pathRoamingPointList;

        //添加标注点
        for (let i = 0; i < pathRoamingPointList.length; i++) {
            bt_Plug_Annotation.setAnnotation("pathRoamingStartSign" + i, pathRoamingPointList[i].point.x, pathRoamingPointList[i].point.y, pathRoamingPointList[i].point.z, -8, -16, "<div style='background:url(image/DefaultIcon.png); " +
                "background-position:center left; background-repeat: no-repeat; height:16px; line-height:10px;'>" +
                "<span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" +
                pathRoamingPointList[i].site + "</span></div>", false);
        }

        let startPathRoamingVue = new Vue({
            el: '.pathRoamingDiv',
            data: {
                tableData: pathRoamingPointList,
                controlText: "开始"
            },
            methods: {
                handleEdit: (index, row) => {
                    let pointList = bt_pathRoaming_func.data.pointList;
                    let cameraPoint = bt_pathRoaming_func.getSiteByDistance(parseFloat(row.distance), pointList);
                    let viewPoint = bt_pathRoaming_func.getSiteByDistance(parseFloat(row.distance) + 20, pointList);
                    let height = bt_pathRoaming_func.data.pathRoamingLHeight;
                    let viewHeight = bt_pathRoaming_func.data.pathRoamingLViewHeight;
                    bt_Util.executeScript("Render\\Camera\\SetParam " + cameraPoint.x + " " + cameraPoint.y + " " + (cameraPoint.z + parseFloat(height)) + " "
                        + viewPoint.x + " " + viewPoint.y + " " + (viewPoint.z + parseFloat(height) + parseFloat(viewHeight)) + " 0 0 1 1;");
                    bt_pathRoaming_func.data.pathRoamingLength = row.distance;
                },
                startFunc: () => {
                    if (!bt_pathRoaming_func.data.startSign) {
                        bt_pathRoaming_func.data.startSign = true;
                        startPathRoamingVue.controlText = "暂停";
                        bt_pathRoaming_func.data.preDate = new Date().getTime();
                        //bt_pathRoaming_func.data.pathRoamingLength = bt_pathRoaming_func.data.pathRoamingLength - bt_pathRoaming_func.data.perIncrease*30;
                        bt_PlugManager.addEventListener("Render\\BeforeRender", bt_pathRoaming_func.beforeRender);
                        bt_Util.executeScript("Render\\ForceRedraw;");

                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseWheel", bt_pathRoaming_func.pathRoaming_mouseWheel);
                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.changeAngle_mouseDown);
                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseMove", bt_pathRoaming_func.changeAngle_mouseMove);
                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.changeAngle_mouseUp);
                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseClick", bt_pathRoaming_func.disable_click);
                        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_pathRoaming_func.disable_DBClick);
                    } else {
                        bt_pathRoaming_func.data.startSign = false;
                        startPathRoamingVue.controlText = "开始";
                        bt_PlugManager.removeEventListener("Render\\BeforeRender", bt_pathRoaming_func.beforeRender);

                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseWheel", bt_pathRoaming_func.pathRoaming_mouseWheel);
                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.changeAngle_mouseDown);
                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_pathRoaming_func.changeAngle_mouseMove);
                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.changeAngle_mouseUp);
                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_pathRoaming_func.disable_click);
                        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_pathRoaming_func.disable_DBClick);
                    }
                },
                speedUpFunc: () => {
                    bt_pathRoaming_func.data.pathRoamingRate += 0.01;
                },
                slowDownFunc: () => {
                    if (bt_pathRoaming_func.data.pathRoamingRate > 0.01) {
                        bt_pathRoaming_func.data.pathRoamingRate -= 0.01;
                    }
                }
            },
            mounted: () => {

            }
        });

        bt_pathRoaming_func.data.startPathRoamingVue = startPathRoamingVue;
    },
    deactivateStartPathRoaming: () => {
        bt_PlugManager.removeEventListener("Render\\BeforeRender", bt_pathRoaming_func.beforeRender);

        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseWheel", bt_pathRoaming_func.pathRoaming_mouseWheel);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.changeAngle_mouseDown);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_pathRoaming_func.changeAngle_mouseMove);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.changeAngle_mouseUp);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_pathRoaming_func.disable_click);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_pathRoaming_func.disable_DBClick);
        if (bt_pathRoaming_func.data.startPathRoamingTipsDiv) {
            $(".pathRoamingDiv").remove();
            bt_pathRoaming_func.data.startPathRoamingTipsDiv.close();
        }

        let pathRoamingPointList = bt_pathRoaming_func.data.pathRoamingPointList;
        if (pathRoamingPointList) {
            for (let i = 0; i < pathRoamingPointList.length; i++) {
                bt_Plug_Annotation.removeAnnotation("pathRoamingStartSign" + i);
            }
        }

        bt_pathRoaming_func.data.rotationAngle = 0;
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
    beforeRender: () => {
        let pointList = bt_pathRoaming_func.data.pointList;
        let pathRoamingLength = bt_pathRoaming_func.data.pathRoamingLength;
        if (!pathRoamingLength) pathRoamingLength = 0;
        let preDate = bt_pathRoaming_func.data.preDate;
        if (!preDate) preDate = new Date().getTime() - 33;
        let cameraPoint = bt_pathRoaming_func.getSiteByDistance(pathRoamingLength, pointList);
        let viewPoint = bt_pathRoaming_func.getSiteByDistance(pathRoamingLength + bt_pathRoaming_func.data.viewToCameraDistance, pointList);
        let height = bt_pathRoaming_func.data.pathRoamingLHeight;
        let viewHeight = bt_pathRoaming_func.data.pathRoamingLViewHeight;
        let rate = bt_pathRoaming_func.data.pathRoamingRate;
        let distance = bt_pathRoaming_func.data.lineLength;
        let rotationAngle = bt_pathRoaming_func.data.rotationAngle;
        if (!rotationAngle) rotationAngle = 0;

        if (pathRoamingLength >= distance + 50) {
            bt_pathRoaming_func.data.startPathRoamingVue.controlText = "开始";
            bt_pathRoaming_func.data.startSign = false;
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseWheel", bt_pathRoaming_func.pathRoaming_mouseWheel);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_pathRoaming_func.changeAngle_mouseDown);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseMove", bt_pathRoaming_func.changeAngle_mouseMove);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_pathRoaming_func.changeAngle_mouseUp);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseClick", bt_pathRoaming_func.disable_click);
            bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_pathRoaming_func.disable_DBClick);
            bt_pathRoaming_func.data.pathRoamingLength = 0;
            bt_PlugManager.removeEventListener("Render\\BeforeRender", bt_pathRoaming_func.beforeRender);
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
        bt_pathRoaming_func.data.perIncrease = rate * (currentDate - preDate);
        bt_pathRoaming_func.data.preDate = currentDate;
        bt_pathRoaming_func.data.pathRoamingLength = pathRoamingLength;
        bt_pathRoaming_func.data.startPathRoamingVue.pathRoamingVal = 100 * parseFloat(pathRoamingLength) / parseFloat(distance);
        bt_pathRoaming_func.data.rotationAngle = rotationAngle;
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    pathRoaming_mouseWheel: (e) => {
        let height = bt_pathRoaming_func.data.pathRoamingLHeight;
        height = height - e[0] * 1;
        bt_pathRoaming_func.data.pathRoamingLHeight = height;
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
        bt_pathRoaming_func.data.changeAngle_mouseDown = ep[1] + " " + ep[2];
        return true;
    },
    changeAngle_mouseMove: (e) => {
        let mouseDownSite = bt_pathRoaming_func.data.changeAngle_mouseDown;
        if (!mouseDownSite) return true;
        mouseDownSite = mouseDownSite.split(" ");
        let viewHeight = bt_pathRoaming_func.data.pathRoamingLViewHeight;
        bt_pathRoaming_func.data.pathRoamingLViewHeight = (viewHeight - (parseFloat(e[1]) - parseFloat(mouseDownSite[1])).toFixed(4) * 0.1) * 0.5;

        let changeAngle_mouseMoveX = bt_pathRoaming_func.data.changeAngle_mouseMoveX;
        if (!changeAngle_mouseMoveX) {
            changeAngle_mouseMoveX = e[0];
            bt_pathRoaming_func.data.changeAngle_mouseMoveX = changeAngle_mouseMoveX;
        } else {
            let rotationAngle = bt_pathRoaming_func.data.rotationAngle;
            if (!rotationAngle) rotationAngle = 0;
            let perX = e[0] - changeAngle_mouseMoveX;
            let angle = Math.asin(Math.abs(perX) / parseFloat(bt_pathRoaming_func.data.viewToCameraDistance)) * 0.15;
            if (perX > 0) {
                rotationAngle -= angle;
            } else {
                rotationAngle += angle;
            }
            bt_pathRoaming_func.data.rotationAngle = rotationAngle;
            bt_pathRoaming_func.data.changeAngle_mouseMoveX = e[0];
        }

        return true;
    },
    changeAngle_mouseUp: () => {
        bt_pathRoaming_func.data.changeAngle_mouseDown = null;
        return true;
    },
    importPathRoamingData: () => {
        if (bt_pathRoaming_func.data.pointList) {
            bt_PlugManager.$confirm('此操作将覆盖当前已有的路径点数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let div = document.createElement("div");
                div.innerHTML = '<div><input type="file" id="PathRoamingImportPointFile" style="display: none;"></div>';
                document.getElementById("bt_container").appendChild(div);
                document.getElementById("PathRoamingImportPointFile").click();
                return true;
            }).catch(() => {
                return false;
            });
        } else {
            let div = document.createElement("div");
            div.innerHTML = '<div><input type="file" id="PathRoamingImportPointFile" style="display: none;"></div>';
            document.getElementById("bt_container").appendChild(div);
            document.getElementById("PathRoamingImportPointFile").click();
        }
    },
    exportPathRoamingData: () => {
        let pointList = bt_pathRoaming_func.data.pointList;
        let content = "";
        if (!pointList || pointList.length < 1) {
            bt_PlugManager.$message.error('暂无路径点可供导出，请设置路径点后再次尝试导出。');
            return false;
        }
        for (let i = 0; i < pointList.length; i++) {
            content += JSON.stringify(pointList[i]) + "\r\n";
        }
        let blob = new Blob([content], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "路径点" + new Date().getTime() + ".txt");
        bt_PlugManager.$message.success('导出路径点文件成功。');
    }
};

$(() => {
    $(document).on("change", "#PathRoamingImportPointFile", (data) => {
        let file = data.target.files[0];
        if (!file) return;
        if (file['name'].indexOf(".txt") === -1) {
            bt_PlugManager.$message.error('导入文件格式错误，需为txt格式文件！');
        } else {
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function (e) {
                let text = e.target.result;
                let list = text.split('\r\n');
                if (!list[list.length - 1]) {
                    list.length = list.length - 1;
                }
                let pointList = [];
                for (let i = 0; i < list.length; i++) {
                    pointList.push(JSON.parse(list[i]));
                }
                $("#PathRoamingImportPointFile").val("");
                bt_pathRoaming_func.data.pointList = pointList;
                bt_pathRoaming_func.deactivateCollectPathPoint();
                bt_pathRoaming_func.deactivateStartPathRoaming();
                bt_PlugManager.$message.success('导入路径点文件成功。');
            }
        }
    });

    bt_pathRoaming_func.data.localDataFile = "http://" + window.location.host + "/path.txt";
});
