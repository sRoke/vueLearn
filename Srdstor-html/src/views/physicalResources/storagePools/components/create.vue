<template>
  <section v-loading="loading" class="l-create-form-container">
    <div class="l-create-form-container__header">
      <raid-image :disks-status = "tableData" @handleSlotChange = "setSelectedSlot"/>
    </div>
    <div class="l-create-form-container__main">
      <div class="l-create-form-container__form">
        <el-form ref="form" :rules = "rules" :model="form" label-width="70px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="级别" prop="devTree.raidType">
            <el-select
              ref = "raidType"
              v-model="form.devTree.raidType"
              placeholder="请选择级别"
              style="display: block;">
              <el-option
                v-for="item in raidType"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.prompt }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="硬盘" prop="devTree.blockDevicesAry">
            <el-select
              v-model="form.devTree.blockDevicesAry"
              multiple
              placeholder="请选择硬盘"
              style="display: block;"
              @change = "blockDevicesChange">
              <el-option
                v-for="item in tableList"
                :key="item.slot"
                :disabled = "item.usedFlag"
                :label="item.slot"
                :value="item.slot">
                <span style="float: left">{{ item.slot }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">容量: {{ item.baseInfo.size | bytesFormatter }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="热备盘" prop="devTree.hotSpareDeviceAry">
            <el-select v-model="form.devTree.hotSpareDeviceAry" multiple placeholder="请选择热备盘" style="display: block;">
              <el-option
                v-for="item in tableList"
                :key="item.slot"
                :disabled = "item.usedFlag"
                :label="item.slot"
                :value="item.name">
                <span style="float: left">{{ item.slot }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">容量: {{ item.baseInfo.size | bytesFormatter }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="读" prop="devTree.rCacheDeviceAry">
            <el-select v-model="form.devTree.rCacheDeviceAry" multiple placeholder="请选择读缓存盘" style="display: block;">
              <el-option
                v-for="item in tableList"
                :key="item.slot"
                :disabled = "item.usedFlag"
                :label="item.slot"
                :value="item.name">
                <span style="float: left">{{ item.slot }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">容量: {{ item.baseInfo.size | bytesFormatter }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="写" prop="devTree.wCacheDeviceAry">
            <el-select v-model="form.devTree.wCacheDeviceAry" multiple placeholder="请选择写缓存盘" style="display: block;">
              <el-option
                v-for="item in tableList"
                :key="item.slot"
                :disabled = "item.usedFlag"
                :label="item.slot"
                :value="item.name">
                <span style="float: left">{{ item.slot }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">容量: {{ item.baseInfo.size | bytesFormatter }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="l-create-form-container__table">
        <el-table
          ref="multipleTable"
          :data="tableList"
          :default-sort = "{prop: 'slot', order: 'ascending'}"
          fit
          border
          highlight-current-row
          max-height="263"
          @select = "handleSelectionChange">
          <el-table-column
            :selectable="checkSelectable"
            type="selection"
            width="40"/>
          <el-table-column :sort-method="sortBySlot" label="槽位" prop="slot" sortable/>
          <el-table-column label="容量">
            <template slot-scope="scope">
              {{ scope.row.baseInfo.size | bytesFormatter }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="l-create-form-container__footer">
      <el-button type="primary" @click.native = "createStoragePool('form')">创 建</el-button>
      <el-button @click.native = "showChartView">取 消</el-button>
    </div>
  </section>
</template>

<script>
import { raidTypeFilter, deepClone, filterUnique } from '@/utils/index'
import { createStoragePool } from '@/api/SRDstor/physicalResources/storagePools'
import RaidImage from '@/components/RAIDImage/index'
// import { raidTypeFilter } from '@/utils/index'
export default {
  name: 'Create',
  components: {
    RaidImage
  },
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    var validateRAIDType = (rule, value, callback) => {
      const raidType = this.form.devTree.raidType
      const minimumNumberRAID = {
        1: 1,
        2: 2,
        3: 4,
        4: 3,
        5: 6,
        6: 4,
        7: 8,
        8: 5
      }
      if (raidType === 2 && value.length !== 2) {
        callback(new Error('RAID1只能选两块盘'))
      }
      if (value.length < minimumNumberRAID[raidType]) {
        callback(new Error('请选择符合数量的硬盘'))
      } else {
        callback()
      }
    }
    var validateHotSpareDevice = (rule, value, callback) => {
      const blockDevicesAry = this.getDiskNameBySlot(this.form.devTree.blockDevicesAry)
      const disksArr = filterUnique(blockDevicesAry.concat(this.form.devTree.wCacheDeviceAry, this.form.devTree.rCacheDeviceAry))
      const hasChosenDisk = []
      disksArr.forEach(diskItem => {
        value.forEach(item => {
          if (diskItem === item) {
            hasChosenDisk.push(item)
          }
        })
      })
      if (hasChosenDisk.length > 0) {
        const arr = this.getDiskSlotByName(hasChosenDisk)
        callback(new Error(`硬盘${arr}已被选,请选择其他硬盘`))
      } else {
        callback()
      }
    }
    var validateRCacheDeviceAry = (rule, value, callback) => {
      const blockDevicesAry = this.getDiskNameBySlot(this.form.devTree.blockDevicesAry)
      const disksArr = filterUnique(blockDevicesAry.concat(this.form.devTree.wCacheDeviceAry, this.form.devTree.hotSpareDeviceAry))
      const hasChosenDisk = []
      disksArr.forEach(diskItem => {
        value.forEach(item => {
          if (diskItem === item) {
            hasChosenDisk.push(item)
          }
        })
      })
      if (hasChosenDisk.length > 0) {
        const arr = this.getDiskSlotByName(hasChosenDisk)
        callback(new Error(`硬盘${arr}已被选,请选择其他硬盘`))
      } else {
        callback()
      }
    }
    var validateWCacheDeviceAry = (rule, value, callback) => {
      const blockDevicesAry = this.getDiskNameBySlot(this.form.devTree.blockDevicesAry)
      const disksArr = filterUnique(blockDevicesAry.concat(this.form.devTree.rCacheDeviceAry, this.form.devTree.hotSpareDeviceAry))
      const hasChosenDisk = []
      disksArr.forEach(diskItem => {
        value.forEach(item => {
          if (diskItem === item) {
            hasChosenDisk.push(item)
          }
        })
      })
      if (hasChosenDisk.length > 0) {
        const arr = this.getDiskSlotByName(hasChosenDisk)
        callback(new Error(`硬盘${arr}已被选,请选择其他硬盘`))
      } else {
        callback()
      }
    }
    return {
      tableList: this.tableData, // 表格信息 { Array }
      form: {
        name: '', // 存储池名称 {String}
        devTree: {
          raidType: 1, // RAID类型 {Number}
          blockDevicesAry: [], // 硬盘 选中磁盘(Select) {Array}
          hotSpareDeviceAry: [], // 热备盘
          rCacheDeviceAry: [], // 读缓存盘
          wCacheDeviceAry: [] // 写缓存盘
        }
      },
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }],
        'devTree.raidType': [{
          required: true, message: '请选择级别', trigger: 'change'
        }],
        'devTree.blockDevicesAry': [{
          required: true, message: '请选择硬盘', trigger: 'change'
        }, {
          validator: validateRAIDType, trigger: 'change'
        }],
        'devTree.hotSpareDeviceAry': [{
          validator: validateHotSpareDevice, trigger: 'change'
        }],
        'devTree.rCacheDeviceAry': [{
          validator: validateRCacheDeviceAry, trigger: 'change'
        }],
        'devTree.wCacheDeviceAry': [{
          validator: validateWCacheDeviceAry, trigger: 'change'
        }]
      },
      loading: false,
      raidType: [{
        name: 'RAID0',
        value: 1,
        prompt: '请至少选择一块盘'
      }, {
        name: 'RAID1',
        value: 2,
        prompt: '请选择两块盘'
      }, {
        name: 'RAID10',
        value: 3,
        prompt: '请至少选择四块盘'
      }, {
        name: 'RAID5',
        value: 4,
        prompt: '请至少选择三块盘'
      }, {
        name: 'RAID50',
        value: 5,
        prompt: '请至少选择六块盘'
      }, {
        name: 'RAID6',
        value: 6,
        prompt: '请至少选择四块盘'
      }, {
        name: 'RAID60',
        value: 7,
        prompt: '请至少选择八块盘'
      }, {
        name: 'RAIDX',
        value: 8,
        prompt: '请至少选择五块盘'
      }], // RAID类型
      multipleSelection: [] // 选中磁盘(Table) {Array}
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.tableList = val.concat()
      this.tableList = this.tableList.sort((a, b) => Number(a.slot) - Number(b.slot))
    }
  },
  methods: {
    getDiskSlotByName(arr) {
      const slots = []
      this.tableList.forEach(tableItem => {
        arr.forEach(item => {
          if (item === tableItem.name) {
            slots.push(tableItem.slot)
          }
        })
      })
      return slots
    },
    getDiskNameBySlot(arr) {
      const diskName = []
      this.tableList.forEach(tableItem => {
        arr.forEach(item => {
          if (item === tableItem.slot) {
            diskName.push(tableItem.name)
          }
        })
      })
      return diskName
    },
    sortBySlot(a, b) {
      const aSlot = a.slot === '' ? -1 : parseInt(a.slot)
      const bSlot = b.slot === '' ? -1 : parseInt(b.slot)
      return (aSlot - bSlot)
    },
    /**
     * 判断当前行是否可选
     * @param row {Object} 当前行
     * @param index {Number} 当前行索引
     * @returns {number}
     */
    checkSelectable(row, index) {
      return row.usedFlag ? 0 : 1
    },
    /**
     * 硬盘被选择时触发(Select)
     * @param val {Array} 已选中的磁盘
     */
    blockDevicesChange(val) {
      this.form.devTree.blockDevicesAry = val

      // 将选中的磁盘根据名称赋值于新建的数组变量因为multipleSelection2数组只包含磁盘名称信息
      const mArr = []
      this.tableData.forEach((item, index, array) => {
        item.isChosen = false
        this.form.devTree.blockDevicesAry.forEach((item2, index2, array2) => {
          if (item2 === item.slot) {
            item.isChosen = true
            mArr.push(item)
          }
        })
        this.$set(this.tableData, index, item)
      })

      // 赋值于multipleSelection 以及同步更新表格上的选择状态
      this.multipleSelection = mArr
      this.$refs.multipleTable.clearSelection()
      // if (this.multipleSelection.length === 0) {
      //   this.$refs.multipleTable.clearSelection()
      // }

      this.multipleSelection.forEach((item, index, array) => {
        if (!item.usedFlag) {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(item, item.isChosen)
          })
        }
      })
    },
    /**
     * 磁盘被选中时(Table)
     * @param selection {Object} 已选中的行
     * @param row {Object} 当前选中的行
     */
    handleSelectionChange(selection, row) {
      // 判断所选行是否已在multipleSelection中
      let flag = false
      let i = 0
      this.multipleSelection.forEach((item, index, array) => {
        if (item.slot === row.slot) {
          flag = true
          i = index
        }
      })

      // 已经存在则删除反之添加
      if (flag) {
        this.multipleSelection.splice(i, 1)
        this.form.devTree.blockDevicesAry.splice(i, 1)
        this.tableData.forEach((item, index, array) => {
          if (row.slot === item.slot) {
            item.isChosen = false
          }
          this.$set(this.tableData, index, item)
        })
        this.$refs.multipleTable.clearSelection()
        this.tableData.forEach(item => {
          if (item.isChosen) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(item, item.isChosen)
            })
          }
        })
      } else {
        this.multipleSelection.push(row)
        this.form.devTree.blockDevicesAry.push(row.slot)
        this.tableData.forEach((item, index, array) => {
          if (row.slot === item.slot) {
            item.isChosen = true
          }
          this.$set(this.tableData, index, item)
        })
        this.$refs.multipleTable.clearSelection()
        this.tableData.forEach(item => {
          if (item.isChosen) {
            this.$nextTick(() => {
              this.$refs.multipleTable.toggleRowSelection(item, item.isChosen)
            })
          }
        })
      }
    },
    /**
     * 点击槽位触发(RAIDImage)
     * @param row {Object} 所点击的槽位对应的磁盘数据
     */
    setSelectedSlot(row) {
      // TODO 后期考虑调整下
      // 遍历如果已存在且未选中 则删除
      let flag = false
      this.multipleSelection.forEach((item, index, array) => {
        if (item.slot === row.slot) {
          if (!row.isChosen) {
            this.multipleSelection.splice(index, 1)
            this.form.devTree.blockDevicesAry.splice(index, 1)
          }
          flag = true
        }
      })

      // 未存在则添加
      if (!flag) {
        this.multipleSelection.push(row)
        const countOccurrences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)
        if (countOccurrences(this.form.devTree.blockDevicesAry, row.slot) <= 0) {
          this.form.devTree.blockDevicesAry.push(row.slot)
        }
      }
      this.tableData.forEach((item, index, array) => {
        item.isChosen = false
        this.multipleSelection.forEach((mitem, mindex, marray) => {
          if (mitem.slot === item.slot) {
            item.isChosen = true
          }
        })
        this.$set(this.tableData, index, item)
      })
      this.tableData.forEach(item => {
        if (item.isChosen) {
          this.$nextTick(() => {
            this.$refs.multipleTable.toggleRowSelection(item, item.isChosen)
          })
        }
      })
    },
    /**
     * 提交创建存储池表单
     * FIXME 创建成功后无法获取新生成的图表的上级DIV的宽高
     * 导致渲染失败 图表无法生成 目前的做法是给了一个默认的宽高
     */
    createStoragePool(formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const form = deepClone(_this.form)
          form.devTree.blockDevicesAry = raidTypeFilter(form.devTree.raidType, this.getDiskNameBySlot(form.devTree.blockDevicesAry))
          createStoragePool(form).then(resp => {
            if (resp.rc === 0) {
              _this.$message({ type: 'success', message: '存储池创建成功' })
              setTimeout(() => {
                _this.$emit('updateData', false)
              }, 2000)
              setTimeout(() => {
                _this.$emit('updateData', false)
                this.loading = false
                this.$emit('handleViewVisible', true)
              }, 4000)
              this.$refs['form'].resetFields()
              this.multipleSelection = []
              this.form.devTree.blockDevicesAry = []
              this.form.name = ''
            } else {
              this.loading = false
              _this.$message({ type: 'failure', message: '存储池创建失败' })
            }
          })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 显示图表视图
     */
    showChartView() {
      this.$refs['form'].resetFields()
      this.form.hotSpareDeviceAry = []
      this.form.rCacheDeviceAry = []
      this.form.wCacheDeviceAry = []
      this.$emit('handleViewVisible', true)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-button--advanced-options {
    background: #e1e1e1;
    border-color: #ccc;
    color: #666;
  }
  .l-create-form-container {
    &__header {
      text-align: center;
      padding: 5px 0 0 0;
    }
    &__main {
      margin: 0 auto;
      width: 746px;
    }
    &__footer {
      padding-right: 150px;
      text-align: right;
    }
    &__form {
      display: inline-block;
      width: 380px;
      padding: 20px 10px;
    }
    &__table {
      display: inline-block;
      width: 331px;
      padding: 20px 10px;
      vertical-align: top;
    }
  }
</style>
