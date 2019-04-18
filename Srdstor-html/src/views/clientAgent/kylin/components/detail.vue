<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="客户端磁盘详情" width="1120px">
    <section class="l-client-agent-container__header">
      <!--<el-button icon="iconfont icon-info" size="small" plain @click="detailClient">详情</el-button>-->
      <el-button icon="iconfont icon-protect" type="primary" @click="protectDisk">保护</el-button>
      <el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-protect" @click="unProtectDisk">取消保护</el-button>
      <el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-state" plain @click="getStatus">状态</el-button>
      <!--<el-dropdown v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" style="padding-left: 10px; padding-right: 10px;" trigger="click" @command="handleCommandSync">-->
      <!--<el-button icon="iconfont icon-synchronous" plain size="mini">-->
      <!--同步<i class="el-icon-arrow-down el-icon-right"/>-->
      <!--</el-button>-->
      <!--<el-dropdown-menu slot="dropdown">-->
      <!--<el-dropdown-item command="0">-->
      <!--<span>开启差异同步</span>-->
      <!--</el-dropdown-item>-->
      <!--<el-dropdown-item command="1">-->
      <!--<span>强制全局同步</span>-->
      <!--</el-dropdown-item>-->
      <!--</el-dropdown-menu>-->
      <!--</el-dropdown>-->
      <!--&lt;!&ndash;<el-button icon="iconfont icon-start" plain size="small" @click="visible.diskSyncDialog = true">同步</el-button>&ndash;&gt;-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-quxiaotongbu" plain @click="unDiskSync">取消同步</el-button>-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-pause" plain @click="diskSuspend">暂停</el-button>-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-restore" plain @click="diskResume">恢复</el-button>-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-analysis" plain @click="diskAnalyze">分析</el-button>-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-forcedShutdown" plain @click="unDiskAnalyze">取消分析</el-button>-->
      <!--<el-button v-if="diskCurrentRow && diskCurrentRow.status === 'PROTECTED' && diskCurrentRow.protocol !== 'iscsi'" icon="iconfont icon-setSynchronizationRate" plain @click="diskSetSpeed">设置同步速率</el-button>-->
      <el-button icon="iconfont icon-refresh" plain @click="getDisks">刷新</el-button>
    </section>

    <client-agent-disk-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <client-agent-disk-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <protect-disk
      v-if="currentRow"
      :ip = "currentRow.ip"
      :sys-disk-name= "sysDiskName"
      :disk-data = "diskCurrentRow"
      :dialog-visible="visible.protectDiskDialog"
      @handleDialogVisible="visible.protectDiskDialog = false"
      @updateData="updateData"/>
    <disk-status
      v-if="currentRow"
      :ip = "currentRow.ip"
      :current-row = "diskCurrentRow"
      :show-dialog="visible.diskStatusDialog"
      @handleDialogVisible="visible.diskStatusDialog = false"/>
    <disk-sync
      :dialog-visible="visible.diskSyncDialog"
      @handleDialogVisible="visible.diskSyncDialog = false"/>
    <set-disk-sync-speed
      v-if="diskCurrentRow && currentRow"
      :ip = "currentRow.ip"
      :current-row = "currentRow"
      :show-dialog="visible.setDiskSyncSpeedDialog"
      @handleDialogVisible="visible.setDiskSyncSpeedDialog = false"/>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import DiskStatus from './detailComponents/status'
