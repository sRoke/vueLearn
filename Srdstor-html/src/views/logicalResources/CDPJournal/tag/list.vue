<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="标记列表"
    width="800px">
    <div style="padding-bottom: 20px;">
      <el-button icon="iconfont icon-del" @click="deleteTag">删除</el-button>
    </div>
    <tag-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <tag-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
  </el-dialog>
</template>

<script>
import { getTags, deleteTag } from '@/api/SRDstor/logicalResources/CDPJournal'
import TagTable from './components/table'
import TagPagination from '@/components/Pagination/index'
export default {
  name: 'List',
  components: {
    TagTable,
    TagPagination
  },
  props: {
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
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      tagTableCurrentRow: null
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getTags()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getTags() {
      getTags({ name: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.tableData = resp.data.Marks.list === null ? [] : resp.data.Marks.list
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSelectionChange(selection) {
      this.tagTableCurrentRow = selection
    },
    formatMessageBox(action, type, params, name, request) {
      const h = this.$createElement
      this.$msgbox({
        title: `${action}${type}`,
        message: h('p', null, [
          h('span', null, `确定${action}${type}`),
          h('i', { style: 'color: red' }, name)
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
                  this.getTags()
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
    deleteTag() {
      if (this.tagTableCurrentRow === null) {
        this.$message({ type: 'warning', message: '请选择标记' })
        return false
      }
      this.formatMessageBox('删除', '标记', {
        name: this.selectedRow.name,
        poolName: this.selectedRow.poolName,
        info: {
          timestamp: this.tagTableCurrentRow.timestamp,
          snapshotId: this.tagTableCurrentRow.guid
        }
      }, '', deleteTag)
    }
  }
}
</script>

<style scoped>
</style>
