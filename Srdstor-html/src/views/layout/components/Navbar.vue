<template>
  <el-menu class="navbar" mode="horizontal">
    <img class = "logo" src = "@/assets/logo.png">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
      <div class="avatar-wrapper">
        <!--<img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
        <svg-icon icon-class="user" />
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item command="change">
          <span style="display:block;">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <span style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <change-password
      :show-dialog = "visible.changePasswordDialog"
      @handleDialogVisible = "visible.changePasswordDialog = false" />
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ChangePassword from '@/views/systemManage/components/changePassword'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ChangePassword
  },
  data() {
    return {
      visible: {
        changePasswordDialog: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    handleCommand(command) {
      if (command === 'change') {
        this.visible.changePasswordDialog = true
      } else if (command === 'logout') {
        this.logout()
      }
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  background: #31404d;
  border-radius: 0px !important;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2;
  .logo {
    width: 190px;
    height: auto;
    max-width: 100%;
    display: block;
    float: left;
    margin: 5px 0;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      /*line-height: initial;*/
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 20px;
        font-size: 12px;
      }
    }
  }
}
</style>

