<template>
  <div class="home">
    <leftTree/>
    <LayerControl/>
    <router-view />
    <rightContainer/>
    <Compass />
    <PlugManager />
    <!-- 插件start -->
    <PlugExample />
    <Measurement />
    <WMS />
    <BufferQuery />
    <PBFastReader />
    <!-- 插件end -->
  </div>
</template>

<script>
import Compass from '@/components/ui/Compass.vue';
import PlugManager from '@/components/PlugManager.vue';
import LayerControl from '@/components/ui/LayerControl.vue';

// 插件
import PlugExample from '@/components/plug/PlugExample.vue';
import Measurement from '@/components/plug/Measurement.vue';
import WMS from '@/components/plug/WMS.vue';
import BufferQuery from '@/components/plug/BufferQuery.vue';
import PBFastReader from '@/components/plug/PBFastReader.vue';
import leftTree from '@/components/ui/leftTree.vue';
import rightContainer from '@/components/ui/rightContainer.vue';

export default {
  name: 'home',
  components: {
    Compass,
    PlugManager,
    LayerControl,
    // 插件
    PlugExample,
    Measurement,
    WMS,
    BufferQuery,
    PBFastReader,
    leftTree,
    rightContainer,
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
}
</style>