<template>
  <div class="tabsBox">
    <el-button size="mini" type='text' icon="el-icon-close" @click="closeTabsBox"></el-button>
    <div class="title">
      {{title}}&nbsp;-&nbsp;整治详情
    </div>
    <div class="content">
      <el-tabs :value='activeTab' stretch :before-leave='handle'>
        <el-tab-pane label="统计" name='1'>
          <checkChart :percentage='percentage'/>
        </el-tab-pane>
        <el-tab-pane label="查看附件" name='2'>
          <checkFile/>
        </el-tab-pane>        
        <el-tab-pane label="图斑" name='3'>图斑</el-tab-pane>
        <el-tab-pane label="上传附件" name='4'>
          <uploadFile/>
        </el-tab-pane>
      </el-tabs>
    </div>        
  </div>
</template>

<script>
import  checkFile from './checkFile.vue';
import  checkChart from './checkChart.vue';
import  uploadFile from './uploadFile.vue';
export default {
  name: 'tabs',
  data () {
    return {
      title:'01乡',      
      percentage:0
    }
  },
  props:['activeTab'],
  components:{
    checkFile,
    checkChart,
    uploadFile
  },
  methods: {
    handle(activeName,oldActiveName){
      console.log(activeName,oldActiveName);
      if(activeName==='1'){
        setTimeout(()=>{
          this.percentage=80;
        },1);
      }
      if(oldActiveName==='1'){
        this.percentage=0;
      }      
    },
    closeTabsBox(){
      this.$emit('update:showTabs');
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