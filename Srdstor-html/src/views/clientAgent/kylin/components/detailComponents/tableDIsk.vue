<template>
  <el-table
    :data="tableList"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column type="index" width="40"/>
    <el-table-column label="磁盘名称" show-overflow-tooltip prop="dev"/>
    <el-table-column label="IP" show-overflow-tooltip prop="diskid"/>
    <el-table-column label="协议类型" show-overflow-tooltip prop="protocol"/>
    <el-table-column label="状态" show-overflow-tooltip prop="status">
      <template slot-scope="scope">
        <div>
          <span v-if="scope.row.status === 'PROTECTED'">受保护的</span>
          <span v-if="scope.row.status === 'NORMAL'">正常的</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="容量" show-overflow-tooltip prop="capacity"/>
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
    handleCurrentChange(currentRow) {
      this.$emit('handleSelectionChange', currentRow)
    }
  }
}
</script>

<style scoped>

</style>
