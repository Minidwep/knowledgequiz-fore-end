import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import qs from 'qs'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueQuillEditor from 'vue-quill-editor'
var baseUrl = 'http://localhost:8080'
axios.interceptors.response.use(undefined, (error) => {
  console.log("Error: " + error.response.status);
  if(error.response.status === 401){
    //全局登录过滤，当判读token失效或者没有登录时 返回登录页面
    router.replace({
        path: '/login',
        query: {redirect: router.currentRoute.fullPath}
    })
}
  return Promise.reject(error);
});
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$qs = qs
Vue.config.productionTip = false
Vue.prototype.$baseAxios = axios

Vue.use(VueQuillEditor, /* { default global options } */)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
