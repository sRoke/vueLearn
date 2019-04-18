<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="同步磁盘" width="500px">
    <el-form v-loading="loading" ref="diskSyncForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="磁盘">
        <el-input/>
      </el-form-item>
      <el-form-item label="保护类型">
        <el-switch/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'Sync',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      form: {},
      rules: {}
    }
  },
  methods: {
    handleClose() {
      this.$refs['diskSyncForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
