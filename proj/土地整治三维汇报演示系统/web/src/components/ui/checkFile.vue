<template>
  <div class="checkFile">
    <el-tabs 
      tab-position='left'
      :value='activeTab' 
      style="height: 340px;"      
      :before-leave='handleBeforeLeave'
    >
      <el-tab-pane label="前后对比" name='1'>
        <div class="compareImage">
          <el-row>
            <el-col :span="12">
              <el-card :body-style="{ padding: '10px' }" shadow='hover'>              
                <div class="image">
                  <img v-if='urlOfBefore' :src='urlOfBefore' alt="">                  
                  <div v-else>
                    <i class="fa fa-picture-o"></i>
                    <p>暂无图片，请先上传！</p>
                  </div>                  
                </div>
                <div style="padding: 14px;text-align:center;">
                  整治前
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card :body-style="{ padding: '10px'}" shadow='hover'>
                <div class="image">
                  <img v-if='urlOfAfter' :src='urlOfAfter' alt="">                  
                  <div v-else>
                    <i class="fa fa-picture-o"></i>
                    <p>暂无图片，请先上传！</p>
                  </div>
                </div>                
                <div style="padding: 14px;text-align:center;">
                  整治后
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
      </el-tab-pane>
      <el-tab-pane label='其他' style='height:100%;padding-right:10px;' name='2'>        
        <ul v-if='otherFiles' class='fileList'>
          <li v-for='file in otherFiles' :key='file.gid' @click="handleFileClick(file.gid,$event)" title='点击查看'>            
            <i :class='file.icon'></i>{{file.file_name}}.{{file.file_type}}
          </li>
        </ul>
        <p v-else>暂无其他附件</p>
      </el-tab-pane> 
    </el-tabs>
  </div>
</template>

<script>
import {get} from '@/utils/fetch';
export default {
  name: 'checkFile',
  data () {
    return {
      activeTab:'',
      urlOfBefore:'',      
      urlOfAfter:''
    }
  },
  props:['files'],
  computed:{
    otherFiles:function(){
      if(this.files){
        let files=this.files.filter(file=>file.attach_type!=='zzq_img'&&file.attach_type!=='zzh_img');
        files.forEach(file=>{
          switch(file.file_type){
            case 'jpg':
            case 'png':
            case 'gif':
              file.icon='fa fa-file-image-o';
              break;
            case 'xls':
            case 'xlsx':
              file.icon='fa fa-file-excel-o';
              break;
            case 'doc':
            case 'docx':
              file.icon='fa fa-file-word-o';
              break;
            case 'zip':
            case 'rar':
              file.icon='fa fa-file-archive-o';
              break;
            default :
              file.icon='fa fa-file-o';
          }
        });
        return files;
      }            
    }
  },
  methods: {
    handleFileClick(gid,evt){
      get("http://" + location.hostname + ":7001/attachs/getAttachmentById/"+gid).then(res=>{
        const {mime_type, blob_data} = res.data[0];
        const bolbUrl=`data:${mime_type};base64,` + blob_data;
        openInNewtab(bolbUrl);
      });
    },
    handleBeforeLeave(aName,oName){
      if(aName==='1'){
        let map=new Map();
        const filterDatas=this.files.filter(file=>file.attach_type==='zzq_img'||file.attach_type==='zzh_img');
        const gets=filterDatas.map(data=>get("http://" + location.hostname + ":7001/attachs/getAttachmentById/"+data.gid));     
        Promise.all(gets).then(results=>{          
          results.forEach(result=>{
            const { mime_type, blob_data, attach_type} = result.data[0];
            const bolbUrl=`data:${mime_type};base64,` + blob_data;
            if(attach_type==='zzq_img'){
              this.urlOfBefore=bolbUrl;
            }else if(attach_type==='zzh_img'){
              this.urlOfAfter=bolbUrl;
            }           
          });          
          this.$emit('updata-checkLoading');
        });
      }
    }
  }
}
function openInNewtab(dataURL) {
  var iframe =
    "<iframe width='100%' height='100%' style='border:none;' src='" + dataURL + "'></iframe>";
  var x = window.open();
  
  x.document.open();
  x.document.write(iframe);  
  x.document.body.style.margin=0;
  x.document.close();
}
</script>

<style lang="scss" scoped>
 
.checkFile{  
  /deep/.el-tabs__content{
    height: 100%;
  }
  .compareImage{
    padding-right: 10px;

    .image {      
      height: 180px;
      text-align: center;      
      border:1px dashed #d9d9d9;
      box-sizing: border-box;

      img{
        width:100%;
        height:100%;
      }
      i{
        line-height: 2;
        font-size:67px;
        display: inline-block;
        color:#C0C4CC !important;
      }
      p{
        color:#606266;
      }
    }
  }
  .fileList {
    list-style: none;
    height: 100%;    
    overflow-y: auto; 

    >li{
      margin-bottom:10px;
      padding:8px 5px;
      cursor: pointer;
      user-select:none;
    }
    >li:hover{
      background-color: #f5f7fa;      
    }
    >li:last-child{
      margin-bottom:0;
    }
    a{
      font-size: 17px;
      padding-left:4px;
      text-decoration: none;
      color: #606266;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a:hover{
      color: #409eff;
    }
    i{
      margin-right:8px;
    }
  }
}

</style>