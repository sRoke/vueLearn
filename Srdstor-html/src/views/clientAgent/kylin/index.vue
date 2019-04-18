<template>
  <main class="l-client-agent-container">
    <section class="l-client-agent-container__header">
      <el-button icon="iconfont icon-create" size="small" type="primary" @click="addClient">新增</el-button>
      <el-button icon="iconfont icon-del" size="small" plain @click="delClient">删除</el-button>
      <el-button icon="iconfont icon-info" size="small" plain @click="detailClient">磁盘详情</el-button>
      <el-dropdown style="padding-left: 10px; padding-right: 10px;" trigger="click" @command="handleCommandLicense">
        <el-button icon="iconfont icon-synchronous" plain size="small">
          许可证<i class="el-icon-arrow-down el-icon-right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :disabled="currentRowLicense !== false" command="add">
            <span>添加许可</span>
          </el-dropdown-item>
          <el-dropdown-item :disabled="currentRowLicense !== true" command="replace">
            <span>替换许可</span>
          </el-dropdown-item>
          <el-dropdown-item :disabled="currentRowLicense !== true" command="info">
            <span>许可信息</span>
          </el-dropdown-item>
          <el-dropdown-item :disabled="currentRowLicense !== true" command="del">
            <span>删除许可</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button icon="iconfont icon-refresh" size="small" plain @click="getSanClients">刷新</el-button>
    </section>
    <client-agent-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <client-agent-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <create-disk
      :show-dialog="visible.createDiskDialog"
      @handleDialogVisible="visible.createDiskDialog = false"
      @updateData="updateData"/>
    <client-detail
      :show-dialog="visible.detailClientDialog"
      :current-page = "currentPage"
      :current-row = "currentRow"
      @handleDialogVisible="visible.detailClientDialog = false"
      @updateData="updateData"/>
    <disk-status
      :current-row = "currentRow"
      :show-dialog="visible.diskStatusDialog"
      @handleDialogVisible="visible.diskStatusDialog = false"/>
    <disk-sync
      :dialog-visible="visible.diskSyncDialog"
      @handleDialogVisible="visible.diskSyncDialog = false"/>
    <set-disk-sync-speed
      :current-row = "currentRow"
      :show-dialog="visible.setDiskSyncSpeedDialog"
      @handleDialogVisible="visible.setDiskSyncSpeedDialog = false"/>
    <add-license
      :current-row = "currentRow"
      :show-dialog="visible.addLicenseDialog"
      @handleDialogVisible="visible.addLicenseDialog = false"
      @updateData="updateData"/>
    <replace-license
      :current-row = "currentRow"
      :show-dialog="visible.replaceLicenseDialog"
      @handleDialogVisible="visible.replaceLicenseDialog = false"
      @updateData="updateData"/>
    <license-info
      :current-row = "currentRow"
      :show-dialog="visible.licenseInfoDialog"
      @handleDialogVisible="visible.licenseInfoDialog = false"/>
  </main>
</template>

