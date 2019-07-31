var bt_Plug_Compass = {
	isActive: true,
	img: 1,
	canvas: 1,

	on_Render_FinalBlend: function(event_param) {
		if (bt_Plug_Compass.img.width <= 0 || bt_Plug_Compass.img.height <= 0) return;
		bt_Plug_Compass.canvas.width = bt_Plug_Compass.img.width;
		bt_Plug_Compass.canvas.height = bt_Plug_Compass.img.height;
		var bt_Plug_Compass_ctx = bt_Plug_Compass.canvas.getContext("2d");

		var cam_param = bt_Util.getCameraParam();
		var dx = cam_param.lookatPt.x - cam_param.cameraPt.x;
		var dy = cam_param.lookatPt.y - cam_param.cameraPt.y;
		var dz = cam_param.lookatPt.z - cam_param.cameraPt.z;
		if (dx == 0 && dy == 0) {
			dx = cam_param.upVec.x;
			dy = cam_param.upVec.y;
			if (dz > 0) {
				dy = -dy;
				dx = -dx;
		   }
		}
		var rot = -Math.PI / 2 + Math.atan2(dy, dx);

		bt_Plug_Compass.canvas.style.left = (document.getElementById("canvasgl").width - bt_Plug_Compass.img.width) + "px";
		bt_Plug_Compass.canvas.style.top = 0 + "px";
		bt_Plug_Compass_ctx.save();
		bt_Plug_Compass_ctx.translate(bt_Plug_Compass.img.width / 2, bt_Plug_Compass.img.height / 2);
		bt_Plug_Compass_ctx.rotate(rot);
		bt_Plug_Compass_ctx.drawImage(bt_Plug_Compass.img, -bt_Plug_Compass.img.width / 2, -bt_Plug_Compass.img.height / 2);
		bt_Plug_Compass_ctx.restore();
	}
}

bt_Plug_Compass.canvas = document.createElement('canvas');
bt_Plug_Compass.canvas.style.position = "absolute";
bt_Plug_Compass.canvas.style.zIndex = 100;
document.getElementById("bt_container").appendChild(bt_Plug_Compass.canvas);

bt_Plug_Compass.img = new Image();
bt_Plug_Compass.img.src = "image/compass.png";

bt_PlugManager.plugins.push(bt_Plug_Compass);
bt_PlugManager.addEventListener("Render\\FinalBlend", bt_Plug_Compass.on_Render_FinalBlend);