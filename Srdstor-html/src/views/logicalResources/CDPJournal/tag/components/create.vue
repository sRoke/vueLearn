<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="创建标记"
    width="600px">
    <div style="padding-bottom: 20px;">
      <el-button type="primay" @click="handleCreateTagDialogVisible">创建</el-button>
      <el-button>删除</el-button>
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
import TagPagination from '@/componens/Pagination/index'
import TagTable from './table'
export default {
  name: 'Create',
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
      selectedRow: this.currentRow
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSelectionChange(selection) {
      this.currentRow = selection
    },
    handleCreateTagDialogVisible() {
      console.log('create')
    }
  }
}
</script>

<style scoped>

</style>
