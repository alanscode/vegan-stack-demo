import Vue from 'vue'
import Router from 'vue-router'
import Todos from '@/components/Todos'
import NewPage from '@/components/NewPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Todos
    },
    {
      path: 'newpage',
      name: 'newpage',
      component: NewPage
    }
  ]
})
