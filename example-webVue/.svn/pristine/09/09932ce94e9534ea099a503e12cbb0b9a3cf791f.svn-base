<template>
  <div>
    <el-row :gutter="20" class="m-t-20">
      <el-col :span="23" :offset="1">
        <el-tabs type="border-card" v-bind:class="{ 'hideTab': !showFinance}">
          <el-tab-pane label="里程碑" name="1">
            <div class="p-a-40 fz-16" v-if="isOne">
              <div class="m-b-10" v-for="(p_pro, p_index) in process">
                <div class="m-l-126 m-b-10" :class="{'active': p_pro.status==1, 'noactive': p_pro.status==0, 'nochild': !p_pro.child||p_pro.child.length==0}">
                  <span class="order-circle m-r-15">{{p_index+1}}</span>
                  <span class="main-step-name fz-16">{{p_pro.name}}</span>
                </div>
                <div class="h-40 hasdot" v-for="(pro, index) in p_pro.child" :class="{'active': pro.status==1, 'noactive': pro.status==0}">
                  <div class="inline-block tx-r c-black m-r-15 w-127">{{pro.time}}</div>
                  <div class="order-dot" :class="{'noactive': pro.status==0, 'first-dot': index==0, 'last-dot': p_pro.child&&index==p_pro.child.length-1}"></div>
                  <div class="m-l-15 order-circle order-small m-r-15">{{p_index+1}}.{{index+1}}</div>
                  <span class="step-name m-r-10">{{pro.name}}</span>
                  <a class="c-blue" :href="imgUrl + pro.file" v-if="pro.file" download>下载</a>
                </div>
              </div>
            </div>
            <div class="tx-c p-t-10 p-b-10 fz-14 c-gra" v-else>里程碑为空</div>
          </el-tab-pane>
          <el-tab-pane label="合同信息" name="2">
            <contract :conId="conId" :isCom="isCom" :model="model"></contract>
          </el-tab-pane>
          <el-tab-pane label="文件管理" name="4">
            <div>
              <el-table
              :data="fileList"
              style="width:100%">
                <el-table-column
                prop="type"
                label="文件类型"
                min-width="150">
                </el-table-column>
                <el-table-column
                prop="file_name"
                label="文件名"
                min-width="250">
                </el-table-column>
                <el-table-column
                prop="u_name"
                label="上传人"
                min-width="200">
                </el-table-column>
                <el-table-column
                prop="upload_time"
                label="上传时间"
                min-width="150">
                </el-table-column>
                <el-table-column
                  label="操作"
                  v-show="allEdit"
                  min-width="150">
                  <template scope="scope">
                    <el-button
                      type="danger"
                      size="small"
                      @click="delFile(scope.row.id)" v-show="allEdit">
                      删除
                    </el-button>
                    <a :href="imgUrl + scope.row.file_url" download="{scope.row.file_name}" class="el-button--primary file-down m-l-20" v-show="allEdit">下载</a>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tx-c m-t-20 m-b-10" v-show="allEdit">
                <el-button @click="openUp()">上传</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="备注信息" name="5">
            <el-table
            :data="remarkData"
            style="width: 100%">
              <el-table-column
              prop="require_status"
              label="需求状态"
              min-width="150">
              </el-table-column>
              <el-table-column
              prop="order_status"
              label="订单状态"
              min-width="150">
              </el-table-column>
              <el-table-column
              prop="msg"
              label="跟进备注信息"
              min-width="250">
              </el-table-column>
              <el-table-column
              prop="u_name"
              label="跟进人"
              min-width="200">
              </el-table-column>
              <el-table-column
              prop="create_time"
              label="跟进备注时间"
              min-width="150">
              </el-table-column>
            </el-table>
            <div class="m-t-20" v-show="allEdit">
              <div class="fl">
                <el-input type="textarea" v-model.trim="remark" placeholder="请填写跟进内容" :rows="3" class="w-500"></el-input>
              </div>
              <div class="fl m-t-20 m-l-20">
                <el-button type="primary" @click="addRemark()">添加跟进</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="财务记录" name="3">
            <div>
              <div class="m-t-10" style="width: 100%">
                <div class="finance-title">项目款</div>
                <el-table
                :data="proData"
                style="width: 100%"
                class="m-t-10">
                  <el-table-column
                  prop="type"
                  label="类型"
                  min-width="100">
                  </el-table-column>
                  <el-table-column
                  prop="amount"
                  label="金额"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="status_attr"
                  label="状态"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="pay_time"
                  label="支付时间"
                  min-width="200">
                  </el-table-column>
                  <el-table-column
                  prop="please_attr"
                  label="是/否请款"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    min-width="100">
                    <template scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="payMoney(scope.row, 0)">
                        {{scope.row.handle}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="m-t-30 m-t-20" style="width: 100%" v-show="model == 2">
                <div class="finance-title">提成记录</div>
                <el-table
                :data="bonusData"
                style="width: 100%"
                class="m-t-10">
                  <el-table-column
                  prop="name"
                  label="款项名"
                  min-width="100">
                  </el-table-column>
                  <el-table-column
                  prop="sales_count"
                  label="周期销售量"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="amount"
                  label="金额"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="status_attr"
                  label="状态"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="create_time"
                  label="生成时间"
                  min-width="150">
                  </el-table-column>
                  <el-table-column
                  prop="please_attr"
                  label="是/否请款"
                  min-width="100">
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    min-width="100">
                    <template scope="scope">
                      <el-button
                        type="text"
                        size="small"
                        @click="payMoney(scope.row, 1)">
                        {{scope.row.handle}}
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="m-t-10" style="width: 100%" v-show="model == 2">
                <div class="finance-title">销售记录</div>
                <div class="fl m-b-10 h-28" style="width: 100%">
                  <div class="fl c-light-gray fz-14">提成计算开始时间：</div>
                  <div class="fl c-light-gray fz-14">{{ recordTiem }}</div>
                </div>
                <el-table
                :data="saleData"
                style="width: 451px"
                class="m-t-10">
                  <el-table-column
                  prop="sales_time"
                  label="月份"
                  width="100">
                  </el-table-column>
                  <el-table-column
                  prop="sales_count"
                  label="销量"
                  width="150">
                  </el-table-column>
                  <el-table-column
                  prop="status"
                  label="提成状态"
                  width="200">
                  </el-table-column>
                </el-table>
                <div>
                  <div class="m-b-10 p-t-20 fr" v-show="isPage">
                    <el-pagination
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next, jumper"
                    :page-size="12"
                    :current-page="currentPage"
                    :total="dataCount">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <upImg ref="upImg" :status="0" :urlId="reId"></upImg>
  </div>
</template>
<style type="text/css">
  .hideTab .el-tabs__item:last-child {
    display: none;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import contract from './contract.vue'
  import upImg from './upImg.vue'

  export default {
    props: ['isOne', 'reId', 'isCom', 'conId', 'model'],
    data() {
      return {
        id: null,
        remarkData: [],
        remark: '',
        proData: [],
        bonusData: [],
        saleData: [],
        process: [],
        fileList: [],
        isPage: false,
        currentPage: 1,
        dataCount: null,
        recordTiem: '',
        allEdit: false,
        showFinance: false,
        imgUrl: ''
      }
    },
    watch: {
      'reId' (to, from) {
        this.getFiles()
        this.getRemark()
        if (this.showFinance == true) {
          this.getsaleData()
        }
      },
      'isOne' (to, from) {
        if (this.isOne) {
          this.getStep()
        }
      }
    },
    methods: {
      // 获取里程碑信息
      getStep() {
        this.apiGet('orders/' + this.id + '/process').then((res) => {
          console.log(res)
          if (res.code == 200) {
            this.process = res.data
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 获取备注列表
      getRemark() {
        this.apiGet('requires/' + this.reId + '/remarks').then((res) => {
          if (res.code == 200) {
            this.remarkData = res.data.list
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 添加备注
      addRemark() {
        if (this.remark == '') {
          _g.toastMsg(this, 'warning', '请输入跟进备注')
          return
        }
        this.apiPost('requires/' + this.reId + '/orders/' + this.id + '/remarks', { msg: this.remark }).then((res) => {
          if (res.code == 200) {
            _g.toastMsg(this, 'success', '添加成功')
            setTimeout(() => {
              this.remark = ''
              this.getRemark()
            }, 500)
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 获取文件列表
      getFiles() {
        this.apiGet('requires/' + this.reId + '/files').then((res) => {
          if (res.code == 200) {
            this.fileList = res.data
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 删除文件
      delFile(id) {
        this.$confirm('确认删除该文件?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('requires/' + this.reId + '/files/', id).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              setTimeout(() => {
                this.getFiles()
              }, 200)
            } else {
              _g.dealError(this, res)
            }
          })
        }).catch(() => {
        })
      },
      // 上传文件弹窗
      openUp() {
        this.$refs.upImg.open()
      },
      // 获取项目款列表
      getProData() {
        this.apiGet('orders/' + this.id + '/finances/project').then((res) => {
          if (res.code == 200) {
            this.proData = _(res.data).forEach((val, key) => {
              if (val.status == 1) {
                val.handle = '付款'
              } else {
                val.handle = ''
              }
              if (val.please == 0) {
                val.please_attr = '否'
              } else {
                val.please_attr = '是'
              }
            })
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 确认付款
      payMoney(row, num) {
        this.apiPut('finances/' + row.id, '', { action_type: 'pay' }).then((res) => {
          if (res.code == 200) {
            _g.toastMsg(this, 'success', '付款成功')
            setTimeout(() => {
              if (num == 1) {
                this.getbonusData()
                this.getsaleData()
              } else {
                this.getProData()
              }
            }, 200)
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 销量提成记录页面跳转
      handleCurrentChange(val) {
        this.currentPage = val
        this.getsaleData()
      },
      // 获取销售记录列表
      getsaleData() {
        let data = {
          params: {
            page: this.currentPage,
            pagesize: 12,
            type: 2
          }
        }
        this.apiGet('requires/' + this.reId + '/sales', data).then((res) => {
          if (res.code == 200) {
            this.dataCount = res.data.page.total_count
            if (res.data.page.total_count > 12) {
              this.isPage = true
            } else {
              this.isPage = false
            }
            this.recordTiem = res.data.commission_time
            this.saleData = res.data.list
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 获取提成记录列表
      getbonusData() {
        this.apiGet('orders/' + this.id + '/finances/commission').then((res) => {
          if (res.code == 200) {
            this.bonusData = _(res.data).forEach((val, key) => {
              switch (val.status) {
                case 1:
                  val.handle = '付款'
                  break
              }
              if (val.please == 0) {
                val.please_attr = '否'
              } else {
                val.please_attr = '是'
              }
            })
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.imgUrl = window.imgUrl
      let auth = Lockr.get('authList')
      let name = this.$route.name
      if (auth) {
        // 需求管理
        if ((name == 'orderDetail') || (name == 'overDetail')) {
          if (typeof (auth.order_edit) != 'undefined') {
            this.allEdit = true
          }
          if (typeof (auth.order_finance) != 'undefined') {
            this.showFinance = true
          }
        }
        // 服务商列表
        if (name == 'serviceOrderDetail') {
          if (typeof (auth.service_edit) != 'undefined') {
            this.allEdit = true
          }
          if (typeof (auth.service_finance) != 'undefined') {
            this.showFinance = true
          }
        }
      } else {
        this.allEdit = true
        this.showFinance = true
      }
      this.id = this.$route.params.id
      if (this.showFinance == true) {
        this.getProData()
        this.getProData()
        this.getbonusData()
      }
    },
    mounted() {
      if (this.reId != null) {
        this.getFiles()
        if (this.showFinance == true) {
          this.getsaleData()
        }
      }
      if (this.isOne) {
        this.getStep()
      }
    },
    components: {
      contract,
      upImg
    },
    mixins: [http]
  }
</script>