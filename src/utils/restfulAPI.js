/*
 * @Description:
 * @Version:
 * @Company: 杭州凯立通信有限公司
 * @Author: Jesen
 * @Date: 2018-11-28 14:46:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2018-11-28 14:48:29
 */
import service from './request'
// restful API接口请求方式设置
const base = ''

export const postRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return service({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const putRequest = (url, params) => {
  return service({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    // transformRequest就是在axios发送数据之前对需要发的数据进行处理，可以在这里附加token和uid然后返回data。
    // transformRequest: [function(data) {
    //     let ret = ''
    //     for (let it in data) {
    //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    //     }
    //     return ret
    // }],
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const deleteRequest = (url, params) => {
  return service({
    method: 'delete',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url) => {
  return service({
    method: 'get',
    url: `${base}${url}`
  })
}
export const getRequestParams = (url, params) => {
  return service({
    method: 'get',
    url: `${base}${url}`,
    params: params
  })
}
