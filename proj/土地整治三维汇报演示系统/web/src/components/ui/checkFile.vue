<template>
  <div class="checkFile">
    <el-tabs 
      tab-position='left'
      :value='activeTab' 
      style="height: 340px;"
      @tab-click='handleClick'
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
        <!-- <ul class='fileList'>
          <li v-for='file in files' :key='file.gid' >            
            {{file.file_name}}.{{file.file_type}}
          </li>
        </ul> -->
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
      urlOfAfter:'',
      urlOfOther:[]
    }
  },
  props:['files'],
  methods: {
    /* /attachs/getAttachmentById/:id */
    /* /attachs/getAttachmentListById/:id */
    handleClick(){

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
          // this.$emit('updata-checkLoading');
        });
      }
    }
  }
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
      padding:5px 0;
      cursor: pointer;
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