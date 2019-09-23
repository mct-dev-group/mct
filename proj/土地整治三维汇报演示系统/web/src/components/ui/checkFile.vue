<template>
  <div class="checkFile">
    <el-tabs tab-position='left' style="height: 340px;">
      <el-tab-pane label="前后对比">
        <div class="compareImage">
          <el-row>
            <el-col :span="12">
              <el-card :body-style="{ padding: 0 }" shadow='hover'>
                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                <div style="padding: 14px;text-align:center;">
                  整治前
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card :body-style="{ padding: 0}" shadow='hover'>
                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                <div style="padding: 14px;text-align:center;">
                  整治后
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
        
      </el-tab-pane>
      <el-tab-pane label='其他' style='height:100%;padding-right:10px;'>
        <ul class='fileList'>
          <li v-for='item in list' :key='item.name' >
            <a :href="item.url" target="_blank"><i :class="item.icon"></i>{{item.name}}</a>
          </li>
        </ul>
      </el-tab-pane> 
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'checkFile',
  data () {
    return {
      list:[
        {name:'文件1',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件2',icon:'fa fa-file-pdf-o',url:'https://www.baidu.com'},
        {name:'文件3',icon:'fa fa-file-word-o',url:'https://www.baidu.com'},
        {name:'文件4',icon:'fa fa-file-image-o',url:'https://www.baidu.com'},
        {name:'文件5',icon:'fa fa-file-text',url:'https://www.baidu.com'},
        {name:'文件6',icon:'fa fa-file-audio-o',url:'https://www.baidu.com'},
        {name:'文件7',icon:'fa fa-file-powerpoint-o',url:'https://www.baidu.com'},
        {name:'文件8',icon:'fa fa-file-video-o',url:'https://www.baidu.com'},
        {name:'文件9',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件10',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件11',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件12',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件13',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
        {name:'文件14',icon:'fa fa-file-excel-o',url:'https://www.baidu.com'},
      ]
    }
  },
  // props:['title'],
  methods: {
    /* /attachs/getAttachmentById/:id */
    /* /attachs/getAttachmentListById/:id */
  }
}
</script>

<style lang="scss" scoped>
 
.checkFile{  
  /deep/.el-tabs__content{
    height: 100%;
  }
  .compareImage{
    padding-right: 10px;

    .image {
      width: 100%;
      display: block;
    }
  }
  .fileList {
    list-style: none;
    height: 100%;    
    overflow-y: auto; 

    >li{
      margin-bottom:10px;
      padding:5px 0;
      cursor: pointer;
    }
    >li:hover{
      background-color: #f5f7fa;      
    }
    >li:last-child{
      margin-bottom:0;
    }
    a{
      font-size: 17px;
      padding-left:4px;
      text-decoration: none;
      color: #606266;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    a:hover{
      color: #409eff;
    }
    i{
      margin-right:8px;
    }
  }
}

</style>