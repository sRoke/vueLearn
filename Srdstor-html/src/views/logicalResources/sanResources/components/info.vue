<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="逻辑卷信息"
    width="600px">
    <div class="title">{{ info.name }}</div>
    <table>
      <tbody>
        <tr>
          <td>大小</td>
          <td>{{ info.size | bytesFormatter }}</td>
          <td>已用</td>
          <td>{{ info.used | bytesFormatter }}</td>
          <td>block</td>
          <td>{{ info.block | bytesFormatter }}</td>
        </tr>
        <tr>
          <td>启用压缩</td>
          <td>{{ info.normaProperty.dedup ? '是' : '否' }}</td>
          <td>压缩等级</td>
          <td>{{ info.normaProperty.compression }}</td>
          <td>备份数</td>
          <td>{{ info.normaProperty.copies }}</td>
        </tr>
        <tr>
          <td>是否只读</td>
          <td>{{ info.normaProperty.readonly ? '是' : '否' }}</td>
          <td>启用快照</td>
          <td>{{ info.snapshot.enable ? '是' : '否' }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import { getSanResource } from '@/api/SRDstor/logicalResources/sanResources'
export default {
  name: 'Info',
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
        normaProperty: {
          dedup: false,
          compression: '',
          copies: 1,
          readonly: false
        },
        replication: '',
        snapshot: {
          enable: false,
          snapshotresource: '0',
          usedbysnapshots: '1'
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
        this.getSanResource()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getSanResource() {
      getSanResource({ name: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
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
