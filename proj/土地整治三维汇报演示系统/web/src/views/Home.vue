<template>
  <div class="home">
    <Matrix />

    <leftTree/>
    <LayerControl/>
    <Compass />

    <PlugManager />
    <!-- 插件start -->
    <Measurement />
    <PBFastReader />
    <searchWMSdb />
    <!-- 插件end -->
  </div>
</template>

<script>
import Matrix from '@/components/Matrix.vue';
import Compass from '@/components/ui/Compass.vue';
import PlugManager from '@/components/PlugManager.vue';
import LayerControl from '@/components/ui/LayerControl.vue';

// 插件
import Measurement from '@/components/plug/Measurement.vue';
import PBFastReader from '@/components/plug/PBFastReader.vue';
import leftTree from '@/components/ui/leftTree.vue';
import searchWMSdb from '@/components/plug/searchWMSdb.vue';

export default {
  name: 'home',
  components: {
    Matrix,
    Compass,
    leftTree,
    LayerControl,

    PlugManager,
    // 插件
    Measurement,
    PBFastReader,
    searchWMSdb
  },
  created () {
    const db = this.$route.params.db;
    this.$store.commit('setCurrentDB', db);
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
}
</style>