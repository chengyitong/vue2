import Vue from 'vue'
import App from './App.vue'
// 引入并注册vue-router
import VueRouter from 'vue-router'
// 引入并注册vue-resource，用于添加动态数据
import VueResource from 'vue-resource'

// 开启debug模式
Vue.config.debug = true;

Vue.use(VueRouter)
Vue.use(VueResource)

// import Element from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
// Vue.use(Element)

// 定义组件或引入组件
import headercomponent from './components/headercomponent.vue'
var First = {
	template: '<div><h2>我是第一个子页面</h2></div>'
}
import secondcomponent from './components/secondcomponent.vue'

// 创建一个路由器实例
// 并配置路由规则
var router = new VueRouter({
	mode: 'history',
	base: __dirname,
	routes: [{
		path: '/header',
		component: headercomponent,
	}, {
		path: '/first',
		component: First
	}, {
		path: '/second',
		component: secondcomponent
	}]
})

// 现在可以启动应用了
// 路由器会创建一个App实例，并且挂载到选择符为 #app 匹配的元素上
var app = new Vue({
		router: router,
		el: '#app',
		render: h => h(App)
	})
	// 两个的写法一样效果
	// var app = new Vue({
	// 	router: router,
	//     render: h => h(App)
	// }).$mount('#app')