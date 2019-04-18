<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="CDP策略属性"
    width="600px">
    <div class="title">{{ properties.name }}</div>
    <table>
      <tbody>
        <tr>
          <td>保留时间/天</td>
          <td>{{ properties.policy.retain.rPolicy }}</td>
          <td>存储区域初始值</td>
          <td>{{ properties.policy.storage.sPolicy.initSize }}</td>
          <td>精简配置</td>
          <td>{{ properties.policy.storage.sPolicy.enable ? '开启' : '未开启' }}</td>
        </tr>
        <tr>
          <td>自动扩容率</td>
          <td>{{ properties.policy.storage.sPolicy.expandRate }}</td>
          <td>存储区域最大值</td>
          <td>{{ properties.policy.storage.max }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import { getCDPJournalProperties } from '@/api/SRDstor/logicalResources/CDPJournal'
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
      properties: {
        name: '',
        policy: {
          retain: {
            rPolicy: 0
          },
          storage: {
            max: '',
            sPolicy: {
              enable: false,
              expandRate: 0,
              initSize: ''
            }
          }
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
        this.getCDPJournalProperties()
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getCDPJournalProperties() {
      getCDPJournalProperties({ name: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.properties = resp.data
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
      width: 110px;
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
