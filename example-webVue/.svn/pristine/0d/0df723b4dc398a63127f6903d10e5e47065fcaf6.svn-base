<template>
    <el-dialog title="查阅" ref="dialog">
      <el-row type='flex' :gutter="20">
        <el-col class="textalign_rigt" :span="3" :offset="2">反馈标题:</el-col>
        <el-col :span="4">{{infos.title}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">反馈内容:</el-col>
        <el-col :span="4">{{infos.content}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">联系人:</el-col>
        <el-col :span="4">{{infos.linker}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">联系电话:</el-col>
        <el-col :span="4" >{{infos.phone}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">联系邮件:</el-col>
        <el-col :span="4">{{infos.email}}</el-col>
      </el-row> 
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">备注:</el-col>
        <el-col :span="15" class="textalign_rigt">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" size="large" v-model="infos.remark">
        </el-input>
        </el-col>
      </el-row>
        <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">创建时间:</el-col>
        <el-col :span="9">{{infos.create_time}}</el-col>
      </el-row> 
      <el-row :gutter="20">
        <el-col :span="3" :offset="2" class="textalign_rigt">状态设置:</el-col>
        <el-col :span="15">   
          <el-radio-group v-model="infos.statement">
            <el-radio :label="1">已查阅</el-radio>
            <el-radio :label="2">已处理</el-radio>
            <el-radio :label="3">已取消</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="disable" @click="save()" icon="check" :loading="isLoading">保存设置</el-button>
      </div>
    </el-dialog>
</template>
<style>
  .textalign_rigt{
    text-align: right;
    margin-bottom: 25px;
  }
</style>
<script>
import http from '../../../assets/js/http'
export default{
  props: ['info'],
  data() {
    return {
      isLoading: false,
      disable: false,
      infos: {
        remark: '',
        statement: null
      }
    }
  },
  methods: {
    open(id) {
      this.$refs.dialog.open(id)
      this.isLoading = false
      this.infos.id = id
      this.$refs.dialog.open(id)
      this.apiGet('feedback/' + this.infos.id, this.infos).then((res) => {
        if (res.data.statement == '已查阅') {
          res.data.statement = 1
        } else if (res.data.statement == '已处理') {
          res.data.statement = 2
        } else if (res.data.statement == '已取消') {
          res.data.statement = 3
        }
        this.infos = res.data
        this.infos.statement = res.data.statement
        console.log(res.data.statement)
      })
    },
    save() {
      this.isLoading = true
      console.log(this.infos)
      this.apiPut('feedback/', this.infos.id, this.infos).then((res) => {
        console.log('2222')
        if (res.code == 200) {
          _g.toastMsg(this, 'success', '编辑成功')
          this.$refs.dialog.close()
          this.$parent.getData()
          console.log(this.$parent)
        } else {
          _g.dealError(this, res)
          this.isLoading = !this.isLoading
        }
      })
    }
  },
  created(id) {
    this.uploadUrl = window.HOST + '/Upload'
  },
  mixins: [http]
}
</script>