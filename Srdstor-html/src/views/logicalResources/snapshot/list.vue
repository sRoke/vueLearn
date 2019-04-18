<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="800px"
    title="快照列表">
    <div style="padding-bottom: 20px;">
      <el-button icon="iconfont icon-create" type="primary" @click="handleCreateTimeViewDialogShow(true)">创建快照视图</el-button>
      <el-button icon="iconfont icon-del" plain @click="deleteSanpshot">删除</el-button>
      <el-button icon="iconfont icon-refresh" plain @click="getSanpshots">刷新</el-button>
    </div>
    <snapshot-table
      v-loading="loading"
      :table-data="tableData"
      :current-page="currentPage"
      :page-size="pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <snapshot-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <create-time-view
      :show-dialog="visible.createTimeViewDialog"
      :snapshot="snapshot"
      :current-row="snapshotTableSelectedRow"
      @handleDialogVisible="visible.createTimeViewDialog = false"/>
  </el-dialog>
</template>

<script>
import { getSanpshots, deleteSanpshot } from '@/api/SRDstor/logicalResources/snapshot'
import SnapshotPagination from '@/components/Pagination/index'
import SnapshotTable from './components/table'
import CreateTimeView from '../timeView/components/create'
export default {
  name: 'List',
  components: {
    SnapshotTable,
    SnapshotPagination,
    CreateTimeView
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
      dialogVisible: this.showDialog,
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      listLoading: true, // 加载状态 { Boolean }
      snapshotTableSelectedRow: null, // 所选中表格信息 { Object }
      selectedRow: this.currentRow,
      visible: {
        createTimeViewDialog: false
      },
      snapshot: null
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getSanpshots()
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
    handleClose() {
      this.currentPage = 1
      this.pageSize = 10
      this.$emit('handleDialogVisible', false)
    },
    handleSelectionChange(selection) {
      console.log(selection)
      this.snapshotTableSelectedRow = selection
    },
    getSanpshots() {
      this.loading = true
      getSanpshots({
        poolName: this.selectedRow.poolName,
        virDevName: this.selectedRow.name
      })
        .then(resp => {
          this.loading = false
          if (resp.rc === 0) {
            this.tableData = resp.data.snapshots === null ? [] : resp.data.snapshots
            this.snapshot = {
              poolName: resp.data.poolName,
              virDevName: resp.data.virDevName
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    querySelectedRow() {
      if (this.snapshotTableSelectedRow === null) {
        this.$message({ type: 'info', message: '请选择快照' })
        return false
      }
      return true
    },
    handleCreateTimeViewDialogShow(val) {
      if (!this.querySelectedRow()) {
        return false
      }
      this.visible.createTimeViewDialog = true
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
    deleteSanpshot() {
      if (!this.querySelectedRow()) {
        return false
      }
      this.formatMessageBox('删除', '快照', {
        name: this.snapshotTableSelectedRow.name,
        poolName: this.snapshot.poolName,
        virDevName: this.snapshot.virDevName
      }, this.snapshotTableSelectedRow.name, deleteSanpshot)
    }
  }
}
</script>

<style scoped>

</style>
