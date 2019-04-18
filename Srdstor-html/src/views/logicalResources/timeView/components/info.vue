<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="快照视图信息"
    width="600px">
    <div class="title">{{ info.name }}</div>
    <table>
      <tbody>
        <tr>
          <td>大小</td>
          <td>{{ info.size | bytesFormatter }}</td>
          <td>已用</td>
          <td>{{ parseInt(info.used) | bytesFormatter }}</td>
          <td>预留大小</td>
          <td>{{ info.reservation | bytesFormatter }}</td>
        </tr>
        <tr>
          <td>快照</td>
          <td>{{ info.originSnapshot.name }}</td>
          <td>资源池</td>
          <td>{{ info.originSnapshot.poolName | storagePoolNameMap }}</td>
          <td>逻辑卷</td>
          <td>{{ info.originSnapshot.virDevName }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import { getTimeView } from '@/api/SRDstor/logicalResources/timeView'
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
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow,
      info: {
        name: '',
        size: 0,
        used: 0,
        reservation: 0,
        originSnapshot: {
          name: '',
          poolName: '',
          virDevName: ''
        }
      }
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getTimeView()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getTimeView() {
      getTimeView({ name: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.info = resp.data
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .title {
    color: hsl(0, 0%, 25%);
    font-size: 16px;
    font-weight: 600;
  }
  table {
    table-layout: fixed;
  }
  tbody {
    tr td:nth-child(odd) {
      width: 70px;
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
