<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="设置同步速率" width="500px">
    <el-form v-loading="loading" ref="setSyncSpeedForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="客户端名称">
        {{ selectedRow.dev }}
      </el-form-item>
      <el-form-item prop="max_rate" label="速率设置">
        <el-input-number v-model="form.max_rate" :precision="0" :min="min" :max="max" />
        <el-select v-model="form.unit" style="width: 65px;" @change="changeUnit">
          <el-option v-for="item in rateUnit" :key="item.unit" :value="item.unit" :label="item.unit"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { setSpeed } from '@/api/SRDstor/clientAgent'
export default {
  name: 'SetSyncSpeed',
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
      selectedRow: {},
      rateUnit: [
        {
          unit: 'K',
          min: 256,
          max: 4000000
        },
        {
          unit: 'M',
          min: 1,
          max: 4000
        }],
      min: 256,
      max: 4000000,
      form: {
        max_rate: null,
        unit: 'K'
      },
      rules: {}
    }
  },
  watch: {
    currentRow(val) {
      if (val) {
        this.selectedRow = val
      } else {
        this.selectedRow = {}
      }
    },
    showDialog(val) {
      this.dialogVisible = val
      // if (val) {}
    }
  },
  methods: {
    handleClose() {
      this.$refs['setSyncSpeedForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    changeUnit(value) {
      const _this = this
      _this.rateUnit.map(function(val) {
        if (value === val.unit) {
          _this.min = val.min
          _this.max = val.max
        }
      })
      _this.form.max_rate = _this.form.max_rate > _this.max ? _this.max : _this.form.max_rate
      _this.form.max_rate = _this.form.max_rate < _this.min ? _this.min : _this.form.max_rate
    },
    /**
     * 提交编辑表单
     * @param
     */
    submitForm() {
      const _this = this
      _this.loading = true
      setSpeed({
        cmdcode: 56,
        diskid: _this.currentRow.disnid,
        max_rate: _this.form.max_rate + _this.form.unit
      }, `${_this.ip}:8888`).then((resp) => {
        self.loading = false
        if (resp.rc === 0) {
          _this.handleClose()
          _this.$message({ type: 'success', message: '设置成功' })
        } else {
          _this.$message({ type: 'error', message: '设置失败' })
        }
      }).catch(() => {
        _this.loading = false
        _this.$message({ type: 'error', message: `设置失败` })
      })
    }
  }
}
</script>

<style scoped>

</style>
