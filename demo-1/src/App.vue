<template>
  <div id="app">
    <headercomponent></headercomponent>
    <img src="./assets/images/logo.png">
    <h1>{{ msg }}</h1>
    <!-- 3. 使用组件 -->
    <firstcomponent></firstcomponent>
    <ul>
      <li><router-link to="/first">点击跳转到第一个页面</router-link></li>
      <li><router-link to="/second">点击跳转到第二个页面</router-link></li>
      <li><router-link to="/header">点击跳转到头部页面</router-link></li>
    </ul>
    <router-view></router-view>
    <footercomponent></footercomponent>
  </div>
</template>

<script>
import './assets/css/style.css'
// 1. 引入vue组件
import headercomponent from './components/headercomponent.vue'
import firstcomponent from './components/firstcomponent.vue'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  // 2. 注册组件
  components: {
    headercomponent,
    firstcomponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}
</style>
