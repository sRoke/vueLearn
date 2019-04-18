<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="许可信息"
    width="600px">
    <table>
      <tbody>
        <tr>
          <td>客户端名称</td>
          <td>
            <el-tooltip :content="`${selectedRow.name}`" placement="top-start">
              <div class="td_text">{{ selectedRow.name }}</div>
            </el-tooltip>
          </td>
          <td>客户端IP</td>
          <td>
            {{ selectedRow.ip }}
          </td>
        </tr>
        <tr>
          <td>许可有效天数</td>
          <td>
            {{ info.overdue_day }}天
          </td>
          <td>许可注册时间</td>
          <td>
            {{ info.register_time | timeFilter }}
          </td>
        </tr>
        <tr>
          <td>许可剩余时间</td>
          <td>
            {{ info.lastTime }}
          </td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getLicenseInfo } from '@/api/SRDstor/clientAgent'
export default {
  name: 'LicenseInfo',
  filters: {
    timeFilter: parseTime
  },
  props: {
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
      dialogVisible: this.showDialog,
      loading: false,
      selectedRow: {},
      info: {},
      details: {}
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getInfo()
      }
    },
    currentRow(val) {
      if (val) {
        this.selectedRow = val
      } else {
        this.selectedRow = {}
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleDialogVisible', false)
    },
    getInfo() {
      const self = this
      getLicenseInfo({ cmdcode: 82 }, `${self.currentRow.ip}:8888`).then(resp => {
        if (resp.retcode === 0) {
          self.info = resp.data
          const lastTime = self.info.overdue_day * 24 - Math.floor((self.info.time_interval) / 3600)
          const days = Math.floor(lastTime / 24)
          const hours = lastTime % 24
          self.info.lastTime = days > 0 ? `${days}天${hours}小时` : `${hours}小时`
        }
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped  lang="scss" rel="stylesheet/scss">
  table {
    table-layout: fixed;
    width: 100%;
  }
  tbody {
  tr td {
    .td_text{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
  }
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
