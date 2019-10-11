<template>
  <div class="uploadImage">
    <el-row>
      <el-col :span="12">
        <el-card :body-style="{ padding: '10px' }" shadow='hover'>
          <el-upload
            id='beforeImgUpload'
            action
            accept='image/*'
            :auto-upload='false'
            drag
            list-type="picture-card"
            ref='beforeImg'
            :limit='1'
            :on-preview="handlePreview"
            :on-remove='handleBeforeImgRemove'
            :on-change='handleBeforeImgChange'
            :on-exceed='handleExceed'
          >
            <i class="el-icon-upload"></i>
            <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
            <div  class='el-upload__tip'>*只能上传图片文件</div>
          </el-upload>
          <div style="padding: 14px;text-align:center;">
            整治前
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :body-style="{ padding: '10px'}" shadow='hover'>
          <el-upload
            id='afterImgUpload'
            action
            accept='image/*'
            :auto-upload='false'
            drag
            list-type="picture-card"
            ref='afterImg'
            :limit='1'
            :on-preview="handlePreview"
            :on-remove='handleAfterImgRemove'
            :on-change='handleAfterImgChange'
            :on-exceed='handleExceed'
          >
            <i class="el-icon-upload"></i>
            <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
            <div  class='el-upload__tip'>*只能上传图片文件</div>
          </el-upload>
          <div style="padding: 14px;text-align:center;">
            整治后
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="primary" round @click="handleUpload">确认上传</el-button>
    <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'uploadImage',
  data () {
    return {
      dialogImageUrl:'',
      dialogVisible:false,
      fileList:[]
    }
  },
  props:['gid'],
  methods: {
    //查看
    handlePreview(file){
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //超出个数限制
    handleExceed(){
       this.$message.error('只能上传一张图片，请勿多选！');
    },
    //整治前
    handleBeforeImgChange(file){
      if(/^image\//.test(file.raw.type)){
        this.fileList[0]={
          attach_type:'zzq_img',
          file:file.raw
        };
        document.querySelector('#beforeImgUpload div.el-upload.el-upload--picture-card').style.display='none';
      }else{
        this.$message.error('请选择图片上传！');
        this.$refs.beforeImg.clearFiles();
      }
    },
    handleBeforeImgRemove(file){
      document.querySelector('#beforeImgUpload div.el-upload.el-upload--picture-card').style.display='block';
      this.fileList.shift();
    },
    //整治后
    handleAfterImgChange(file){
      if(/^image\//.test(file.raw.type)){
        this.fileList[1]={
          attach_type:'zzh_img',
          file:file.raw
        };
        document.querySelector('#afterImgUpload div.el-upload.el-upload--picture-card').style.display='none';
      }else{
        this.$message.error('请选择图片上传！');
        this.$refs.afterImg.clearFiles();
      }
    },
    handleAfterImgRemove(file){
      document.querySelector('#afterImgUpload div.el-upload.el-upload--picture-card').style.display='block';
      this.fileList.pop();
    },
    //确认上传
    handleUpload(){
      if(this.fileList.length<1){
        this.$message.error('请至少上传一张图片！');
        return;
      }
      const th=this;
      const fds = this.fileList.map(f => {
        const fileInfo = f.file.name.split(".");
        const file_type = fileInfo.pop();
        const file_name = fileInfo.join(".");
        const fd = new FormData();
        const attach_type = f.attach_type;
        fd.append("file_name", file_name);
        fd.append("file_type", file_type);
        fd.append("DB", "qibin");
        fd.append("attach_to_id", th.gid);
        if (attach_type) {
          //不是指定附件类型就不添加
          fd.append("attach_type", attach_type);
        }
        fd.append("blob_data", f.file);
        return fd;
      });
      const url = config.server + "attachs/postAttachment";
      fds.forEach(fd => postData(url, fd));
      function postData(url = "", data = {}) {
        $.ajax({
          type: "POST",
          crossDomain: true,
          url: url,
          data: data,
          processData: false,
          contentType: false,
          success: ()=>{
            th.$message({
              message: '上传成功！',
              type: 'success'
            });
            th.clearFiles();
          },
          error: console.log
        });
      }
    },
    clearFiles(){
      this.$refs.beforeImg.clearFiles();
      this.$refs.afterImg.clearFiles();
      document.querySelector('#beforeImgUpload div.el-upload.el-upload--picture-card').style.display='block';
      document.querySelector('#afterImgUpload div.el-upload.el-upload--picture-card').style.display='block';
      this.fileList=[];
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadImage{
  padding-right: 10px;
  text-align: center;
  user-select: none;

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
</style>