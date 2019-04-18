<template>
  <main v-loading="loading" class="l-physical-devices-container">
    <div class="l-physical-devices-container__header">
      <el-button icon="iconfont icon-scan" size="small" type="primary" @click="rescanDisk">重新扫描</el-button>
      <el-button icon="iconfont icon-light" plain size="small" @click="lightDisk">点亮</el-button>
      <el-button icon="iconfont icon-extinguish" plain size="small" @click="extinguishDisk">熄灭</el-button>
    </div>
    <div class="c-raid-image">
      <raid-image :disks-status = "tableData" :slot-number="slotNumber" @handleSlotChange = "handleSlotChange"/>
    </div>
    <physical-devices-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"
      @handleAllSelectionChange="handleAllSelectionChange"/>
    <physical-devices-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      :page-sizes="pageSizes"
      @handleCurrentChange = "handleCurrentChange"
      @handleSizeChange = "handleSizeChange"/>
  </main>
</template>

<script>
import axios from 'axios'
import { getDisks, getDisk, rescanDisk, lightDisk, extinguishDisk, getLightStatus } from '@/api/SRDstor/physicalResources/physicalDevices'
import PhysicalDevicesTable from './components/table'
import PhysicalDevicesPagination from '@/components/Pagination/index'
import RaidImage from '@/components/RAIDImage/index'

