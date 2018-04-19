<template>
  <el-dialog ref="dialog" custom-class="w-900 h-620" title="选择服务商" id="service-tab">
    <div class="ovf-auto">
      <div class="fl" id="servicerCo">
        <el-button type="text" :disabled="allSer" @click="change(0)">所有服务方</el-button>
        <el-button type="text" :disabled="someSer" @click="change(1)" class="m-l-10">匹配服务方</el-button>
      </div>
      <div class="fr w-200 m-l-30">
        <el-input placeholder="搜索服务方名称/标签" v-model="keyword">
          <el-button slot="append" icon="search" @click="getData()"></el-button>
        </el-input>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%" height="441" class="tx-c m-t-15 fl" id="serList">
        <el-table-column
          label="选择"
          width="80">
          <template scope="scope">
            <input type="checkbox" label="" :disabled="scope.row.sel" :checked="scope.row.sel" v-if="scope.row.sel">
            <input type="checkbox" label="" :checked="scope.row.selChange" @change="changeSel(scope.row)" v-if="!scope.row.sel">
          </template>
        </el-table-column>
        <el-table-column
          prop="u_name"
          label="服务方"
          width="240">
        </el-table-column>
        <el-table-column
          label="标签">
          <template scope="scope">
            <el-tooltip 
            class="item" 
            effect="dark" 
            :content='scope.row.labelStr' 
            placement="bottom" 
            popper-class="w-300">
              <div class='ellips' style='width:390px'>{{scope.row.labelStr}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tab_page" v-show="isPage">
      <div class="block">
        <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="dataCount">
        </el-pagination>
      </div>
    </div>
    <div class="ser_btn_group">
      <el-button class="m-r-20" @click="close()">返回</el-button>
      <el-button type="primary" class="m-r-30" @click="postSer()">确认</el-button>
    </div>
  </el-dialog>
</template>
<style type="text/css">
  #service-tab .ellips{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  #service-tab .ser_btn_group {
    position: absolute;
    bottom: 15px;
    right: 20px;
  }
  #service-tab .el-table th>.cell {
    text-align: center;
  }
  #service-tab .tab_page {
    position: absolute;
    bottom: 15px;
    left: 20px;
  }
  #service-tab .el-dialog__body {
    padding: 15px 20px;
  }
  .h-620 {
    height: 620px;
  }
  #servicerCo .el-button--text {
    color: #333333;
  }
  #servicerCo .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    color: #20a0ff;
  }
  #serList .el-scrollbar__wrap {
    margin-right: 0 !important;
    margin-bottom: 0 !important;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import Vue from 'vue'

  export default {
    props: ['isIn', 'isNewSer', 'inData', 'outData'],
    data() {
      return {
        id: null,
        keyword: '',
        is_match: 1,
        tableData: [],
        isPage: false,
        currentPage: 1,
        dataCount: null,
        service_id: [],
        allSer: false,
        someSer: true,
        selId: [],
        newSer: '',
        pageSize: 10
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData()
      },
      open() {
        this.tableData = []
        this.keyword = ''
        this.is_match = 1
        this.isPage = false
        this.currentPage = 1
        this.dataCount = null
        this.service_id = []
        this.allSer = false
        this.someSer = true
        this.selId = []
        this.newSer = ''
        this.getData()
        this.$refs.dialog.open()
      },
      getData() {
        let data = {
          params: {
            pagesize: this.pageSize,
            page: this.currentPage,
            is_match: this.is_match,
            keyword: this.keyword
          }
        }
        this.apiGet('requires/' + this.id + '/services/select', data).then((res) => {
          if (res.code == 200) {
            this.tableData = []
            console.log(res.data.list)
            console.log(_(res.data.list))
            _(res.data.list).forEach((obj, key) => {
              obj.labelStr = obj.label.join('、')
            })
            this.tableData = _(res.data.list).forEach((obj, key) => {
              obj.sel = false
              obj.selChange = false
            })
            if (this.tableData.length > 0) {
              this.isPage = true
            } else {
              this.isPage = false
            }
            this.dataCount = res.data.page.total_count
            // 判断是重新选择服务方还是添加邀请服务方
            if (this.isNewSer == 0) {
              if (this.isIn == 0) {
                this.setSelect(this.outData)
              } else if (this.isIn == 1) {
                this.setSelect(this.inData)
              }
              _(this.selId).forEach((res, key) => {
                _(this.tableData).forEach((obj, i) => {
                  if (res == obj.u_id) {
                    obj.selChange = true
                  }
                })
              })
            } else {
              _(this.tableData).forEach((obj, i) => {
                if (obj.u_id == this.newSer) {
                  obj.selChange = true
                }
              })
            }
          } else {
            _g.dealError(this, res)
          }
        })
      },
      // 设置已选择的服务方
      setSelect(objData) {
        _(objData).forEach((obj, key) => {
          _(this.tableData).forEach((res, key) => {
            if (res.u_id == obj.u_id) {
              this.tableData[key].sel = true
              this.service_id.push(obj.u_id)
            }
          })
        })
      },
      close() {
        this.$refs.dialog.close()
      },
      postSer() {
        let num = Number(this.isIn) + 1
        // 判断是重新选择服务方还是添加邀请服务方
        if (this.isNewSer == 0) {
          let upId = this.service_id.concat(this.selId)
          if (upId.length > 0) {
            this.apiPost('requires/' + this.id + '/services', { service_id: upId, type: num }).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '添加成功')
                this.$parent.getServicer()
                setTimeout(() => {
                  this.close()
                }, 800)
              } else {
                _g.dealError(this, res)
              }
            })
          } else {
            _g.toastMsg(this, 'warning', '请选择服务方')
          }
        } else {
          if (this.newSer == '') {
            _g.toastMsg(this, 'warning', '请选择服务方')
          } else {
            this.apiPut('requires/' + this.id, '', { action_type: 'replaceService', order_type: num, user_id: this.newSer }).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '选择成功')
                this.$parent.getData()
                setTimeout(() => {
                  this.close()
                }, 800)
              } else {
                _g.dealError(this, res)
              }
            })
          }
        }
      },
      // 选中/取消选中
      changeSel(obj) {
        if (obj.selChange) {
          obj.selChange = false
          if (this.isNewSer == 0) {
            _(this.selId).forEach((res, key) => {
              if (res == obj.u_id) {
                this.selId.splice(key, 1)
              }
            })
          } else {
            this.newSer = ''
          }
        } else {
          if (this.isNewSer == 0) {
            this.selId.push(obj.u_id)
          } else {
            this.newSer = obj.u_id
            _(this.tableData).forEach((res, key) => {
              res.selChange = false
            })
          }
          obj.selChange = true
        }
      },
      // 切换所有/匹配服务方
      change(num) {
        if (num == 0) {
          this.allSer = true
          this.someSer = false
        } else {
          this.allSer = false
          this.someSer = true
        }
        this.is_match = num
        this.getData()
      }
    },
    created() {
      this.id = this.$route.params.id
    },
    mixins: [http]
  }
</script>