<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="客户端信息" width="500px">
    <table>
      <tbody>
        <tr>
          <td>客户端名称</td>
          <td>{{ details.name }}</td>
        </tr>
        <tr>
          <td>ID</td>
          <td>{{ details.id }}</td>
          <td>IP地址</td>
          <td>{{ details.ip }}</td>
        </tr>
        <tr>
          <td>操作系统</td>
          <td>{{ details.os_type }}</td>
          <td>iSCSI</td>
          <td>{{ details.iscsi ? '是' : '否' }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>
<script>
import { getSanClient } from '@/api/SRDstor/client/sanClients'

export default {
  name: 'Statistics',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      details: {
        name: '',
        os_type: '',
        id: '',
        ip: '',
        description: '',
        iscsi: ''
      }
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getSanClient(this.currentRow.id)
      }
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getSanClient(id) {
      getSanClient(id).then(resp => {
        if (resp.rc === 0) {
          this.details = resp.data
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
    width: 100%;
    padding: 0 40px;
  }
  tbody {
    tr td:nth-child(odd) {
      /*width: 90px;*/
      text-align: right;
      padding-left: 10px;
      padding-right: 10px;
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
