import request from '@/utils/request'

// 登录
export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username: username,
      username_P: password
    }
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: 'v1/getUserMessage',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
