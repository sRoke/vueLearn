<template>
  <el-table
    :data="tableList"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleSelectionChange">
    <el-table-column label="名字" prop="name" show-overflow-tooltip sortable/>
    <el-table-column label="创建时间" prop="create_time"/>
    <el-table-column label="是否分配" prop="client_id">
      <template slot-scope="scope">
        {{ scope.row.client_id ? '已分配' : '未分配' }}
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
    iqnSelectable(row, index) {
      return row.client_id === null
    },
    handleSelectionChange(selection) {
      this.$emit('handleSelectionChange', selection)
    }
  }
}
</script>

<style scoped>

</style>
