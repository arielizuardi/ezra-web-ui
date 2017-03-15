// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import GSignInButton from 'vue-google-signin-button'


Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueMaterial)
Vue.use(GSignInButton)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App, VueMaterial, GSignInButton }
})
