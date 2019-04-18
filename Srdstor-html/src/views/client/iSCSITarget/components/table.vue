<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column type="index" width="40"/>
    <el-table-column label="名称" prop="name" show-overflow-tooltip/>
    <el-table-column label="ID" prop="id"/>
    <el-table-column label="IP" prop="portals">
      <template slot-scope="scope">
        <el-tag v-for="item in scope.row.portals" :key="item" type="info" style="margin-left: 5px;">{{ item }}</el-tag>
      </template>
    </el-table-column>
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
      tableList: this.tableData,
      listQuery: {
        page: this.currentPage,
        limit: this.pageSize
      }
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.tableList = val
    },
    currentPage(val, oldVal) {
      this.listQuery.page = val
    },
    pageSize(val, oldVal) {
      this.listQuery.limit = val
    }
  },
  methods: {
    handleCurrentChange(selection) {
      this.$emit('handleSelectionChange', selection)
    }
  }
}
</script>

<style scoped>

</style>
