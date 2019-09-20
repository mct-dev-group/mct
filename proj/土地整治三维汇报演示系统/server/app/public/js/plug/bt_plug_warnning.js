var _css = `<style>
#warnningBox{
  height: 315px;
  position: absolute;
  width: 400px;
  right: 190px;
  bottom: 20px;
  z-index: 10;
  border: 0;
  display: block;
  overflow: visible;
  border: 1px solid #fff;
}
#warnningBox .tContainer-content{
  height: 100%;
}
#warnningBox .el-tabs {
  height: 100%;
}
#warnningBox .el-tabs .el-tabs__header {
  margin: 0;
}
#warnningBox .el-tabs__header .el-tabs__nav {
  border: 0;
  border-radius: 0;
  width: 100%;
}
#warnningBox .el-tabs__header .el-tabs__nav>div.el-tabs__item.is-top {
  width: 200px;
  text-align: center;
}
#warnningBox .el-tabs .el-tabs__content {
  height: calc(100% - 100px);
  overflow-y: auto;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
#warnningBox .el-tabs .el-tabs__content::-webkit-scrollbar{
  width: 4px;
  height: 4px;
  background-color: #D2E6DD;
}

/*定义滚动条轨道 内阴影+圆角*/
#warnningBox .el-tabs .el-tabs__content::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);
  border-radius: 4px;
  background-color: #2B4D5E;
}

/*定义滑块 内阴影+圆角*/
#warnningBox .el-tabs .el-tabs__content::-webkit-scrollbar-thumb{
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,.3);
  background-color: #D2E6DD;
}
#warnningBox div.infoContent ul.list li {
  height: 40px;
  display: flex;
  background:rgba(222, 222, 222,0.5);
  cursor: pointer;
  color: #fff;
  border-radius: 20px;
  margin: 10px;
  background: linear-gradient(#57cdfb, #3681f1);
}
#warnningBox div.infoContent ul.list li:nth-of-type(even){
  background: linear-gradient(#98b9d3, #294e6d);
}
#warnningBox div.infoContent ul.list li:hover {
  background:rgba(60,88,109,0.7);
}
#warnningBox div.infoContent ul.list li>div{
  line-height: 20px;
  padding-left: 5px;
  line-height: 40px;
  margin: 0 10px;
}
#warnningBox div.infoContent ul.list li>div>span{
  display: inline-block;
  overflow: hidden;
  padding-left: 2px;
}


#infoBox{
  /* position: relative; */
  position: absolute;
  width: 500px;
  height: 400px;
  background: rgba(255, 255, 255, 0.9);
  color: #409EFF;
  margin: 0 auto;
  /* top: 10%; */
  display: none;
  z-index: 10;
  bottom: 20px;
  left: 190px;
}

#infoBox .el-card__header {
  padding: 10px 20px;
}
#infoBox .clearfix {
  text-align: center;
}
#infoBox .clearfix>span{
  margin: 0 auto;
  font-size: 15px;
  color: #409EFF;
  display: inline-block;
}
#infoBox .el-card__body {
  padding: 0;
  padding-top: 10px;
  height: calc(100% - 23px);
}
#infoBox .el-card__body .content span.el-tag{
  width: 60px;
  margin: 1px;
  margin-right: 10px;
}
</style>`
var _html = `<!-- 预警布告栏 start -->
  <div class="tContainer" id="warnningBox">
    <div class="tContainer-header">        
        <div class="tContainer-header-icon bgImage-warning"></div>
        <div class="tContainer-header-title">{{title}}</div>
        <div class="tContainer-header-btn"></div>
    </div>
    <div class="tContainer-content">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="人脸" name="face">
          <div class="infoContent face">
            <template>
              <ul class="list">
                <li v-for="(item, index) in faceList" :key="faceList.id" @click="clickRow(item,'face')">
                  <div>
                    <span style="display: inline-block;width: 190px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">位置：{{item.name}}</span>
                    <span>人脸信息</span>
                    <span>{{item.face_appear_time}}</span>
                  </div>
                </li>
              </ul>
            </template>
          </div>
        </el-tab-pane>
        <el-tab-pane label="车辆" name="vehicle">
          <div class="infoContent vehicle">
            <template>
              <ul class="list">
                <li v-for="(item, index) in vehicleList" :key="vehicleList.id" @click="clickRow(item),'vehicle'">
                  <div>
                    <span style="display: inline-block;width: 190px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">位置：{{item.name}}</span>
                    <span>卡口信息</span>
                    <span>{{item.appear_time}}</span>
                  </div>
                </li>
              </ul>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
<el-card id="infoBox" style="animation-duration: 500ms">
    <div slot="header" class="clearfix">
      <span style="width: 445px;">{{title}} - {{deviceName}}</span><span style="cursor: pointer;" @click="close">X</span>
    </div>
    <article v-if="info!=null">
        <div class="content" v-if="type == 'face'">
            <img :src="info.subimage_list[0]" style="width: 500px;height: 150px;">
            <div style="display: flex; margin-top: 10px;">
                <img :src="info.subimage_list[1]" style="width: 140px;height: 140px;">
                <img :src="info.target_image_uri" style="width: 140px;height: 140px;">
                <div>
                    <el-tag size="mini">年龄范围</el-tag>{{info.age_lower_limit}}~{{info.age_up_limit}}岁
                    <br>
                    <el-tag size="mini">出现时间</el-tag>{{info.face_appear_time}}
                    <br>
                    <el-tag size="mini">消失时间</el-tag>{{info.face_disappear_time}}
                    <br>
                    <el-tag size="mini">性别</el-tag>{{info.gender_code | genderFilter}}
                    <br>
                    <el-tag size="mini">肤色</el-tag>{{info.skin_color}}
                    <br>
                    <el-tag size="mini">相似度</el-tag>{{info.similaritydegree}}%
                    <br>
                </div>
            </div>
        </div>
        <div class="content" v-else>
            <img :src="info.subimage_list[0]" style="width: 500px;height: 150px;">
            <div style="display: flex; margin-top: 10px;">
                <img :src="info.subimage_list[1]" style="width: 140px;height: 140px;">
                <img :src="info.target_image_uri" style="width: 140px;height: 140px;">
                <div>
                    <el-tag size="mini">出现时间</el-tag>{{info.appear_time}}
                    <br>
                    <el-tag size="mini">消失时间</el-tag>{{info.disappear_time}}
                    <br>
                    <el-tag size="mini">车牌号</el-tag>{{info.plate_no}}
                    <br>
                    <el-tag size="mini">车牌类型</el-tag>{{info.plate_class}}
                    <br>
                    <el-tag size="mini">车牌颜色</el-tag>{{info.plate_color|plate_colorFilter}}
                    <br>
                    <el-tag size="mini">车辆类型</el-tag>{{info.vehicle_class}}
                    <br>
                    <el-tag size="mini">车身颜色</el-tag>{{info.vehicle_color|plate_colorFilter}}
                    <br>
                    <el-tag size="mini">相似度</el-tag>{{info.similaritydegree}}%
                    <br>
                </div>
            </div>
        </div>
    </article>
</el-card>
<!-- 预警布告栏 end -->`
$('head').append(_css)
$('body').append(_html)

