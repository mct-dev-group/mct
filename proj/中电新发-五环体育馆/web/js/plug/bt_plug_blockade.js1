var _css = `<style>
/* 封控点 start */
.poi_blockade{
  background:url(../image/DefaultIcon.png); 
  background-position:center left; 
  background-repeat: no-repeat;
  height:16px;
  width:16px;
  line-height:10px;
  cursor: pointer;
}
.poi_blockade .blockade_pop {
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
.poi_blockade .blockade_pop:after{
  border: solid transparent;
  content: ' ';
  height: 0;
  left: 45%;
  position: absolute;
  width: 0;
  border-width: 10px;
  border-top-color: #fff;
}

.poi_blockade .blockade_pop h3 {
  height:30px;
  line-height:30px;
  background: #409EFF;
  padding-left: 10px;
  color: #fff;
  font-weight: 700;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  display: inline-block;width: 280px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}

.poi_blockade .blockade_pop h3 span.closePop{
  position: absolute;
  right: 16px;
  cursor:pointer;
}

.poi_blockade .blockade_pop ul{
  min-height: 100px;
}

.poi_blockade .blockade_pop ul li{
  height:20px;
  line-height:20px;
  padding: 5px;
  width: 280px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
/* 封控点 end */
</style>`

$('head').append(_css)
// 封控线
let bt_plug_blockade = new Plug()

// 插件信息
bt_plug_blockade.js_name = 'bt_plug_blockade'
bt_plug_blockade.plug_name = '封控线'
bt_plug_blockade.plug_icon = 'ali-icon-ditu-dibiao'
bt_plug_blockade.plug_commandOnly = true
bt_plug_blockade.plug_isOnMobile = false

// 插件功能
bt_plug_blockade.plug_commands = []
bt_plug_blockade.plug_commands[0] = new Command("封控线", 0, false, false)

bt_plug_blockade.command_activate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command activated: ' + commandID)
      blockadeHandle.addPoi()
      break
  
    default:
      break
  }
}

bt_plug_blockade.command_deactivate = commandID => {
  switch (commandID) {
    case 0:
      console.log('command deactivated: ' + commandID)
      for (var i =0; i<poi_blockadeArr.length; i = i+2) {
        bt_Plug_Annotation.removeAnnotation('poi_blockade_'+poi_blockadeArr[i].id+'_'+i);
        bt_Plug_Annotation.removeAnnotation('poi_blockade_'+poi_blockadeArr[i].id+'_'+(i+1));
        bt_Plug_Annotation.removeAnnotation('poi_blockade_'+poi_blockadeArr[i].id+'_zj');
        var str = "Render\\RenderDataContex\\DynamicFrame\\DelRenderObj poi_blockade_"+poi_blockadeArr[i].id+" 16;"
        bt_Util.executeScript(str)
      }
      bt_Util.executeScript("Render\\ForceRedraw;")
      // for (var i in poi_blockadeArr) {
      //   bt_Plug_Annotation.removeAnnotation('poi_blockade_'+poi_blockadeArr[i].id+'_'+i);
      //   var str = "Render\\RenderDataContex\\DynamicFrame\\DelRenderObj poi_blockade_"+poi_blockadeArr[i].id+" 16;"
      //   console.log(str)
      //   bt_Util.executeScript(str)
        
      //   bt_Util.executeScript("Render\\ForceRedraw;")
      // }
      break
  
    default:
      break
  }
}

bt_plug_blockade.plug_activate = () => {
  console.log('plug activated')
}

bt_plug_blockade.plug_deactivate = () => {
  console.log('plug deactivated')
}

bt_PlugManager.insert_plug(bt_plug_blockade);

