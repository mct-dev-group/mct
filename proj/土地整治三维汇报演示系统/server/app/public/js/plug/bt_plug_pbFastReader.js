let plug_pbFastReader = new Plug();

plug_pbFastReader.js_name = "plug_pbFastReader";
plug_pbFastReader.plug_name = '查看pb文件';
plug_pbFastReader.plug_icon = "ali-icon-chaxun";


plug_pbFastReader.plug_deactivate = function () {
    bt_pbFastReader.closePb();
};

plug_pbFastReader.plug_commands[0] = new Command('快速查看', 1, false, true);

plug_pbFastReader.command_activate = function (command_id) {
    switch (command_id) {
        case bt_plug_mapMeasurement.plug_commands[0].command_id:
            bt_pbFastReader.fastReader();
            break;
    }
};

let bt_pbFastReader = {
    fastReader: function () {
        $("#console").after('<input type="file" id="loadPbFile" name="file" style="display:none;" onchange="bt_pbFastReader.readPb()">');
        document.getElementById("loadPbFile").click();
    },
    readPb: function () {
        let pbFile = $("#loadPbFile")[0].files[0];

        if (pbFile.name.indexOf(".pb") < 0 && layui) {
            layui.use('layer', function () {
                let layer = layui.layer;
                layer.msg('选择的不是pb文件，请重试。', {icon: 2});
            });
            return false;
        }
        bt_pbFastReader.closePb();

        let url = "";
        if (window.createObjectURL !== undefined) {
            url = window.createObjectURL(pbFile);
        } else if (window.URL !== undefined) {
            url = window.URL.createObjectURL(pbFile);
        } else if (window.webkit.createObjectURL !== undefined) {
            url = window.webkit.createObjectURL(pbFile);
        }

        let pb_url = url.substring(0, url.lastIndexOf("/") + 1);
        let pb_name = url.substring(url.lastIndexOf("/") + 1);
        bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\OpenModelScene mc://" + pb_url + " " + pb_name + " 1;");

        localDB.set("bt_pbFastReader_temp_pb", pb_name);
        bt_Util.executeScript("Render\\ForceRedraw;");
    },
    closePb: function () {
        let pb_name = localDB.get("bt_pbFastReader_temp_pb");
        if (pb_name) bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\CloseModelScene " + pb_name + ";");
        bt_Util.executeScript("Render\\ForceRedraw;");
    }
};

bt_PlugManager.insert_plug(plug_pbFastReader);