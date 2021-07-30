import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import User from '@/components/user/user.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      name:'login',
      path: '/login',
      component: Login
    },
    {
      name:'home',
      path: '/',
      component: Home,
      //在home组件中添加user组件，直接在本页指定位置显示
      children:[
        {name:'user',path:'/user',component:User}
      ]
    }
  ]
})