import DiskSync from './detailComponents/sync'
import { detailClient, getDisks, setSync, stopSync, suspend, resume, analyze, unanalyze, unProtect, getSysDisk } from '@/api/SRDstor/clientAgent'
import ClientAgentDiskTable from './detailComponents/tableDIsk'
import ClientAgentDiskPagination from '@/components/Pagination/index'
import ProtectDisk from './detailComponents/protect'
import SetDiskSyncSpeed from './detailComponents/setSyncSpeed'
export default {
  name: 'Detail',
  components: {
    DiskStatus,
    SetDiskSyncSpeed,
    DiskSync,
    ClientAgentDiskTable,
    ClientAgentDiskPagination,
    ProtectDisk
  },
  filters: {
    connFilter: function(val) {
      return store.state.returnConn.rcList[val] || val
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: 30,
      diskCurrentRow: null,
      sysDiskName: null,
      visible: {
        protectDiskDialog: false,
        createDiskDialog: false,
        detailClientDialog: false,
        diskStatusDialog: false,
        diskSyncDialog: false,
        setDiskSyncSpeedDialog: false
      }
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.tableData = []
        // this.getdetail()
        this.getDisks()
        this.getSysDisk()
      }
    }
  },
  methods: {
    handleSelectionChange(selection) {
      this.diskCurrentRow = selection
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleClose() {
      // this.$refs['diskStatusForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    updateData() {
      this.tableData = []
      this.getDisks()
    },
    getDisks() {
      const self = this
      getDisks(
        {
          cmdcode: 0,
          filter: 0
        },
        `${this.currentRow.ip}:8888`
      ).then(resp => {
        if (Number(resp.retcode) === 0) {
          self.tableData = []
          resp.data.forEach((item) => {
            if (item.dev) {
              self.tableData.push(item)
            }
          })
        }
      })
    },
    getdetail(ip) {
      detailClient(
        {
          ip: this.$store.getters.srdstorIp
        },
        `${this.currentRow.ip}:8888`
      ).then(resp => {
        if (resp.rc === 0) {
          // this.details = resp.data
          // store.state.returnConn.rcList[resp.data.conn]
        }
      })
    },
    protectDisk() {
      if (this.diskCurrentRow === null) {
        this.$message({ type: 'warning', message: '请选择磁盘' })
        return false
      }
      if (this.diskCurrentRow.status === 'PROTECTED') {
        this.$message({ type: 'warning', message: '客户端磁盘已被保护' })
        return false
      }
      if (this.diskCurrentRow.protocol === 'iscsi') {
        this.$message({ type: 'warning', message: 'iscsi协议磁盘不可保护！' })
        return false
      }
      this.visible.protectDiskDialog = true
    },
    unProtectDisk() {
      if (this.diskCurrentRow === null) {
        this.$message({ type: 'warning', message: '请选择磁盘' })
        return false
      }
      if (this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '该磁盘未被保护' })
        return false
      }
      this.formatMessageBox('取消保护', '磁盘', this.diskCurrentRow.id, { name: this.diskCurrentRow.dev, ip: this.$store.getters.srdstorIp }, this.diskCurrentRow.dev, unProtect, `${this.currentRow.ip}:8888`)
    },
    getStatus() {
      if (this.diskCurrentRow === null) {
        this.$message({ type: 'warning', message: '请选择磁盘' })
        return false
      }
      this.visible.diskStatusDialog = true
    },
    getSysDisk(ip) {
      const self = this
      getSysDisk(`${self.currentRow.ip}:8888`).then(resp => {
        if (Number(resp.retcode) === 0) {
          self.sysDiskName = resp.data
        }
      })
    },
    handleCommandSync(command) {
      if (this.diskCurrentRow === null) {
        this.$message({ type: 'warning', message: '请选择磁盘' })
        return false
      }
      if (Number(command)) {
        this.formatMessageBox('强制全局同步', '磁盘', this.diskCurrentRow.id, { cmdcode: 52, diskid: this.diskCurrentRow.diskid, force: command }, this.diskCurrentRow.dev, setSync, `${this.currentRow.ip}:8888`)
      } else {
        this.formatMessageBox('开启差异同步', '磁盘', this.diskCurrentRow.id, { cmdcode: 52, diskid: this.diskCurrentRow.diskid, force: command }, this.diskCurrentRow.dev, setSync, `${this.currentRow.ip}:8888`)
      }
    },
    unDiskSync() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.formatMessageBox('停止同步', '磁盘', this.diskCurrentRow.id, { cmdcode: 53, diskid: this.diskCurrentRow.diskid }, this.diskCurrentRow.dev, stopSync, `${this.currentRow.ip}:8888`)
    },
    diskSuspend() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.formatMessageBox('暂停磁盘保护', '磁盘', this.diskCurrentRow.id, { cmdcode: 50, diskid: this.diskCurrentRow.diskid }, this.diskCurrentRow.dev, suspend, `${this.currentRow.ip}:8888`)
    },
    diskResume() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.formatMessageBox('恢复保护', '磁盘', this.diskCurrentRow.id, { name: this.diskCurrentRow.dev }, this.diskCurrentRow.dev, resume, `${this.currentRow.ip}:8888`)
    },
    diskAnalyze() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.formatMessageBox('分析磁盘数据', '磁盘', this.diskCurrentRow.id, { cmdcode: 54, diskid: this.diskCurrentRow.diskid }, this.diskCurrentRow.dev, analyze, `${this.currentRow.ip}:8888`)
    },
    unDiskAnalyze() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.formatMessageBox('取消分析磁盘数据', '磁盘', this.diskCurrentRow.id, { cmdcode: 55, diskid: this.diskCurrentRow.diskid }, this.diskCurrentRow.dev, unanalyze, `${this.currentRow.ip}:8888`)
    },
    diskSetSpeed() {
      if (this.diskCurrentRow === null || this.diskCurrentRow.status === 'NORMAL') {
        this.$message({ type: 'warning', message: '请选择被保护的磁盘' })
        return false
      }
      this.visible.setDiskSyncSpeedDialog = true
    },
    formatMessageBox(actions, type, id, params, name, request, ip) {
      const h = this.$createElement
      this.$msgbox({
        title: `${actions}${type}`,
        message: h('p', null, [
          h('span', null, `确定${actions}${type}`),
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
            request(params, ip).then(resp => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              if (resp.retcode === 0) {
                console.log('系统磁盘==============', this.sysDiskName, name)
                if (actions === '取消保护' && this.sysDiskName === name) {
                  this.$message({ type: 'success', message: `${type}${actions}成功,需重启后生效！` })
                } else {
                  this.$message({ type: 'success', message: `${type}${actions}成功` })
                }
                this.getDisks()
                done()
              } else {
                this.$message({ type: 'error', message: `${type}${actions}失败` })
              }
            }).catch(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              this.$message({ type: 'error', message: `${type}${actions}失败` })
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: `${type}${actions}成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${actions}操作`
        })
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  table {
    table-layout: fixed;
    width: 100%;
  }
  tbody {
    tr td:nth-child(odd) {
      width: 70px;
      padding-left: 10px;
      color: hsl(0, 0%, 45%);
    }
    tr td:nth-child(even) {
      color: hsl(0, 0%, 17%);
      font-weight: 600;
    }
    tr {
      height: 50px;
    }
  }
 .l-client-agent-container {
   background: #fff;
   margin: 20px;
   padding: 20px;
   &__header {
     padding-bottom: 20px;
     .el-button{
       /*margin-bottom: 20px;*/
     }
   }
 }
</style>
