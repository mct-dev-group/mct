let plug_manualCollect = new Plug();
plug_manualCollect.js_name = "plug_manualCollect";
plug_manualCollect.plug_name = "人工边界提取";


plug_manualCollect.plug_commands[0] = new Command('导出边界点信息', 1, false, true);


plug_manualCollect.command_activate = function (commandID) {
    switch (commandID) {
        case plug_manualCollect.plug_commands[0].command_id:
            bt_manualCollect_func.exportBorderData();
            break;
    }
};

plug_manualCollect.command_deactivate = function (commandID) {
    switch (commandID) {
        case plug_manualCollect.plug_commands[0].command_id:
            break;
    }
};

//激活人工边界提取功能
plug_manualCollect.plug_activate = function () {
    bt_manualCollect_func.manualCollect();
    let cameraParam = bt_Util.executeScript("Render\\Camera\\GetParam;");
    cameraParam = cameraParam[0].split(" ");
    bt_Util.executeScript("Render\\Camera\\SetParam "+cameraParam[0]+" "+cameraParam[1]+" "+cameraParam[2]+" "+cameraParam[3]+" "+cameraParam[4]+" "+cameraParam[5]+" "+cameraParam[6]+" "+cameraParam[7]+" "+cameraParam[8]+" 2;");
};

//注销人工边界提取功能
plug_manualCollect.plug_deactivate = function () {
    bt_manualCollect_func.manualCollect_cancel();
    let cameraParam = bt_Util.executeScript("Render\\Camera\\GetParam;");
    cameraParam = cameraParam[0].split(" ");
    bt_Util.executeScript("Render\\Camera\\SetParam "+cameraParam[0]+" "+cameraParam[1]+" "+cameraParam[2]+" "+cameraParam[3]+" "+cameraParam[4]+" "+cameraParam[5]+" "+cameraParam[6]+" "+cameraParam[7]+" "+cameraParam[8]+" 1;");
};

bt_PlugManager.insert_plug(plug_manualCollect);

