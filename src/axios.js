'use strict';

import Vue from 'vue';
import axios from 'axios';
import router from './router';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const _axios = axios.create();

let loginFlag = false;

_axios.interceptors.request.use(
  function(config) {
    let token = localStorage.getItem('token');
    if (token) {
      token = 'manage ' + token;
      config.headers['Authorization'] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    if (response.data && response.data.status !== 1 && response.data.message) {
      Vue.prototype.$message({
        type: 'error',
        message: response.data.message,
        showClose: true,
        center: true
      });
      throw new Error();
    }
    return response;
  },
  function(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!loginFlag) {
            loginFlag = true;
            if (localStorage.getItem('platform') === 'wechat') {
              localStorage.clear();
              router.push({ path: '/wechat/login' });
            } else {
              let message;
              if (localStorage.getItem('token')) {
                message = '登陆信息过期，请重新登陆';
              } else {
                message = '请登陆';
              }

              Vue.prototype.$message({
                type: 'error',
                message: message,
                showClose: true,
                center: true
              });
              localStorage.clear();
              router.push({ path: '/login' });
            }
          }

          break;
        default:
          Vue.prototype.$message({
            type: 'error',
            message: '出现错误',
            showClose: true,
            center: true
          });
      }
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
    $loginFlag: {
      get() {
        return loginFlag;
      },
      set(v) {
        if (typeof v === 'boolean') {
          loginFlag = v;
        } else {
          throw new Error('loginFlag must be boolean');
        }
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
