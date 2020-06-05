import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    children: [{
      path: 'user',
      name: 'User',
      component: () => import('@/views/user/index'),
      meta: {
         title: '用户管理', 
         icon: 'user' }
    }]
  },
  {
    path: '/team',
    component: Layout,
    redirect: '/team',
    children: [{
      path: 'team',
      name: 'Team',
      component: () => import('@/views/device/index'),
      meta: { title: '设备管理', icon: 'table'}
    }]
  },
  {
    path: '/checkAccount',
    component: Layout,
    redirect: 'noRedirect',
    meta:{title: '审核账单', icon: 'tree',},
    children: [{
      path: 'noCheck',
      name: 'NoCheck',
      component: () => import('@/views/checkAccount/index'),
      meta: { title: '待审核', icon: 'tree',}
    },
    {
      path: 'hasCheck',
      name: 'HasCheck',
      component: () => import('@/views/checkAccount/passAccount'),
      meta: { title: '审核通过', icon: 'tree',}
    },
    {
      path: 'hasNoCheck',
      name: 'HasNoCheck',
      component: () => import('@/views/checkAccount/noPassAccount'),
      meta: { title: '审核未通过', icon: 'tree',}
    },
  ]
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/course',
    redirect: 'noRedirect',
    meta:{title: '我的账单', icon: 'form',},
    children: [{
      path: 'course',
      name: 'Course',
      component: () => import('@/views/myAccount/index'),
      meta: { title: '待审核', icon: 'form'}
    },
    {
      path: 'noPass',
      name: 'NoPass',
      component: () => import('@/views/myAccount/checkFail'),
      meta: { title: '审核失败', icon: 'form'}
    },
    {
      path: 'pass',
      name: 'Pass',
      component: () => import('@/views/myAccount/checkSuccess'),
      meta: { title: '审核成功', icon: 'form'}
    },
  ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system',
    children: [{
      path: 'system',
      name: 'System',
      component: () => import('@/views/system/index'),
      meta: { title: '个人中心', icon: 'nested'}
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
