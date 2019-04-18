<template>
  <el-table
    :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column label="时间戳" prop="timestamp"/>
    <el-table-column label="快照ID" prop="snapshotId"/>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      list: this.tableData,
      listQuery: {
        page: this.currentPage,
        limit: this.pageSize
      }
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.list = val
    },
    currentPage(val, oldVal) {
      this.listQuery.page = val
    },
    pageSize(val, oldVal) {
      this.listQuery.limit = val
    }
  },
  methods: {
    handleCurrentChange(currentRow) {
      this.$emit('handleSelectionChange', currentRow)
    }
  }
}
</script>

<style scoped>

</style>
