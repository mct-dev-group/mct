<template>
  <div class="checkDetail">
    <div v-for='(val,key) in details' :key='key' v-if='key!=="geom"'>
      <span>{{key}}</span>
      <div v-if='key!=="status"' class='test'>{{val}}</div>
      <el-select v-else v-model="status" placeholder="请选择" :disabled='disabled'>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-button type="danger" round  v-if='disabled' class="btn" @click="editStatus">修改图斑状态</el-button>
    <el-button type="primary" round  v-else class="btn" @click="saveStatus">提交更改</el-button>
  </div>
</template>

<script>
import evenBus from '@/utils/event_bus';
import { setStatus } from '@/api/api';


export default {
  name: 'checkDetail',
  data () {
    return {
      options:[{
        value: '1',
        label: '审批中'
      },{
        value: '2',
        label: '施工中'
      },{
        value:'3',
        label: '验收中'
      },{
        value:'4',
        label: '已完成'
      }
      ],
      disabled:true,
      status:this.details.status
    }
  },
  props:['details'],
  methods: {
    editStatus(){
      this.disabled=false;
    },
    saveStatus(){
      setStatus({id:this.details.gid,status:this.status}).then( () => {
        evenBus.$emit('layerControl_requestImage');
      });
    }
  },  
}

</script>

<style lang="scss" scoped>
div{
  box-sizing: border-box;
}
.checkDetail{  
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  height: 320px;
  margin: 10px;  
  overflow-y: auto;

  >div{
    width:50%;
    // height:40px;
    // line-height: 40px;
    overflow: hidden;
    // text-align: center;
    padding-bottom:10px;

    >span{
      width: 120px;      
      line-height: 40px;
      display: inline-block;
      padding-right:12px;
      font-size: 18px;
      text-align:right;      
    }
    >div.test{      
      display: inline-block;
      height:40px;
      width: 150px;      
      padding:8px;
      border: 1px solid #dcdfe6;      
      vertical-align: bottom;

    }
    .el-select{
      width: 150px;
    }
  }
  .btn{
    width: 50%;
    margin: 0 auto;
  }
}
</style>