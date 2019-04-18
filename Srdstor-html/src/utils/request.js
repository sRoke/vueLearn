import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      // service.defaults.headers.common['token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.rc && Number(res.rc) !== 0) {
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.rc <= 6 && res.rc >= 1) {
        MessageBox.confirm(
          '权限已过期, 请重新登录',
          '确定登出',
          {
            cancelButtonClass: 'btn-custom-cancel',
            confirmButtonText: '重新登录',
            // cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        Message({
          message: store.state.returnCode.rcList[res.rc] || res.msg || res.errMsg || res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    } else if (res.retcode && Number(res.retcode) !== 0) {
      if (store.state.returnCode.rcList[res.retcode] || res.msg || res.errMsg || res.message) {
        Message({
          message: store.state.returnCode.rcList[res.retcode] || res.msg || res.errMsg || res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error, error.response) // for debug
    // if (error.response.status === 502) {
    //   Message({
    //     message: '服务器故障',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   console.log('err:' + error, error.response) // for debug
    // } else if (error.response.status === 404) {
    //   console.log('err:' + error, error.response) // for debug
    // } else {
    //   Message({
    //     message: error.response.statusText,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }
    // Message({
    //   message: error.response.statusText,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    /* if (error.response.status >= 500) {
      MessageBox.confirm(
        '服务器出现故障',
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }*/
    return Promise.reject(error)
  }
)

export default service
