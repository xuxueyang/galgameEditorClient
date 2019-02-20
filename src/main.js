// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUIs from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'font-awesome/css/font-awesome.min.css'
import {httpProdPlugin, loginPlugin, httpProd} from '@cube-vue-pc/prod-http'
import store from './store'

Vue.use(VueQuillEditor)
Vue.use(ElementUIs)
Vue.use(httpProdPlugin)
Vue.use(loginPlugin, process.env)
httpProd.set('CubeProdFengyunOAModule', process.env)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
