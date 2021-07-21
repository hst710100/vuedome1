// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';//引入对应ui组件
import 'element-ui/lib/theme-chalk/index.css'; //组件样式，必须引入

import '@/assets/publicstyle/login.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // render:(h)=>h(App),
  components: { App },
  template: '<App/>'
})