let bt_manualCollect_func = {
    manualCollect: function () {
        //设置坐标点保存集合
        localDB.set("manualCollectList", {
            list: [],
            line_id: "manualCollectLine_id" + new Date().getTime(),
            anno_list: []
        });
        localDB.set("totalManualCollectList", []);
        //激活鼠标功能
        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_manualCollect_func.mouseDown);
        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_manualCollect_func.mouseUp);
        bt_PlugManager.addEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_manualCollect_func.mouseDbClick);
        //设置组合键，Ctrl+Z 撤销最后一个点，Ctrl+D 重新取点
        $(document).unbind("keydown").keydown(function (e) {
            let keyCode = e.keyCode || e.which || e.charCode;
            let ctrlKey = e.ctrlKey || e.metaKey;
            if (ctrlKey && keyCode === 90) {
                //Ctrl + Z
                let manualCollectList = localDB.get("manualCollectList");
                if (manualCollectList.list.length > 0) {   //此时撤销的点为当前正在编辑的边界线中的点
                    bt_Plug_Annotation.removeAnnotation(manualCollectList.anno_list[manualCollectList.anno_list.length - 1]);
                    manualCollectList.anno_list.pop();
                    manualCollectList.list.pop();
                    if (manualCollectList.list.length > 0) bt_manualCollect_func.drawBorderLine(manualCollectList);
                } else if (manualCollectList.list.length === 0) { //此时撤销的点为上一个已完成的边界线的最后一个点
                    let totalManualCollectList = localDB.get("totalManualCollectList");
                    if (!totalManualCollectList) totalManualCollectList = [];
                    if (totalManualCollectList.length > 0) {
                        manualCollectList = totalManualCollectList[totalManualCollectList.length - 1];
                        totalManualCollectList.pop();
                        bt_Plug_Annotation.removeAnnotation(manualCollectList.anno_list[manualCollectList.anno_list.length - 1]);
                        manualCollectList.anno_list.pop();
                        manualCollectList.list.pop();
                        if (manualCollectList.list.length > 0) bt_manualCollect_func.drawBorderLine(manualCollectList);
                    }
                }
                return false;
            } else if (ctrlKey && keyCode === 68) {
                //Ctrl + D  删除所有边界线和标注点
                let manualCollectList = localDB.get("manualCollectList");
                let totalManualCollectList = localDB.get("totalManualCollectList");
                if (!totalManualCollectList) totalManualCollectList = [];
                if (manualCollectList) {
                    totalManualCollectList.push(manualCollectList);
                    for (let i = 0; i < totalManualCollectList.length; i++) {
                        for (let j = 0; j < totalManualCollectList[i].anno_list.length; j++) {
                            bt_Plug_Annotation.removeAnnotation(totalManualCollectList[i].anno_list[j]);
                        }
                        bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj " + totalManualCollectList[i].line_id + " 8;");
                    }
                    localDB.set("manualCollectList", {
                        list: [],
                        line_id: "manualCollectLine_id" + new Date().getTime(),
                        anno_list: []
                    });
                    bt_Util.executeScript("Render\\ForceRedraw;");
                }
                localDB.set("totalManualCollectList", []);
                return false;
            }
        });
        //弹出组合键提示框
        let manual_tips_div = bt_PlugManager.$notify({
            title: '组合键提示',
            dangerouslyUseHTMLString: true,
            customClass: 'manual_tips_div',
            message: 'Ctrl + Z：删除最后一个边界点<br/>Ctrl + D：删除所有边界点',
            type: 'success',
            duration: 0,
            showClose: false
        });
        $(".manual_tips_div").css("opacity", "0.8");
        localDB.set("manual_tips_div", manual_tips_div);

    },
    manualCollect_cancel: function () {
        //取消鼠标事件，删除线、标注点，关闭组合键提示框。
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonDown", bt_manualCollect_func.mouseDown);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseButtonUp", bt_manualCollect_func.mouseUp);
        bt_PlugManager.removeEventListener("GUIEvent\\KM\\OnMouseDbClick", bt_manualCollect_func.mouseDbClick);

        let manualCollectList = localDB.get("manualCollectList");
        let totalManualCollectList = localDB.get("totalManualCollectList");
        if (!totalManualCollectList) totalManualCollectList = [];
        if (manualCollectList) {
            totalManualCollectList.push(manualCollectList);
            for (let i = 0; i < totalManualCollectList.length; i++) {
                for (let j = 0; j < totalManualCollectList[i].anno_list.length; j++) {
                    bt_Plug_Annotation.removeAnnotation(totalManualCollectList[i].anno_list[j]);
                }
                bt_Util.executeScript("Render\\RenderDataContex\\DynamicFrame\\DelRenderObj " + totalManualCollectList[i].line_id + " 8;");
            }
            localDB.set("manualCollectList", {
                list: [],
                line_id: "manualCollectLine_id" + new Date().getTime(),
                anno_list: []
            });
            bt_Util.executeScript("Render\\ForceRedraw;");
        }
        localDB.set("totalManualCollectList", []);
        //关闭组合键提示框
        let manual_tips_div = localDB.get("manual_tips_div");
        if (manual_tips_div) manual_tips_div.close();
    },
    mouseDown: function (ep) {
        //点击记录按下的坐标点
        if (ep[0] !== 0) return false;
        let click_point = {x: ep[1], y: ep[2]};
        localDB.set("manualCollectMoveSite", click_point);
    },
    mouseUp: function (ep) {
        //鼠标弹起后判断鼠标是否移动，若未移动则绘制点、线
        if (ep[0] !== 0) return false;
        let mouseDown_move_site = localDB.get("manualCollectMoveSite");
        if (Math.abs(mouseDown_move_site.x - ep[1]) > 3 || Math.abs(mouseDown_move_site.y - ep[2]) > 3) return false;
        let manualCollect_last_mouseUp_point = localDB.get("manualCollect_last_mouseUp_point");
        localDB.set("manualCollect_last_mouseUp_point", {x: ep[1], y: ep[2], time: new Date().getTime()});
        if (manualCollect_last_mouseUp_point) {
            if (Math.abs(manualCollect_last_mouseUp_point.x - ep[1]) < 3
                && Math.abs(manualCollect_last_mouseUp_point.y - ep[2]) < 3
                && Math.abs(manualCollect_last_mouseUp_point.time - new Date().getTime()) < 300) {
                return false;
            }
        }
        let click_point = bt_Util.executeScript("Render\\CameraControl\\QueryPointPosInScreen " + ep[1] + " " + ep[2] + ";");
        click_point = click_point[0].split(" ");
        let manualCollectList = localDB.get("manualCollectList");
        if (!manualCollectList) {
            manualCollectList = {list: [], line_id: "manualCollectLine_id" + new Date().getTime(), anno_list: []};
        }
        manualCollectList.list.push({
            x: click_point[1],
            y: click_point[2],
            z: click_point[3]
        });
        bt_manualCollect_func.drawBorderLine(manualCollectList);
    },
    mouseDbClick: function (ep) {
        //鼠标左键双击时完成该条边界线绘制
        if (ep[0] !== 0) return false;
        let totalManualCollectList = localDB.get("totalManualCollectList");
        if (!totalManualCollectList) totalManualCollectList = [];
        let manualCollectList = localDB.get("manualCollectList");
        if (manualCollectList) {
            bt_manualCollect_func.drawBorderLine(manualCollectList, true);
            totalManualCollectList.push(manualCollectList);
            localDB.set("manualCollectList", {
                list: [],
                line_id: "manualCollectLine_id" + new Date().getTime(),
                anno_list: []
            });
        }
        //保存所有边界线的集合
        localDB.set("totalManualCollectList", totalManualCollectList);
    },
    /**
     * 绘制边界线段
     * @param manualCollectList  ---保存边界点的集合
     * @param isRect    ---所有边界点是否将绘制成封闭图形，若为true，则将最后一个点与第一个点相连
     */
    drawBorderLine: function (manualCollectList, isRect) {
        //根据数组数据绘制标注点和线段
        let index_count = (manualCollectList.list.length - 1) * 2;
        if (isRect) index_count = manualCollectList.list.length * 2;
        let addRenderObjScript = "Render\\RenderDataContex\\DynamicFrame\\AddRenderObj " + manualCollectList.line_id + " 4 1 " +
            manualCollectList.list[0].x + " " + manualCollectList.list[0].y + " " + manualCollectList.list[0].z + " 8 " + manualCollectList.list.length + " " + index_count + " ";
        let index_list_str = "";
        for (let i = 0; i < manualCollectList.list.length; i++) {
            addRenderObjScript += (parseFloat(manualCollectList.list[i].x) - parseFloat(manualCollectList.list[0].x)) + " "
                + (parseFloat(manualCollectList.list[i].y) - parseFloat(manualCollectList.list[0].y)) + " "
                + (parseFloat(manualCollectList.list[i].z) - parseFloat(manualCollectList.list[0].z)) + " 255 255 0 255 ";
            if (i < manualCollectList.list.length - 1) {
                index_list_str += i + " " + (i + 1) + " ";
            }
            bt_Plug_Annotation.setAnnotation(manualCollectList.line_id + "_anno_" + i, manualCollectList.list[i].x, manualCollectList.list[i].y, manualCollectList.list[i].z, -8, -16,
                "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat; height:16px;line-height:10px;'><span style='margin-left:16px; font-size:9px; white-space: nowrap;'>" + "边界点" + (i + 1) + "</span></div>", false);
            if (manualCollectList.anno_list.indexOf(manualCollectList.line_id + "_anno_" + i) < 0) manualCollectList.anno_list.push(manualCollectList.line_id + "_anno_" + i);
        }
        if (isRect) {
            addRenderObjScript += index_list_str + (manualCollectList.list.length - 1) + " 0 0;";
        } else {
            addRenderObjScript += index_list_str + "0;";
        }
        bt_Util.executeScript(addRenderObjScript);
        localDB.set("manualCollectList", manualCollectList);
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    exportBorderData: function () {
        let totalManualCollectList = localDB.get("totalManualCollectList");
        let manualCollectList = localDB.get("manualCollectList");
        if(totalManualCollectList != null && totalManualCollectList.indexOf(manualCollectList) < 0)totalManualCollectList.push(manualCollectList);
        if ((totalManualCollectList && totalManualCollectList.length > 0)) {
            //弹出输入框输入instance名称
            /*bt_PlugManager.$prompt('请输入instance名称', '输入', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.*[^\s]+.*$/,
                inputErrorMessage: 'instance名称不能为空'
            }).then(({value}) => {

            });*/
            let borderStr = "#export border\r\n";
            let point_size = 0;
            if ((totalManualCollectList && totalManualCollectList.length > 0)) {
                for (let i = 0; i < totalManualCollectList.length; i++) {
                    let line_index = "";
                    if (totalManualCollectList[i].list.length > 0) {
                        for (let j = 0; j < totalManualCollectList[i].list.length; j++) {
                            borderStr += "v " + totalManualCollectList[i].list[j].x + " "
                                + totalManualCollectList[i].list[j].z + " -" + totalManualCollectList[i].list[j].y + "\r\n";
                            line_index += (point_size + j + 1) + " ";
                        }
                        borderStr += "g line" + i + "\r\nl " + line_index + (point_size + 1) + "\r\n\r\n";
                        point_size += totalManualCollectList[i].list.length;
                    }
                }
            }

            bt_manualCollect_func.download("export" + new Date().getTime() + '.obj', borderStr);
        } else {
            bt_PlugManager.$message({
                message: '暂未采集到边界点，请采集边界点后再导出数据。',
                type: 'warning'
            });
        }
    },
    /**
     * 生成txt文件
     *
     * @param filename
     * @param text
     */
    download: function (filename, text) {
        let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    }
};