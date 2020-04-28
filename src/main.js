import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import TableTree from 'vue-table-with-tree-grid'

import './assets/css/global.css'
import "element-ui/lib/theme-chalk/index.css"

import router from './router.js'
import './plugins/element.js'


axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios

Vue.component('zk-table',TableTree)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
