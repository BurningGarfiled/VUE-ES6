import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}
