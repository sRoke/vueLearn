<template>
  <div class="m-l-50 m-t-30 w-500">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="账号" prop="user_account">
        <el-input v-model.trim="form.user_account" class="h-40 w-200"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model.trim="form.user_name" class="h-40 w-200" :maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="用户角色" prop="user_role_id">
        <el-select v-model="form.user_role_id" placeholder="请选择角色" class="w-200">
          <el-option v-for="item in roleList" :label="item.role_name" :value="item.role_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="user_phone">
        <el-input v-model.trim="form.user_phone" class="h-40 w-200" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="user_password">
        <el-input v-model.trim="form.user_password" class="h-40 w-200"></el-input>
      </el-form-item>
      <el-form-item label="跟进客户上限">
        <el-input v-model.trim="form.follow_num" class="h-40 w-200"></el-input>&nbsp;&nbsp;人
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="edit()" :loading="isLoading">提交</el-button>
        <el-button @click="goback()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style type="text/css">
  .form-checkbox:first-child{
    margin-left: 15px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value) {
          if ((value.length < 6) || (value.length > 12)) {
            callback(new Error('密码长度为6-12个字符'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      var phonePass = (rule, value, callback) => {
        if (value) {
          if (!(/^1[34578]\d{9}$/.test(value))) {
            callback(new Error('请填写正确的手机号码'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        form: {},
        roleList: [],
        rules: {
          user_account: [
            { required: true, message: '请输入账号' }
          ],
          user_name: [
            { required: true, message: '请输入用户名' }
          ],
          user_role_id: [
            { required: true, message: '请选择用户角色' }
          ],
          user_password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          user_phone: [
            { validator: phonePass, trigger: 'blur' }
          ]
        },
        isLoading: false
      }
    },
    methods: {
      edit() {
        this.isLoading = true
        console.log(this.form)
        this.$refs.form.validate((pass) => {
          if (pass) {
            this.apiPut('users/', this.form.user_id, this.form).then((res) => {
              console.log(res)
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '编辑成功')
                setTimeout(() => {
                  this.isLoading = !this.isLoading
                  this.goback()
                }, 1500)
              } else {
                this.isLoading = !this.isLoading
                _g.dealError(this, res)
              }
            })
          } else {
            this.isLoading = !this.isLoading
          }
        })
      },
      goback() {
        router.go(-1)
      },
      // 获取角色列表
      getAllRoles() {
        this.apiGet('groups').then((res) => {
          if (res.code == 200) {
            this.roleList = res.data.list
            this.getData()
          } else {
            _g.dealError(this, res)
          }
        })
      },
      getData() {
        this.apiGet('users/' + this.form.user_id).then((res) => {
          console.log(res)
          if (res.code == 200) {
            this.form = res.data
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.form.user_id = this.$route.params.id
      this.getAllRoles()
    },
    components: {

    },
    mixins: [http]
  }
</script>