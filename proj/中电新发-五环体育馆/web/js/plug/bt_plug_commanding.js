var _css = `<style>
/* 制高点 start */
.poi_commanding{
  background:url(../image/DefaultIcon.png); 
  background-position:center left; 
  background-repeat: no-repeat;
  height:16px;
  width:16px;
  line-height:10px;
  cursor: pointer;
}
.poi_commanding .commanding_pop {
  margin-left:16px; 
  font-size:9px; 
  white-space: nowrap;
  width:280px;
  /* background: #fff; */
	background: rgba(48,89,111, 0.384);
  color: #000; 
  border-radius: 3px;
  /* transform: translate(-116px,-140px); */
  transform: translate(-144px,-140px);
  display: none;
	border: 1px solid #fff;
}

.poi_commanding .commanding_pop:after{
  border: solid transparent;
  content: ' ';
  height: 0;
  left: 45%;
  position: absolute;
  width: 0;
  border-width: 10px;
  /* border-top-color: #fff; */
	border-top-color: rgba(48,89,111, 0.384);
}

.poi_commanding .commanding_pop h3 {
  height:30px;
  line-height:30px;
  /*background: #409EFF;*/
	background: rgba(60,88,109,0.7);
  padding-left: 10px;
  color: #fff;
  font-weight: 700;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.poi_commanding .commanding_pop h3 span.closePop{
  position: absolute;
  right: 16px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  cursor:pointer;
}

.poi_commanding .commanding_pop ul{
  min-height: 100px;    
	color: #fff;
}

.poi_commanding .commanding_pop ul li{
  height:20px;
  line-height:20px;
  padding: 5px;
}

.poi_commanding .commanding_pop ul li .video_btn {
	border-radius: 50px;
	color: #fff;
	background: linear-gradient(#629bca, #123c5d);
	border: 0;
	height: 28px;
	width: 90px;
	line-height: 28px;
	margin-left: 160px;
	margin-top: 15px;
	cursor: pointer;
}

#commandingBox{
  /* background: rgba(255, 255, 255, 0.9); */
  height: 584px;
  position: absolute;
  width: 300px;
  right: 80px;
  bottom: 20px;
  z-index: 10;
  border: 0;
  overflow: visible;
  display: none;
	background: rgba(48,89,111, 0.384);
	border-radius: 5px;
	border: 1px solid white;
}
#commandingBox .el-card__header {
  padding: 10px 20px;
	background: rgba(60,88,109,0.7);
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
}
#commandingBox .clearfix {
  text-align: center;
}
#commandingBox .clearfix>span{
  margin: 0 auto;
  font-size: 15px;
  /*color: #409EFF;*/
	color: white;
}
#commandingBox .el-card__body {
  padding: 0;
  height: calc(100%);
}
#commandingBox div.infoContent{
  height: 544px;
  overflow: auto;
}
#commandingBox div.infoContent ul.list li {
  height: 70px;
  display: flex;
  /*background:rgba(222, 222, 222,0.5);*/
  cursor: pointer;
  margin-bottom: 1px;
  color: #FFF;
	border-bottom: 1px solid white;
	/*background: linear-gradient(#98b9d3, #294e6d);*/
}
#commandingBox div.infoContent ul.list li:hover {
  background:rgba(60,88,109,0.7);
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
#commandingBox div.infoContent::-webkit-scrollbar{
  width: 4px;
  height: 4px;
  background-color: #D2E6DD;
}

/*定义滚动条轨道 内阴影+圆角*/
#commandingBox div.infoContent::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
  border-radius: 4px;
  background-color: #2B4D5E;
}

/*定义滑块 内阴影+圆角*/
#commandingBox div.infoContent::-webkit-scrollbar-thumb{
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,.3);
  background-color: #D2E6DD;
}
/* 制高点 end */
</style>`

$('head').append(_css)
var _html = `
<el-card id="commandingBox">
    <div slot="header" class="clearfix">
      <span>{{title}}</span>
    </div>
    <div class="infoContent">
      <template>
          <ul class="list">
              <li v-for="(item, index) in commandingList" :key="index" @click="clickRow(item)">
                <div style ="padding: 12px;">
                  <div>{{index+1}}、{{item.name}}</div>
                  <div style="padding-left: 10px; margin-top: 5px;">{{item.address}}</div>
                </div>
              </li>
          </ul>
      </template>
    </div>
</el-card>`
$('body').append(_html)
// 制高点
let bt_plug_commanding = new Plug()

