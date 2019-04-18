<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="智能报表" width="580px">
    <section v-loading="downloadLoading" style="margin-bottom: 10px">
      <el-checkbox v-model="storagePool">存储池</el-checkbox>
      <el-checkbox v-model="physicalDevice">物理设备</el-checkbox>
      <el-checkbox v-model="client">客户端</el-checkbox>
      <el-checkbox v-model="sanResource">逻辑资源</el-checkbox>
      <el-button style="margin-left: 20px;" icon="iconfont icon-excel" type="primary" @click="handleDownload">导出EXCEL</el-button>
    </section>
  </el-dialog>
</template>

<script>
import { getStoragePools } from '@/api/SRDstor/physicalResources/storagePools'
import { getDisks } from '@/api/SRDstor/physicalResources/physicalDevices'
import { getSanClients } from '@/api/SRDstor/client/sanClients'
import { getSanResources } from '@/api/SRDstor/logicalResources/sanResources'

export default {
  name: 'HandleDownload',
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
      storagePool: false,
      physicalDevice: false,
      client: false,
      sanResource: false,
      downloadLoading: false
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      // this.$refs['editStoragePoolForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        if (this.storagePool) {
          getStoragePools().then(resp => {
            if (resp.rc === 0) {
              const tHeader = ['name', 'raid', 'healthy', 'size', 'free', 'allocated']
              const filterVal = ['name', 'raid', 'healthy', 'size', 'free', 'allocated']
              const storagePoollist = resp.data.storagepools === null ? [] : resp.data.storagepools
              const data = this.formatJson(filterVal, storagePoollist)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'storage-pool-list'
              })
            }
          })
        }
        if (this.physicalDevice) {
          getDisks().then(resp => {
            if (resp.rc === 0) {
              const tHeader = ['name', 'slot', 'status', 'usedFlag']
              const filterVal = ['name', 'slot', 'status', 'usedFlag']
              const disks = resp.Data.disks === null ? [] : resp.Data.disks
              const data = this.formatJson(filterVal, disks)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'physical-device-list'
              })
            }
          })
        }
        if (this.client) {
          getSanClients().then(resp => {
            if (resp.rc === 0) {
              const tHeader = ['id', 'name', 'os_type', 'protocols', 'ip', 'description']
              const filterVal = ['id', 'name', 'os_type', 'protocols', 'ip', 'description']
              const sanClients = resp.data === null ? [] : resp.data
              const data = this.formatJson(filterVal, sanClients)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'san-client-list'
              })
            }
          })
        }
        if (this.sanResource) {
          getSanResources().then(resp => {
            if (resp.rc === 0) {
              const tHeader = ['name', 'poolName', 'guid', 'cdp', 'size', 'used', 'thin']
              const filterVal = ['name', 'poolName', 'guid', 'cdp', 'size', 'used', 'thin']
              const sanResources = resp.Data.virtualDevices === null ? [] : resp.Data.virtualDevices
              const data = this.formatJson(filterVal, sanResources)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: 'san-resource-list'
              })
            }
          })
        }
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>

<style scoped>

</style>
