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
import {post} from '@/utils/fetch';
export default {
  name: 'uploadOther',
  data () {
    return {
      fileList:new Map(),
      DB:''
    }
  },
  props:['gid'],
  mounted(){
    this.DB=this.$store.state.db;
  },
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
      const th=this;
      const fds = [...this.fileList.values()].map(f => {
        const fileInfo = f.name.split(".");
        const file_type = fileInfo.pop();
        const file_name = fileInfo.join(".");
        const fd = new FormData();
        fd.append("file_name", file_name);
        fd.append("file_type", file_type);
        fd.append("attach_to_id", th.gid);
        fd.append("DB", this.DB);
        fd.append("blob_data", f);
        return fd;
      });      
      let promises=fds.map(fd =>post("/attachs/postAttachment",fd));
      Promise.all(promises).then(res=>{
        if(res.every(r=>r.code===1)){
          this.$message.success('上传成功!');
        }else if(res.every(r=>r.code!==1)){
          this.$message.error('上传失败!');
        }else{
          const errorArr=res.filter(r=>r.code!==1);
          let msg='';
          errorArr.forEach(v=>{
           msg+=`${v.data.file_name}.${v.data.file_type} `
          });
          msg+='上传失败！';
          this.$message.error(msg);
        }
        this.clearFiles();
      }).catch(error=>{
        console.error('上传附件错误!',error);
      });
    },
    clearFiles(){
      this.$refs.uploadOther.clearFiles();
      this.fileList.clear();
    }
  }
}
</script>

<style lang="scss" scoped>

</style>