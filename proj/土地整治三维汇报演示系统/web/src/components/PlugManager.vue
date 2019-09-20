<template>
  <div class="plugManager">
    <el-breadcrumb separator="|">
      <el-breadcrumb-item v-for="(plug, index) in plugList" :key="index">
        <el-dropdown @command="handleCommand" v-if="plug.children && plug.children.length > 0">
          <el-button style="border-radius: 0;border: 0;" :icon="plug.icon ? plug.icon : 'el-icon-menu'" :class="{ active: plug.isActive }"> {{plug.title}} <i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu class="plug_dropmenu" slot="dropdown">
            <el-dropdown-item :icon="sub.icon ? sub.icon : 'el-icon-menu'" v-for="(sub, i) in plug.children" :key="index+'_'+i" :class="{ active: sub.isActive }" :command="{plug, type: sub.type}">{{sub.title}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-else style="border-radius: 0;border: 0;" :icon="plug.icon ? plug.icon : 'el-icon-menu'" :class="{ active: plug.isActive }" @click="handleClick(plug)"> {{plug.title}}</el-button>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <el-button style="border-radius: 0;border: 0;bacground:none;" icon="el-icon-delete" @click="deactivateAll">清除</el-button>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'plug_manager',
  components: {
    
  },
  data () {
    return {
      plugList: []
    }
  },
  mounted () {
    this.plugList = this.$store.state.plugList;
  },
  methods: {
    handleClick (plug) {
      this.deactivateOtherPlug(plug);
      if (plug.isActive && plug.isActive == true) { //激活
        plug.isActive = false;
        plug.value.deactivate();
      } else { //未激活
        plug.isActive = true;
        plug.value.activate();
      }
      this.$forceUpdate();
    },
    handleCommand (command) {
      const {plug, type} = command;
      this.deactivateOtherPlug(plug);
      plug.isActive = false;
      plug.value.deactivate();
      const subs = plug.children;
      for (const sub of subs) {
        if (sub.type == type) {
          if (sub.isActive && sub.isActive == true) {
            sub.isActive = false;
          } else {
            sub.isActive = true;
            plug.isActive = true;;
            plug.value.activate(type);
          }
        } else {
          sub.isActive = false;
        }
      }
      this.$forceUpdate();
    },
    /**
     * @method deactivateOtherPlug 失活除去当前插件的其他互斥插件
     * @param curPlug 当前选中插件
     */
    deactivateOtherPlug (curPlug) {
      for (const plug of this.plugList) {
        if (curPlug.name == plug.name) continue; // 当前插件状态不改变
        if (curPlug.isIndependent && curPlug.isIndependent == true && plug.isIndependent && plug.isIndependent == true) { // 互斥插件
          if (plug.children && plug.children.length > 0) { // 下拉菜单
            plug.isActive = false;
            for (let sub of plug.children) {
              sub.isActive = false;
            }
          } else { // 无下拉菜单
            plug.isActive = false;
          }
          plug.value.deactivate();
        }
      }
    },
    /**
     * @method deactivateAll
     * @description 失活所有插件
     */
    deactivateAll () {
      for (const plug of this.plugList) {
        if (plug.children && plug.children.length > 0) {
          plug.isActive = false;
          for (let sub of plug.children) {
            sub.isActive = false;
          }
        } else {
          plug.isActive = false;
        }
        plug.value.deactivate();
      }
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
  .plugManager {
    height: 40px;
    z-index: 6;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 10px;
    top: 7px;
    background: white;
    
    .el-button:not(.active):focus {
      color: #606266;
    }
    .el-button:focus {
      background: none;
    }
    .el-button:hover {
      color: red;
      background: none;
    }
  }
  
  .plug_dropmenu .el-dropdown-menu__item:hover {
    color: red !important;
    background: none;
  }
  .active {
    color: red;
  }

</style>