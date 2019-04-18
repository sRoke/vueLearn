<template>
  <div class="l-statistics-container">
    <table>
      <tr>
        <td>名称</td>
        <td v-text = "details.altName"/>
        <td>RAID级别</td>
        <td>{{ details.devTree.raidType | raidLevel }}</td>
      </tr>
      <tr>
        <td>使用率</td>
        <td v-text = "details.property.capacity"/>
        <td>存储池ID</td>
        <td>{{ details.id }}</td>
      </tr>
      <tr>
        <td>总容量</td>
        <td>{{ parseInt(details.size) | bytesFormatter }}</td>
        <td>槽位</td>
        <td>
          <span v-for = "item in details.devTree.blockDevicesAry" :key="item[0]">
            <span v-for="i in item" :key="i">
              <span class="block-device-item">{{ i | formatDevice }}</span>
            </span>
          </span>
        </td>
      </tr>
      <tr>
        <td>已使用</td>
        <td>{{ parseInt(details.allocated) | bytesFormatter }}</td>
        <td>热备盘</td>
        <td>
          <span>{{ details.property.isAutoReplace === 'off' ? '未启动自动替换' : '已启动自动替换' }}</span>
          <span v-show="details.devTree.hotSpareDeviceAry !== null && details.devTree.hotSpareDeviceAry.length > 0">
            <span v-for="item in details.devTree.hotSpareDeviceAry" :key="item" class="hot-spare-device-item"> {{ item | formatDevice }}</span>
          </span>
          <el-button icon="iconfont icon-create" plain circle @click="handleAddPhysicalDeviceDialogVisible('spare')"/>
          <el-button icon="iconfont icon-del" plain circle @click="handleRemovePhysicalDeviceDialogVisible(details.devTree.hotSpareDeviceAry, 'spare')"/>
        </td>
      </tr>
      <tr>
        <td>未使用</td>
        <td>{{ parseInt(details.free) | bytesFormatter }}</td>
        <td>读缓存设备</td>
        <td>
          <span v-show="details.devTree.rCacheDeviceAry !== null && details.devTree.rCacheDeviceAry.length > 0">
            <span v-for="item in details.devTree.rCacheDeviceAry" :key="item" class="read-cache-device-item"> {{ item | formatDevice }}</span>
          </span>
          <el-button icon="iconfont icon-create" plain circle @click="handleAddPhysicalDeviceDialogVisible('cache')"/>
          <el-button icon="iconfont icon-del" plain circle @click="handleRemovePhysicalDeviceDialogVisible(details.devTree.rCacheDeviceAry, 'cache')"/>
        </td>
      </tr>
      <tr>
        <td>只读</td>
        <td>{{ details.property.isReadOnly === 'off' ? '否' : '是' }}</td>
        <td>写缓存设备</td>
        <td>
          <span v-show="details.devTree.wCacheDeviceAry !== null && details.devTree.wCacheDeviceAry.length > 0">
            <span v-for="item in details.devTree.wCacheDeviceAry" :key="item" class="write-cache-device-item"> {{ item | formatDevice }}</span>
          </span>
          <el-button icon="iconfont icon-create" plain circle @click="handleAddPhysicalDeviceDialogVisible('log')"/>
          <el-button icon="iconfont icon-del" plain circle @click="handleRemovePhysicalDeviceDialogVisible(details.devTree.wCacheDeviceAry, 'log')"/>
        </td>
      </tr>
      <tr>
        <td>状态</td>
        <td>{{ details.property.healthy === 'ONLINE' ? '在线' : '离线' }}</td>
      </tr>
    </table>
    <add-physical-device
      :show-dialog="visible.addPhysicalDeviceDialog"
      :storage-pool-name = "storagePoolName"
      :physical-device-type="physicalDeviceType"
      :block-devices-ary="details.devTree.blockDevicesAry"
      @updateData="updateData"
      @handleDialogVisible="visible.addPhysicalDeviceDialog = false"/>
    <remove-physical-device
      :show-dialog="visible.removePhysicalDeviceDialog"
      :storage-pool-name = "storagePoolName"
      :physical-device-type="physicalDeviceType"
      :device-list="deviceList"
      @updateData="updateData"
      @handleDialogVisible="visible.removePhysicalDeviceDialog = false"/>
  </div>
</template>

<script>
import store from '@/store/index'
import AddPhysicalDevice from './addPhysicalDevice'
import RemovePhysicalDevice from './removePhysicalDevice'
export default {
  name: 'Info',
  components: {
    AddPhysicalDevice,
    RemovePhysicalDevice
  },
  filters: {
    formatDevice: function(value) {
      // const blockDevices =
      //   value.map((item, index, array) => {
      //     item = item.map((blockDeviceItem, index, array) => {
      //       blockDeviceItem = blockDeviceItem.substring(blockDeviceItem.lastIndexOf('/') + 1)
      //       return blockDeviceItem
      //     })
      //     return item
      //   }).toString().split(',')
      // return blockDevices
      if (Array.isArray(value)) {
        const deviceName = []
        value.forEach(item => {
          deviceName.push(item.substring(item.lastIndexOf('/') + 1))
        })
        return deviceName
      } else {
        const deviceName = value.substring(value.lastIndexOf('/') + 1)
        return store.getters.physicalDevice[deviceName] || deviceName
      }
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      details: this.info,
      visible: {
        addPhysicalDeviceDialog: false,
        removePhysicalDeviceDialog: false
      },
      physicalDeviceType: '',
      deviceList: [],
      storagePoolName: { altName: this.info.altName, name: this.info.name }
    }
  },
  watch: {
    info(val, oldVal) {
      this.details = val
      this.storagePoolName = { altName: val.altName, name: val.name }
    }
  },
  methods: {
    showChartView() {
      this.$emit('getShowChartViewFlag', false)
    },
    handleRemovePhysicalDeviceDialogVisible(val, type) {
      if (val === null || val.length <= 0) {
        this.$message({ type: 'warning', message: '盘数为空' })
        return false
      }
      this.physicalDeviceType = type
      this.deviceList = val.map(item => {
        return item.substring(item.lastIndexOf('/') + 1)
      })
      this.visible.removePhysicalDeviceDialog = true
    },
    handleAddPhysicalDeviceDialogVisible(val) {
      this.physicalDeviceType = val
      this.visible.addPhysicalDeviceDialog = true
    },
    updateData() {
      this.$emit('updateData', true)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-statistics-container {
    font-size: 14px;
    padding-left: 87px;
    table {
      table-layout: fixed;
    }
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
  .block-device-item {
    display: inline-block;
    background: #eee2f5;
    margin-right: 5px;
    padding: 3px 5px;
    font-weight: 500;
    color: hsl(0, 0%, 17%);
  }
  .hot-spare-device-item {
    display: inline-block;
    background: #0bc265;
    margin-right: 5px;
    padding: 0 5px;
    font-weight: 500;
    color: hsl(0, 0%, 17%);
  }
  .read-cache-device-item {
    display: inline-block;
    background: #2f8cfe;
    margin-right: 5px;
    padding: 0 5px;
    font-weight: 500;
    color: hsl(0, 0%, 17%);
  }
  .write-cache-device-item {
    display: inline-block;
    background: #2f8cfe;
    margin-right: 5px;
    padding: 0 5px;
    font-weight: 500;
    color: hsl(0, 0%, 17%);
  }
</style>
