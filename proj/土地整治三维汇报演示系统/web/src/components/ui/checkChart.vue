<template>
  <div class="checkChart">
    <el-progress type="circle" :percentage="percentage" ></el-progress>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage"></el-progress>
  </div>
</template>

<script>
export default {
  name: 'checkChart',
  data () {
    return {
      
    }
  },
  props:['percentage'],
  methods: {

  }
}
</script>

<style lang="scss" scoped>
 

</style>