<template>
  <el-form :model="form" :rules="rules2" ref="form" label-position="left" label-width="0px" class="loginform">
    <div class="loginTop">
    </div>
    <div class="loginMain">
      <div class="loginTitle" v-bind:class="{'titleOp': nameFocus}">
        <span class="numIcon"></span>
        <span>账号</span>
      </div>
      <el-form-item prop="account" v-bind:class="{'loginFocus': nameFocus}">
        <el-input type="text" v-model="form.account" auto-complete="off" placeholder="输入账号" @blur="blurInput(0)" @focus="focusInput(0)"></el-input>
        <div class="loginClose" v-show="form.account != ''" @click="clearInput(0)"></div>
      </el-form-item>
      <div class="loginTitle" v-bind:class="{'titleOp': pswFocus}">
        <span class="pswIcon"></span>
        <span>密码</span>
      </div>
      <el-form-item prop="password" v-bind:class="{'loginFocus': pswFocus}">
        <el-input type="password" v-model="form.password" auto-complete="off" placeholder="输入密码" @blur="blurInput(1)" @focus="focusInput(1)" @keyup.enter="handleSubmit2">
        </el-input>
        <div class="loginClose" v-show="form.password != ''" @click="clearInput(1)"></div>
      </el-form-item>
      <el-form-item>
      <div class="no_rem" v-bind:class="{'rem': ifrem}" @click="remember()" ></div><div class="log1">保持登录</div>
      </el-form-item>
      <el-form-item style="width:100%;" class="tx-c p-t-5">
        <el-button type="primary" class="loginBtn" :disabled="disable" @click.native.prevent="handleSubmit2">登录</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
  import http from '../../assets/js/http'

  export default {
    data() {
      return {
        zz: 0,
        ifrem: false,
        title: '',
        disable: false,
        form: {
          account: '',
          password: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        checked: false,
        nameFocus: false,
        pswFocus: false
      }
    },
    methods: {
      checkLoginOvertime() {
        let postData = {
          authKey: Lockr.get('authKey'),
          sessionId: Lockr.get('sessionId')
        }
        this.apiPost('base/isLoginOutOfTime', postData).then((res) => {
          if (res.code != 200) {
                // 登录未过期
              this.$router.replace('/service/demand/demandlist')
          }
        })
      },
      remember() {
        if (this.zz % 2 == 0) {
          this.ifrem = true
          this.zz++
        } else if (this.zz % 2 == 1) {
          this.ifrem = false
          this.zz++
        }
      },
      handleSubmit2() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.disable = !this.disable
            let data = {
              user_name: this.form.account,
              user_psw: this.form.password
            }
            // console.log(data)
            this.apiPost('Base/login', data).then((res) => {
              // console.log('res = ', res)
              if (res.code != 200) {
                this.disable = !this.disable
                _g.dealError(this, res)
              } else {
                _g.resetCommonData(this, res.data)
                sessionStorage.setItem('u_id', res.data.userInfo.u_id)
                if (this.ifrem == true) {
                  Lockr.set('userInfos', data)
                } else {
                  Lockr.set('userInfos', null)
                }
                // console.log(Lockr.get('userInfos'))
                _g.toastMsg(this, 'success', '登录成功')
              }
            })
          } else {
            return false
          }
        })
      },
      clearInput(type) {
        if (type == 0) {
          this.form.account = ''
        } else {
          this.form.password = ''
        }
      },
      focusInput(type) {
        if (type == 1) {
          this.pswFocus = true
        } else {
          this.nameFocus = true
        }
      },
      blurInput(type) {
        if (type == 1) {
          this.pswFocus = false
        } else {
          this.nameFocus = false
        }
      }
    },
    created() {
      this.checkLoginOvertime()
      if (Lockr.get('userInfos') == null) {
        this.ifrem = false
      } else {
        this.ifrem = true
        this.form.account = Lockr.get('userInfos').user_name
        this.form.password = Lockr.get('userInfos').user_psw
      }
      this.apiPost('base/getConfigs').then((res) => {
        if (res.code == 200) {
          document.title = res.data.data.system_name
        } else {
          _g.dealError(this, res)
        }
      })
    },
    mixins: [http]
  }
</script>

<style>
.loginform {
  width: 480px;
  background-color: #ffffff;
  margin: 120px auto;
}
.loginMain {
  padding: 20px 100px 5px;
}
.loginMain .el-input__inner {
  border: 0;
  border-radius: 0;
  border-bottom: 1px solid #eeeeee;
  padding-right: 28px;
  text-align: center;
  color: #999999;
}
.loginFocus .el-input__inner {
  color: #333333;
  border-color: #00a3ff;
}
.loginClose {
  position: absolute;
  top: 8px;
  right: 0;
  width: 25px;
  height: 25px;
  background: url(../../assets/images/loginMain.png) no-repeat -96px 2px;
}
.loginTop {
  width: 100%;
  height: 136px;
  background: url(../../assets/images/loginTop.png) no-repeat;
  border-bottom: 1px solid #f5f5f5;
}
.loginTitle {
  width: 100%;
  height: 25px;
  line-height: 25px;
  color: #007dc4;
  font-size: 16px;
  font-weight: bold;
  opacity: 0.4;
}
.titleOp {
  opacity: 1;
}
.loginTitle span {
  display: block;
  float: left;
}
.numIcon {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  background: url(../../assets/images/loginMain.png) no-repeat 0px 2px;
}
.pswIcon {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  background: url(../../assets/images/loginMain.png) no-repeat -49px 2px;
}
.loginBtn {
  width: 220px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 100px;
  background-color: #007dc4 !important;
  border-color: #007dc4 !important;
  color: #ffffff !important;
}
.loginBtn:hover {
  background-color: #1a8aca !important;
  border-color: #1a8aca !important;
}
.loginBtn:active {
  background-color: #0070b0 !important;
  border-color: #0070b0 !important;
}
.no_rem{
    width: 20px;
    height: 18px;
    display: inline-block;
    top: 4px;
    background: url("../../assets/images/loginMain.png");
    background-position: -145px 0px ;
    cursor: pointer;
    position: relative;
  }
  .rem{
    background-position: -194px 0px
  }
  .log1{
    position: relative;
    display: inline;
    margin-left: 10px;
  }
</style>