<template>
  <div class="rightContainer">
    <h4>图层控制</h4>
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="行政边界"></el-checkbox>
      <el-checkbox label="潜力图斑"></el-checkbox>
      <el-checkbox label="规划图斑"></el-checkbox>
      <el-checkbox label="土地类型"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'rightContainer',
  data () {
    return {
      checkList:[]
    }
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.rightContainer{
  position: fixed;
  top:64px;
  right: 10px;
  width: 120px;
  text-align: center;
  background-color: #fff;
  padding:8px;
  border-radius: 10px;

  h4{
    margin-bottom:10px; 
  }

  .el-checkbox{
    margin-right: 0;
    margin-bottom: 3px;
  }
}
</style>