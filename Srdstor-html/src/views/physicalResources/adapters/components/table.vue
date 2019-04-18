<template>
  <el-table
    :data="tablelist.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    stripe
    highlight-current-row>
    <el-table-column label="名称" prop="name" sortable/>
    <el-table-column label="地址" prop="addr"/>
    <el-table-column label="型号" prop="model" show-overflow-tooltip/>
    <el-table-column label="厂商" prop="vendor" show-overflow-tooltip/>
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
      default: 10
    }
  },
  data() {
    return {
      tablelist: this.tableData,
      listQuery: {
        page: this.currentPage,
        limit: this.pageSize
      }
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.tablelist = val
    },
    currentPage(val, oldVal) {
      this.listQuery.page = val
    },
    pageSize(val, oldVal) {
      this.listQuery.limit = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
