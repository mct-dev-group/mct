<template>
  <div class="uploadOther">
    <el-upload      
      ref="uploadOther"
      action
      multiple
      :auto-upload="false"
      :on-remove="handleRemove"      
      :on-change='handleChange'
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="handleUpload">上传到服务器</el-button>      
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'uploadOther',
  data () {
    return {
      fileMap:new Map(),
    }
  },
  
  methods: {
    handleChange(file){
      // if(this.fileMap.has(file.name)){
      //   this.$message.error('该文件已选取！将上传最新选取的文件！');
      // }else{
      //   this.fileMap.set(file.name,file.raws);
      // }
      this.fileMap.set(file.name,file.raws);
    },
    handleRemove(){

    },
    handleUpload(){
      console.log(this.fileSet);
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadOther{

}
</style>