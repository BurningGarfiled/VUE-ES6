/*
 * @Description:
 * @Version:
 * @Company: 杭州凯立通信有限公司
 * @Author: Jesen
 * @Date: 2018-11-27 15:58:11
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2018-11-28 11:15:49
 */
import { constantRouterMap, baseRouterMap } from '@/router/index'
// import store from './store'

/**
 * 根据权限匹配路由
 * @param {array} asyncRouterMap 权限列表（所有权限菜单数据列表）
 * @param {array} baseRouterMap 基础路由列表
 */
function routerMatch(asyncRouterMap, baseRouterMap) {
  // 创建路由
  function createRouter(baseRouterMap) {
    baseRouterMap.forEach((item) => {
      // 先判断是否是一级的虚拟路由项
      if ('alwaysShow' in item && item.alwaysShow === false) {
        // 判断asyncRouterMap权限菜单数据列表中是否有该path
        for (const elem of asyncRouterMap) {
          if (item.children[0].path === elem.path) {
            item.hidden = false
            return
          }
        }
      } else {
        for (const elem of asyncRouterMap) {
          if (item.path === elem.path) { // 路由存在权限菜单中，状态改为显示
            item.hidden = false
            if ('permission' in elem) {
              item.meta.permission = elem.permission
            }
            // 存在子路由，继续遍历下级子路由，递归调用
            if (item.children && item.children.length) {
              // 递归
              createRouter(item.children)
            }
            return
          } else {
            item.hidden = true
          }
        }
      }
    })
  }
  createRouter(baseRouterMap)
  return baseRouterMap
}

let asyncRouterMap = []
let accessedRouters = []

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        if (data) {
          asyncRouterMap = data
        }

        if (asyncRouterMap.length > 0) {
          accessedRouters = routerMatch(asyncRouterMap, baseRouterMap)
        }
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
