let remote_url = "http://" + document.location.hostname + ":8086";
console.log(remote_url);
let img_alpha = 0.5;
let plug_showSubtleImage = new Plug();

plug_showSubtleImage.js_name = 'plug_showSubtleImage';
plug_showSubtleImage.plug_name = '显示区划线';
plug_showSubtleImage.plug_icon = 'ali-icon-guizeyinqing';


plug_showSubtleImage.plug_activate = function () {

};

plug_showSubtleImage.plug_deactivate = function () {

};

plug_showSubtleImage.plug_commands = [];
plug_showSubtleImage.plug_commands[0] = new Command('显示区划线', 1, false, true);
plug_showSubtleImage.plug_commands[1] = new Command('关闭区划线', 2, false, true);

plug_showSubtleImage.command_activate = function (command_id) {
    switch (command_id) {
        case plug_showSubtleImage.plug_commands[0].command_id:
            bt_showSubtleImage.active();
            break;
        case plug_showSubtleImage.plug_commands[1].command_id:
            bt_showSubtleImage.deactivate();
            break;
    }
};

let bt_showSubtleImage = {
    active: function () {
        bt_PlugManager.addEventListener("Render\\BeforeRender", bt_showSubtleImage.beforeRender);
        localDB.set("isResponded", true);
        bt_showSubtleImage.drawSplicedImage();
    },
    deactivate: function () {
        localDB.set("isResponded", false);
        bt_PlugManager.removeEventListener("Render\\BeforeRender", bt_showSubtleImage.beforeRender);
        bt_Util.SetGlobalOrthoTexture1(0, 1, 1, 0, 1024, 1024, "");
        bt_Util.executeScript("Render\\ForceRedraw;");
        localDB.set("img_param", "");
    },
    beforeRender: function () {
        bt_showSubtleImage.drawSplicedImage();
    },
    drawSplicedImage: function () {
        let cameraParam = bt_Util.executeScript("Render\\Camera\\GetParam;");
        cameraParam = cameraParam[0].split(" ");

        let sceneWidth = cameraParam[10];

        let side = Math.sqrt(Math.pow(cameraParam[0] - cameraParam[3], 2) + Math.pow(cameraParam[1] - cameraParam[4], 2) + Math.pow(cameraParam[2] - cameraParam[5], 2)) / sceneWidth;

        let x = parseFloat(cameraParam[3]);
        let y = parseFloat(cameraParam[4]);

        if (localDB.get("img_param") === x + "_" + y + "_" + cameraParam[5] + "_" + side * 4) return false;
        let url = remote_url + "/madcat/anren/v1/image/splicedImage?x=" + x + "&y=" + y + "&z=" + cameraParam[5] + "&side=" + side * 4;
        localDB.set("img_param", x + "_" + y + "_" + cameraParam[5] + "_" + side * 4);
        if (localDB.get("isResponded") === true) {
            localDB.set("isResponded", false);
            $.ajax({
                data: "",
                type: "GET",
                scriptCharset: "utf-8",
                url: url,
                error: function (data) {
                    console.log("error accured!");
                },
                success: function (result, status, xhr) {
                    let ltPoint = result.data[0].split(" ");
                    ltPoint[0] = parseFloat(ltPoint[0]);
                    ltPoint[1] = parseFloat(ltPoint[1]);
                    let rbPoint = result.data[1].split(" ");
                    rbPoint[0] = parseFloat(rbPoint[0]);
                    rbPoint[1] = parseFloat(rbPoint[1]);

                    let image = new Image();
                    image.src = result.data[2];
                    image.onload = function () {
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext("2d");
                        canvas.width = image.width;
                        canvas.height = image.height;
                        //ctx.fillRect(0, 0, 1024, 1024);
                        ctx.drawImage(image, 0, 0);
                        let ImageData = ctx.getImageData(0, 0, image.width, image.height);
                        for (let i = 3; i < ImageData.data.length; i=i+4) {
                            ImageData.data[i] = ImageData.data[i]*img_alpha;
                        }
                        ctx.putImageData(ImageData,0,0);
                        bt_Util.SetGlobalOrthoTexture1(ltPoint[0], ltPoint[1], rbPoint[0], rbPoint[1], image.width, image.height, ImageData.data);
                        bt_Util.executeScript("Render\\ForceRedraw;");
                    };
                    localDB.set("isResponded", true);
                }
            });
        }
    }
};

bt_PlugManager.insert_plug(plug_showSubtleImage);

