<template>
  <div class="index">
    <div class="cityBox">
      <div class="city" v-for="(item, index) in qhList" :key="index" @click="handleClick(item.value)">
        <div class="img"></div>
        <div class="title">{{item.title}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      qhList: []
    }
  },
  mounted () {
    this.getqhList();
  },
  methods: {
    getqhList () {
      this.qhList = [
        {
          title: '淇滨',
          value: 'qibin'
        },{
          title: '测试',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        },{
          title: '其他',
          value: 'qibin2'
        }
      ]
    },
    handleClick (val) {
      this.$router.push({
        name: 'home',
        params: {
          db: val
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  height: 100vh;
  background: #dedede;

  .cityBox {
    position: relative; 
    top: 80px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 100px;
    padding-right: 100px;

    .city {
      margin:20px;
      cursor: pointer;
      width: 200px;
      height: 240px;
      background: #f7f7f7;
      box-shadow: #d0cbcb 2px 2px 2px;
      
      .img {
        width: 200px;
        height: 200px;
        background: #6fcffcd8;
      }
      .title {
        height: 40px;
        line-height: 40px;
        text-align: center;
      }

      &:hover {
        color: #264c5ed8;
      }
    }
  }
}
</style>