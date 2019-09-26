<template>
  <div class="checkChart">
    <!-- <el-progress type="circle" :percentage="percentage" ></el-progress>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress> -->
      <div class='progress'>
        <el-divider content-position="left">进度展示</el-divider>
        <p>已完成/总量</p>
        <div class='progress-line'>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="70" >ssssssss</el-progress>
          <div class='progress-line-text'>70/100</div>
        </div>        
      </div>
      <div class="chart"> 
        <el-divider content-position="left">详情统计</el-divider>
        <div id="planChart" ref="planChart" @click="handleClick"></div>
      </div>
      
  </div>
</template>

<script>
export default {
  name: 'checkChart',
  data () {
    return {
       
    }
  },
  // props:['percentage'],
  methods: {
    handleClick(){
      // console.log(this.$refs.myChart);
    },
    draw(){
        const planChart = this.$echarts.init(this.$refs.planChart);

        // 指定图表的配置项和数据
        var option = {
            series : [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data:[
                {value:235, name:'视频广告'},
                {value:274, name:'联盟广告'},
                {value:310, name:'邮件营销'},
                {value:335, name:'直接访问'},
                {value:400, name:'搜索引擎'}
            ]
        }
    ]
        };

        // 使用刚指定的配置项和数据显示图表。
        planChart.setOption(option);
        //刚进入标签页时宽度不正确，手动重置
        planChart.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.checkChart{
  .progress{        

    .el-divider--horizontal{
      margin:10px 0;
    }
    >p{
      padding:5px 0;
      text-align: center;
    }
    .progress-line{
      display: flex;
      justify-content: space-around;

      .progress-line-text{
        line-height: 26px;
      }
    }
    /deep/.el-progress--line{
      width:80%;
      // margin-left: 10px;
    }
  }
  
}
#planChart {
  width: 500px;
  height:100px;  
  border: 1px solid #CCC
}

</style>