<template>
  <div>
  
    <el-card class="box-card base-card m-b-20">
      <div slot="header"
           class="clearfix">
        <span style="line-height: 36px;">跟进人员</span>
      </div>
      <el-row>
        <el-col :span="4"
                v-for="item in followPeople">
          <!--<div class="tx-c">-->
          <span>{{ item.group_name }}：</span>
          <el-tag type="primary" v-for="(items,index) in item.user">{{ items.u_name }}</el-tag>
          <!--</div>-->
        </el-col>
      </el-row>
    </el-card>
  
    <el-row>
      <el-form ref="follow"
               :model="followForm"
               label-width="100px"
               class="m-t-10 m-b-10">
        <el-col :span="6">
  
          <el-form-item label="客户状态：">
            <el-radio-group v-model="followForm.status">
              <el-radio  :label="1">已跟进</el-radio>
              <el-radio  :label="2">无效</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <el-form-item prop="return_visit"
                        label="回访时间：">
            <el-date-picker type="datetime"
                            :disabled="!isFollowing"
                            placeholder="选择日期范围"
                            v-model="followForm.return_visit">
            </el-date-picker>
          </el-form-item>
  
          <el-form-item prop="level"
                        label="公司级别：">
            <el-select v-model="followForm.level"
                       class="level-select"
                       placeholder="请选择公司级别">
              <el-option v-for="item in levelOptions"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
  
        <el-col :span="12">
          <el-form-item prop="content"
                        label="跟进说明："
                        :required="isFollowing">
            <el-input type="textarea"
                      v-model="followForm.content"
                      placeholder="请填写跟进说明.."
                      :autosize="{ minRows: 7, maxRows: 10}">
            </el-input>
          </el-form-item>
        </el-col>
  
        <el-col :span="1">
          <el-button type="text"
                     class="fr m-t-5"
                     @click="addFollowRecord">添加
          </el-button>
        </el-col>
  
      </el-form>
    </el-row>
  
    <el-table border
              :data="followRecord"
              style="width: 100%"
              row-class-name="tx-c">
      <el-table-column label="跟进记录"
                       header-align="center">
        <el-table-column prop="create_time"
                         label="跟进时间"
                         header-align="center">
        </el-table-column>
        <el-table-column prop="user"
                         label="跟进人员"
                         header-align="center">
        </el-table-column>
        <el-table-column prop="content"
                         label="跟进说明"
                         header-align="center">
        </el-table-column>
        <el-table-column prop="level"
                         label="公司级别"
                         header-align="center">
        </el-table-column>
        <el-table-column prop="return_visit"
                         label="下次回访时间"
                         header-align="center">
        </el-table-column>
      </el-table-column>
    </el-table>
  
    <!-- <el-row>
      <el-button class="fr m-t-10"
                 type="primary"
                 :loading="saving">保存</el-button>
    </el-row> -->
  </div>
</template>

<script>
import http from 'assets/js/http'
import levelOptions from 'assets/json/client_level.json'

export default {
  data() {
    return {
      status: 2,
      level: '',
      // level: '',
      levelOptions: [{
        label: '热门用户',
        value: 1
      }, {
        label: '普通用户',
        value: 2
      }, {
        label: '潜在用户',
        value: 3
      }, {
        label: '无法沟通',
        value: 4
      }],
      followPeople: [
      ],
      followRecord: [],
      customerStatus: '无效',
      followForm: {
        content: '',
        level: '',
        return_visit: '',
        status: 2
      }
    }
  },
  methods: {
    addFollowRecord() {
      var myDate = new Date()
      // this.followForm.create_time = myDate.getFullYear() + '-' + myDate.getMonth() + '-' + myDate.getDate()
      // this.return_view = this.return_view.getFullYear() + '-' + this.return_view.getMonth() + '-' + this.return_view.getDate()
      // console.log(this.followForm.create_time)
      // this.followForm.time = ''
      // this.followForm.remark = ''
      let data = {
        ...this.followForm,
        return_visit: moment(this.followForm.return_visit).format('YYYY-MM-DD HH:mm:ss')
      }
      let dsu_id = this.$route.query.dsu_id
      // console.log(this.followForm)
      // console.log(data)
      this.apiPost(`customers/${dsu_id}/follow_records`, data).then((res) => {
        if (res.code == 200) {
          if (res.data.level == 1) {
            res.data.level = '热门用户'
          } else if (res.data.level == 2) {
            res.data.level = '普通用户'
          } else if (res.data.level == 3) {
            res.data.level = '潜在用户'
          } else if (res.data.level == 4) {
            res.data.level = '无法沟通'
          }
          this.followRecord.unshift(res.data)
          console.log(res.data)
          this.$message.success('添加成功')
          this.followForm = {
            content: '',
            level: '',
            return_visit: '',
            status: 2
          }
        } else {
          this.$message.error(res.error)
        }
      })
    },
    getData() {
      console.log('跟进记录')
      let dsu_id = this.$route.query.dsu_id
      this.apiGet(`customers/${dsu_id}/follow_records`).then((res) => {
        if (res.code == 200) {
          console.log(res.data.list)
          this.followRecord = res.data.list
        } else {
          console.log('获取失败')
          this.$message.error(res.error)
        }
      })
      this.apiGet(`customers/${dsu_id}/follow_peoples`).then((res) => {
        if (res.code == 200) {
          console.log(res.data.list)
          this.followPeople = res.data
        } else {
          console.log('获取失败')
          this.$message.error(res.error)
        }
      })
    }
  },
  computed: {
    isFollowing() {
      return this.followForm.status !== 2
    }
  },
  created() {
    // this.levelOptions = levelOptions
    // this.followRecord.push({
    //   time: '2017-03-30',
    //   follower: '小明',
    //   remark: '客户没时间',
    //   return_view: '2017-04-07 18:30:00'
    // })
  },
  mixins: [http]
}
</script>

<style type="text/css">
.level-select {
  width: 193px;
}

.follow-textarea {
  margin-top: 5px;
}
</style>