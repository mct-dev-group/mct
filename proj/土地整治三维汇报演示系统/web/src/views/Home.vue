<template>
  <div class="home">
    <router-view />

    <leftTree/>
    <LayerControl/>
    <Compass />
    
    <PlugManager />
    <!-- 插件start -->
    <Measurement />
    <PBFastReader />
    <!-- 插件end -->
  </div>
</template>

<script>
import Compass from '@/components/ui/Compass.vue';
import PlugManager from '@/components/PlugManager.vue';
import LayerControl from '@/components/ui/LayerControl.vue';

// 插件
import Measurement from '@/components/plug/Measurement.vue';
import PBFastReader from '@/components/plug/PBFastReader.vue';
import leftTree from '@/components/ui/leftTree.vue';

export default {
  name: 'home',
  components: {
    Compass,
    PlugManager,
    LayerControl,
    // 插件
    Measurement,
    PBFastReader,
    leftTree,
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
}
</style>