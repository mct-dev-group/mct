<template>
  <div class="uploadFile">
    <el-tabs tab-position='left' style="height: 340px;">
      <el-tab-pane label="前后对比">
        <uploadImage  ref='uploadImage' :gid='gid' />
      </el-tab-pane>
      <el-tab-pane label='其他' style='height:100%;padding-right:10px;'>
        <uploadOther ref='uploadOther' :gid='gid'/>
      </el-tab-pane> 
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import uploadImage from '@/components/ui/uploadImage.vue';
import uploadOther from '@/components/ui/uploadOther.vue';
export default {
  name: 'uploadFile',
  data () {
    return {            
      dialogImageUrl:'',
      dialogVisible:false,      
    }
  },
  props:['gid'],
  components:{
    uploadImage,
    uploadOther
  },
  methods: {
    clearFileList(){
      this.$refs.uploadImage.clearFiles();
      this.$refs.uploadOther.clearFiles();
    }
  }
}
</script>

<style lang="scss" scoped>
 
.uploadFile{  
  /deep/.el-tabs__content{
    height: 100%;
  }
  .compareImage{
    padding-right: 10px;
    text-align: center;

    /deep/.el-upload--picture-card{
      border: none;
      line-height: unset;
      height:unset;
    }
    /deep/.el-upload-list--picture-card .el-upload-list__item{
      width: 100%;
      height: 180px;
      transition:none;
      margin-bottom: 0;
      display: block;
    }
    /deep/.el-upload{
      width: 100%;
    }
    /deep/.el-upload-dragger{
      width: 100%;          
    }
    /deep/.el-upload__tip{      
      color:#e4393c;
    }
    .el-button{
      margin-top:10px; 
    }
    .previewImg{
      width: 100%;
    }
  }  
}

</style>