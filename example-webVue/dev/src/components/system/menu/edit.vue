<template>
	<div class="m-l-50 m-t-30 w-500">
		<el-form ref="form" :model="form" :rules="rules" label-width="110px">
			<el-form-item label="标题" prop="title">
				<el-input v-model.trim="form.title" class="h-40 w-200"></el-input>
			</el-form-item>
			<el-form-item label="绑定权限标识" prop="rule_name">
				<el-input v-model.trim="form.rule_name" class="h-40 fl w-200" :disabled="true"></el-input>
				<el-button class="fl m-l-30" @click="openRule()">查找</el-button>
			</el-form-item>
			<el-form-item label="菜单类型" prop="menu_type">
				<el-radio-group v-model="form.menu_type">
					<el-radio disabled label="1">普通三级菜单</el-radio>
					<el-radio disabled label="2">单页菜单</el-radio>
					<el-radio disabled label="3">外链</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="上级菜单" prop="pid">
				<el-select disabled v-model="form.pid" placeholder="请选择活动区域" class="w-200">
					<el-option v-for="item in options" :label="item.title" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="路径">
				<el-input v-model.trim="form.url" class="h-40 w-200"></el-input>
			</el-form-item>
			<el-form-item label="模块" prop="module">
				<el-input v-model.trim="form.module" class="h-40 w-200"></el-input>
			</el-form-item>
			<el-form-item label="所属菜单">
				<el-input v-model.trim="form.menu" class="h-40 w-200"></el-input>
			</el-form-item>
			<el-form-item label="排序">
				<el-input v-model="form.sort" class="h-40 w-200"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="edit()" :loading="isLoading">提交</el-button>
				<el-button @click="goback()">返回</el-button>
			</el-form-item>
		</el-form>
		<ruleList ref="ruleList"></ruleList>
	</div>
</template>

<script>
  import ruleList from './ruleList.vue'
  import http from '../../../assets/js/http'

  export default {
    data() {
      return {
        isLoading: false,
        id: null,
        form: {
          title: '',
          rule_name: '',
          pid: '',
          menu_type: '',
          url: '',
          module: '',
          menu: '',
          sort: ''
        },
        options: [{ id: 0, title: '无' }],
        rules: {
          title: [
            { required: true, message: '请输入菜单标题' }
          ],
          rule_name: [
            { required: true, message: '请绑定权限标识' }
          ],
          menu_type: [
            { required: true, message: '请选择菜单类型' }
          ],
          module: [
            { required: true, message: '请填写菜单模块' }
          ],
          pid: [
            { type: 'number', required: true, message: '请选择上级菜单' }
          ]
        }
      }
    },
    methods: {
      edit() {
        this.$refs.form.validate((pass) => {
          if (pass) {
            this.isLoading = !this.isLoading
            this.apiPut('menus/', this.id, this.form).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '编辑成功')
                setTimeout(() => {
                  this.goback()
                }, 1500)
              } else {
                this.isLoading = !this.isLoading
                _g.dealError(this, res)
              }
            })
          }
        })
      },
      openRule() {
        this.$refs.ruleList.open()
      },
      goback() {
        router.go(-1)
      },
      getMenus() {
        this.apiGet('menus').then((res) => {
          if (res.code == 200) {
            let array = []
            _(res.data).forEach((res) => {
              if (res.level != 3 && res.menu_type == 1) {
                array.push(res)
              }
            })
            this.options = this.options.concat(array)
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.getMenus()
      this.id = this.$route.params.id
      this.apiGet('menus/' + this.id).then((res) => {
        if (res.code == 200) {
          res.data.menu_type = res.data.menu_type.toString()
          this.form = res.data
        } else {
          _g.dealError(this, res)
        }
      })
    },
    components: {
      ruleList
    },
    mixins: [http]
  }
</script>