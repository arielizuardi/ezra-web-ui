import Vue from 'vue'
import Router from 'vue-router'
import ImportSheets from '@/components/ImportSheets'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: ImportSheets
    }
  ]
})
