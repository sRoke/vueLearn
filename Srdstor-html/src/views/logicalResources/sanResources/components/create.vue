<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="创建虚拟设备"
    width="600px">
    <el-form v-loading="loading" ref="addSanResourceForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="poolName" label="存储池">
        <el-select v-model="form.poolName" style="display: block;">
          <el-option v-for="item in storagePools" :key="item.name" :label="item.altName" :value="item.name">
            <span style="float: left">{{ item.altName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">/总容量: {{ item.size | bytesFormatter }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">可用容量: {{ item.free | bytesFormatter }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="大小">
        <el-input-number v-model="form.size" :min="1" style="width: 178px;"/>
        <el-select v-model="sizeUnit" style="width: 70px;">
          <el-option v-for="item in storageUnit" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="精简配置">
        <el-switch v-model="form.thinProvisioning.enable"/>
      </el-form-item>
      <el-collapse-transition>
        <el-form-item v-show="form.thinProvisioning.enable" label-width="175px" label="固定分配大小">
          <el-input-number v-model="form.thinProvisioning.refreservation" :min="1"/>
          <el-select v-model="refreservationSizeUnit" style="width: 70px;">
            <el-option v-for="item in storageUnit" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-collapse-transition>
      <el-form-item label="块大小">
        <el-select v-model="form.block">
          <el-option v-for="item in blocks" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="开启压缩">
        <el-switch v-model="form.normalProperty.dedup"/>
      </el-form-item>
      <el-form-item label="压缩等级">
        <el-select :disabled="!form.normalProperty.dedup" v-model="form.normalProperty.compression">
          <el-option v-for="item in compression" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="只读">
        <el-switch v-model="form.normalProperty.readonly"/>
      </el-form-item>
      <el-form-item label="份数">
        <el-input-number v-model="form.normalProperty.copies" :min="1" style="width: 178px;"/>
      </el-form-item>
      <el-form-item label="同步方式">
        <el-select v-model="form.syncWay">
          <el-option v-for="item in syncWay" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('addSanResourceForm')">创  建</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { createSanResource } from '@/api/SRDstor/logicalResources/sanResources'
import { getStoragePools } from '@/api/SRDstor/physicalResources/storagePools'
export default {
  name: 'Create',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      loading: false,
      storageUnit: ['MB', 'GB', 'TB'],
      sizeUnit: 'GB',
      refreservationSizeUnit: 'MB',
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }],
        poolName: [{
          required: true, message: '请选择存储池', trigger: 'change'
        }]
      },
      form: {
        name: '',
        poolName: '',
        size: 1,
        thinProvisioning: {
          enable: false,
          refreservation: 1
        },
        block: '8kb',
        normalProperty: {
          dedup: false,
          compression: 'lz4',
          readonly: false,
          copies: 1
        },
        syncWay: ''
      },
      storagePools: [],
      blocks: ['2kb', '4kb', '8kb', '16kb', '32kb', '64kb', '128kb'],
      compression: [
        'lzjb', 'gzip', 'gzip-1', 'gzip-2', 'gzip-3', 'gzip-4',
        'gzip-5', 'gzip-6', 'gzip-7', 'gzip-8', 'zip-9', 'zle', 'lz4'
      ],
      syncWay: [{
        name: '安全与性能',
        value: 'standard'
      }, {
        name: '安全为重',
        value: 'always'
      }, {
        name: '性能为重',
        value: 'disabled'
      }]
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getStoragePools()
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['addSanResourceForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getStoragePools() {
      const self = this
      this.loading = true
      getStoragePools()
        .then(resp => {
          this.loading = false
          if (resp.rc === 0) {
            self.storagePools = resp.data.storagepools === null ? [] : resp.data.storagepools
            self.storagePools.forEach(item => {
              item.altName = self.$store.getters.storagePoolNameMap[item.name]
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    organizeForm() {
      const params = deepClone(this.form)
      params.size = params.size.toString() + this.sizeUnit.toLowerCase()
      params.thinProvisioning.refreservation = params.thinProvisioning.refreservation.toString() + this.refreservationSizeUnit.toLowerCase()
      return params
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createSanResource(this.organizeForm()).then(resp => {
            this.loading = false
            if (resp.rc === 0) {
              this.$message({ type: 'success', message: '创建成功' })
              this.$emit('updateData', false)
              this.handleClose()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
