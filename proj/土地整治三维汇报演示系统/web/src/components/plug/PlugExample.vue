<!-- 插件示例 -->
<template>
</template>

<script>
export default {
  name: 'plug_plugexample',
  data () {
    return {

    }
  },
  mounted () {
    this.$store.dispatch('addPlug', {
      name: this.$options.name,
      value: this,
      title: '插件示例',
      isActive: false, //是否激活
      icon: '', //图标
      isIndependent: true, // 是否是单独的功能
      children: [
        {
          title: '按钮1',
          type: '1',
          icon: '',
          isActive: false
        },
        {
          title: '按钮2',
          type: '2',
          icon: '',
          isActive: false
        },
        {
          title: '按钮3',
          type: '3',
          icon: '',
          isActive: false
        }
      ]
    });
  },
  destroyed () {
    this.$store.dispatch('removePlug', this.$options.name);
  },
  methods: {
    activate (type) {
      console.log('激活插件',type);
    },
    deactivate () {
      console.log('失活插件');
    }
  }
}
</script>

<style>
</style>