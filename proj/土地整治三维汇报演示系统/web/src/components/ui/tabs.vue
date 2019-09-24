<template>
  <div class="tabsBox">
    <el-button size="mini" type='text' icon="el-icon-close" @click="closeTabsBox"></el-button>
    <div class="title">
      {{dataForTabs.title}}&nbsp;-&nbsp;整治详情
    </div>
    <div class="content">
      <el-tabs 
        :value='activeTab' 
        stretch 
        :before-leave='handle' 
        ref='activeTab'
        @tab-click='handleClick'
      >
        <el-tab-pane label="统计信息" name='1' v-if='dataForTabs.showType===1'>
          <checkChart :percentage='percentage'/>
        </el-tab-pane>
        <el-tab-pane label="附件查看" name='2' v-if='dataForTabs.showType!==2'>
          <checkFile v-loading='checkLoading' ref='checkFile' :files='dataForTabs.data' @updata-checkLoading='checkLoading=false'/>
        </el-tab-pane>
        <el-tab-pane label="附件上传" name='3' v-if='dataForTabs.showType!==2'>
          <uploadFile ref='uploadFile' :gid='dataForTabs.gid'/>
        </el-tab-pane>
        <el-tab-pane label="查看详情" name='4'>图斑</el-tab-pane>
      </el-tabs>
    </div>        
  </div>
</template>

<script>
import  checkFile from './checkFile.vue';
import  checkChart from './checkChart.vue';
import  uploadFile from './uploadFile.vue';
import {get} from '@/utils/fetch';
export default {
  name: 'tabs',
  data () {
    return {         
      percentage:0,
      checkLoading:false,
    }
  },
  props:['activeTab','dataForTabs'],
  components:{
    checkFile,
    checkChart,
    uploadFile
  },
  methods: {
    handle(activeName,oldActiveName){      
      if(activeName==='1'){
        setTimeout(()=>{
          this.percentage=80;
        },1);
      }
      if(oldActiveName==='1'){
        this.percentage=0;
      }
      if(oldActiveName==='2'){
        this.$refs.checkFile.activeTab='0';
      }
      if(activeName==='2'){
        this.$refs.checkFile.activeTab='1';
        this.checkLoading=true;
      }
    },
    closeTabsBox(){
      this.$emit('update:showTabs');
      this.$emit('update:activeTab');      
      this.$refs.uploadFile&&this.$refs.uploadFile.clearFileList();
      this.$refs.checkFile&&this.$refs.checkFile.clearFile();
    },
    handleClick(tab){
      console.log(tab);
    }
  }
}
</script>

<style lang="scss" scoped>
.tabsBox{
  position: fixed;
  top:64px;
  left:50%;
  transform: translateX(-50%);
  width: 600px;
  
  background-color: #fff;
  border-radius: 8px;

  .el-button{
    position: absolute;
    top:5px;
    right: 20px;
    color:#303133;
    font-size:16px;
  }
  .el-icon-close{
    
  }

  .title{
    padding:10px;
    font-size: 18px;
    font-weight: bold;    
  }
  .content{
    height: 400px;
  }

}
</style>