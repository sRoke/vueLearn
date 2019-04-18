<template>
  <el-table
    :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column label="名称" prop="name"/>
    <el-table-column label="存储池" prop="poolName">
      <template slot-scope="scope">
        {{ scope.row.poolName | storagePoolNameMap }}
      </template>
    </el-table-column>
    <el-table-column label="大小" prop="size">
      <template slot-scope="scope">
        {{ scope.row.size | bytesFormatter }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'Table',
  filters: {
    storagePoolNameMap: function(val) {
      return store.getters.storagePoolNameMap[val] || val
    }
  },
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
