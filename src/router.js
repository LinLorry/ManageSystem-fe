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
const WorkCreator = () => import('@/views/work/WorkCreator');
const WorkDetail = () => import('@/views/work/WorkDetail');
const Process = () => import('@/views/work/Process');

const Worker = () => import('@/views/worker/Worker');
const WechatWorker = () => import('@/views/worker/WechatWorker');

const ProductCreator = () => import('@/views/product/Creator');

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
      path: '/admin',
      component: Index,
      children: [
        {
          path: 'userManage',
          name: 'user',
          component: User
        },
        {
          path: 'roleManage',
          name: 'role',
          component: Role
        },
        {
          path: 'wechatManage',
          name: 'wechat',
          component: WechatManage
        },
        {
          path: 'menuManage',
          name: 'menu',
          component: Menu
        }
      ]
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
          path: 'createWork',
          name: 'workCreator',
          component: WorkCreator
        },
        {
          path: 'workDetail/:id',
          component: WorkDetail
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
      path: '/product',
      component: Index,
      children: [
        {
          path: 'create',
          name: 'createProduct',
          component: ProductCreator
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
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});
