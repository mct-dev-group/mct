import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'font-awesome/css/font-awesome.min.css';

import echarts from 'echarts';


import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

window.$Vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
