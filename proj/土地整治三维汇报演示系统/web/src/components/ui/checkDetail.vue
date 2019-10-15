<template>
  <div class="checkDetail">
    <div v-for='(val,key) in details' :key='key' v-if='key!=="geom"'>
      <span>{{key}}：</span>
      <div v-if='key!=="status"' class='status'>{{val}}</div>
      <div v-else class='select'>
        <el-select v-model="status" placeholder="请选择" :disabled='disabled'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <i class='el-icon-edit icon' v-if='disabled' @click="editStatus" ></i>
        <i class='el-icon-upload2 icon' v-else  @click="saveStatus" ></i>
      </div>
      
    </div>  
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
        label: '图斑筛查'
      },{
        value: '2',
        label: '设计规划'
      },{
        value:'3',
        label: '施工整治'
      },{
        value:'4',
        label: '竣工验收'
      }
      ],
      disabled:true,
      status:this.details?this.details.status+'':''
    }
  },
  props:['details'],
  watch:{
    details:function(){
      if(this.details){
        this.status=this.details.status;
      }      
    }
  },
  methods: {
    editStatus(){
      this.disabled=false;
    },
    saveStatus(){
      setStatus({id:this.details.gid,status:this.status,DB: this.$store.state.db}).then( () => {
        evenBus.$emit('layerControl_requestImage');
        this.disabled=true;
      });
    },
    clear(){
      this.disabled=true;
      this.status='';
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
    overflow: hidden;
    padding-bottom:10px;

    >span{
      width: 100px;      
      line-height: 40px;
      display: inline-block;
      padding-right:5px;
      font-size: 18px;
      text-align:right;      
    }
    >div.status{      
      display: inline-block;
      height:40px;
      line-height: 20px;
      width: 150px;      
      padding:8px;
      vertical-align: middle;

    }
    .el-select{
      width: 120px;
      margin-right:3px;
    }
    >div.select{
      display: inline-block;      
    }
    i.icon{
      font-size: 25px;
      vertical-align: middle;
      cursor: pointer;
    }
    i.el-icon-edit{
      color:#409EFF;
    }
    i.el-icon-upload2{
      color:#67C23A;
    }
  }

}
</style>