var poi_blockadeArr =[]
var blockadeHandle = {
  addPoi: function () {
    var url= "http://"+window.location.hostname+":8014/sqlservice/v1/executeSql?sql=SELECT l.*,p.longitude,p.latitude FROM as_local_blockade_line l LEFT JOIN as_local_blockade_point p ON l.id = p.blockade_line_id"
    console.log(url)
    $.ajax({
      url: url,
      type:'GET',
      success: function(data){
        if (data.length > 0) {
          poi_blockadeArr =data
          for (var i =0; i<data.length; i = i+2) {
            var ll = LL2Geo(data[i].longitude,data[i].latitude)
            var ll2 = LL2Geo(data[i+1].longitude,data[i+1].latitude)
            var html= `<div class='poi_blockade'></div>`
            // 点
            bt_Plug_Annotation.setAnnotation('poi_blockade_'+data[i].id+'_'+i, ll.x, ll.y, 20, -8, -16, html, false);
            bt_Plug_Annotation.setAnnotation('poi_blockade_'+data[i].id+'_'+(i+1), ll2.x, ll2.y, 20, -8, -16, html, false);
            // 注记
            var html = `<span style='color:#fff;'>封控线：${data[i].name}</span>`
            bt_Plug_Annotation.setAnnotation('poi_blockade_'+data[i].id+'_zj', Math.abs(ll2.x+ll.x)/2, Math.abs(ll2.y+ll.y)/2, 20, -8, -16, html, false);
            // 线
            var scriptStr =`Render\\RenderDataContex\\DynamicFrame\\AddRenderObj poi_blockade_${data[i].id} 4 1 (${ll.x},${ll.y},20) 16 2 2 (0.000000,0.000000,0.000000,255,255,0,255) (${ll2.x - ll.x},${ll2.y - ll.y},0,255,255,0,255) (0,1) 0;`
            bt_Util.executeScript(scriptStr)
          }
          bt_Util.executeScript("Render\\ForceRedraw;")
        }
        // if (data.length > 0) {
        //   poi_blockadeArr =data
        //   for (var i =0; i<data.length; i++) {
        //     var ll = LL2Geo(data[i].longitude,data[i].latitude)
        //     data[i].x = ll.x
        //     data[i].y = ll.y
        //     var html= `<div class='poi_blockade'></div>`
        //     bt_Plug_Annotation.setAnnotation('poi_blockade_'+data[0].id+'_'+i, ll.x, ll.y, 20, -8, -16, html, false);
        //   }
          
        //   var scriptStr =`Render\\RenderDataContex\\DynamicFrame\\AddRenderObj poi_blockade_${data[0].id} 4 1 (${data[0].x},${data[0].y},20) 16 2 2 (0.000000,0.000000,0.000000,255,255,0,255) (${data[1].x - data[0].x},${data[1].y - data[0].y},0,255,255,0,255) (0,1) 0;`
        //   console.log(scriptStr)
        //   bt_Util.executeScript(scriptStr)
        //   bt_Util.executeScript("Render\\ForceRedraw;")
        // }
      }
    })
  }
  // addPoi: function () {
  //   var url= "http://localhost:8014/sqlservice/v1/executeSql?sql=SELECT * FROM as_local_blockade_point"
  //   console.log(url)
  //   $.ajax({
  //     url: url,
  //     type:'GET',
  //     success: function(data){
  //       if (data.length > 0) {
  //         poi_blockadeArr =data
  //         for (var i =0; i<data.length; i++) {
  //           // data[i].longitude =114.12798298117886
  //           // data[i].latitude = 30.63994477868518
  //           var ll = LL2Geo(data[i].longitude,data[i].latitude)
  //           // var property = JSON.stringify(data[i])
  //           var html = ``

  //           var html= `<div class='poi_blockade'>
  //                       <div class='blockade_pop'>
  //                         <h3>封控线id ${data[i].id}<span class="closePop">X<span></h3>
  //                         <ul>
  //                           <li>序号：${data[i].serial_number}</li>
                            
  //                           <li>分控线id：${data[i].blockade_line_id}</li>
  //                         </ul>
  //                       </div>
  //                     </div>`
  //           bt_Plug_Annotation.setAnnotation(data[i].id, ll.x, ll.y, 70, -8, -16, html, false);
  //         }
  //       }

  //       $(".poi_blockade").click(function(){
  //         $(".blockade_pop").hide()
  //         $(this).children().show()
  //       })
  //       $(".closePop").click(function(e){
  //         $(this).parent().parent().hide()
  //         e.stopPropagation();
  //       })
  //     }
  //   })
  // }
}
