<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="网络接口" width="500px">
    <el-table
      :data="interfaces"
      border
      stripe>
      <el-table-column type="index" width="35"/>
      <el-table-column label="地址" prop="addr" show-overflow-tooltip/>
      <el-table-column label="名称" prop="name" show-overflow-tooltip/>
      <el-table-column label="子网掩码" prop="netmask" show-overflow-tooltip/>
    </el-table>
  </el-dialog>
</template>

<script>
import { getInterfaces } from '@/api/SRDstor/systemManage'

export default {
  name: 'NIC',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      interfaces: null
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getInterfaces()
      }
    }
  },
  methods: {
    handleClose() {
      // this.$refs['editStoragePoolForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getInterfaces() {
      getInterfaces({ cmdcode: 2 })
        .then(resp => {
          if (resp.rc === 0) {
            this.interfaces = resp.data.interfaces
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
