import Vue from 'vue'

import 'babel-polyfill'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { getRequest, postRequest, uploadFileRequest, deleteRequest, putRequest, getRequestParams } from './utils/restfulAPI'

import '@/styles/index.scss' // global css

import '../static/icon/iconfont.css' // 引入阿里字体图标库

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang'
import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // global filters
import './components/Common/install' // 引入全局组件

import * as globalFun from '@/utils/fun' // 引入全局函数组合
Vue.prototype.$gFun = globalFun // 挂载组合,直接this.$gFun.method调用

Vue.use(ElementUI, { size: Cookies.get('size') || 'mini', i18n: (key, value) => i18n.t(key, value) })

Object.keys(filters).forEach(key => { // register global utility filters.
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 对接restful APi交互方式工具类
Vue.prototype.getRequest = getRequest
Vue.prototype.uploadFileRequest = uploadFileRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.getRequestParams = getRequestParams

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
