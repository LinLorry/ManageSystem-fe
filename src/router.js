import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/Login.vue')
const Inedx = () => import('@/views/Index.vue')
const Home = () => import('@/views/Home.vue')
const Role = () => import('@/views/admin/Role.vue')
const Menu = () => import('@/views/admin/Menu.vue')

const WechatLogin = () => import('@/views/wechat/Login.vue')

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
      path: '/wechat/login',
      component: WechatLogin
    },
    {
      path: '/',
      component: Inedx,
      redirect: 'home',
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: '/roleManage',
          name: 'role',
          component: Role
        },
        {
          path: '/menuManage',
          name: 'menu',
          component: Menu
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
