<template>
  <div class="login-container">
    <img class = "logo" src = "@/assets/logo.png">
    <div class="header"/>
    <div class="title">自主容灾平台</div>
    <div class="main">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <!--<h3 class="title">自主容灾平台</h3>-->
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            name="password"
            auto-complete="on"
            placeholder="password"
            @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item class="el-form-item__login">
          <el-button :loading="loading" type="primary" size="medium" style="width:200px;" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
        <!--<div class="tips">-->
        <!--<span style="margin-right:20px;">username: admin</span>-->
        <!--<span> password: admin</span>-->
        <!--</div>-->
      </el-form>
    </div>
    <div class="footer"/>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 0) {
        callback(new Error('密码不能小于0位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'root',
        password: 'password',
        server: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__login {
    border: none;
    background: none;
    border-radius: 0;
    text-align: center;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#01121d;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  // background: $bg url(@/assets/background.jpg) no-repeat fixed center;
  /*background: #f0f2f5 url(../../static/img/background.a568162c.svg) no-repeat 50%;*/
  /*background-size: 100%;*/
  background: $bg;
  .logo {
    width: 190px;
    height: auto;
    max-width: 100%;
    display: block;
    float: left;
    margin: 5px 0;
  }
  .header {
    position: absolute;
    background: #1a2941;
    margin: 0 auto;
    width: 100%;
    height: 2px;
    top: 200px;
  }
  .main {
    position: absolute;
    background: #1a2941;
    margin: 220px auto;
    width: 100%;
    height: 300px;
  }
  .footer {
    position: absolute;
    background: #1a2941;
    margin: 0 auto;
    width: 60%;
    height: 2px;
    top: 534px;
    left: 50%;
    margin-left: -30%;
  }
  .login-form {
    position: relative;
    left: 0;
    right: 0;
    width: 400px;
    max-width: 100%;
    padding: 70px 35px 15px 35px;
    margin: 0 auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    position: absolute;
    background: #01121d;
    margin: 0 auto;
    width: 167px;
    z-index: 2;
    top: 184px;
    color: #eee;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
    left: 50%;
    margin-left: -84px;
    background-image: -webkit-linear-gradient(left,#10e8f4, #16c5f4 30%, #19b1f5 50%, #1ba9f5 80%, #1d9bf5);
    -webkit-background-clip: text;
    color:transparent;
    /*<!--font-size: 26px;-->*/
    /*<!--font-weight: 400;-->*/
    /*<!--color: $light_gray;-->*/
    /*<!--margin: 0px auto 40px auto;-->*/
    /*<!--text-align: center;-->*/
    /*<!--font-weight: bold;-->*/
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 12px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
