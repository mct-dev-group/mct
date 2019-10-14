<!-- 插件示例 -->
<template></template>

<script>
import {get} from '@/utils/fetch';
let searchWMSdbOnClick;
export default {
  name: "searchWMSdb",
  data() {
    return {};
  },
  mounted() {
    this.DB=this.$store.state.db;
    const v = this;
    searchWMSdbOnClick = (...args) => v.onClick.apply(null, args);
    bt_event.addEventListener('GUIEvent\\KM\\OnMouseDbClick', searchWMSdbOnClick);
  },
  destroyed() {},
  methods: {
    onClick(e){
      if(this.$store.state.isPlugDeactivateAll){
        this.requestFeature(e);
      }
    },
    requestFeature(e) {
      let v = this;
      const { x, y, z } = bt_Util.screenToWorld(e[1], e[2]);
      get(`/geom/getLayer/${x}/${y}/${this.DB}`).then(res=>{
        console.log(res)
        if(res && res.data){
          v.$store.commit('setdbClickedLayer', res.data);
          v.$store.commit('setdbClickedPosition',{x,y,z});
        }
      });
    }
  }
};
</script>

<style>
</style>