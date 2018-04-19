<template>
  <div>
    <el-table
    :data="show_emailMsg"
    style="width: 100%" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中">
      </el-table-column>
      <el-table-column
      prop="id"
      label="ID"
      width="150">
      </el-table-column>
      <el-table-column
      prop="server_name"
      label="服务名称">
      </el-table-column>
      <el-table-column
      prop="email"
      label="Email">
      </el-table-column>
      <el-table-column
      prop="host"
      label="Host">
      </el-table-column>
      <el-table-column
      prop="port"
      label="端口">
      </el-table-column>
      <el-table-column
      prop="remark"
      label="备注">
      </el-table-column>
      <el-table-column
        label="操作"
        width="80">
        <template scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="editInfo()">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <editInfo ref="editInfo" :info="editMsg"></editInfo>
  </div>
  
</template>
<style type="text/css">
  .form-checkbox:first-child{
    margin-left: 15px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import editInfo from './edit.vue'
  export default {
    data() {
      return {
        show_emailMsg: [],
        emailMsg: {},
        editMsg: {},
        fullscreenLoading: false
      }
    },
    methods: {
      editInfo() {
        this.editMsg = this.emailMsg
        var show_emailMsg = []
        show_emailMsg.push(this.emailMsg)
        this.show_emailMsg = show_emailMsg
        this.$refs.editInfo.open()
      },
      getData() {
        this.apiGet('system_configs/email').then((res) => {
          this.fullscreenLoading = false
          if (res.code == 200) {
            this.emailMsg = res.data
            this.show_emailMsg.push(this.emailMsg)
            // console.log(this.emailMsg)
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.fullscreenLoading = true
      this.getData()
    },
    components: {
      editInfo
    },
    mixins: [http]
  }
</script>