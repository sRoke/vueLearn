<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column type="index" width="40"/>
    <el-table-column label="ID" prop="id" sortable/>
    <el-table-column label="名称" prop="name" show-overflow-tooltip sortable/>
    <el-table-column label="操作系统" prop="os_type"/>
    <el-table-column label="协议类型" prop="protocols"/>
    <el-table-column label="IP地址" prop="ip" show-overflow-tooltip/>
    <el-table-column label="一键恢复" prop="assign">
      <template slot-scope="scope">
        <span>{{ scope.row.assign ? '正在使用' : '未使用' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="描述" prop="description" show-overflow-tooltip/>
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
