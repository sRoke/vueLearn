<template>
  <el-table
    :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column label="脚本" prop="scriptName" show-overflow-tooltip/>
    <el-table-column label="脚本状态" prop="runMode">
      <template slot-scope="scope">
        <span>{{ scope.row.runMode | formatRunMode }}</span>
      </template>
    </el-table-column>
    <el-table-column label="虚拟机状态" prop="vmStatus">
      <template slot-scope="scope">
        <span>{{ scope.row.vmStatus | formatVMStatus }}</span>
        <el-button v-show="scope.row.vmStatus !== 0" icon="iconfont icon-client" circle style="margin-left: 5px;" @click="openVMConsole(scope.row.id)"/>
      </template>
    </el-table-column>
    <el-table-column label="虚拟机名称" prop="vmName" show-overflow-tooltip/>
    <el-table-column label="虚拟机-CPU数" prop="cpus"/>
    <el-table-column label="虚拟机内存(MB)" prop="ram"/>
  </el-table>
</template>

<script>
import { queryVMStatus } from '@/api/SRDstor/autoRecover'
export default {
  name: 'Table',
  filters: {
    formatRunMode: (val) => {
      const runMode = {
        1: '从未运行',
        2: '正在运行',
        3: '暂停',
        4: '结束',
        5: '未知状态'
      }
      return runMode[val]
    },
    formatVMStatus: (val) => {
      const vmStatus = {
        0: '未创建',
        1: '开机',
        3: '挂起',
        4: '正在关机',
        5: '关机'
      }
      return vmStatus[val] || '未知状态'
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
    },
    openVMConsole(id) {
      queryVMStatus(id)
        .then(resp => {
          if (Number(resp.rc) === 0) {
            window.open(`http://${resp.data.webvncSocket}/vnc_lite.html?token=${resp.data.recoverKvmHostIP}:${resp.data.vncPort}`)
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '开启虚拟机控制台失败' })
        })
    }
  }
}
</script>

<style scoped>

</style>
