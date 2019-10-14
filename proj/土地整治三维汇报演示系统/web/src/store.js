import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dbClickedLayer:'',
    dbClickedPosition:{},
    isPlugDeactivateAll: true,
    plugList: [],
    showMenu:false
  },
  mutations: {
    addPlug (state, plug) {
      state.plugList.push(plug);
    },
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
    setShowMenu(state,flag){
      state.showMenu=flag;
    },
    setPlugStatus(state,isPlugDeactivateAll) {
      state.isPlugDeactivateAll = isPlugDeactivateAll;
    },
    setdbClickedLayer(state,dbClickedLayer) {
        state.dbClickedLayer = dbClickedLayer;
    },
    setdbClickedPosition(state,Position) {
      console.log(Position)
        state.dbClickedPosition = Position;
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
