import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

import home from '@/components/home/home'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }, {
      path: '/home',
      name: 'home',
      component: home
    }
  ]
})

export default router
