import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { menuFormat, getPermissionList } from '@/utils'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    navList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_NAVLIST: (state, data) => {
      state.navList = data
      localStorage.setItem('menuList', JSON.stringify(data))
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.username_P).then(response => {
          const data = response.data
          setToken(data.id)
          commit('SET_TOKEN', data.id)
          // 菜单权限加工
          // const menu = menuFormat(data.baseMenus)
          // commit('SET_NAVLIST', menu)
          getPermissionList(menuFormat(data.baseMenus)).then(res => {
            commit('SET_NAVLIST', res)
            resolve()
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          // console.info(response)
          const data = response.data
          if (data.baseRoles && data.baseRoles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.baseRoles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          localStorage.setItem('userInfo', JSON.stringify(data))
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          localStorage.removeItem('menuList')
          localStorage.removeItem('userInfo')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
