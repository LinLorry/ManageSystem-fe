import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/Login.vue')
const Inedx = () => import('@/views/Index.vue')

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Inedx
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
