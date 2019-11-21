import Vue from 'vue'
import Router from 'vue-router'

// 引入组件
import Login from './views/Login.vue'
import Register from './views/Register.vue'
// import Index from './views/Index.vue'
// import userlist from './views/userlist.vue'
// import useradd from './views/useradd.vue'
// import passwordedit from './views/passwordedit.vue'

// 注册路由
Vue.use(Router)

// 导出路由
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      component: () => import('./views/Index.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('./views/home.vue')
        },
        {
          path: '/userlist',
          name: 'userlist',
          component: () => import('./views/userlist.vue')
        },
        {
          path: '/VIPuser',
          name: 'VIPuser',
          component: () => import('./views/VIPuser.vue')
        },
        {
          path: '/passwordedit',
          name: 'passwordedit',
          component: () => import('./views/passwordedit.vue')
        },
        {
          path: '/procedureManagement',
          name: 'procedureManagement',
          component: () => import('./views/produce/procedureManagement.vue')
        },
        {
          path: '/processManagement',
          name: 'processManagement',
          component: () => import('./views/produce/processManagement.vue')
        },
        {
          path: '/procedureConfiguration',
          name: 'procedureConfiguration',
          component: () => import('./views/produce/procedureConfiguration.vue')
        },
        {
          path: '/createOrder',
          name: 'createOrder',
          component: () => import('./views/order/createOrder.vue')
        },
        {
          path: '/orderView',
          name: 'orderView',
          component: () => import('./views/order/orderView.vue')
        }
      ]
    }
  ]
})