// 插件信息
bt_plug_commanding.js_name = 'bt_plug_commanding'
bt_plug_commanding.plug_name = '制高点'
// bt_plug_commanding.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_commanding.plug_commandOnly = true
bt_plug_commanding.plug_isOnMobile = false

// 插件功能
bt_plug_commanding.plug_commands = []
// bt_plug_commanding.plug_commands[0] = new Command("制高点", 0, false, false)

bt_plug_commanding.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      break
  
    default:
      break
  }
}

bt_plug_commanding.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command deactivated: ' + commandID)
      break
  
    default:
      break
  }
}

bt_plug_commanding.plug_activate = () => {
  console.log('plug activated')
	$('#commandingBox').addClass('animated bounceInRight').show()
	commandingHandle.addPoi()
}

bt_plug_commanding.plug_deactivate = () => {
  console.log('plug deactivated')
	$('#commandingBox').removeClass('animated bounceInRight').hide()
	commanding_vm.commandingList = []
	for (var poi of poi_commandingArr) {
		bt_Plug_Annotation.removeAnnotation(poi.id);
	}
}

bt_PlugManager.insert_plug(bt_plug_commanding);

var poi_commandingArr =[]
var commanding_vm = new Vue({
  el: '#commandingBox',
  data: {
    title: '制高点',
    commandingList: [],
  },
  methods: {
    clickRow:function(item){
      var ll = LL2Geo(item.longitude,item.latitude)
      var height = item.height || 60;
			// var cameraParam = bt_Util.getCameraParam();
			// var {x, y, z} = cameraParam.cameraPt;
			// bt_Util.executeScript(`Render\\CameraControl\\FlyTo2 ${ll.x} ${ll.y} ${height};`);
      bt_Util.executeScript(`Render\\CameraControl\\FlyTo ${ll.x} ${ll.y} ${height+ 10} ${ll.x} ${ll.y} ${height};`);
			$('.'+item.id).click();
    }
  }
})
var commandingHandle = {
  addPoi: function () {
    // var url= "http://localhost:8014/sqlservice/v1/executeSql?sql=SELECT * FROM as_local_commanding_height "
    var url= "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT h.*,a.id AS device_id,a.guid AS device_guid,a.name AS device_name,a.place AS device_place,a.description AS device_description,a.space_z as height FROM as_local_commanding_height h LEFT JOIN ape a on h.device_id = a.id";
    $.ajax({
      url: url,
      type:'GET',
      success: function(data){
        if (data.length > 0) {
          poi_commandingArr =data
          commanding_vm.commandingList = data
          for (var i =0; i<data.length; i++) {
            // data[i].longitude =114.12798298117886
            // data[i].latitude = 30.63994477868518
            var ll = LL2Geo(data[i].longitude,data[i].latitude)
            // var property = JSON.stringify(data[i])
						let video_info = {
							id: data[i].device_id,
							guid: data[i].device_guid,
							name: data[i].device_name,
							place: data[i].device_place,
							description: data[i].device_description,
						}
						
            var html= `<div class='poi_commanding ${data[i].id}'>
                        <div class='commanding_pop'>
                          <h3>制高点 ${data[i].name}<span class="closePop">X<span></h3>
                          <ul>
                            <li>设备：${data[i].device_name}</li>
                            
                            <li>地址：${data[i].address}</li>
														<li><button class="video_btn" data-videoinfo=${JSON.stringify(video_info)}>查看监控</button></li>
                          </ul>
                        </div>
                      </div>`
            bt_Plug_Annotation.setAnnotation(data[i].id, ll.x, ll.y, data[i].height ? data[i].height : 70, -8, -16, html, false);
          }
        }

        $(".poi_commanding").click(function(){
          $(".commanding_pop").hide()
          $(this).children().show()
					$('.bt_ui_element').css({'z-index':10})
					$(this).parent().parent().css({'z-index':11});
        })
        $(".closePop").click(function(e){
          $(this).parent().parent().hide()
          e.stopPropagation();
        })
				
				$(".poi_commanding .commanding_pop .video_btn").click(function(){
					const option = JSON.parse($(this).attr('data-videoinfo'))
					initMonitoringContainer.openVideoModal(option)
				});
      }
    })
  }
}