// 预警信息
let bt_plug_warnning = new Plug()

// 插件信息
bt_plug_warnning.js_name = 'bt_plug_warnning'
bt_plug_warnning.plug_name = '视频预警栏目'
bt_plug_warnning.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_warnning.plug_commandOnly = true
bt_plug_warnning.plug_isOnMobile = false

// 插件功能
bt_plug_warnning.plug_commands = []
bt_plug_warnning.plug_commands[0] = new Command("预警信息", 0, false, false)
let warnningBoxShow = true
bt_plug_warnning.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      $('#warnningBox').addClass('animated bounceInRight').show()
      warnningBoxShow = true
      $("li[data-type=4]").addClass("sideNav-isActive");
      break
  
    default:
      break
  }
}

bt_plug_warnning.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command deactivated: ' + commandID)
      $('#warnningBox').removeClass('animated bounceInRight').hide()
      $('#infoBox').removeClass('animated slideInDown').hide()
      bt_Plug_Annotation.removeAnnotation('warnningPoi')
      warnningBoxShow = false
      $("li[data-type=4]").removeClass("sideNav-isActive");
      break
  
    default:
      break
  }
}

bt_plug_warnning.plug_activate = () => {
  console.log('plug activated')  
}

bt_plug_warnning.plug_deactivate = () => {
  console.log('plug deactivated')  
}

bt_PlugManager.insert_plug(bt_plug_warnning);

