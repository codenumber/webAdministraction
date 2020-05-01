import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/Users/User.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/roles.vue'
import Cates from './components/goods/Cates.vue'
import Params from './components/goods/Params.vue'
import GoodsList from './components/goods/List.vue'
import AddGoods from './components/goods/Add.vue'
import Order from './components/order/Order.vue'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome',children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cates },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList},
      { path: '/goods/add', component: AddGoods},
      { path: '/orders', component: Order}
    ]},
  ]
})

router.beforeEach((to,from,next) => {
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
