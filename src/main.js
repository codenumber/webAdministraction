import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import TableTree from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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

Vue.use(VueQuillEditor)
Vue.component('zk-table',TableTree)

Vue.filter('datefmt',function (timestamp) {
  const time = new Date(timestamp*1000)
  const year = time.getFullYear()
  console.log(time.getMonth())
  const month = (time.getMonth() + 1 +'').padStart(2,'0')
  const date = (time.getDay() + '').padStart(2,'0')
  const hh = (time.getHours() + '').padStart(2,'0')
  const mm = (time.getMinutes() + '').padStart(2,'0')
  const ss = (time.getSeconds() + '').padStart(2,'0')
  return `${year}-${month}-${date} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
