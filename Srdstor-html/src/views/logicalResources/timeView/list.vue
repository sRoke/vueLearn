<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="800px"
    title="快照视图列表">
    <div style="padding-bottom: 20px;">
      <el-button icon="iconfont icon-edit" type="primary" @click="handleEditTimeViewDialogShow(true)">编辑</el-button>
      <el-button icon="iconfont icon-del" plain @click="deleteTimeView">删除</el-button>
      <el-button icon="iconfont icon-info" plain @click="handleTimeViewInfoDialogShow(true)">详情</el-button>
      <el-button icon="iconfont icon-refresh" plain @click="getTimeViews">刷新</el-button>
    </div>
    <time-view-table
      v-loading="loading"
      :table-data="tableData"
      :current-page="currentPage"
      :page-size="pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <time-view-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <edit-time-view
      :show-dialog="visible.editTimeViewDialog"
      :current-row="currentRow"
      @updateData="getTimeViews"
      @handleDialogVisible="visible.editTimeViewDialog = false"/>
    <time-view-info
      :show-dialog="visible.timeViewInfoDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.timeViewInfoDialog = false"/>
  </el-dialog>
</template>

<script>
import { getTimeViews, deleteTimeView } from '@/api/SRDstor/logicalResources/timeView'
import TimeViewPagination from '@/components/Pagination/index'
import TimeViewTable from './components/table'
import EditTimeView from './components/edit'
import TimeViewInfo from './components/info'
export default {
  name: 'List',
  components: {
    TimeViewTable,
    EditTimeView,
    TimeViewInfo,
    TimeViewPagination
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: this.showDialog,
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      currentRow: null, // 所选中表格信息 { Object }
      visible: {
        editTimeViewDialog: false,
        timeViewInfoDialog: false
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getTimeViews()
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
      this.$emit('handleDialogVisible', false)
    },
    handleSelectionChange(selection) {
      console.log(selection)
      this.currentRow = selection
    },
    getTimeViews() {
      getTimeViews()
        .then(resp => {
          if (resp.rc === 0) {
            this.tableData = resp.data === null ? [] : resp.data
          }
        })
    },
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'info', message: '请选择快照视图' })
        return false
      }
      return true
    },
    handleEditTimeViewDialogShow(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.editTimeViewDialog = true
    },
    handleTimeViewInfoDialogShow(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.timeViewInfoDialog = true
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
                  this.getTimeViews()
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
    deleteTimeView() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox(
        '删除',
        '快照视图', {
          name: this.currentRow.name,
          poolName: this.currentRow.poolName
        },
        this.currentRow.name,
        deleteTimeView)
    }
  }
}
</script>

<style scoped>

</style>