var warnning_vm = new Vue({
  el: '#warnningBox',
  data: {
    title: '近期警告',
    activeName: 'face',
    faceList: [],
    vehicleList: []
  },
  mounted () {
    var self = this
    setInterval(function() {
      if (warnningBoxShow) {
        if (self.faceList.length > 100) {
          self.faceList.length = 100
        }
        if (self.vehicleList.length > 100) {
          self.vehicleList.length = 100
        }
        self.addFaceItem()
        self.addVehicleItem()
      }
    },5000)
  },
  updated () {
    this.$nextTick(function(){
      $('#warnningBox div.infoContent.vehicle ul.list li').first().addClass('animated flipInX')
      $('#warnningBox div.infoContent.face ul.list li').first().addClass('animated flipInX')
      
      setTimeout(function() {
        $('#warnningBox div.infoContent.vehicle ul.list li').removeClass()
        $('#warnningBox div.infoContent.face ul.list li').removeClass()
      },1000)
    })
  },
  methods: {
    clickBtn: function (type) {
      this.activeName = type
    },
    getMyDate : function (date) {
      function toDou (num) {
          var str = ''
          if (num < 10) {
            str = '0'+num
          } else {
            str = ''+num
          }
          return str
      }
      date = date ? date :new Date()
      date.setSeconds(date.getSeconds() - 3)
      var yy = date.getFullYear()
      var mm = date.getMonth()+1
      var dd = date.getDate()
      var HH = date.getHours()
      var MM = date.getMinutes()
      var SS = date.getSeconds()

      return toDou(mm)+'月'+toDou(dd)+'日'
      // return yy+'-'+toDou(mm)+'-'+toDou(dd)+' '+toDou(HH)+':'+toDou(MM)+':'+toDou(SS)
    },
    addFaceItem: function () {
      var self = this
      var date = this.getMyDate()
      date = '2019-05-27 13:09:39'
      var url= "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT df.*, a.name FROM disposition_face df left join ape a on df.device_id = a.id where df.face_appear_time > '"+date+"' ORDER BY df.face_appear_time"
      // console.log(url)
      $.ajax({
        url: url,
        type:'GET',
        success: function(data){
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              // data[i].device_id = self.getMyDate()
              data[i].face_appear_time = self.getMyDate(new Date(data[i].face_appear_time))
              data[i].target_image_uri = data[i].target_image_uri ? data[i].target_image_uri: 'image/default.png'
              data[i].subimage_list = data[i].subimage_list ? data[i].subimage_list : ['image/big_p.png','image/small_p.png']
              self.faceList.unshift(data[i])
            }
          }
         
        }
      })
    },
    addVehicleItem: function () {
      var self = this
      var date = this.getMyDate()
      date = '2019-05-27 13:09:39'
      var url= "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT dv.*,a.name FROM disposition_vehicle dv left join ape a on dv.device_id = a.id where dv.appear_time > '"+date+"' ORDER BY dv.appear_time"
      console.log(url)
      $.ajax({
        url: url,
        type:'GET',
        success: function(data){
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              data[i].appear_time = self.getMyDate(new Date(data[i].appear_time))
              data[i].target_image_uri = data[i].target_image_uri ? data[i].target_image_uri: 'image/default.png'
              data[i].subimage_list = data[i].subimage_list ? data[i].subimage_list : ['image/big_c.png','image/small_c.png']
              self.vehicleList.unshift(data[i])
            }
          }
         
        }
      })
    },
    clickRow: function(data,type){
      bt_Plug_Annotation.removeAnnotation('warnningPoi')
      // var self = this
      var id = data.device_id
      // id = 'd0587e35-81c3-11e9-adf8-00163e068fd6'
      var url = "http://"+location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT longitude,latitude,name FROM ape WHERE id = '"+id +"'"
      console.log(url)
      $.ajax({
        url: url,
        type: 'GET',
        success: function (device) {
          if (device.length < 1) return
          info_vm.close()
          // lnglat.longitude = 114.12798298117886
          // lnglat.latitude = 30.63994477868518
          // data.device_name = device[0].name
          // self.$set(data,'device_name',device[0].name)
          var ll = LL2Geo(device[0].longitude,device[0].latitude)
          bt_Util.executeScript('Render\\CameraControl\\FlyTo2 '+ll.x+' '+ll.y+' 0;');
          bt_Plug_Annotation.setAnnotation('warnningPoi', ll.x, ll.y, 100, -8, -16, "<div style='background:url(image/DefaultIcon.png); background-position:center left; background-repeat: no-repeat;width:16px;height:16px;line-height:16px;'></div>", false);
          // bt_Plug_Annotation.setAnnotation('warnningPoi2', ll.x, ll.y, 70, -8, -16, '<div>123</div>', false);
          setTimeout(function(){
            info_vm.showInfo(data,type,device[0].name)
          },200)
        }
      })
    }
  }
})

var info_vm = new Vue({
  el: '#infoBox',
  data: {
    title: null,
    deviceName: null,
    type: null,
    info: null
  },
  filters: {
    genderFilter :function (val){
      switch (val) {
        case '0':
          return '未知性别'
          break;
        case '1':
          return '男'
          break;
        case '2':
          return '女'
          break;
        case '9':
          return '未说明'
          break;
        default:
          return '未说明'
          break;
      }
    },
    plate_colorFilter: function(val){//车牌颜色。1：黑；2：白；3：灰；4：红；5：蓝；6：黄；7：橙；8：棕；9：绿；10：紫；11：青；12：粉；13：透明；99：其他；
      switch (val) {
        case '1':
          return '黑'
          break;
        case '2':
          return '白'
          break;
        case '3':
          return '灰'
          break;
        case '4':
          return '红'
          break;
        case '5':
          return '蓝'
          break;
        case '6':
          return '黄'
          break;
        case '7':
          return '橙'
          break;
        case '8':
          return '棕'
          break;
        case '9':
          return '绿'
          break;
        case '10':
          return '紫'
          break;
        case '11':
          return '青'
          break;
        case '12':
          return '粉'
          break;
        case '13':
          return '透明'
          break;
        case '99':
          return '其他'
          break;
        default:
          return '其他'
          break;
      }
    }
  },
  methods: {
    showInfo: function(data,type,deviceName) {
      var self = this
      this.$nextTick(function(){
        $('#infoBox').addClass('animated slideInLeft').show()
        self.type = type
        if (type == 'face') {
          self.title = '人脸识别报警'
        } else {
          self.title = '车辆识别报警'
        }
        self.deviceName = deviceName
        self.info = data
      })
      
    },
    close: function() {
      $('#infoBox').hide()
      bt_Plug_Annotation.removeAnnotation('warnningPoi')
    }
  }
})
