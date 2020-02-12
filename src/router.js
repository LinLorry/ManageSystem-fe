import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/views/Login.vue')
const Inedx = () => import('@/views/Index.vue')
const Home = () => import('@/views/Home.vue')

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
      component: Inedx,
      redirect: 'home',
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
