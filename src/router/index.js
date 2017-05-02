import Vue from 'vue'
import Router from 'vue-router'
import GSheetImporter from '@/components/GSheetImporter'
import ReportPage from '@/components/ReportPage'
import { Line } from 'vue-chartjs'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: GSheetImporter
    },
    {
      path: '/report',
      component: ReportPage
    }
  ]
})
