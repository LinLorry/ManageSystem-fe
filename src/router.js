import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Index = () => import('@/views/Index.vue');
const Home = () => import('@/views/Home.vue');

const User = () => import('@/views/admin/User');
const Role = () => import('@/views/admin/Role.vue');
const Menu = () => import('@/views/admin/Menu.vue');
const WechatManage = () => import('@/views/admin/Wechat.vue');

const WechatLogin = () => import('@/views/wechat/Login.vue');

const Work = () => import('@/views/work/Work.vue');
const Process = () => import('@/views/work/Process');

const Worker = () => import('@/views/worker/Worker');
const WechatWorker = () => import('@/views/worker/WechatWorker');

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
      path: '/work',
      component: Index,
      children: [
        {
          path: 'workManage',
          name: 'work',
          component: Work
        },
        {
          path: 'processManage',
          name: 'process',
          component: Process
        }
      ]
    },
    {
      path: '/worker',
      component: Index,
      children: [
        {
          path: 'workerManage',
          name: 'worker',
          component: Worker
        },
        {
          path: 'wechatWorkerManage',
          name: 'wechatWorker',
          component: WechatWorker
        }
      ]
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
          path: '/userManage',
          name: 'user',
          component: User
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