export default {
  name: 'Index',
  components: {
    PhysicalDevicesTable,
    PhysicalDevicesPagination,
    RaidImage
  },
  data() {
    return {
      slotNumber: 12,
      loading: true, // 加载状态 { Boolean }
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 12, // 当前页面尺寸 { Number }
      pageSizes: [12, 16, 20],
      multipleSelection: [] // 所选中表格信息 { Array }
    }
  },
  created() {
    this.getDisksAndLightStatusAndDiskVendorInfo()
    this.queryDisks()
  },
  methods: {
    /**
     * 设置当前页码并初始化表格
     * @function setCurrentPaginationChange
     * @param val {Number} - 当前页码 - e.g 1
     **/
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDisksAndLightStatusAndDiskVendorInfo()
    },
    /**
     * 设置当前页面尺寸并初始化表格
     * @function setSizeChange
     * @param val {Number} - 当前页面尺寸 - e.g 12
     **/
    handleSizeChange(val) {
      this.pageSize = val
      this.getDisksAndLightStatusAndDiskVendorInfo()
    },
    /**
     * 初始化，获取磁盘阵列信息
     * @function getDisksAndLightStatusAndDiskVendorInfo
     **/
    getDisksAndLightStatusAndDiskVendorInfo() {
      const self = this
      // 启用加载动画
      self.loading = true
      axios.all([getDisks(), getLightStatus()]).then(axios.spread(function(disksResp, ligthStatusResp) {
        // 两个请求现在都执行完成
        if (disksResp.rc === 0) {
          self.slotNumber = 12
          // 初次获取磁盘信息
          self.tableData = disksResp.Data.disks.filter(item => {
            return (item.slot !== '')
          })

          // 遍历添加初始信息 isLight 默认未点亮 isChosen 默认槽位未选中 details 厂商信息
          self.tableData = self.tableData.map((item, index, array) => {
            item.details = {
              vendor: '',
              product: '',
              firmwareRev: '',
              sn: ''
            }
            item.isChosen = false
            item.isLight = false
            return item
          })
          if (ligthStatusResp.rc === 0) {
            if (Array.isArray(ligthStatusResp.data)) {
              ligthStatusResp.data.forEach(lightStatusItem => {
                self.tableData.forEach(diskItem => {
                  if (diskItem.slot === lightStatusItem) {
                    diskItem.isLight = true
                  }
                })
              })
            }
          }
          // 遍历获取对应的厂商信息
          self.tableData.forEach((item, index, array) => {
            self.getDiskVendorInfo(item, index, array)
          })
          self.multipleSelection = []
          self.loading = false
        }
      })).catch(() => {
        self.loading = false
      })
    },
    /**
     * 设置对应磁盘的厂商信息
     * @function getDiskVendorInfo
     * @param item {Object} - 单个磁盘 - e.g "{name: 'sda', id: '1347'...}"
     * @param [index] {Number} - 索引 - e.g 1
     * @param [array] {Obejct} - 磁盘阵列 - e.g "{name: 'sda', id: '1347'...}"
     **/
    getDiskVendorInfo(item, index, array) {
      const self = this
      getDisk({
        name: item.name
      }).then(resp => {
        if (resp.rc === 0) {
          item.details = resp.data.details
          self.$set(self.tableData, index, item)
        }
      })
    },
    /**
     * 获取最新的磁盘信息
     * @function queryDisks
     **/
    queryDisks() {
      const self = this
      getDisks().then(resp => {
        if (resp.rc === 0) {
          resp.Data.disks.forEach(respDiskItem => {
            self.tableData.forEach(diskItem => {
              if (respDiskItem.slot === diskItem.slot) {
                if (respDiskItem.baseInfo.size !== diskItem.baseInfo.size) {
                  diskItem.baseInfo.size = respDiskItem.baseInfo.size
                }
                if (respDiskItem.baseInfo.sectorSize !== diskItem.baseInfo.sectorSize) {
                  diskItem.baseInfo.sectorSize = respDiskItem.baseInfo.sectorSize
                }
                if (respDiskItem.baseInfo.sectorNum !== diskItem.baseInfo.sectorNum) {
                  diskItem.baseInfo.sectorNum = respDiskItem.baseInfo.sectorNum
                }
                if (respDiskItem.name !== diskItem.name) {
                  diskItem.name = respDiskItem.name
                }
                if (respDiskItem.status !== diskItem.status) {
                  diskItem.status = respDiskItem.status
                }
                if (respDiskItem.usedFlag !== diskItem.usedFlag) {
                  diskItem.usedFlag = respDiskItem.usedFlag
                }
              }
            })
          })
        }
      })

      // 启动新的定时器
      const timer = setTimeout(() => {
        self.queryDisks()
      }, 5000)

      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      self.$once('hook:beforeDestroy', () => {
        clearTimeout(timer)
      })
    },
    /**
     * 设置当前槽位的选中状态
     * @function handleSlotChange
     * @param row {Object} - 所选磁盘对象 - e.g "{name: 'sda', id: '1347'...}"
     */
    handleSlotChange(row) {
      // flag标示所选磁盘是否已存在于multipleSelection中
      let flag = false
      this.multipleSelection.forEach((item, index, array) => {
        if (item.slot === row.slot) {
          // 槽位取消选中对应将multipleSelection中的数据去除
          if (!row.isChosen) {
            this.multipleSelection.splice(index, 1)
          }
          flag = true
        }
      })
      if (!flag) {
        this.multipleSelection.push(row)
      }
      // 根据现有的multipleSelection中数值重置tableData中isChoosen中的状态
      this.tableData.forEach((tableItem, index, array) => {
        tableItem.isChosen = false
        this.multipleSelection.forEach(selectionItem => {
          if (selectionItem.slot === tableItem.slot) {
            tableItem.isChosen = true
          }
        })
        this.$set(this.tableData, index, tableItem)
      })
    },
    /**
     * 获取所选表格信息
     * @function handleSelectionChange
     * @param selection {Object} - 所选行 - e.g "{name: 'sda', id: '1347'...}"
     **/
    handleSelectionChange(selectedRow) {
      // row是否存在于multipleSelection中
      // false: 不存在 true: 存在
      let flag = false

      // 记录row在multipleSelection中所处的位置 默认为0
      let i = 0

      // 遍历multipleSelection判断所选row是否存在于已选表格数组中
      this.multipleSelection.forEach((item, index, array) => {
        if (item.slot === selectedRow.slot) {
          flag = true
          i = index
        }
      })

      // row未存在于multipleSelection则添加反之删除
      if (!flag) {
        this.multipleSelection.push(selectedRow)
      } else {
        this.multipleSelection.splice(i, 1)
      }

      // 遍历tableData表格数组设置对应的选中状况
      this.tableData.forEach((tableItem, index, array) => {
        // 初始设置为未选中
        tableItem.isChosen = false

        // 遍历multipleSelection 根据名字做比较 若相同则设置为选中
        this.multipleSelection.forEach(selectionItem => {
          if (tableItem.slot === selectionItem.slot) {
            tableItem.isChosen = true
          }
        })

        // 触发数据更新
        this.$set(this.tableData, index, tableItem)
      })
    },
    handleAllSelectionChange(selection) {
      const self = this
      if (selection.length === 0) {
        self.multipleSelection = []
        self.tableData.forEach((item, index) => {
          item.isChosen = false
          self.$set(self.tableData, index, item)
        })
      } else {
        self.multipleSelection = selection
        self.tableData.forEach((tableItem, tableIndex) => {
          selection.forEach(selectionItem => {
            if (tableItem.slot === selectionItem.slot) {
              tableItem.isChosen = true
              self.$set(self.tableData, tableIndex, tableItem)
            }
          })
        })
      }
    },
    formatMessageBox(action, params, name, type) {
      const h = this.$createElement
      this.$msgbox({
        title: `${action}槽位`,
        message: h('p', null, [
          h('span', null, `确定${action}槽位`),
          h('i', { style: 'color: #e96661' }, name),
          h('span', null, '?')
        ]),
        showCancelButton: true,
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            type(params)
              .then(resp => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                if (resp.rc === 0) {
                  done()
                  this.getDisksAndLightStatusAndDiskVendorInfo()
                } else {
                  this.$message({ type: 'error', message: `槽位${action}失败` })
                }
              })
              .catch(() => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
              })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: `槽位${action}成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${action}操作`
        })
      })
    },
    queryMultipleSelection() {
      if (this.multipleSelection.length === 0) {
        this.$message({ type: 'warning', message: '请选择槽位' })
        return false
      }
      return true
    },
    /**
     * 扫描磁盘以更新磁盘信息
     * @function rescanDisk
     **/
    rescanDisk() {
      this.formatMessageBox('扫描', '', ' ', rescanDisk)
    },
    /**
     * 点亮槽位
     * @function lightDisk
     * @param val {Object} - 所选磁盘对象 - e.g "{name: 'sda', id: '1347'...}, {name: 'sdb'}"
     **/
    lightDisk(val) {
      if (!this.queryMultipleSelection()) {
        return false
      }
      const slots = this.multipleSelection.map(item => { return (item.slot).toString() })
      this.formatMessageBox('点亮', { slots: slots }, slots.join(), lightDisk)
    },
    /**
     * 熄灭槽位
     * @function extinguishDisk
     * @param val {Object} - 所选磁盘对象 - e.g "{name: 'sda', id: '1347'...}, {name: 'sdb'}"
     **/
    extinguishDisk() {
      if (!this.queryMultipleSelection()) {
        return false
      }
      const slots = this.multipleSelection.map(item => { return (item.slot).toString() })
      this.formatMessageBox('熄灭', { slots: slots }, slots.join(), extinguishDisk)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-physical-devices-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header {
      padding-bottom: 20px;
    }
    .c-raid-image {
      padding-bottom: 20px;
      text-align: center;
    }
  }
</style>
