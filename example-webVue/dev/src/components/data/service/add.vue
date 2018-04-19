<template>
  <div class="customerData">
    <el-form :inline="true" :model="form" label-width="100px">
      <div class='base-info-cont'>
        <el-row>
          <el-col :span="24"><div class="m-b-20 base-title">基本信息</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="公司名称：" prop="name" :rules="[
        { required: true, message: '公司名称不能为空'}]">
              <el-input v-model="form.name" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="登录账号：" prop="account" :rules="[
        { required: true, message: '登录账号不能为空'}]">
              <el-input v-model="form.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="密码：">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item class="uphead h-100" style="margin-bottom: 0px;">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :action="uploadUrl"
                :on-success="uploadSuccess"
                :on-error="uploadFail"
                :default-file-list="fileList"  class="headImg w-100  h-100 ">
                <el-button type="text" size='mini'>
                  <div>
                    <img :src="imgSrc" alt="上传头像" class="headImg w-100  h-100">
                  </div>
                </el-button>
              </el-upload>
              <div slot="tip" class="el-upload__tip">上传公司标识</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="m-t-20">
          <el-col :span="6">
            <el-form-item label="公司电话：">
              <el-input v-model="form.mobile" class="w-150"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司人数：">
              <el-select v-model="form.size" placeholder="请选择公司人数" class='w-150'>
                <el-option
                  v-for="item in people"
                  :label="item.account"
                  :value="item.account">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="公司地址：">
              <el-row type='flex' justify='start'>
                <div>
                  <el-cascader
                    :options="proCityList"
                    v-model="proCityVal"
                    @change="handleChangeCity" >
                  </el-cascader>
                </div>
                <div>
                  <el-input class='m-l-15' v-model="address" placeholder="请输入详细地址"></el-input>
                </div>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="公司简介："  class='desp'>
              <el-input type="textarea" class="textA" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  :gutter="24" type='flex' justify='start' align='bottom' class="contact m-b-30 w-1000">
          <el-col :span="2"  class="textalign_rigt">银行卡</el-col>
          <el-col :span="18">
            <el-table
              :data="bank"
              border
              style="width: 800px">
              <el-table-column
                label="开户行" >
                <template scope="scope">
                  <el-input v-model="scope.row.bank_name" placeholder="请输入开户行"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="账号">
                <template scope="scope">
                  <el-input v-model="scope.row.bank_account" placeholder="请输入账号"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="户名">
                <template scope="scope">
                  <el-input v-model="scope.row.bank_user" placeholder="请输入户名"></el-input>
                </template>
              </el-table-column>
            </el-table>
            </el-col>
        </el-row>
      </div>
    </el-form>
    <div class='base-info-cont'>
    <div class="m-b-25 m-t-10">
    <category ref="category"
                :type="categoryMode"
                v-if="categoryVisible"
                :handleSubmit="addCategory"
                :handleEdit="editCategory"
                :sourceData="categoryData">
    </category>
    <div class=" p-a-20 m-t-10 w-100p m-l-0" style="border-bottom: solid 1px #BFCBD9"><div><p style="line-height:10px;margin-left:10px"><span style="color: red">*</span>营业品类</p></div></div>
      <div class="inline-block c-36 w-800 m-b-20 m-t-20" style="margin-left:80px">
        <el-table border
                  style="width: 100%"
                  class="inline-block"
                  :data="form.business_category">
          <el-table-column
                           label="专长排序">
            <template scope="scope">
              <span>{{ scope.row.index}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="category"
                           label="品类"
                           min-width="350">
            <template scope="scope">
              <el-tree :data="scope.row.data1"
                       :props="defaultProps"></el-tree>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="100">
            <template scope="scope">
              <a class="c-blue"
                 @click="openCategoryDialog(scope.$index)">编辑</a>
              <a class="c-blue"
                 @click="removeCategory(scope.$index)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <el-button type="text" size="mini" @click.prevent="openCategoryDialog()" class='m-l-5'>+添加品类</el-button>
    </div>
    </div>
    <div style="margin-top: 15px;" class='base-info-cont'>
    <div class="m-b-25 m-t-20">
    <contact ref="contact" 
      :sourceData="contactForm"
      :type="openType"
      :handleSubmit="addContact"
      :handleEdit="editContact"
      v-if="contactVisible"> </contact>
    <div class="bor-b-3e p-a-20 w-100p " style="border-bottom: solid 1px #BFCBD9"> <p style="line-height:10px;margin-left:10px"><span style="color: red">*</span>联系人</p></div>
      <div class="inline-block c-36 w-800 m-b-20 m-t-20" style="margin-left:80px">
        <el-table :data="contactList"
                  border
                  class="inline-block"
                  style="width: 100%">
          <el-table-column prop="name"
                           label="名字"
                           width="100"
                           header-align="center"
                           class-name="tx-c">
          </el-table-column>
          <el-table-column prop="position"
                           width="125"
                           label="职位"
                           header-align="center"
                           class-name="tx-c">
          </el-table-column>
          <el-table-column prop="phone"
                           width="150"
                           label="手机号"
                           header-align="center"
                           class-name="tx-c">
          </el-table-column>
          <el-table-column prop="email"
                           label="邮箱"
                           min-width="150"
                           header-align="center"
                           class-name="tx-c">
          </el-table-column>
          <el-table-column label="操作"
                           width="140"
                           header-align="center">
            <template scope="scope">
              <a class="c-blue"
                 @click="editPhone(scope.$index)" v-if="!scope.row.is_bind">绑定</a>
              <a class="c-blue" v-else>已绑定</a>
              <a class="c-blue"
                 @click="openContactDialog(scope.row)">编辑</a>
              <a class="c-blue"
                 @click="removeContact(scope.$index)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button type="text" size="mini" @click.prevent="openContactDialog()" class='m-l-5'>+添加联系人</el-button>
    </div>
    <phones ref="phones"> </phones>
    </div>
  <weixin ref="weixin"></weixin>
    <div style="margin-top: 15px;" class='base-info-cont'>
      <div class="m-b-25 m-t-20">
          <div class="m-b-25 m-t-20">
            <div class="bor-b-3e p-a-20 w-100p" style="border-bottom: solid 1px #BFCBD9"> <p style="line-height:10px;margin-left:10px">公司证照</p>&nbsp;&nbsp;<el-checkbox v-model="checked" class="clor-5e" :checked="checked">已认证</el-checkbox></div>
            <div class="inline-block c-36 w-800 m-b-20 m-t-20" style="margin-left:80px">
              <el-table border
                        :data="Credentials"
                        class="inline-block"
                        style="width: 100%">
                <el-table-column prop="type"
                                 label="文件类型">
                </el-table-column>
                <el-table-column prop="data_name"
                                 label="文件名">
                </el-table-column>
                <el-table-column
              prop="create_time"
              label="上传时间"
              width="180">
            </el-table-column>
            <el-table-column label="说明">
              <template scope="scope">
                <el-col :span="24"> 
                  <span>{{ scope.row.introduction}}</span>
                </el-col>
              </template>
            </el-table-column>
                <el-table-column label="操作">
                  <template scope="scope">
                    <a class="c-blue"
                       :href="imgUrl + scope.row.path"
                       download
                       v-if="scope.row.path" @click='downed(scope.row.path)'>下载</a>
                    <a class="c-blue"
                        @click='removeData(scope.row.index)'>删除</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-button type="text" size="mini" @click="uploadFile" class='m-l-5'>+添加上传</el-button>
            <upload ref="upload"></upload>
          </div>
        </div>
      </div>
      <el-row class="fr m-t-30">
        <el-col>
          <el-button  @click="goback()">取消</el-button>
          <el-button type="primary" @click="edit()" :loading="isLoading">添加</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style>
  .customerData  .uphead .el-upload-list{
    display: none;
  }
  .customerData .el-form--inline .el-form-item{
    display: block;
    /*margin-right: 30px;*/
  }
  .customerData .el-input{
    display: block;
  }
  /*.customerData .el-col-7,.customerData .el-col-8{
    margin-bottom: 20px;
  }*/
  .customerData .el-select{
    width: 48%;
  }
  .customerData .base-info {
    background-color: #66CCFF;
    width: 100%;
    height: 30px;
    line-height: 30px; 
    font-size: 14px;
    text-indent: 10px;
  }
  .customerData .customer-info {
    background-color: #ccc;
    width: 100%;
    height: 25px;
    line-height: 25px; 
    font-size: 14px;
    border: #E0E6ED;
    text-indent: 10px;
  }
  .customerData .base-info-cont{
    border:1px solid #BFCBD9; 
    border-radius:3px; 
    margin-bottom:10px;
  }
  .customerData .base-title{
    padding: 5px 0px;
    text-align: left;
    text-indent: 10px;
    border-bottom: 1px solid #BFCBD9;
  }
  .customerData .add-content {
    color: #66CCFF;
    cursor: pointer;
    position: absolute;
    top: 72px; 
    left: 35%;
  }
  .customerData .realse {
    color: #66CCFF;
    cursor: pointer;
    margin-left: 15px;
  }
  .m-l-1 {
    margin-left: 1%;
  }
  .uphead .el-upload__files{
    display: none;
  }
  .textA .el-textarea__inner{
    height: 100px;
  }
  .textB .el-textarea__inner{
    width: 34%;
    height: 100px;
  }
  .customerData .lineh-36{
    line-height: 36px;
  }
  .customerData .underline{
    text-decoration: underline;
  }
</style>

<script>
  import address from '../../../assets/js/city-data.json'
  import http from '../../../assets/js/http'
  import staff from './staff.vue'
  import upload from './upload.vue'
  import category from '../../common/dialog/category.vue'
  import contact from '../../common/contact.vue'
  import phones from './phones.vue'
  import weixin from './weixin.vue'
  import _ from 'lodash'
  export default {
    data() {
      return {
        currentCategoryIndex: null,
        categoryData: {},
        categoryMode: null,
        wxurl: null,
        isClick: false,
        contactVisible: false,
        contactForm: null,
        index: 0,
        categoryVisible: false,
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        people: [{
          account: '0-100'
        }, {
          account: '100-300'
        }, {
          account: '300-500'
        }, {
          account: '500-1000'
        }, {
          account: '>1000'
        }],
        imgUrl: window.imgUrl,
        isLoading: false,
        head: require('../../../assets/images/head.png'),
        status: '',
        customerStatus: '',
        is_status: '',
        openType: '',
        efficientStatus: false,
        invalidStatus: false,
        checked: false,
        cus_id: null,
        proCityList: address,
        proCityVal: [],
        isInfo: true,
        proCityVal1: [],
        category: [],
        contact: [],
        firstStep: false,
        Credentials: [],
        fileType: [{
          label: '营业执照',
          status: '1'
        }, {
          label: '企业资质',
          status: '2'
        }, {
          label: '获奖证明',
          status: '3'
        }, {
          label: '其他',
          status: '4'
        }],
        province: '',
        area: '',
        address: '',
        city: '',
        source: '',
        form: {
          create_time: null,
          name: '',
          num: '',
          account: '',
          source: '',
          password: '',
          type: '',
          mobile: '',
          size: '',
          remark: '',
          business_category: [],
          index: null
        },
        bank: [{
          bank_user: '',
          bank_account: '',
          bank_name: ''
        }],
        contactList: [],
        options: [{
          value: '选项1',
          label: 'A热门客户'
        }, {
          value: '选项2',
          label: 'B普通客户'
        }, {
          value: '选项3',
          label: 'C潜在客户'
        }, {
          value: '选项4',
          label: 'D无法沟通'
        }],
        value: '',
        customerData: [],
        input: '',
        // editPhoneShow: false,
        // editPhoneTitle: '操作提醒',
        text: '',
        sturdyData: [],
        followPeople: [],
        level: '',
        del_contact_list: [],
        follow_people: [],
        del_data_situation: [],
        is_saleClose: false,
        is_serviceClose: false,
        is_pushClose: false,
        match: '',
        del_follow_record: [],
        new__follow_record: [],
        cancel_release: '释放',
        is_release: true,
        isFirst: true,
        uploadData: [],
        show: Lockr.get('authList'),
        follow_num: '',
        uploadUrl: '',
        fileList: [],
        logo: '',
        imgSrc: '',
        path: '',
        rules: {
          name: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请选择分类' }
          ],
          img_url: [
          { required: true, message: '封面不能为空' }
          ],
          status: [
            { required: true, message: '选择状态' }
          ],
          content: [
            { required: true, message: '资讯内容不能为空' }
          ]
        }
      }
    },
    watch: {
      // proValue(val, oldVal) {  // 监听省份的选择，以更新城市选项
      //   var self = this
      //   // self.cityValue = ''
      //   self.cityOptions = address['city'][val]
      //   self.proValue = val
      //   if (!self.isFirst) {
      //     self.cityValue = ''
      //   } else {
      //     self.isFirst = false
      //   }
      // },
      value(val) { // 监听客户级别的选择，并赋予level
        var self = this
        switch (val) {
          case '选项1': self.level = 1
            break
          case '选项2': self.level = 2
            break
          case '选项3': self.level = 3
            break
          case '选项4': self.level = 4
            break
        }
      },
      customerStatus(val) { // 监听客户状态
        var self = this
        if (val == '有效') {
          self.is_status = 1
        } else if (val == '无效') {
          self.is_status = 0
        } else {
          self.is_status = null
        }
      }
    },
    methods: {
      removeData(index) { // 删除证件
        this.Credentials.splice(index, 1)
      },
      openwx(row) {
        console.log(row)
        this.wxurl = row.qrcode
        console.log(this.wxurl)
        this.$refs.weixin.open(this.wxurl)
      },
      downed(url) { // 下载证件
        console.log(imgUrl + url)
      },
      removeCategory(index) { // 删除品类
        this.form.business_category.splice(index, 1)
      },
      flagTrans(val) {
        return _.includes(this.postArr, val)
      },
      openCategoryDialog(index = null) { // 打开添加或者编辑品类对话框
        console.log(index)
        if (index || typeof index === 'number') {
          this.categoryMode = 'edit'
          this.categoryData = this.form.business_category[index]
          console.log(this.categoryData)
        } else {
          this.categoryMode = 'add'
          this.categoryData = { id: null, child: [] }
        }
        this.currentCategoryIndex = index
        this.categoryVisible = true
        this.$nextTick(() => {
          this.$refs.category.render()
        })
      },
      addCategory(data) { // 添加品类,渲染页面
        console.log(data)
        let categorys = this.form.business_category
        let data1 = [{ ...data }]
        console.log(data1)
        categorys.push({ index: categorys.length + 1, ...data, data1 })
        console.log(this.form.business_category)
        this.$refs.category.destory()
      },
      editCategory(data) { // 编辑品类
        let index = this.currentCategoryIndex
        let categorys = this.form.business_category
        let data1 = [{ ...data }]
        this.$set(categorys, index, { index: index + 1, ...data, data1 })
        console.log(this.form.business_category)
        this.$refs.category.destory()
      },
      openContactDialog(contact = null) { // 打开联系人对话框
        console.log(contact)
        if (contact) {
          this.openType = 'edit'
          this.contactForm = {
            name: contact.name,
            email: contact.email,
            position: contact.position,
            phone: contact.phone
          }
        } else {
          this.openType = 'add'
          this.contactForm = {}
        }

        this.contactVisible = true
        this.$nextTick(() => this.$refs.contact.toggle())
      },
      beforeAvatarUpload(file) {
        var self = this
        // if (self.isEdit) {
        //   _g.toastMsg(self, 'warning', '您没有上传头像的权限！')
        // }
        // return !self.isEdit
      },
      handleChangeCity(val) {
        this.province = val[0]
        this.city = val[1]
        this.area = val[2]
      },
      uploadFail(err, res, file) { // 头像上传失败
        var self = this
        _g.toastMsg(self, 'warning', '上传失败！')
      },
      removeContact(index) { // 删除联系人
        var self = this
        self.contactList.splice(index, 1)
      },
      editContact(contact) { // 编辑联系人
        let { phone } = contact
        this.$refs.contact.destory()
        let index = _.findIndex(this.contactList, item => item.phone == phone)
        this.$set(this.contactList, index, { ...this.contactList[index], ...contact })
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
      editPhone(index) {
        this.contactList.forEach((item, key) => {
          let is_bind = index == key ? 1 : 0
          this.$set(this.contactList, key, { ...this.contactList[key], is_bind })
        })
        console.log(this.contactList)
        // this.$refs.phones.open(this.contactList[index].phone, this.contactList[index].id)
      },
      addData(form) { // 添加客户上传资料的情况
        var self = this
        form.data_name = form.name
        form.introduction = form.desc
        // form.path = form.fileList[0].url
        console.log(form)
        // var typeName = ''
        var typeName = form.type
        // if (form.type == 0) {
        //   typeName = '营业执照'
        // } else if (form.type == 1) {
        //   typeName = '企业资质'
        // } else if (form.type == 2) {
        //   typeName = '获奖证明'
        // } else if (form.type == 3) {
        //   typeName = '其他'
        // }
        self.Credentials.push({
          data_name: form.name,
          type: typeName,
          create_time: _g.getDatetime(),
          introduction: form.desc,
          path: form.fileList[0].response.data,
          showPath: imgUrl + form.fileList[0].response.data
        })
      },
      uploadFile() {
        var x = 'demand'
        this.$refs.upload.open(x)
      },
      addContact(contact) { // 添加联系方式
        if (this.contactList.length == 0) {
          contact.is_bind = 1
        } else {
          contact.is_bind = 0
        }
        console.log(contact)
        this.contactList.push(contact)
        console.log(this.contactList)
      },
      edit() { // 保存修改信息
        this.isLoading = true
        var self = this
        console.log('用户资料')
        console.log(this.contactList)
        console.log(this.Credentials)
        if (self.form.name == '') {
          _g.toastMsg(this, 'error', '公司名称不能为空')
          this.isLoading = false
          return
        }
        for (var s = 0; s < self.customerData.length; s++) {
          if (self.customerData[s].id) {
            self.uploadData.push({
              id: self.customerData[s].id,
              name: self.customerData[s].name,
              type: self.customerData[s].type,
              create_time: self.customerData[s].create_time,
              remark: self.customerData[s].remark,
              path: self.customerData[s].path,
              introduction: self.customerData[s].introduction
            })
          } else {
            self.uploadData.push({
              name: self.customerData[s].name,
              type: self.customerData[s].type,
              create_time: self.customerData[s].create_time,
              remark: self.customerData[s].remark,
              path: self.customerData[s].path,
              introduction: self.customerData[s].introduction
            })
          }
        }
        for (var i = 0; i < self.followPeople.length; i++) {
          self.follow_people.push(self.followPeople[i].id)
        }
        if (self.fileList.length) {
          self.logo = self.fileList[0].response.data
        } else {
          self.logo = 0
        }
        var business_categorys = self.form.business_category.map(item => {
          return { id: item.id, name: item.name, child: item.child }
        })
        console.log(business_categorys)
        var Credentials1 = self.Credentials.map(item => {
          return { data_name: item.data_name, path: item.path, type: item.type, introduction: item.introduction }
        })
        console.log(Credentials1)
        console.log(business_categorys)
        let data = {
          business_category: business_categorys,
          dataRecord: Credentials1,
          demandServiceContacts: self.contactList,
          id: self.cus_id,
          logo: self.logo,
          followPeople: self.follow_people,
          followRecord: self.new__follow_record,
          auth: self.checked ? 1 : 0,
          name: self.form.name,
          account: self.form.account,
          bank_account: self.bank[0].bank_account,
          bank_name: self.bank[0].bank_name,
          bank_user: self.bank[0].bank_user,
          password: self.form.password,
          phone: self.form.mobile,
          remark: self.form.remark,
          size: self.form.size,
          level: self.level,
          province: self.province,
          area: self.area,
          address: self.address,
          city: self.city,
          del_contact_list: self.del_contact_list,
          status: self.is_status,
          del_follow_record: self.del_follow_record,
          del_data_situation: self.del_data_situation
        }
        console.log(data)
        self.apiPost('demand_user/', data).then((res) => {
          console.log('111')
          if (res.code == 200) {
            console.log(res.data)
            _g.toastMsg(self, 'success', '保存成功')
            console.log('成功')
            setTimeout(() => {
              this.isLoading = false
              self.goback()
            }, 1500)
          } else {
            console.log('必败')
            this.isLoading = false
            _g.dealError(this, res)
          }
        })
      },
      goback() { // 返回上一页面
        var self = this
        if (self.$route.params.path) {
          self.path = self.$route.params.path
        } else {
          self.path = Lockr.get('path')
        }
        location.hash = self.path
      }
    },
    created() {
      this.uploadUrl = window.HOST + 'Upload/data'
    },
    components: {
      staff,
      upload,
      category,
      contact,
      phones,
      weixin
    },
    mixins: [http]
  }
</script>