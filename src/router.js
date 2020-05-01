import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import('@/views/Login.vue');
const Index = () => import('@/views/Index.vue');
const Home = () => import('@/views/Home.vue');
const Wechat = () => import('@/views/Wechat');

const User = () => import('@/views/admin/User');
const Role = () => import('@/views/admin/Role.vue');
const Menu = () => import('@/views/admin/Menu.vue');
const WechatManage = () => import('@/views/admin/Wechat.vue');

const WechatLogin = () => import('@/views/wechat/Login');
const WechatInfo = () => import('@/views/wechat/Info');

const WechatIndex = () => import('@/views/wechat/Index');
const WechatProduct = () => import('@/views/wechat/product/Product');
const WechatProductDetail = () =>
  import('@/views/wechat/product/ProductDetail');
const WechatRecentFinishProcess = () =>
  import('@/views/wechat/product/RecentFinishProcess');
const WechatWorkloadStatistics = () =>
  import('@/views/wechat/worker/WorkloadStatistics');
const WechatMyWorkload = () => import('@/views/wechat/user/MyWorkload');

const Work = () => import('@/views/work/Work.vue');
const WorkCreator = () => import('@/views/work/WorkCreator');
const WorkDetail = () => import('@/views/work/WorkDetail');
const Process = () => import('@/views/work/Process');

const Worker = () => import('@/views/worker/Worker');
const WechatWorker = () => import('@/views/worker/WechatWorker');
const WorkloadStatistics = () => import('@/views/worker/WorkloadStatistics');

const ProductCreator = () => import('@/views/product/Creator');
const ProductDetail = () => import('@/views/product/Detail');
const UnCompleteProduct = () => import('@/views/product/Product');
const CompleteProduct = () => import('@/views/product/CompleteProduct');

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
      path: '/wechat/info',
      component: WechatInfo
    },
    {
      path: '/wechat',
      component: Wechat,
      children: [
        {
          path: '',
          component: WechatIndex
        },
        {
          path: 'product',
          component: WechatProduct
        },
        {
          path: 'product/:id',
          props: route => ({ detail: route.query.detail }),
          component: WechatProductDetail
        },
        {
          path: 'recentFinishProcess',
          component: WechatRecentFinishProcess
        },
        {
          path: 'worker/workloadStatistics',
          name: 'wechatWorkloadStatistics',
          component: WechatWorkloadStatistics
        },
        {
          path: 'user/myWorkload',
          name: 'wechatMyWorkload',
          component: WechatMyWorkload
        },
        {
          path: '*',
          redirect: '/wechat'
        }
      ]
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
        },
        {
          path: 'workloadStatistics',
          name: 'workloadStatistics',
          component: WorkloadStatistics
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
        },
        {
          path: 'detail/:id',
          name: 'productDetail',
          component: ProductDetail
        },
        {
          path: 'unComplete',
          name: 'unCompleteProductManage',
          component: UnCompleteProduct
        },
        {
          path: 'complete',
          name: 'completeProductManage',
          component: CompleteProduct
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
