<template>
  <el-dialog ref="dialog" title="导入失败原因" class="dialog">
    <el-table
      :data="errorData"
      border
      style="width: 100%;">
      <el-table-column
        prop="name"
        label="失败原因"
        width="150"
        align="center">
      </el-table-column>
      <el-table-column
        label="行号">
        <template scope="scope">
          <el-input type="textarea" placeholder="请输入内容" v-model="scope.row.num" :autosize="{ minRows: 1, maxRows: 4}"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click.prevent="close()">取 消</el-button>
      <el-button type="primary" @click.prevent="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import http from '../../../assets/js/http'
  export default {
    props: ['errorData'],
    data() {
      return {
      }
    },
    methods: {
      open() { // 开启模态框
        var self = this
        self.$refs.dialog.open()
      },
      close() { // 关闭莫泰框
        var self = this
        self.$refs.dialog.close()
      },
      submit() { // 关闭莫泰框
        var self = this
        self.$refs.dialog.close()
      }
    },
    created() {
      var self = this
      self.uploadUrl = window.HOST + 'Upload/data'
    },
    mounted() {
    },
    mixins: [http]
  }
</script>