<script>
import { getSanClients } from '@/api/SRDstor/client/sanClients'
import { queryStatusOfClientUsedByAutoRecover } from '@/api/SRDstor/autoRecover'
import { getDisks, deleteClient, delLicense, getLicenseInfo, getWarnings } from '@/api/SRDstor/clientAgent'
import ClientAgentTable from './components/table'
import ClientAgentPagination from '@/components/Pagination/index'
import DiskStatus from './components/detailComponents/status'
import ClientDetail from './components/detail'
import DiskSync from './components/detailComponents/sync'
import SetDiskSyncSpeed from './components/detailComponents/setSyncSpeed'
import CreateDisk from './components/create'
import AddLicense from './components/addLicense'
import LicenseInfo from './components/licenseInfo'
import ReplaceLicense from './components/replaceLicense'
export default {
  name: 'Index',
  components: {
    ReplaceLicense,
    LicenseInfo,
    AddLicense,
    CreateDisk,
    ClientAgentTable,
    ClientAgentPagination,
    DiskStatus,
    ClientDetail,
    DiskSync,
    SetDiskSyncSpeed
  },
  data() {
    return {
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: 30,
      currentRow: null,
      currentRowLicense: false,
      visible: {
        createDiskDialog: false,
        detailClientDialog: false,
        diskStatusDialog: false,
        diskSyncDialog: false,
        addLicenseDialog: false,
        replaceLicenseDialog: false,
        licenseInfoDialog: false,
        setDiskSyncSpeedDialog: false
      }
    }
  },
  created() {
    this.getSanClients()
  },
  beforeDestroy() {
    // this.$store.dispatch('clearKylinTimer')
  },
  methods: {
    handleSelectionChange(selection) {
      this.currentRow = selection
      if (selection) {
        this.getLicenseInfo(selection)
      } else {
        self.currentRowLicense = false
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    getLicenseInfo(selection) {
      const self = this
      getLicenseInfo({ cmdcode: 82 }, `${selection.ip}:8888`).then(resp => {
        if (resp.retcode === 0) {
          if (resp.data && resp.data.status === 0) {
            self.currentRowLicense = true
          } else {
            self.currentRowLicense = false
          }
        } else {
          self.currentRowLicense = false
        }
      }).catch(() => {
        self.currentRowLicense = false
      })
    },
    getSanClients() {
      const self = this
      getSanClients({ pagesize: this.pageSize, currpage: this.currentPage }).then(resp => {
        if (Number(resp.rc) === 0) {
          self.tableData = []
          // self.$store.dispatch('clearKylinTimer')
          resp.data.forEach((item) => {
            if (item.from_appsafe) {
              // const timerValue = setInterval(function() {
              //   self.getWarnings(item)
              // }, 10000)
              self.getWarnings(item)
              // self.$store.dispatch('setKylinTimer', { key: item.ip, value: timerValue })
              queryStatusOfClientUsedByAutoRecover(item.id).then(response => {
                if (Number(response.rc) === 0) {
                  item.scriptNameList = response.data.scriptNameList
                  item.assign = response.data.assign
                  self.tableData.push(item)
                }
              })
            }
          })
        }
      })
    },
    getWarnings(item, index) {
      const self = this
      if (!item.ip) {
        return false
      }
      getWarnings({ ip: self.$store.getters.srdstorIp }, `${item.ip}:8888`).then(response => {
        if (response.retcode === 0) {
          if (item.warnings) {
            item.warnings = response.alarmLevel
          } else {
            self.$set(item, 'warnings', response.alarmLevel)
          }
        }
      }).catch(() => {
        console.log('error')
      })
    },
    addClient() {
      this.visible.createDiskDialog = true
    },
    delClient() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.assign) {
        return this.$message({ type: 'error', message: `客户端正在被脚本${this.currentRow.scriptNameList}使用, 请先删除对应脚本！` })
      }
      this.formatMessageBox('删除', '客户端', this.currentRow.id, { ip: this.$store.getters.srdstorIp }, this.currentRow.name, deleteClient, `${this.currentRow.ip}:8888`, '客户端有设备在使用中')
    },
    detailClient() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRowLicense === false) {
        this.$message({ type: 'warning', message: '请先添加许可！' })
        return false
      }
      this.visible.detailClientDialog = true
    },
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择客户端' })
        return false
      }
      return true
    },
    updateData() {
      this.tableData = []
      this.getSanClients()
    },
    getDisks() {
      const self = this
      getDisks({
        cmdcode: 0,
        filter: 0
      }).then(resp => {
        if (Number(resp.rc) === 0) {
          self.tableData = resp.data
        }
      })
    },
    handleCommandLicense(command) {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择客户端' })
        return false
      }
      const command_list = {
        'add': () => {
          this.visible.addLicenseDialog = true
        },
        'replace': () => {
          this.visible.replaceLicenseDialog = true
        },
        'info': () => {
          this.visible.licenseInfoDialog = true
        },
        'del': () => {
          if (!this.queryCurrentRow()) {
            return false
          }
          this.formatMessageBox('删除许可', '客户端', this.currentRow.id, { cmdcode: 84 }, this.currentRow.name, delLicense, `${this.currentRow.ip}:8888`)
        }
      }
      command_list[command]()
    },
    formatMessageBox(actions, type, id, params, name, request, ip, errorMsg) {
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
                done()
                this.$message({ type: 'success', message: `${type}${actions}成功` })
                this.getSanClients()
              } else {
                this.$message({ type: 'error', message: errorMsg || `${type}${actions}失败` })
              }
            }).catch(() => {
              this.$message({ type: 'error', message: errorMsg || `${type}${actions}失败` })
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

<style rel="stylesheet/scss" lang="scss" scoped>
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
