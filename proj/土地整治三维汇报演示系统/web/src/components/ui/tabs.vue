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
          <checkChart v-loading='chartLoading' :chartData='chartData' ref='checkChart' />
        </el-tab-pane>
        <el-tab-pane label="附件查看" name='2' v-if='dataForTabs.showType!==3'>
          <checkFile v-loading='checkLoading' ref='checkFile' :gid='dataForTabs.gid' :showType='dataForTabs.showType' :files='files' @updata-checkLoading='checkLoading=false'/>
        </el-tab-pane>
        <el-tab-pane label="附件上传" name='3' v-if='dataForTabs.showType!==3'>
          <uploadFile ref='uploadFile' :gid='dataForTabs.gid' :showType='dataForTabs.showType'/>
        </el-tab-pane>
        <el-tab-pane label="查看详情" name='4'>
          <checkDetail ref='checkDetail' :details='dataForTabs.details'/>
        </el-tab-pane>
      </el-tabs>
    </div>        
  </div>
</template>

<script>
import  checkFile from './checkFile.vue';
import  checkChart from './checkChart.vue';
import  uploadFile from './uploadFile.vue';
import  checkDetail from './checkDetail.vue';
import {get} from '@/utils/fetch';
export default {
  name: 'tabs',
  data () {
    return {
      chartData:{
        total:0,
        statusMap:null
      },      
      checkLoading:false,
      chartLoading:false,
      files:''
    }
  },
  props:['activeTab','dataForTabs'],
  components:{
    checkFile,
    checkChart,
    uploadFile,
    checkDetail
  },
  methods: {
    handle(aName,oName){
      switch(aName){
        case '1':
          this.chartLoading=true;
          const plan=this.dataForTabs.plan;
          this.chartData.total=plan.length;          

          let promises=plan.map(v=>get('http://'+location.hostname+':7001/attachs/query',{"sql":"select p.status,p.shape_area from plan p where p.gid="+v.id, "db":"qibin"}));
          Promise.all(promises).then(res=>{            
            const statusArr=res.map(s=>({status:s.data[0].status,area:s.data[0].shape_area*1}));
            let statusMap=new Map();
            //状态
            const status=['1','2','3','4'];            
            status.forEach(v=>{
              let sArr=statusArr.filter(s=>s.status===v);
              statusMap.set(v,{
                count:sArr.length,
                area:sArr.reduce((accumulator, currentValue) => accumulator + currentValue.area,0)
              });
            });            
            this.chartData.statusMap=statusMap;
            this.$refs.checkChart.draw();
            this.chartLoading=false;
          });
          
          break;
        case '2':          
          get("http://" + location.hostname + ":7001/attachs/getAttachmentListById/" +this.dataForTabs.gid).then(res=>{
            this.files=res.data;
            this.$refs.checkFile.activeTab=this.dataForTabs.showType===2?'1':'2';
            this.checkLoading=true;
          });
          break;
      };
      switch(oName){
        case '1':
          this.$refs.checkChart.clearChart();    
          break;
        case '2':
          this.$refs.checkFile.activeTab='0';
          break;
      }
    },
    closeTabsBox(){
      this.$emit('update:showTabs');
      this.$emit('update:activeTab');      
      this.$refs.uploadFile&&this.$refs.uploadFile.clearFileList();
      this.$refs.checkFile&&this.$refs.checkFile.clearFile();
      this.$refs.checkDetail.clear();
      this.$refs.checkChart&&this.$refs.checkChart.clearChart();
    },
    handleClick(tab){
      // console.log(tab);
    },
    getData(){
      this.$emit('update:files');
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