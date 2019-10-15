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
      <div slot="tip" class="el-upload__tip">*只能上传'.txt','.doc','.pdf','.docx','.xls','.xlsx','.dppt'文件，且不超过50M</div>
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
      DB:'',
      fileType:['txt','doc','pdf','docx','xls','xlsx','ppt']
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
      let arr=[...this.fileList.values()];      
      let filterArr=arr.filter(v=>{
        let type=v.name.split('.').slice(-1)[0];        
        return this.fileType.includes(type);
      });      
      const th=this;
      const fds = filterArr.map(f => {
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
      if(fds.length===0){
        this.$message.error(`无合法文件！请检查后重新上传！`);
        this.clearFiles();
        return;
      }else if(filterArr.length<arr.length){
        this.$message.warning('检测到部分文件不合法，已过滤！');
      }
      let promises=fds.map(fd =>post("/attachs/postAttachment",fd));
      Promise.all(promises).then(res=>{
        const errorArr=res.filter(r=>r.code!==1);
        if(errorArr.length>0){
          let msg='';
          errorArr.forEach(v=>{
            msg+=`${v.data.file_name}.${v.data.file_type} `
          });
          msg+='上传失败！';
          this.$message.error(msg);
        }else{
          this.$message.success('上传成功!');
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