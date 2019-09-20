<template>
  <div class="pbfastreader">
    <input type="file" name="file" ref="pbInput" hidden @change="readPb">
  </div>
</template>

<script>
export default {
  name: 'plug_pbfastreader',
  data () {
    return {
      data () {
        return {
          pbName: null
        }
      }
    }
  },
  mounted () {
    this.$store.dispatch('addPlug', {
      name: this.$options.name,
      value: this,
      title: '查看pb文件',
      isActive: false,
      icon: 'fa fa-eye',
      isIndependent: false
    });
  },
  destroyed () {
    this.$store.dispatch('removePlug', this.$options.name); 
  },
  methods: {
    activate () {
      this.fastReader();
    },
    deactivate () {
      this.closePb();
    },
    fastReader () {
      $(this.$refs.pbInput).click();
    },
    readPb () {
      const pbFile = this.$refs.pbInput.files[0];
      if (pbFile.name.indexOf('.pb') < 0) {
        this.$message.error('选择的不是pb文件，请重试！！！');
        return false;
      }
      this.closePb();
      const url = URL.createObjectURL(pbFile);

      const pb_url = url.substring(0, url.lastIndexOf("/") + 1);
      const pb_name = url.substring(url.lastIndexOf("/") + 1);
      bt_Util.executeScript("Render\\RenderDataContex\\ModelScene\\OpenModelScene mc://" + pb_url + " " + pb_name + " 1;");
      this.pbName = pb_name;
      bt_Util.executeScript("Render\\ForceRedraw;");
    },
    closePb () {
      if (this.pbName) {
        bt_Util.executeScript(`Render\\RenderDataContex\\ModelScene\\CloseModelScene ${this.pbName};`);
        bt_Util.executeScript('Render\\ForceRedraw;');
        this.pbName = null;
      }
    },
  }
}
</script>

<style>

</style>