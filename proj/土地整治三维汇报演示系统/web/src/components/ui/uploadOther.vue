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
      fileList:new Map(),
    }
  },
  props:['gid'],
  methods: {
    handleChange(file){
      this.fileList.set(file.uid,file.raw);
    },
    handleRemove(file){
      this.fileList.delete(file.uid);
    },
    handleUpload(){
      if(this.fileList.size===0){
        this.$message.error('上传文件列表为空！');
        return;
      }
      const fileArr=[...this.fileList.values()];
      const th=this;
      const fds = fileArr.map(f => {
        const fileInfo = f.name.split(".");
        const file_type = fileInfo.pop();
        const file_name = fileInfo.join(".");
        const fd = new FormData();
        fd.append("file_name", file_name);
        fd.append("file_type", file_type);
        fd.append("attach_to_id", th.gid);
        fd.append("DB", "qibin");
        fd.append("blob_data", f);
        return fd;
      });
      const url = config.server + "attachs/postAttachment";
      fds.forEach(fd => {
        postData(url,fd);
      });
      function postData(url = "", data = {}) {
        $.ajax({
          type: "POST",
          crossDomain: true,
          url: url,
          data: data,
          processData: false,
          contentType: false,
          success: (result)=>{
            th.$message({
              message: result.msg,
              type: 'success'
            });
            th.clearFiles();
          },
          error: console.log
        });
      }
    },
    clearFiles(){
      this.$refs.uploadOther.clearFiles();
      this.fileList.clear();
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadOther{

}
</style>