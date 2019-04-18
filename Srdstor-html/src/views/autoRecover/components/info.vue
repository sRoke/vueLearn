<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="脚本属性" width="500px">
    <table v-loading="loading">
      <tbody>
        <tr>
          <td>脚本名称</td>
          <td>{{ info.scriptName }}</td>
        </tr>
        <tr>
          <td>CPU数</td>
          <td>{{ info.cpus }}</td>
        </tr>
        <tr>
          <td>内存</td>
          <td>{{ info.ram }} MB</td>
        </tr>
        <tr>
          <td>系统类型</td>
          <td>{{ info.systemType }}</td>
        </tr>
        <tr>
          <td>虚拟机类型</td>
          <td>{{ info.vmName }}</td>
        </tr>
        <tr>
          <td>虚拟机IP</td>
          <td>{{ info.vmIp }}</td>
        </tr>
        <tr>
          <td>虚拟机网络掩码</td>
          <td>{{ info.vmNetmask }}</td>
        </tr>
        <tr>
          <td>虚拟机网关</td>
          <td>{{ info.vmGateway }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import { getScript } from '@/api/SRDstor/autoRecover'
export default {
  name: 'Info',
  props: {
    dialogVisible: {
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
      loading: false,
      form: {},
      rules: {},
      info: {
        name: '',
        cpus: 0,
        ram: 0,
        systemType: '',
        vmName: '',
        vmIp: '',
        vmNetmask: '',
        vmGateway: ''
      }
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    dialogVisible(val) {
      this.dialogVisible = val
      if (val) {
        this.getScript()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getScript() {
      this.loading = true
      getScript(this.currentRow.id)
        .then(resp => {
          this.loading = false
          if (Number(resp.rc) === 0) {
            this.info = resp.data
          }
        })
        .catch(() => {
          this.loading = false
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
      width: 120px;
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
