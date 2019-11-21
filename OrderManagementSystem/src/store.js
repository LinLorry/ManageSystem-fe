import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  // 状态
  state: {
    userinfo: JSON.parse(localStorage.getItem('userinfo')),
    userList: []
  },

  // 操作state
  mutations: {
    // 保存用户数据
    SAVE_USERINFO (state, userinfo) {
      // console.log('函数被触发')
      // state.userinfo = userinfo
      // console.log('赋值后的用户信息：', state.userinfo)
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
      state.userinfo = userinfo
    },
    GET_USERLIST (state, userlist) {
      state.userList = userlist
    }
  },
  // commit mutations 由matations来改变状态
  actions: {
    GET_USERLIST ({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/getuserlist').then(response => {
          commit('GET_USERLIST', response.data)
          resolve()
        })
      })
    }
  },

  // 全局共享属性getters
  getters: {
    vipUsers: state => state.userList.filter(v => v.age > 25)
  }
})
