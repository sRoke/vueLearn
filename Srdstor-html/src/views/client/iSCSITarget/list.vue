<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="iSCSI目标列表" width="800px">
    <section style="padding-bottom: 20px;">
      <el-button icon="iconfont icon-edit" type="primary" @click="handleUpdateiSCSITargetDialogVisible">编辑</el-button>
      <el-button icon="iconfont icon-info" plain @click="handleiSCSITargetStatisticsDialogVisible">详情</el-button>
      <el-button icon="iconfont icon-del" plain @click="deleteiSCSITarget">删除</el-button>
      <el-button icon="iconfont icon-refresh" plain @click="getSanClient(currentRow.id)">刷新</el-button>
    </section>
    <iscsi-target-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <iscsi-target-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <update-iscsi-target
      :current-row = "selectedRow"
      :show-dialog="visible.updateiSCSITargetDialog"
      @handleDialogVisible="visible.updateiSCSITargetDialog = false"
      @updateData="getSanClient(currentRow.id)"/>
    <iscsi-target-statistics
      :current-row="selectedRow"
      :show-dialog="visible.iSCSITargetStatisticsDialog"
      @handleDialogVisible="visible.iSCSITargetStatisticsDialog = false"/>
  </el-dialog>
</template>
<script>
import { getSanClient } from '@/api/SRDstor/client/sanClients'
import { deleteiSCSITarget } from '@/api/SRDstor/client/iSCSITarget'
import IscsiTargetTable from './components/table'
import IscsiTargetPagination from '@/components/Pagination/index'
import UpdateIscsiTarget from './components/update'
import IscsiTargetStatistics from './components/statistics'
export default {
  name: 'List',
  components: {
    IscsiTargetTable,
    UpdateIscsiTarget,
    IscsiTargetStatistics,
    IscsiTargetPagination
  },
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      osType: ['windows', 'linux', 'unix', 'macOS', 'kylin'],
      form: {
        name: '', // 存储池名称 {String}
        ostype: 'windows',
        ipaddress: '',
        action: 'update'
      },
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      visible: {
        updateiSCSITargetDialog: false,
        iSCSITargetStatisticsDialog: false
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
        this.getSanClient(this.currentRow.id)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getSanClient(id) {
      getSanClient(id)
        .then(resp => {
          if (resp.rc === 0) {
            this.tableData = resp.data.iscsitargets
          }
        })
    },
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    querySelectedRow() {
      if (this.selectedRow === null) {
        this.$message({ type: 'warning', message: '请选择iSCSI目标' })
        return false
      }
      return true
    },
    handleUpdateiSCSITargetDialogVisible() {
      if (!this.querySelectedRow()) {
        return false
      }
      this.visible.updateiSCSITargetDialog = true
    },
    handleiSCSITargetStatisticsDialogVisible() {
      if (!this.querySelectedRow()) {
        return false
      }
      this.visible.iSCSITargetStatisticsDialog = true
    },
    formatMessageBox(action, type, id, params, name, request) {
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
            request(id, params)
              .then(resp => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                if (resp.rc === 0) {
                  done()
                  this.getSanClient(this.currentRow.id)
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
    deleteiSCSITarget() {
      if (!this.querySelectedRow()) {
        return false
      }
      this.formatMessageBox('删除', 'iSCSI目标', this.selectedRow.id, {}, this.selectedRow.name, deleteiSCSITarget)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
