<template>
  <main class = "l-replication-container">
    <section class="l-replication-container__header">
      <el-button icon="el-icon-refresh" type="primary" size="small" @click="getReplications">刷新</el-button>
      <el-button v-show="currentRow !== null" icon="el-icon-edit" size="small" plain @click="handleUpdateReplicationDialogVisible">编辑</el-button>
      <el-button v-show="currentRow !== null" icon="iconfont icon-synchronous" size="small" plain @click="startReplcation">同步</el-button>
      <el-button v-show="currentRow !== null" icon="iconfont icon-pause" size="small" plain @click="suspendReplcation">暂停</el-button>
      <el-button v-show="currentRow !== null" icon="iconfont icon-pause" size="small" plain @click="resumeReplcation">恢复</el-button>
      <el-button v-show="currentRow !== null" icon="iconfont icon-stop" size="small" plain @click="stopReplication">取消</el-button>
      <el-button v-show="currentRow !== null" icon="iconfont icon-hangUp" size="small" plain @click="elevateReplication">提升</el-button>
    </section>
    <replication-table
      v-loading="loading"
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <replication-pagination
      :table-total = "tableTotal"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <update-replication
      :show-dialog="visible.updateReplicationDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.updateReplicationDialog = false"
      @updateData="getReplicationList"/>
  </main>
</template>

<script>
import { deepClone } from '@/utils/index'
import { getReplicationList, updateReplication, createReplication } from '@/api/SRDstor/logicalResources/replication'
import ReplicationTable from './components/table'
import ReplicationPagination from '@/components/Pagination/index'
import UpdateReplication from './components/edit'
export default {
  name: 'Index',
  components: {
    ReplicationTable,
    ReplicationPagination,
    UpdateReplication
  },
  data() {
    return {
      tableData: [], // 表格信息 { Array }
      tableTotal: 0,
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      loading: true, // 加载状态 { Boolean }
      currentRow: null, // 所选中表格信息 { Array }
      visible: {
        updateReplicationDialog: false
      },
      responseText: null
    }
  },
  created() {
    this.getReplicationList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    getReplications() {
      const self = this
      self.loading = true
      getReplicationList()
        .then(resp => {
          self.loading = false
          if (resp.rc === 0) {
            self.tableData = resp.data.repconfiglist === null ? [] : resp.data.repconfiglist
            self.tableTotal = resp.data.total
          }
        })
        .catch(() => {
          self.loading = false
        })
    },
    getReplicationList() {
      const self = this
      self.loading = true
      getReplicationList()
        .then(resp => {
          self.loading = false
          if (resp.rc === 0) {
            self.tableData = resp.data.repconfiglist === null ? [] : resp.data.repconfiglist
            self.tableTotal = resp.data.total
          }
        })
        .catch(() => {
          self.loading = false
        })
      const timer = setTimeout(() => {
        this.getReplicationList()
      }, 10000)
      this.$once('hook:beforeDestroy', () => {
        clearTimeout(timer)
      })
    },
    handleSelectionChange(selection) {
      this.currentRow = selection
    },
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'info', message: '请选择复制作业' })
        return false
      }
      return true
    },
    handleUpdateReplicationDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.updateReplicationDialog = true
    },
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
            request(params).then(resp => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              if (resp.rc === 0) {
                done()
                this.updateData()
              } else {
                this.$message({ type: 'error', message: `${type}${action}失败` })
              }
            }).catch(() => {
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
    suspendReplcation() {
      if (!this.queryCurrentRow()) {
        return false
      }
      const params = deepClone(this.currentRow)
      params.pause = true
      this.formatMessageBox(
        '暂停',
        '复制',
        params,
        this.currentRow.name,
        updateReplication)
    },
    resumeReplcation() {
      if (!this.queryCurrentRow()) {
        return false
      }
      const params = deepClone(this.currentRow)
      params.pause = false
      this.formatMessageBox(
        '恢复',
        '复制',
        params,
        this.currentRow.name,
        updateReplication)
    },
    stopReplication() {
      if (!this.queryCurrentRow()) {
        return false
      }
      const params = deepClone(this.currentRow)
      params.cancel = true
      this.formatMessageBox(
        '停止',
        '复制',
        params,
        this.currentRow.name,
        updateReplication)
    },
    startReplcation() {
      if (!this.queryCurrentRow()) {
        return false
      }
      const params = deepClone(this.currentRow)
      params.onetime = true
      params.base = false
      this.formatMessageBox(
        '同步',
        '复制',
        params,
        this.currentRow.name,
        createReplication)
    },
    elevateReplication() {
      if (!this.queryCurrentRow()) {
        return false
      }
      const self = this
      const h = this.$createElement
      this.$msgbox({
        title: `提升复制`,
        message: h('p', null, [
          h('span', null, `确定提升复制`),
          h('i', { style: 'color: red' }, this.currentRow.name),
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
            const xhrLogin = new XMLHttpRequest() // IE8/9需用window.XDomainRequest兼容
            xhrLogin.open('post', `http://${self.currentRow.ip}:8081/SRDStor/user/auth/login`, true)
            xhrLogin.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
            xhrLogin.send(JSON.stringify({ 'username': self.currentRow.username, 'password': self.currentRow.password, 'server': '' }))
            xhrLogin.onreadystatechange = function() {
              if (xhrLogin.readyState === 4 && xhrLogin.status === 200) {
                const responseTextLogin = JSON.parse(xhrLogin.responseText)
                var xhrElevate = new XMLHttpRequest()
                xhrElevate.open('POST', `http://${self.currentRow.ip}:8081/SRDStor/logicalresource/replicate/elevate`, true)
                xhrElevate.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
                xhrElevate.setRequestHeader('token', responseTextLogin.data.id)
                xhrElevate.send(JSON.stringify({ volume: self.currentRow.name, poolname: self.currentRow.remotepoolname, host: self.currentRow.host }))
                xhrElevate.onreadystatechange = function() {
                  if (xhrElevate.readyState === 4 && xhrElevate.status === 200) {
                    const responseTextElevate = JSON.parse(xhrElevate.responseText)
                    if (responseTextElevate.rc === 0) {
                      self.$message({ type: 'success', message: `提升复制成功` })
                    } else {
                      self.$message({ type: 'error', message: `提升复制失败` })
                    }
                    done()
                    instance.confirmButtonLoading = false
                    instance.confirmButtonText = '确定'
                  } else if (xhrElevate.status !== 200) {
                    self.$message({ type: 'error', message: `提升复制失败` })
                  }
                }
              } else if (xhrLogin.status !== 200) {
                self.$message({ type: 'error', message: `请求${self.currentRow.ip}:8081服务失败` })
              }
            }
          } else {
            done()
          }
        }
      }).then(() => {
        console.log('提升复制操作已完成')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消提升操作`
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-replication-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header {
      padding-bottom: 20px;
    }
  }
</style>
