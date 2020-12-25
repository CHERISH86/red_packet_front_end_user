import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home.vue'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }
  ]
})
