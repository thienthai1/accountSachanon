import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './components/Home'

var myId = '7779'

export default myId

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
	{ path: '/home', component: Home, params: true}
];

const router = new VueRouter({
	routes,
	mode: 'history'
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
