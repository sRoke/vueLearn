import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
// import enlocale from 'element-ui/lib/locale/lang/en' // lang i18n
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/icons/icon/iconfont.css'
import '@/icons/icon/iconfont.js'

import '@/permission' // permission control
import * as filters from './filters' // global filters

import VCharts from 'v-charts'
// import 'v-charts/lib/style.css'
import elDragDialog from '@/directive/el-dragDialog'
Vue.use(elDragDialog)
Vue.use(ElementUI, { zhLocale, size: 'mini' })
Vue.use(VCharts)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
