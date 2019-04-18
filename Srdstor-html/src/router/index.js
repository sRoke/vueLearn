import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: false,
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },

  {
    path: '/physical-resources',
    component: Layout,
    redirect: '/physical-resources/storage-pools',
    name: 'physicalResources',
    meta: { title: '物理资源', icon: 'physicalresources' },
    children: [
      {
        path: 'storage-pools',
        name: '存储池',
        component: () => import('@/views/physicalResources/storagePools/index'),
        meta: { title: '存储池', icon: 'storagepool' }
      },
      {
        path: 'physical-devices',
        name: '物理设备',
        component: () => import('@/views/physicalResources/physicalDevices/index'),
        meta: { title: '物理设备', icon: 'physicaldevice' }
      },
      {
        path: 'adapters',
        name: '物理适配器',
        component: () => import('@/views/physicalResources/adapters/index'),
        meta: { title: '物理适配器', icon: 'adapter' }
      }
    ]
  },

  {
    path: '/logical-resources',
    component: Layout,
    redirect: '/logical-resources/san-resources',
    name: 'logicalResources',
    meta: { title: '逻辑资源', icon: 'sanresource' },
    children: [
      {
        path: 'san-resources',
        name: '逻辑卷',
        component: () => import('@/views/logicalResources/sanResources/index'),
        meta: { title: '逻辑卷', icon: 'sanresource' }
      },
      {
        hidden: false,
        path: 'replication',
        name: '复制',
        component: () => import('@/views/logicalResources/replication/index'),
        meta: { title: '复制', icon: 'sanresource' }
      }
    ]
  },

  // {
  //   path: '/nas-resources',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'NAS管理',
  //       component: () => import('@/views/logicalResources/nasResources/index'),
  //       meta: { title: 'NAS管理', icon: 'form' }
  //     }
  //   ]
  // },

  {
    path: '/san-clients',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '客户端',
        component: () => import('@/views/client/sanClients/index'),
        meta: { title: '客户端', icon: 'client' }
      }
    ]
  },

  {
    path: '/client-agent',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '客户端管理',
        component: () => import('@/views/clientAgent/kylin/index'),
        meta: { title: '客户端管理', icon: 'user' }
      }
    ]
  },

  {
    path: '/auto-recover',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '一键恢复',
        component: () => import('@/views/autoRecover/index'),
        meta: { title: '一键恢复', icon: 'instantrecovery' }
      }
    ]
  },

  {
    path: '/system-manage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '系统配置',
        component: () => import('@/views/systemManage/index'),
        meta: { title: '系统配置', icon: 'systemSettings' }
      }
    ]
  },

  {
    path: '/history',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '日志信息',
        component: () => import('@/views/history/index'),
        meta: { title: '日志信息', icon: 'log' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
