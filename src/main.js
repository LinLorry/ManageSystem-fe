import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import Vant from 'vant';
import './axios';
import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/index.css';

Vue.use(ElementUI);
Vue.use(Vant);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
