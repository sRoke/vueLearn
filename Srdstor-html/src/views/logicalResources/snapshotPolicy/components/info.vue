<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="快照策略详情"
    append-to-body
    width="600px">
    <table>
      <tbody>
        <tr>
          <td>资源池</td>
          <td>{{ info.poolName | storagePoolNameMap }}</td>
          <td>逻辑卷</td>
          <td>{{ info.virDevName }}</td>
          <td>预留大小</td>
          <td>{{ info.initTime }}</td>
        </tr>
        <tr>
          <td>间隔时间/秒</td>
          <td>{{ info.interval }}</td>
          <td>快照数量</td>
          <td>{{ info.snapshotMaxNum }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import { getSnapshotPolicy } from '@/api/SRDstor/logicalResources/snapshotPolicy'
export default {
  name: 'Info',
  filters: {
    storagePoolNameMap: function(val) {
      return store.getters.storagePoolNameMap[val] || val
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    info: {
      type: Object,
      default: () => {
        return {
          poolName: '',
          virDevName: '',
          initTime: '',
          interval: 0,
          snapshotMaxNum: 0
        }
      }
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    info(val) {
      this.info = val
    },
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getSnapshotPolicy() {
      getSnapshotPolicy({ virDevName: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.info = resp.data
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  table {
    table-layout: fixed;
  }
  tbody {
    tr td:nth-child(odd) {
      width: 90px;
      padding-left: 10px;
      color: hsl(0, 0%, 45%);
    }
    tr td:nth-child(even) {
      color: hsl(0, 0%, 17%);
      font-weight: 600;
    }
    tr {
      height: 50px;
    }
  }
</style>
