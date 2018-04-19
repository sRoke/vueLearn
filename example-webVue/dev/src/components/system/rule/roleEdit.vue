<template>
  <div class="m-l-50 m-t-30 w-800"
       id='roleEdit'>
    <el-form ref="form"
             :model="form"
             :rules="rules"
             label-width="100px">
      <el-form-item label="角色"
                    prop="role_name">
        <el-input v-model.trim="form.role_name"
                  class="h-40 w-200"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea"
                  v-model.trim="form.role_depict"
                  :rows="4"
                  class="w-300"></el-input>
      </el-form-item>
      <el-form-item label="权限节点"
                    class="roleCheckbox"
                    prop="powers">
        <el-row v-show='serviceShow'
                class='row-border'>
          <div class='big-title'>业务管理</div>
          <div v-if='serSubshow.demand'>
            <el-form-item label='需求管理'
                          class='row-bordb'>
              <el-checkbox-group v-model="demandSel">
                <el-checkbox v-for="ssubitem in serviceRole.demandRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='serSubshow.order'>
            <el-form-item label='订单管理'
                          class='row-bordb'>
              <el-checkbox-group v-model="orderSel">
                <el-checkbox v-for="ssubitem in serviceRole.orderRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='serSubshow.finance'>
            <el-form-item label='财务管理'>
              <el-checkbox-group v-model="financeSel">
                <el-checkbox v-for="ssubitem in serviceRole.financeRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-row>
        <el-row v-if='clientShow'
                class='row-border'>
          <div class='big-title'>客户关系管理</div>
          <div v-if='clientSubshow.pub'>
            <el-form-item label='公海客户'
                          class='row-bordb'>
              <el-checkbox-group v-model="pubSel">
                <el-checkbox v-for="ssubitem in clientRole.pubRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='clientSubshow.unDemand'>
            <el-form-item label='未关联需求方'
                          class='row-bordb'>
              <el-checkbox-group v-model="unDemandSel">
                <el-checkbox v-for="ssubitem in clientRole.unDemandRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='clientSubshow.unService'>
            <el-form-item label='未关联服务方'
                          class='row-bordb'>
              <el-checkbox-group v-model="unServiceSel">
                <el-checkbox v-for="ssubitem in clientRole.unServiceRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='clientSubshow.my'>
            <el-form-item label='我的客户'>
              <el-checkbox-group v-model="mySel">
                <el-checkbox v-for="ssubitem in clientRole.myRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-row>
        <el-row v-if='dataShow'
                class='row-border'>
          <div class='big-title'>数据管理</div>
          <div v-if='dataSubshow.ser'>
            <el-form-item label='账号管理'
                          class='row-bordb'>
              <el-checkbox-group v-model="serviceSel">
                <el-checkbox v-for="ssubitem in dataRole.serRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='dataSubshow.Class'>
            <el-form-item label='分类标签'
                          class='row-bordb'>
              <el-checkbox-group v-model="classSel">
                <el-checkbox v-for="ssubitem in dataRole.classRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='dataSubshow.cont'>
            <el-form-item label='内容管理'>
              <el-checkbox-group v-model="contSel">
                <el-checkbox v-for="ssubitem in dataRole.contRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-row>
        <el-row v-if='systemShow'
                class='row-border'>
          <div class='big-title'>系统管理</div>
          <div v-if='sysSubshow.role'>
            <el-form-item label='权限管理'
                          class='row-bordb'>
              <el-checkbox-group v-model="roleSel">
                <el-checkbox v-for="ssubitem in systemRole.roleRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if='sysSubshow.sys'>
            <el-form-item label='系统管理'
                          class='row-bordb'>
              <el-checkbox-group v-model="systemSel">
                <el-checkbox v-for="ssubitem in systemRole.systemRole"
                             v-if='ssubitem.visible == 1'
                             :label="ssubitem.title"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="edit()"
                   :loading="isLoading">提交</el-button>
        <el-button @click="goback()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style type="text/css">
#roleEdit .big-title {
  padding: 0px 0px;
  text-align: left;
  text-indent: 10px;
  background: #CCCCCC;
  border-bottom: 1px solid #48576a;
}

#roleEdit .row-border {
  border: 1px solid #48576a;
  border-bottom: 0px;
}

#roleEdit .row-bordb {
  border-bottom: 1px solid #48576a;
}
</style>
<script>
import http from '../../../assets/js/http'
import fromRole from '../../../assets/js/role'

