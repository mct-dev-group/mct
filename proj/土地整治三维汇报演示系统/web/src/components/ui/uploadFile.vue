<template>
  <div class="uploadFile">
    <el-tabs tab-position='left' style="height: 340px;">
      <el-tab-pane label="前后对比">
        <div class="compareImage">
          <el-row>
            <el-col :span="12">
              <el-card :body-style="{ padding: '10px' }" shadow='hover'>
                <el-upload 
                  action='www.baidu.com'
                  :auto-upload='false'
                  :on-success='testSuccess'
                  :on-change='testChange'
                  drag
                  accept='image/*'
                  :limit='1'
                >
                  <img :src="beforeUrl" class="previewImg">
                  <i class="el-icon-upload"></i>
                  <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
                  <div  class='el-upload__tip' slot="tip">*只能上传图片文件</div>
                </el-upload>
                <div style="padding: 14px;text-align:center;">
                  整治前
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card :body-style="{ padding: '10px'}" shadow='hover'>
                <el-upload 
                  action='www.baidu.com'
                  :auto-upload='false'
                  
                  drag
                  accept='image/*'
                  :limit='1'
                >
                  <img :src="afterUrl" >
                  <i class="el-icon-upload"></i>
                  <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
                  <div  class='el-upload__tip' slot="tip">*只能上传图片文件</div>
                </el-upload>
                <div style="padding: 14px;text-align:center;">
                  整治后
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>        
      </el-tab-pane>
      <el-tab-pane label='其他' style='height:100%;padding-right:10px;'>
        ss
      </el-tab-pane> 
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'uploadFile',
  data () {
    return {
      beforeUrl:'',
      afterUrl:''
    }
  },  
  methods: {
    testSuccess(response, file){
      console.log(response);
      console.log(file);
    },
    testChange(file){
      if(/^image\//.test(file.raw.type)){
        this.beforeUrl=URL.createObjectURL(file.raw);
      }
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

    /deep/.el-upload{
      width: 100%;
    }
    /deep/.el-upload-dragger{
      width: 100%;
    }
    /deep/.el-upload__tip{
      text-align: center;
      color:#e4393c;
    }
    .previewImg{
      width: 100%;
    }
  }  
}

</style>