<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    stripe
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column type="index" align="center" width="50"/>
    <el-table-column label="名称" prop="name" sortable show-overflow-tooltip/>
    <el-table-column label="类型" prop="type" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ scope.row.type === 1 ? '逻辑卷' : '快照视图' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="存储池" prop="poolName" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ scope.row.poolName | storagePoolNameMap }}</span>
      </template>
    </el-table-column>
    <el-table-column label="容量">
      <template slot-scope="scope">
        <span>{{ scope.row.size | bytesFormatter }}</span>
      </template>
    </el-table-column>
    <el-table-column label="已使用">
      <template slot-scope="scope">
        <span v-show="scope.row.type === 1" type="info">{{ scope.row.used | bytesFormatter }}</span>
      </template>
    </el-table-column>
    <el-table-column label="精简配置" prop="thin">
      <template slot-scope="scope">
        <span v-show="scope.row.type === 1">{{ scope.row.thin === true ? '开启' : '关闭' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="快照">
      <template slot-scope="scope">
        <el-button v-show="scope.row.type === 1" type="text" @click="handleSnapshotChange(scope.row)">详情</el-button>
      </template>
    </el-table-column>
    <el-table-column label="快照视图">
      <template slot-scope="scope">
        <el-button v-show="scope.row.type === 2" type="text" @click="handleTimeViewChange(scope.row)">详情</el-button>
      </template>
    </el-table-column>
    <el-table-column label="快照策略">
      <template slot-scope="scope">
        <el-button v-show="scope.row.type === 1" type="text" @click="handleSnapshotPolicyChange(scope.row)">详情</el-button>
      </template>
    </el-table-column>
    <el-table-column label="一键恢复">
      <template slot-scope="scope">
        <span v-show="scope.row.type === 2">{{ scope.row.assign ? '使用中' : '未使用' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="CDP">
      <template slot-scope="scope">
        <span v-show="scope.row.type === 1">{{ scope.row.cdp | formatCDPStatus }}</span>
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
    },
    formatCDPStatus: function(val) {
      if (val === 'on') {
        return '开启'
      } else if (val === 'off') {
        return '关闭'
      } else if (val === 'suspen') {
        return '暂停'
      }
      return val
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
      this.$emit('handleSelectionChange', { row: currentRow, action: 0 })
    },
    handleSnapshotChange(currentRow) {
      this.$emit('handleSelectionChange', { row: currentRow, action: 1 })
    },
    handleTimeViewChange(currentRow) {
      this.$emit('handleSelectionChange', { row: currentRow, action: 2 })
    },
    handleSnapshotPolicyChange(currentRow) {
      this.$emit('handleSelectionChange', { row: currentRow, action: 3 })
    }
  }
}
</script>

<style scoped>

</style>
