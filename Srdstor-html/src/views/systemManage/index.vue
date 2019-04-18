<template>
  <keep-alive>
    <main class="l-system-manage-container">
      <div class="l-system-manage-container__title">系统配置</div>
      <section class="l-system-manage-container__header">
        <div style="padding: 10px 20px;">
          <ul class="l-system-manage-container__list">
            <li class="l-system-manage-container__item">
              <el-button type="primary" circle @click="shutdown">
                <i class="iconfont icon-restart l-system-manage-container__item--icon"/>
              </el-button>
              <div class="l-system-manage-container__item--name">关机</div>
            </li>
            <li class="l-system-manage-container__item">
              <el-button type="primary" plain circle @click="restart">
                <i class="iconfont icon-close l-system-manage-container__item--icon"/>
              </el-button>
              <div class="l-system-manage-container__item--name">重启</div>
            </li>
            <li class="l-system-manage-container__item">
              <el-button type="primary" plain circle @click="visible.handleDownloadDialog = true">
                <i class="iconfont icon-excel l-system-manage-container__item--icon"/>
              </el-button>
              <div class="l-system-manage-container__item--name">智能报表</div>
            </li>
            <li class="l-system-manage-container__item">
              <el-button type="primary" plain circle @click="visible.setNICDialog = true">
                <i class="iconfont icon-networkPort l-system-manage-container__item--icon"/>
              </el-button>
              <div class="l-system-manage-container__item--name">网卡列表</div>
            </li>
            <li class="l-system-manage-container__item">
              <el-button type="primary" plain circle @click="visible.emailNotificationDialog = true">
                <i class="iconfont icon-email l-system-manage-container__item--icon"/>
              </el-button>
              <div class="l-system-manage-container__item--name">邮件通知</div>
            </li>
          </ul>
        </div>
      </section>
      <email-notification
        :show-dialog = "visible.emailNotificationDialog"
        @handleDialogVisible = "visible.emailNotificationDialog = false" />
      <set-ip
        :show-dialog = "visible.setIpDialog"
        @handleDialogVisible = "visible.setIpDialog = false" />
      <handle-download
        :show-dialog = "visible.handleDownloadDialog"
        @handleDialogVisible = "visible.handleDownloadDialog = false" />
      <nic
        :show-dialog = "visible.setNICDialog"
        @handleDialogVisible = "visible.setNICDialog = false" />
    </main>
  </keep-alive>
</template>

<script>
import { shutdown, restart } from '@/api/SRDstor/systemManage'
import EmailNotification from './components/emailNotification'
import HandleDownload from './components/handleDownload'
import SetIp from './components/setIp'
import Nic from './components/NIC'
export default {
  name: 'Index',
  components: {
    EmailNotification,
    HandleDownload,
    SetIp,
    Nic
  },
  data() {
    return {
      visible: {
        changePasswordDialog: false,
        setIpDialog: false,
        emailNotificationDialog: false,
        handleDownloadDialog: false,
        setNICDialog: false
      }
    }
  },
  methods: {
    formatMessageBox(action, type, params, name, request) {
      const h = this.$createElement
      this.$msgbox({
        title: `${action}${type}`,
        message: h('p', null, [
          h('span', null, `确定${action}${type}`),
          h('i', { style: 'color: red' }, name),
          h('span', null, `?`)
        ]),
        showCancelButton: true,
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            request(params)
              .then(resp => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                if (resp.rc === 0) {
                  done()
                  this.getSanpshots()
                } else {
                  this.$message({ type: 'error', message: `${type}${action}失败` })
                }
              })
              .catch(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: `${type}${action}成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${action}操作`
        })
      })
    },
    shutdown() {
      this.formatMessageBox('关机', '', {
        cmdcode: 9,
        option: '0'
      }, '', shutdown)
    },
    restart() {
      this.formatMessageBox('重启', '', {
        cmdcode: 9,
        option: '6'
      }, '', restart)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.l-system-manage-container {
  display: flex;
  height: calc(100vh - 90px);
  margin: 20px;
  background: #fff;
  flex-direction: column;
  /*align-items: center;*/
  /*justify-content: center;*/
  &__title {
    padding: 20px;
    margin: 20px;
    background: #eee;
    color: hsl(0, 0%, 45%);
  }
  &__header {
    padding-bottom: 20px;
    overflow: hidden;
  }
  &__list {
    display: flex;
    flex-direction: row;
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin: 0 20px;
    }
  }
  &__item {
    &--name {
      text-align: center;
      padding: 20px 0;
      font-size: 14px;
      color: hsl(0, 0%, 17%);
    }
    &--icon {
      font-size: 40px;
    }
  }
}
</style>
