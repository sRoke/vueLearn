<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="磁盘状态详情" width="600px">
    <!--<div class="title">{{ details.dev }}</div>-->
    <table>
      <tbody>
        <tr>
          <td>磁盘名称</td>
          <td>
            {{ details.dev }}
          </td>
        </tr>
        <tr>
          <td>ID</td>
          <td>
            <el-tooltip :content="details.diskid" placement="top-start">
              <div class="td_text">{{ details.diskid }}</div>
            </el-tooltip>
          </td>
          <td>容量</td>
          <td>{{ details.capacity }}</td>
          <td>状态</td>
          <td>{{ details.status === 'PROTECTED' ? '受保护的' : '未受保护的' }}</td>
        </tr>
        <tr v-if="details.conn === 16 || details.conn === 17 || details.conn === 18 || details.conn === 19">
          <td>剩余时间</td>
          <td>{{ details.finish }}</td>
          <td>同步进度</td>
          <td>
            <el-tooltip :content="details.synced" placement="top-start">
              <div class="td_text">{{ details.synced }}</div>
            </el-tooltip>
          </td>
          <td>同步速率</td>
          <td>
            <span>{{ details.speed }}k/sec</span>
          </td>
        </tr>
        <tr v-if="details.conn !== 16 && details.conn !== 17 && details.conn !== 18 && details.conn !== 19">
          <td>数据状态</td>
          <td>{{ details.dstat }}</td>
          <td>数据量</td>
          <td>
            <div>{{ details.dsend }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import { getStat } from '@/api/SRDstor/clientAgent'
export default {
  name: 'Status',
  filters: {
    connFilter: function(val) {
      return store.state.returnConn.rcList[val] || val
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
        return null
      }
    },
    ip: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      details: {
        conn: 13
      },
      form: {},
      rules: {}
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getDiskStatus(this.currentRow.diskid)
      }
    }
  },
  methods: {
    handleClose() {
      // this.$refs['diskStatusForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getDiskStatus(id) {
      const self = this
      getStat({
        cmdcode: 30,
        diskid: id
      }, `${self.ip}:8888`).then(resp => {
        if (resp.retcode === 0) {
          self.details = resp.data[0]
          // store.state.returnConn.rcList[resp.data.conn]
        }
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
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
