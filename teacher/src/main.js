import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import qs from 'qs'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import 'bootstrap'
import $ from 'jquery'

var baseUrl = 'http://localhost:8080'
Vue.prototype.$baseUrl = baseUrl
Vue.prototype.$qs = qs
Vue.config.productionTip = false
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use($)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
