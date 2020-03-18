import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import qs from 'qs'

var baseUrl = 'http://localhost:8080/'
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$qs = qs
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
