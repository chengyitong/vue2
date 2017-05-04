<template>
  <div class="wrap">
    <div class="logo"></div>
    <p class="title">魔方校园APP后台管理系统</p>
    <form action="" class="form" id="loginForm">
      <div class="input-box">
        <input type="text" id="adminname" name="adminname" placeholder="请输入管理员账号" required>
      </div>

      <div class="input-box">
        <input type="password" id="password" name="password" placeholder="请输入登录密码" required>
      </div>

      <button type="button" id="loginBtn" onclick="login()">登录</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*
* author 成一通
* 2017.04.07 10:58 
*/
body,
html {
    font-family: "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei", "\9ED1\4F53", Arial, sans-serif;
    color: #333;
    font-size: 14px;
    background: url('assets/images/login_bg.jpg') bottom center no-repeat;
    background-size: cover;
    background-attachment: fixed;
}

.wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -210px 0 0 -160px;
    width: 320px;
    height: 420px;
    text-align: center;
}

.logo {
    margin: 0 auto 20px;
    width: 100px;
    height: 100px;
    background: url('/src/assets/common/images/logo.png') center center no-repeat;
    background-size: cover;
    border-radius: 8px;
}

.title {
    margin: 0 auto 60px;
    font-size: 16px;
    color: #fff;
}

.input-box {
    margin: 0 auto 20px;
    width: 300px;
    height: 50px;
    border-radius: 50px;
    overflow: hidden;
}

.input-box:hover {
    background-color: rgba(0, 0, 0, .5);
    box-shadow: 0 0 10px rgba(255, 255, 255, .5);
}

.input-box input {
    width: 298px;
    text-align: center;
    height: 48px;
    line-height: 48px;
    border-radius: 50px;
    background: none\0;
    *background: none;
    outline-style: none;
    -webkit-appearance: none;
    background-color: rgba(0, 0, 0, .2);
    border: 1px solid rgba(0, 0, 0, .2);
    color: #fff;
}

.input-box input::-webkit-input-placeholder {
    color: #eee;
}

.form button {
    margin: 20px auto 0;
    width: 300px;
    height: 50px;
    background-color: rgba(0, 0, 0, .2);
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 50px;
    overflow: hidden;
    font-size: 16px;
    color: #fff;
}

.form button:hover {
    background-color: rgba(0, 0, 0, .5);
    border: 1px solid rgba(0, 0, 0, .15);
    box-shadow: 0 0 10px rgba(255, 255, 255, .5);
}

</style>
