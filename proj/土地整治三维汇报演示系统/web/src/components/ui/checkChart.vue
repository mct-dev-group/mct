<template>
  <div class="checkChart">
      <div class='progress'>
        <el-divider content-position="left">进度展示</el-divider>
        <p>已完成/总量</p>
        <div class='progress-line'>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" ></el-progress>
          <div class='progress-line-text'>{{text}}</div>
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
      percentage:0,
      text:'',      
      planChart:null
    }
  },
  props:['chartData'],
  watch:{
    chartData:{
      handler(){
        if(this.chartData.statusMap){
          this.percentage=this.chartData.statusMap.get('4')*100/this.chartData.count;
          this.text=this.chartData.statusMap.get('4')+'/'+this.chartData.count;
        }
      },      
      deep:true
    }
  },
  methods: {
    handleClick(){
      
    },
    draw(){
      const th=this;
      this.planChart = this.$echarts.init(this.$refs.planChart);

      let target={
        
      };
      let barOption={
        title:{
          text:'图斑状态统计一览',          
          left:'center',
          subtext :'按图斑个数统计'
        },
        legend:{
          left:'left',
          top:'top',
          orient:'vertical',
        },
        tooltip:{
          formatter: "{b}<br/>个数：{c}<br/>"
        },
        toolbox:{
          showTitle:false,
          tooltip:{
            show: true,
            position:'left',          
          },
          feature:{
            myToolToPie: {
              show: true,
              title: '切换为饼图',
              icon: 'path://M453.042424 1014.690909c124.121212 0 238.933333-49.648485 319.612121-133.430303L453.042424 564.751515V114.812121C201.69697 114.812121 0 316.509091 0 564.751515s201.69697 449.939394 453.042424 449.939394z m62.060606-515.10303H992.969697C992.969697 235.830303 778.860606 21.721212 515.10303 21.721212v477.866667z m24.824243 62.060606l322.715151 316.509091c80.678788-80.678788 130.327273-192.387879 130.327273-316.509091H539.927273z',
              onclick: function (){
                th.planChart.clear();
                th.planChart.setOption(pieOption);
              }
            },
            saveAsImage:{
              pixelRatio:1
            },
          }
        },
        grid:{
          show:true,
          width:430,
          left :'125px',
          bottom:30
        },
        xAxis:  {
          show:true,
          type: 'category',
          axisLabel : {//坐标轴刻度标签的相关设置。
            interval:0,                      
          },
          data: ['图斑筛查','设计规划','施工整治','竣工验收']
        },
        yAxis: {
          show:true,
          type: 'value',
          minInterval: 1,
          axisLabel: {
              formatter: '{value} 个'
          }
        },
        series : [
          {
            name: '图斑筛查', 
            type: 'bar',
            stack:'1',
            data:[
              th.chartData.statusMap.get('1'),
              0,0,0
            ]
          },{
            name: '设计规划', 
            type: 'bar',
            stack:'1',
            data:[
              0,
              th.chartData.statusMap.get('2'),
              0,0
            ]
          },{
            name: '施工整治', 
            type: 'bar',
            stack:'1',
            data:[
              0,0,
              th.chartData.statusMap.get('3'),
              0
            ]
          },{
            name: '竣工验收', 
            type: 'bar',
            stack:'1',
            data:[
              0,0,0,
              th.chartData.statusMap.get('4'),
            ]
          }
        ]
      };
      let pieOption={
        title:{
          text:'图斑状态统计一览',          
          left:'center',
          subtext :'按图斑个数统计'
        },
        legend:{
          left:'left',
          top:'top',
          orient:'vertical',
        },
        tooltip:{
          formatter: "{b}<br/>个数：{c}<br/> 占比：{d}%"
        },
        toolbox:{
          showTitle:false,
          tooltip:{
            show: true,
            position:'left',          
          },
          feature:{
            myToolToBar: {
              show: true,
              title: '切换为柱状图',              
              icon: 'path://M1064.96 894.818462c0 30.483692-26.781538 55.138462-59.707077 55.138461H100.824615c-32.925538 0-59.628308-24.654769-59.785846-55.138461 0-30.168615 26.939077-54.902154 59.785846-54.902154h904.507077c32.846769 0 59.707077 24.733538 59.707077 54.980923zM182.193231 702.621538V272.147692c0-28.356923 23.315692-51.593846 51.751384-51.593846h6.931693c28.356923 0 51.672615 23.158154 51.672615 51.593846V702.621538c0 28.356923-23.236923 51.593846-51.672615 51.593847H233.944615a51.751385 51.751385 0 0 1-51.672615-51.593847z m636.770461-10.555076v-320.59077c0-28.356923 23.236923-51.593846 51.672616-51.593846h6.931692c28.435692 0 51.672615 23.236923 51.672615 51.593846v320.59077c0 28.356923-23.236923 51.593846-51.672615 51.593846h-6.931692a51.672615 51.672615 0 0 1-51.672616-51.593846z m-274.589538 61.991384a51.908923 51.908923 0 0 1-51.672616-51.672615V51.593846c0-28.356923 23.236923-51.593846 51.672616-51.593846H551.384615c28.356923 0 51.672615 23.236923 51.672616 51.593846v650.791385c0 28.356923-23.236923 51.593846-51.672616 51.593846h-7.08923l0.078769 0.078769z',
              onclick:function(){
                th.planChart.clear();
                th.planChart.setOption(barOption);
              }
            },
            saveAsImage:{
              pixelRatio:1
            },
          }
        },
        series : [
          {
            name: '详情统计',
            type: 'pie',
            radius: '55%',
            roseType: 'area',            
            center: ['50%', '65%'],
            data:[
              {value:th.chartData.statusMap.get('1'), name:'图斑筛查'},
              {value:th.chartData.statusMap.get('2'), name:'设计规划'},
              {value:th.chartData.statusMap.get('3'), name:'施工整治'},
              {value:th.chartData.statusMap.get('4'), name:'竣工验收'},
            ]
          },
        ]
      };      
      // 使用刚指定的配置项和数据显示图表。
      this.planChart.setOption(pieOption);
      //刚进入标签页时宽度不正确，手动重置
      this.planChart.resize();
    },
    clearChart(){      
      this.planChart&&this.planChart.dispose();
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
  width: 580px;
  height:210px;  
  border: 1px solid #CCC;
  margin:0 auto;
}

</style>