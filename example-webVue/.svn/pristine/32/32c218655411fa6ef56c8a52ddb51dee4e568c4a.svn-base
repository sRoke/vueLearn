<template>
  <div class="customerData">
    <el-form ref="form"
             :inline="true"
             :model="form"
             :rules="rules"
             label-width="100px">
      <div class='base-info-cont'>
  
        <el-row>
          <el-col :span="24">
            <div class="m-b-20 base-title">
              {{ formTitle }}
            </div>
          </el-col>
        </el-row>
  
        <el-row class='m-t-20'>
          <el-col :span="6">
            <el-form-item label="公司名称："
                          prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司电话："
                          prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-form-item label="公司人数："
                        prop="size">
            <el-select v-model="form.size">
              <el-option v-for="item in sizeOptions"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
  
        <el-row>
          <el-col :span='8'>
            <el-form-item label="公司地址：">
              <el-row type='flex'
                      justify='start'>
                <div>
                  <el-cascader :options="proCityList"
                               v-model="proCityVal"
                               @change="handleChangeCity">
                  </el-cascader>
                </div>
                <div>
                  <el-input class='m-l-15'
                            v-model="form.address"
                            placeholder="请输入详细地址">
                  </el-input>
                </div>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司简介："
                          class='desp'>
              <el-input type="textarea"
                        class="textA"
                        v-model="form.textA"
                        style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  
    <div class='base-info-cont'>
      <el-row>
        <el-col :span="24">
          <div class="base-title">营业品类</div>
        </el-col>
      </el-row>
  
      <el-row>
        <el-col :span='18'
                class="p-a-20">
          <el-table border
                    :data="categoryList"
                    style="width: 100%">
            <el-table-column label="序号"
                             type="index"
                             min-width="120px"
                             header-align="center">
            </el-table-column>
            <el-table-column label="营业品类"
                             header-align="center">
              <template scope="scope">
                <p v-for="(item,index) in scope.row"
                   :class="index ? 'm-l-20' : null">{{ item }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             header-align="center">
              <template scope="scope">
                <el-button type="text"
                           @click="openCategoryDialog(scope.$index)">
                  编辑
                </el-button>
                <el-button type="text"
                           @click="removeCategory(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tb-bottom"
               v-if="canAddCategory">
            <el-button type="text"
                       icon="plus"
                       @click.prevent="openCategoryDialog()">
              添加
            </el-button>
          </div>
        </el-col>
      </el-row>
  
      <!--营业品类-->
      <category ref="category"
                :type="categoryMode"
                v-if="categoryVisible"
                :handleSubmit="addCategory"
                :handleEdit="editCategory"
                :sourceData="categoryItem">
      </category>
      <!--营业品类-->
  
    </div>
  
    <div class='base-info-cont'>
      <el-row>
        <el-col :span="24">
          <div class="base-title">联系人</div>
        </el-col>
      </el-row>
  
      <el-row>
        <el-col :span='18'
                class="p-a-20">
          <el-table :data="contactList"
                    border
                    style="width: 100%">
            <el-table-column label="姓名">
              <template scope="scope">
                <el-input v-model="scope.row.name"
                          placeholder="请输入联系人姓名"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="职位"
                             width="200">
              <template scope="scope">
                <el-input v-model="scope.row.position"
                          placeholder="请输入职位"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="手机号"
                             width="200">
              <template scope="scope">
                <el-input v-model="scope.row.phone"
                          placeholder="请输入手机号"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="邮箱"
                             width="200">
              <template scope="scope">
                <el-input v-model="scope.row.email"
                          placeholder="请输入邮箱"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="150">
              <template scope="scope">
                <div>
                  <el-button size="small"
                             type="danger"
                             @click="deleteRow(contactList, scope.$index,'contactList')">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="tb-bottom">
            <el-button type="text"
                       icon="plus"
                       @click.prevent="addContact()">
              添加
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  
    <div class='base-info-cont'>
      <el-row>
        <el-col :span="24">
          <div class="m-b-20 base-title">资料情况</div>
        </el-col>
      </el-row>
  
      <upload ref="upload"></upload>
  
      <el-row>
        <el-col :span="18"
                style="padding:20px;">
          <el-table :data="customerData"
                    border
                    style="width: 100%">
            <el-table-column prop="name"
                             label="上传人"
                             width="180"></el-table-column>
            <el-table-column prop="type"
                             label="证件名"
                             width="180">
              <template scope="scope">
                <a :href="scope.row.showPath"
                   download="scope.row.type"
                   style='color: #1f2d3d'
                   class="lineh-36 underline">{{ scope.row.type }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="introduction"
                             label="说明"></el-table-column>
            <el-table-column prop="create_time"
                             label="上传时间"
                             width="180"></el-table-column>
            <el-table-column label="备注">
              <template scope="scope">
                <el-col :span="24">
                  <el-input v-model="scope.row.remark"
                            placeholder="请输入内容"
                            :disabled="isEdit"></el-input>
                </el-col>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="120"
                             v-if="!isEdit">
              <template scope="scope">
                <el-button size="small"
                           type="danger"
                           @click="deleteRow(customerData, scope.$index, 'customerData')">
                  <i class="el-icon-delete"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tb-bottom">
            <el-button type="text"
                       icon="plus"
                       @click.prevent="uploadFile()">
              添加
            </el-button>
          </div>
        </el-col>
      </el-row>
  
    </div>
  
    <el-row class="fr m-t-10">
      <el-col>
        <el-button @click="goback()">返回</el-button>
        <el-button type="primary"
                   @click="add()">添加</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.customerData .el-select {
  width: 100% !important;
}

.tb-bottom {
  padding: 8px;
  text-align: center;
  background: transparent;
  border: 1px solid #dfe6ec;
}
</style>

<script>
import address from 'assets/js/city-data.json'
import sizeOptions from 'assets/json/company_size.json'
import http from 'assets/js/http'
import staff from '../common/staff.vue'
import upload from '../common/upload.vue'
import category from 'components/common/dialog/category.vue'
export default {
  data() {
    return {
      status: '',
      customerStatus: '',
      is_status: '',
      efficientStatus: false,
      invalidStatus: false,
      checked: false,
      cus_id: null,
      proCityList: address,
      proCityVal: [],
      sizeOptions,
      source: '',
      form: {
        province: '',
        city: '',
        area: '',
        address: '',
        name: '',
        type: '',
        mobile: '',
        size: '',
        textA: '',
        business_category: []
      },
      // 营业品类
      categoryList: [],
      categoryIndex: 0,
      categoryItem: null,
      categoryMode: 'add',
      categoryVisible: false,
      contactList: [],
      value: '',
      customerData: [],
      input: '',
      text: '',
      sturdyData: [],
      followPeople: [],
      level: '',
      follow_people: [],
      is_saleClose: false,
      is_serviceClose: false,
      is_pushClose: false,
      cancel_release: '释放',
      is_release: true,
      isFirst: true,
      uploadData: [],
      uploadUrl: '',
      rules: {
        name: [
          { required: true, message: '请输入公司名称' }
        ]
      },
      fileList: [],
      imgSrc: require('../../../assets/images/head.png')
    }
  },
  methods: {
    uploadFail(err, res, file) { // 头像上传失败
      _g.toastMsg(this, 'warning', '上传失败！')
    },
    handleChangeCity(val) {
      this.form.province = val[0]
      this.form.city = val[1]
      this.form.area = val[2]
    },
    uploadSuccess(res, file, fileList) { // 头像上传成功
      var self = this
      if (fileList.length == 2) {
        fileList.shift()
      }
      self.fileList = fileList
      self.imgSrc = imgUrl + self.fileList[0].response.data
      _g.toastMsg(self, 'success', '上传成功！')
    },
    followAdd(form) { // 添加客户上传的资料情况
      var self = this
      self.customerData.push({
        name: Lockr.get('userInfo').u_realname,
        type: form.name,
        create_time: _g.getDatetime(),
        remark: form.desc,
        path: form.fileList[0].response.data,
        showPath: imgUrl + form.fileList[0].response.data,
        introduction: ''
      })
    },
    uploadFile() { // 打开上传文件的窗口
      var self = this
      self.$refs.upload.open()
    },
    addContact() { // 添加联系人
      var self = this
      var temp = {
        name: '',
        phone: '',
        email: '',
        position: ''
      }
      self.contactList.push(temp)
    },
    deleteRow(item, index, str) { // 删除
      var self = this
      self.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.splice(index, 1)
        _g.toastMsg(self, 'success', '删除成功')
      }).catch(() => {
        self.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    add() { // 添加客户的信息
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.follow_people = _.map(this.followPeople, 'id')
          for (var s = 0; s < this.customerData.length; s++) {
            this.uploadData.push({
              name: this.customerData[s].name,
              type: this.customerData[s].type,
              create_time: this.customerData[s].create_time,
              remark: this.customerData[s].remark,
              path: this.customerData[s].path,
              introduction: this.customerData[s].introduction
            })
          }
          let data = {
            category: this.form.business_category,
            dataRecord: this.uploadData,
            followPeople: this.follow_people,
            demandServiceContacts: this.contactList,
            followRecord: this.sturdyData,
            auth: this.checked ? 1 : 0,
            name: this.form.name,
            phone: this.form.mobile,
            remark: this.form.textA,
            city: this.form.city,
            area: this.form.area,
            province: this.form.province,
            address: this.form.address,
            size: this.form.size,
            level: this.level,
            status: 0,
            type: this.type
          }
          this.apiPost('customers/', data).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '保存成功')
              setTimeout(() => {
                this.goback()
              }, 1500)
            } else {
              _g.dealError(this, res)
            }
          })
        }
      })
    },
    openCategoryDialog(index = null) {
      if (index || typeof index === 'number') {
        this.categoryMode = 'edit'
        this.categoryItem = this.form.business_category[index]
      } else {
        this.categoryMode = 'add'
        this.categoryItem = { id: null, child: [] }
      }
      this.categoryIndex = index
      this.categoryVisible = true
      this.$nextTick(() => {
        this.$refs.category.render()
      })
    },
    addCategory(data) { // 添加品类
      // 判断一级品类是否重复
      let arr = _.map(this.form.business_category, 'id')
      let exist = _.includes(arr, data.id)
      if (exist) return this.$message.error('一级品类不可重复')
      // 添加成功
      this.form.business_category.push(data)
      this.categoryList = [..._g.formatCategory(this.form.business_category)]
      this.$message.success('添加成功')
      this.$refs.category.destory()
    },
    editCategory(data) { // 编辑品类
      // 判断一级品类是否重复
      // let arr = _.map(this.form.business_category, 'id')
      // let exist = _.includes(arr, data.id)
      // if (exist) return this.$message.error('一级品类不可重复')
      // 编辑成功
      let index = this.categoryIndex
      let categorys = this.form.business_category
      let { key } = categorys[index]
      this.$set(categorys, index, { ...data })
      this.categoryList = [..._g.formatCategory(this.form.business_category)]
      this.$message.success('保存成功')
      this.$refs.category.destory()
    },
    removeCategory(index) {
      let { key, name } = this.form.business_category[index]
      this.categoryList.splice(index, 1)
      this.form.business_category.splice(index, 1)
      this.$message.success('删除成功')
    },
    goback() { // 返回上一页面
      router.go(-1)
    }
  },
  created() {
    this.uploadUrl = window.HOST + 'Upload/data'
  },
  computed: {
    type() {
      return this.$route.query.type === 'demand' ? 1 : 2
    },
    formTitle() {
      return this.type === 1 ? '添加需求方客户' : '添加服务方客户'
    },
    canAddCategory() {
      return this.form.business_category.length < 3 || this.categoryList.length < 3
    }
  },
  components: {
    staff,
    upload,
    category
  },
  mixins: [http]
}
</script>