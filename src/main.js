import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import Stock from './components/Stock.vue'
import Sell from './components/Sell.vue'
import Report from './components/Report.vue'
import Bought from './components/Bought.vue'
import OutinSum from './components/OutinSum.vue'

var myId = ""

export default myId

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
	{ path: '/', component: App},
	{ path: '/home', component: Home, params: true},
	{ path: '/stock', component: Stock, params: true},
	{ path: '/sell', component: Sell, params: true},
	{ path: '/report', component: Report, params: true},
	{ path: '/bought', component: Bought, params: true},
	{ path: '/outin', component: OutinSum, params: true}
];

const router = new VueRouter({
	routes,
	// mode: 'abstract'
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
