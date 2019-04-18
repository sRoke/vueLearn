<template>
  <main class = "l-auto-recover-container">
    <section class = "l-auto-recover-container__header">
      <el-button icon="iconfont icon-create" size="small" type="primary" @click="handleManageScriptDialogVisible(true, 1)">创建</el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 2"
        icon="iconfont icon-edit"
        plain
        size="small"
        @click="handleManageScriptDialogVisible(true, 2)">
        编辑
      </el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 2 && currentRow.runMode !== 3"
        icon="iconfont icon-start"
        plain
        size="small"
        @click="handleStartTaskDialogVisible">
        开始
      </el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 1 && currentRow.runMode !== 4"
        icon="iconfont icon-end"
        plain
        size="small"
        @click="stopTask">
        结束
      </el-button>
      <el-button icon="iconfont icon-info" plain size="small" @click="handleScriptInfoDialogVisible">信息</el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 2 && currentRow.runMode !== 3"
        icon="iconfont icon-del"
        plain
        size="small"
        @click="deleteScript">
        删除
      </el-button>
      <el-button icon="iconfont icon-refresh" plain size="small" @click="getScripts">刷新</el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 4 && currentRow.vmStatus !== 1"
        icon="iconfont icon-start"
        plain
        size="small"
        @click="bootVM">
        开机
      </el-button>
      <!--<el-button v-show="currentRow !== null && currentRow.vmStatus !== 3 && currentRow.vmStatus !== 4 && currentRow.vmStatus !== 5" icon="iconfont icon-shutdown" plain size="small" @click="shutDownVM">关机</el-button>-->
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 4 && currentRow.vmStatus !== 3 && currentRow.vmStatus !== 4 && currentRow.vmStatus !== 5"
        icon="iconfont icon-shutdown"
        plain
        size="small"
        @click="forcedShutDownVM">
        强制关机
      </el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 4 && currentRow.vmStatus !== 3 && currentRow.vmStatus !== 4 && currentRow.vmStatus !== 5"
        icon="iconfont icon-hangUp"
        plain
        size="small"
        @click="suspendVM">
        挂起
      </el-button>
      <el-button
        v-show="currentRow !== null && currentRow.runMode !== 4 && currentRow.vmStatus === 3"
        icon="iconfont icon-restore"
        plain
        size="small"
        @click="resumeVM">
        恢复
      </el-button>
      <!--<el-button v-show="currentRow !== null" icon="iconfont icon-restart" plain size="small" @click="rebootVM">重启</el-button>-->
    </section>
    <auto-recover-table
      v-loading="loading"
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <auto-recover-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <manage-script
      :show-dialog="visible.manageScriptDialog"
      :action-type="manageScriptType"
      :current-row="currentRow"
      @handleDialogVisible="handleManageScriptDialogVisible"
      @updateData="getScripts"/>
    <start-script
      :dialog-visible="visible.startScriptDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.startScriptDialog = false"
      @updateData="getScripts"/>
    <script-info
      :dialog-visible="visible.scriptInfoDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.scriptInfoDialog = false"/>
  </main>
</template>

<script>
import { getScripts, deleteScript, stopTask, bootVM, shutDownVM, forcedShutDownVM, rebootVM, suspendVM, resumeVM } from '@/api/SRDstor/autoRecover'
import AutoRecoverTable from './components/table'
import AutoRecoverPagination from '@/components/Pagination/index'
import ManageScript from './components/action'
import StartScript from './components/start'
import ScriptInfo from './components/info'
export default {
  name: 'Index',
  components: {
    AutoRecoverTable,
    AutoRecoverPagination,
    ManageScript,
    StartScript,
    ScriptInfo
  },
  data() {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      pageSize: 15,
      currentRow: null,
      visible: {
        manageScriptDialog: false,
        startScriptDialog: false,
        scriptInfoDialog: false
      },
      manageScriptType: 1
    }
  },
  created() {
    this.getScripts()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSelectionChange(selection) {
      this.currentRow = selection
    },
    handleManageScriptDialogVisible(val, type) {
      this.manageScriptType = type
      if (type === 2 && this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择脚本' })
        return false
      }
      this.visible.manageScriptDialog = val
    },
    handleStartTaskDialogVisible() {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择脚本' })
        return false
      }
      this.visible.startScriptDialog = true
    },
    handleScriptInfoDialogVisible() {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择脚本' })
        return false
      }
      this.visible.scriptInfoDialog = true
    },
    getScripts() {
      const self = this
      self.loading = true
      getScripts()
        .then(resp => {
          self.loading = false
          if (Number(resp.rc) === 0) {
            self.tableData = resp.data
          }
        })
        .catch(() => {
          self.loading = false
        })
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
              if (Number(resp.rc) === 0) {
                done()
                this.getScripts()
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
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择脚本' })
        return false
      }
      return true
    },
    deleteScript() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('删除', '脚本', this.currentRow.id, this.currentRow.scriptName, deleteScript)
    },
    stopTask() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('停止', '任务', this.currentRow.id, this.currentRow.scriptName, stopTask)
    },
    bootVM() {
      // debugger
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('启动', '虚拟机', this.currentRow.id, this.currentRow.scriptName, bootVM)
    },
    shutDownVM() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('关闭', '虚拟机', this.currentRow.id, this.currentRow.scriptName, shutDownVM)
    },
    forcedShutDownVM() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('强制关闭', '虚拟机', this.currentRow.id, this.currentRow.scriptName, forcedShutDownVM)
    },
    suspendVM() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('暂停', '虚拟机', this.currentRow.id, this.currentRow.scriptName, suspendVM)
    },
    resumeVM() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('恢复', '虚拟机', this.currentRow.id, this.currentRow.scriptName, resumeVM)
    },
    rebootVM() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('重启', '虚拟机', this.currentRow.id, this.currentRow.scriptName, rebootVM)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.l-auto-recover-container {
  background: #fff;
  margin: 20px;
  padding: 20px;
  &__header {
    padding-bottom: 20px;
  }
}
</style>
