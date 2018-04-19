import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Lockr from 'lockr'
import Cookies from 'js-cookie'
import _ from 'lodash'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import routes from './routes'
import VueRouter from 'vue-router'
import store from './vuex/store'
import filter from './assets/filter'
import _g from './assets/js/global'
import NProgress from 'nprogress'       //  页面顶部进度条
import 'nprogress/nprogress.css'
import 'assets/css/global.css'
import 'assets/css/base.css'
// import echarts from 'echarts'

let imgUrl = ''
let HOST = ''
if (process.env.__PE__) { // __PE__ 是否为正式环境的配置
  if (process.env.NODE_ENV == 'development') {
    imgUrl = 'http://api.laisj.com/'
  } else if (process.env.NODE_ENV == 'production') {
    imgUrl = 'http://api.laisj.com/'
  }
  if (process.env.NODE_ENV == 'development') {
    HOST = 'http://api.laisj.com/index.php/admin/'
  } else if (process.env.NODE_ENV == 'production') {
    HOST = 'http://api.laisj.com/index.php/admin/'
  }
} else {
  if (process.env.NODE_ENV == 'development') {
    imgUrl = 'https://dev1483006858api.honghaiweb.com/'
  } else if (process.env.NODE_ENV == 'production') {
    imgUrl = 'https://dev1483006858api.honghaiweb.com/'
  }
  if (process.env.NODE_ENV == 'development') {
    HOST = 'https://dev1483006858api.honghaiweb.com/index.php/admin/'
  } else if (process.env.NODE_ENV == 'production') {
    HOST = 'https://dev1483006858api.honghaiweb.com/index.php/admin/'
  }
}
// 正式环境
// if (process.env.NODE_ENV == 'development') {
//   imgUrl = 'https://dev1483006858api.honghaiweb.com/'
// } else if (process.env.NODE_ENV == 'production') {
//   imgUrl = 'http://api.laisj.com/'
// }
// let HOST = ''
// if (process.env.NODE_ENV == 'development') {
//   HOST = 'https://dev1483006858api.honghaiweb.com/index.php/admin/'
// } else if (process.env.NODE_ENV == 'production') {
//   HOST = 'http://api.laisj.com/index.php/admin/'
// }

// // 开发环境
// if (process.env.NODE_ENV == 'development') {
//   imgUrl = 'https://dev1483006858api.honghaiweb.com/'
// } else if (process.env.NODE_ENV == 'production') {
//   imgUrl = 'https://dev1483006858api.honghaiweb.com/'
// }
// let HOST = ''
// if (process.env.NODE_ENV == 'development') {
//   HOST = 'https://dev1483006858api.honghaiweb.com/index.php/admin/'
// } else if (process.env.NODE_ENV == 'production') {
//   HOST = 'https://dev1483006858api.honghaiweb.com/index.php/admin/'
// }

// cn 测试环境
// if (process.env.NODE_ENV == 'development') {
//   imgUrl = 'http://file.laisj.com/'
// } else if (process.env.NODE_ENV == 'production') {
//   imgUrl = 'http://file.laisj.com/'
// }
// let HOST = ''
// if (process.env.NODE_ENV == 'development') {
//   HOST = 'http://api.laisj.cn/admin/'
// } else if (process.env.NODE_ENV == 'production') {
//   HOST = 'http://api.laisj.cn/admin/'
// }

axios.defaults.baseURL = HOST

axios.defaults.headers.authkey = Lockr.get('authKey')
axios.defaults.headers.sessionid = Lockr.get('sessionId')
axios.defaults.headers['Content-Type'] = 'application/json'

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const hideLeft = to.meta.hideLeft
  store.dispatch('showLeftMenu', hideLeft)
  NProgress.start()
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

Vue.use(ElementUI)
Vue.use(VueRouter)

window.router = router
window.store = store
window.HOST = HOST
window.imgUrl = imgUrl
window.axios = axios
window._ = _
window.moment = moment
window.Lockr = Lockr
window.Cookies = Cookies
window._g = _g
// window.echarts = echarts

// 需求、订单合同产品信息数据
// 设计类型
window.conDesignType = ['全新设计', '迭代设计', '参考设计', '部分部件设计']
// 设计输出
window.conDesignOutput = ['数据分析调研类（副）', '概念图或手绘草图（副）', '平面效果图（副）', '三维数据（副）', '丝印文件图（副）', '手板模型（副）']
// 目标市场
window.conMarket = ['内销', '西欧', '东欧', '南欧', '北欧', '北美', '南美', '日韩', '东南亚', '中东', '澳洲', '非洲', '其他地区']
// 产品定位
window.conPosition = ['高端', '高中端', '中端', '中低端', '低端']
// 适用人群
window.conPeople = ['婴童类', '居家女性', '职场女性', '职场男性', '老年类', '户外人群', '不确定']
// 主要材质
window.conMaterial = ['ABS', '塑料', '不锈钢', '镀铬件', '钣金材料', 'PMAA(有机玻璃)', 'PC', 'PV', '橡胶', '木质']
// 控制面板
window.conPanel = ['电子', '机械']

var isIE
var userAgent = navigator.userAgent
var rMsie = /(msie\s|trident.*rv:)([\w.]+)/
var ua = userAgent.toLowerCase()
var match = rMsie.exec(ua)
if (match != null) {
  isIE = { browser: 'IE', version: parseInt(match[2]) || '0' }
} else {
  isIE = false
}
if (!isIE || isIE.version > 9) {
  new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: { App }
    // render: h => h(Login)
  }).$mount('#app')
}