export default {
  data() {
    return {
      form: {
        role_id: null,
        role_name: '',
        role_depict: '',
        powers: ''
      },
      selectedOptions: [],
      ruleOptions: [],
      rules: {
        role_name: [
          { required: true, message: '请输入角色名' }
        ],
        powers: [
          { required: true, message: '请选择权限节点' }
        ]
      },
      isLoading: false,
      serviceRole: {
        demandRole: [],
        orderRole: [],
        financeRole: []
      },
      clientRole: {
        myRole: [],
        pubRole: [],
        unDemandRole: [],
        unServiceRole: []
      },
      dataRole: {
        serRole: [],
        classRole: [],
        contRole: []
      },
      systemRole: {
        roleRole: [],
        systemRole: []
      },
      serviceShow: false,
      serSubshow: {
        demand: false,
        order: false,
        finance: false
      },
      clientShow: false,
      clientSubshow: {
        my: false,
        pub: false,
        unDemand: false,
        unService: false
      },
      dataShow: false,
      dataSubshow: {
        ser: false,
        Class: false,
        cont: false
      },
      systemShow: false,
      sysSubshow: {
        role: false,
        sys: false
      },
      demandSel: [],
      systemSel: [],
      roleSel: [],
      contSel: [],
      classSel: [],
      serviceSel: [],
      pubSel: [],
      mySel: [],
      unDemandSel: [],
      unServiceSel: [],
      financeSel: [],
      orderSel: []
    }
  },
  watch: {
    serviceSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    pubSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    demandSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    orderSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    financeSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    mySel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看我的客户') < 0 && newVal.length != 0) {
        newVal.push('查看我的客户')
      }
    },
    unDemandSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    },
    unServiceSel(newVal) {
      var str = newVal.join('')
      if (str.indexOf('查看') < 0 && newVal.length != 0) {
        newVal.push('查看')
      }
    }
  },
  methods: {
    sortRole() {
      var serviceRoleList = [] // 业务管理
      if (this.demandSel.length > 0) {
        serviceRoleList = fromRole.pushRole(this.ruleOptions, serviceRoleList, this.demandSel, 0, 0)
      }
      if (this.orderSel.length > 0) {
        serviceRoleList = fromRole.pushRole(this.ruleOptions, serviceRoleList, this.orderSel, 0, 1)
      }
      if (this.financeSel.length > 0) {
        serviceRoleList = fromRole.pushRole(this.ruleOptions, serviceRoleList, this.financeSel, 0, 2)
      }
      if (serviceRoleList.length > 0) {
        serviceRoleList.push(this.ruleOptions[0]['id'])
      }

      var clientRoleList = []
      if (this.pubSel.length > 0) {
        clientRoleList = fromRole.pushRole(this.ruleOptions, clientRoleList, this.pubSel, 1, 0)
      }
      if (this.unDemandSel.length > 0) {
        clientRoleList = fromRole.pushRole(this.ruleOptions, clientRoleList, this.unDemandSel, 1, 2)
      }
      if (this.unServiceSel.length > 0) {
        clientRoleList = fromRole.pushRole(this.ruleOptions, clientRoleList, this.unServiceSel, 1, 3)
      }
      if (this.mySel.length > 0) {
        clientRoleList = fromRole.pushRole(this.ruleOptions, clientRoleList, this.mySel, 1, 1)
      }
      if (clientRoleList.length > 0) {
        clientRoleList.push(this.ruleOptions[1]['id'])
      }

      var dataRoleList = []
      if (this.serviceSel.length > 0) {
        dataRoleList = fromRole.pushRole(this.ruleOptions, dataRoleList, this.serviceSel, 2, 0)
      }
      if (this.classSel.length > 0) {
        dataRoleList = fromRole.pushRole(this.ruleOptions, dataRoleList, this.classSel, 2, 1)
      }
      if (this.contSel.length > 0) {
        dataRoleList = fromRole.pushRole(this.ruleOptions, dataRoleList, this.contSel, 2, 2)
      }
      if (dataRoleList.length > 0) {
        dataRoleList.push(this.ruleOptions[2]['id'])
      }

      var systemRoleList = []
      if (this.roleSel.length > 0) {
        systemRoleList = fromRole.pushRole(this.ruleOptions, systemRoleList, this.roleSel, 3, 0)
      }
      if (this.systemSel.length > 0) {
        systemRoleList = fromRole.pushRole(this.ruleOptions, systemRoleList, this.systemSel, 3, 1)
      }
      if (systemRoleList.length > 0) {
        systemRoleList.push(this.ruleOptions[3]['id'])
      }
      var list = _.union(serviceRoleList, clientRoleList, dataRoleList, systemRoleList)
      list = fromRole.pushContainRole(list) // 把所属的权限添加进去
      return list
    },
    edit() {
      this.isLoading = true
      this.form.powers = this.sortRole()
      if (this.form.powers.length == 0) {
        _g.toastMsg(this, 'warning', '请选择权限节点')
        this.isLoading = !this.isLoading
        return
      }
      this.$refs.form.validate((pass) => {
        if (pass) {
          this.apiPut('groups/', this.form.role_id, this.form).then((res) => {
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
    matchRole(powers) {
      _(powers).forEach((res) => {
        switch (res) {
          case '91':
            this.demandSel.push('查看')
            break
          case '92':
            this.demandSel.push('编辑-管理员权限')
            break
          case '93':
            this.demandSel.push('财务记录-管理员权限')
            break
          case '94':
            this.orderSel.push('查看')
            break
          case '95':
            this.orderSel.push('编辑-管理员权限')
            break
          case '96':
            this.orderSel.push('财务记录-管理员权限')
            break
          case '97':
            this.financeSel.push('查看')
            break
          case '98':
            this.financeSel.push('编辑-管理员权限')
            break
          case '337':
            this.pubSel.push('查看')
            break
          case '343':
            this.pubSel.push('编辑-管理员权限')
            break
          case '282':
            this.pubSel.push('财务记录-管理员权限')
            break
          case '347':
            this.pubSel.push('选择/释放-管理员权限')
            break
          case '370':
            this.pubSel.push('批量分配')
            break
          case '405':
            this.pubSel.push('添加')
            break
          case '102':
            this.mySel.push('查看我的客户')
            break
          case '103':
            this.mySel.push('编辑-管理员权限')
            break
          case '104':
            this.mySel.push('选择/释放-管理员权限')
            break
          case '105':
            this.mySel.push('查看所有已跟进客户')
            break
          case '371':
            this.mySel.push('批量释放')
            break
          case '400':
            this.unDemandSel.push('查看')
            break
          case '401':
            this.unDemandSel.push('编辑')
            break
          case '402':
            this.unServiceSel.push('查看')
            break
          case '403':
            this.unServiceSel.push('编辑')
            break
          case '107':
            this.serviceSel.push('查看')
            break
          case '108':
            this.serviceSel.push('编辑-管理员权限')
            break
          case '284':
            this.serviceSel.push('财务记录-管理员权限')
            break
          case '109':
            this.classSel.push('所有权限')
            break
          case '110':
            this.contSel.push('所有权限')
            break
          case '89':
            this.roleSel.push('所有权限')
            break
          case '90':
            this.systemSel.push('所有权限')
            break
          case '404':
            this.demandSel.push('导出')
            break
        }
      })
    },
    // 获取权限列表
    getAllRules() {
      this.apiGet('rules').then((res) => {
        if (res.code == 200) {
          this.ruleOptions = res.data
          _(this.ruleOptions).forEach((res) => {
            switch (res.title) {
              case '业务管理':
                if (res.visible == 1) {
                  this.serviceShow = true
                  _(res.child).forEach((cres) => {
                    switch (cres.title) {
                      case '需求管理':
                        this.serviceRole.demandRole = cres.child
                        if (cres.visible == 1) {
                          this.serSubshow.demand = true
                        }
                        break
                      case '订单管理':
                        this.serviceRole.orderRole = cres.child
                        if (cres.visible == 1) {
                          this.serSubshow.order = true
                        }
                        break
                      case '财务管理':
                        this.serviceRole.financeRole = cres.child
                        if (cres.visible == 1) {
                          this.serSubshow.finance = true
                        }
                        break
                    }
                  })
                }
                break
              case '客户关系管理':
                if (res.visible == 1) {
                  this.clientShow = true
                  _(res.child).forEach((cres) => {
                    switch (cres.title) {
                      case '公海客户':
                        this.clientRole.pubRole = cres.child
                        if (cres.visible == 1) {
                          this.clientSubshow.pub = true
                        }
                        break
                      case '未关联需求方':
                        this.clientRole.unDemandRole = cres.child
                        if (cres.visible == 1) {
                          this.clientSubshow.unDemand = true
                        }
                        break
                      case '未关联服务方':
                        this.clientRole.unServiceRole = cres.child
                        if (cres.visible == 1) {
                          this.clientSubshow.unService = true
                        }
                        break
                      case '我的客户':
                        this.clientRole.myRole = cres.child
                        if (cres.visible == 1) {
                          this.clientSubshow.my = true
                        }
                        break
                    }
                  })
                }
                break
              case '数据管理':
                if (res.visible == 1) {
                  this.dataShow = true
                  _(res.child).forEach((cres) => {
                    switch (cres.title) {
                      case '账号管理':
                        this.dataRole.serRole = cres.child
                        if (cres.visible == 1) {
                          this.dataSubshow.ser = true
                        }
                        break
                      case '分类标签':
                        this.dataRole.classRole = cres.child
                        if (cres.visible == 1) {
                          this.dataSubshow.Class = true
                        }
                        break
                      case '内容管理':
                        this.dataRole.contRole = cres.child
                        if (cres.visible == 1) {
                          this.dataSubshow.cont = true
                        }
                        break
                    }
                  })
                }
                break
              case '系统管理':
                if (res.visible == 1) {
                  this.systemShow = true
                  _(res.child).forEach((cres) => {
                    switch (cres.title) {
                      case '权限管理':
                        this.systemRole.roleRole = cres.child
                        if (cres.visible == 1) {
                          this.sysSubshow.role = true
                        }
                        break
                      case '系统管理':
                        this.systemRole.systemRole = cres.child
                        if (cres.visible == 1) {
                          this.sysSubshow.sys = true
                        }
                        break
                    }
                  })
                }
                break
            }
          })
          this.getData()
        } else {
          _g.dealError(this, res)
        }
      })
    },
    // 获取角色信息
    getData() {
      this.apiGet('groups/' + this.form.role_id).then((res) => {
        if (res.code == 200) {
          this.form = res.data
          this.matchRole(this.form.powers)
        } else {
          _g.dealError(this, res)
        }
      })
    }
  },
  created() {
    this.form.role_id = this.$route.params.id
    this.getAllRules()
  },
  components: {

  },
  mixins: [http]
}
</script>