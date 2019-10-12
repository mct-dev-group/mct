import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dbClickedLayer:'',
    isPlugDeactivateAll: true,
    plugList: [],
    showMenu:false,
    db: 'qibin_db'
  },
  mutations: {
    // 添加插件
    addPlug (state, plug) {
      state.plugList.push(plug);
    },
    // 移除插件
    removePlug (state, name) {
      let plugList = state.plugList;
      for (let i = 0; i < plugList.length; i++) {
        const plug = plugList[i];
        if (plug.name == name) {
          plugList.splice(i,1);
          break;
        }
      }
    },
    // 设置数据库
    setCurrentDB(state, db) {
      state.db = db;
    },
    setShowMenu(state,flag){
      state.showMenu=flag;
    },
    setPlugStatus(state,isPlugDeactivateAll) {
      state.isPlugDeactivateAll = isPlugDeactivateAll;
    },
    setdbClickedLayer(state,dbClickedLayer) {
        state.dbClickedLayer = dbClickedLayer;
    }
  },
  actions: {
    addPlug (context, plug) {
      context.commit('addPlug', plug);
    },
    removePlug (context, name) {
      context.commit('removePlug', name);
    }
  }
})
