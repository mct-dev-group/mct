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
  background: #fff;
  color: #000; 
  border-radius: 3px;
  /* transform: translate(-116px,-140px); */
  transform: translate(-144px,-140px);
  display: none;
}

.poi_commanding .commanding_pop:after{
  border: solid transparent;
  content: ' ';
  height: 0;
  left: 45%;
  position: absolute;
  width: 0;
  border-width: 10px;
  border-top-color: #fff;
}

.poi_commanding .commanding_pop h3 {
  height:30px;
  line-height:30px;
  background: #409EFF;
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
}

.poi_commanding .commanding_pop ul li{
  height:20px;
  line-height:20px;
  padding: 5px;
}

#commandingBox{
  background: rgba(255, 255, 255, 0.9);
  height: 584px;
  position: absolute;
  width: 300px;
  right: 20px;
  bottom: 20px;
  z-index: 10;
  border: 0;
  overflow: visible;
  display: none;
}
#commandingBox .el-card__header {
  padding: 10px 20px;
}
#commandingBox .clearfix {
  text-align: center;
}
#commandingBox .clearfix>span{
  margin: 0 auto;
  font-size: 15px;
  color: #409EFF;
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
  background:rgba(222, 222, 222,0.5);
  cursor: pointer;
  margin-bottom: 1px;
  color: #409EFF;
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
bt_plug_commanding.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_commanding.plug_commandOnly = true
bt_plug_commanding.plug_isOnMobile = false

// 插件功能
bt_plug_commanding.plug_commands = []
bt_plug_commanding.plug_commands[0] = new Command("制高点", 0, false, false)

bt_plug_commanding.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      $('#commandingBox').addClass('animated bounceInRight').show()
      commandingHandle.addPoi()
      break
  
    default:
      break
  }
}

bt_plug_commanding.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command deactivated: ' + commandID)
      $('#commandingBox').removeClass('animated bounceInRight').hide()
      commanding_vm.commandingList = []
      for (var poi of poi_commandingArr) {
        bt_Plug_Annotation.removeAnnotation(poi.id);
      }
      break
  
    default:
      break
  }
}

bt_plug_commanding.plug_activate = () => {
  console.log('plug activated')
}

bt_plug_commanding.plug_deactivate = () => {
  console.log('plug deactivated')
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
      var height = item.height || 60
      bt_Util.executeScript(`Render\\CameraControl\\FlyTo2 ${ll.x} ${ll.y} ${height};`);  
    }
  }
})
var commandingHandle = {
  addPoi: function () {
    // var url= "http://localhost:8014/sqlservice/v1/executeSql?sql=SELECT * FROM as_local_commanding_height "
    var url= "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT h.*,a.name AS device_name,a.space_z as height FROM as_local_commanding_height h LEFT JOIN ape a on h.device_id = a.id"
    console.log(url)
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
            var html = ``

            var html= `<div class='poi_commanding'>
                        <div class='commanding_pop'>
                          <h3>制高点 ${data[i].name}<span class="closePop">X<span></h3>
                          <ul>
                            <li>设备：${data[i].device_name}</li>
                            
                            <li>地址：${data[i].address}</li>
                          </ul>
                        </div>
                      </div>`
            bt_Plug_Annotation.setAnnotation(data[i].id, ll.x, ll.y, 70, -8, -16, html, false);
          }
        }

        $(".poi_commanding").click(function(){
          $(".commanding_pop").hide()
          $(this).children().show()
        })
        $(".closePop").click(function(e){
          $(this).parent().parent().hide()
          e.stopPropagation();
        })
      }
    })
  }
}
