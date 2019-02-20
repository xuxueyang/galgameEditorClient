import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/account/login'
import AppManagement from '@/pages/app-management/app-management'
import AppList from '@/pages/app-management/app-list'
import AppDesign from '@/pages/app-design/app-design'
import AppFormDesign from '@/pages/app-design/app-form-design'
import AppFlowDesign from '@/pages/app-design/app-flow-design'
import OverallConfig from '@/pages/app-design/app-overall-config'
import AppPublish from '@/pages/app-design/app-publish'
import FormApply from '@/pages/app-apply/app-apply'
import AppAffair from '@/pages/app-affair/app-affair'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app-management',
      component: AppManagement,
      children: [
        {
          path: '',
          name: 'app-list',
          component: AppList
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/app-design',
      name: 'app-design',
      component: AppDesign,
      children: [
        {
          path: '/app-form-design/:appId',
          name: 'app-form-design',
          component: AppFormDesign
        },
        {
          path: '/app-flow-design/:appId',
          name: 'app-flow-design',
          component: AppFlowDesign
        },
        {
          path: '/app-overall-config/:appId',
          name: 'app-overall-config',
          component: OverallConfig
        },
        {
          path: '/app-publish/:appId',
          name: 'app-publish',
          component: AppPublish
        }
      ]
    },
    {
      path: '/app-apply/:appId',
      name: 'app-apply',
      component: FormApply
    },
    {
      path: '/app-affair/:appId/:status',
      name: 'app-affair',
      component: AppAffair
    }
  ]
})
