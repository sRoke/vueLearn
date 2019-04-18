<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"/>
    <el-table-column label="名称" prop="name" sortable/>
    <el-table-column label="存储池名称" prop="poolName" sortable/>
    <el-table-column label="挂载路径">
      <template slot-scope="scope">
        <el-tag type="info" size="medium">{{ scope.row.path }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="NAS存储大小">
      <template slot-scope="scope">
        <el-tag type="info" size="medium">{{ scope.row.size | bytesFormatter }}</el-tag>
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
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange', selection)
    }
  }
}
</script>

<style scoped>

</style>
