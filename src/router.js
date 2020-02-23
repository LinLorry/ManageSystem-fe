import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Index = () => import('@/views/Index.vue');
const Home = () => import('@/views/Home.vue');
const Role = () => import('@/views/admin/Role.vue');
const Menu = () => import('@/views/admin/Menu.vue');
const WechatManage = () => import('@/views/admin/Wechat.vue');

const WechatLogin = () => import('@/views/wechat/Login.vue');

Vue.use(VueRouter);

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
      component: Index,
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
        },
        {
          path: '/wechatManage',
          name: 'wechat',
          component: WechatManage
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
