import Vue from 'vue'
import Router from 'vue-router'
import GSheetImporter from '@/components/GSheetImporter'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: GSheetImporter
    }
  ]
})
