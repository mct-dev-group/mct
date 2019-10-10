import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      children: [
        {
          path: '',
          name: 'matrix',
          component: () => import('@/components/Matrix.vue')
        }
      ]
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/Index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test.vue')
    }
  ]
})
