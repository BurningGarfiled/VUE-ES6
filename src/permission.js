import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken, getLocal } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken() && getLocal().length > 0) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const nav = JSON.parse(localStorage.getItem('menuList'))
          store.dispatch('GenerateRoutes', nav).then(() => { // 根据roles权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else if (to.path.indexOf('redirect') >= 0 || to.name.indexOf('constant') >= 0 || to.name === 'Dashboard') {
        // 防止因重定向到公用无权限页造成beforeEach死循环
        next()
      } else {
        let isPermission = false
        const permissionList = JSON.parse(localStorage.getItem('menuList'))
        permissionList.forEach((v) => {
          // 判断跳转页面是否在权限列表中
          if (v.name === to.name) {
            isPermission = true
          }
        })
        // 没有权限时跳转到401页面
        if (!isPermission) {
          next({ path: '/401', replace: true })
        } else {
          next()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // location.reload()
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
