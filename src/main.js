import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import './assets/css/global.css'
import "element-ui/lib/theme-chalk/index.css"

import router from './router.js'
import './plugins/element.js'


axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

Vue.prototype.$axios = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
