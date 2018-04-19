<template>
  <div>
    <div class="m-b-20 ovf-hd">
      <div class="fl">
        <router-link class="btn-link-large add-btn" to="userAdd">
          <i class="el-icon-plus"></i>&nbsp;&nbsp;添加用户
        </router-link>
      </div>
      <div class="fr w-250 m-l-30">
        <el-input placeholder="请输入用户名、账号查询" v-model="keyword">
          <el-button slot="append" icon="search" @click="select()"></el-button>
        </el-input>
      </div>
    </div>
    <el-table
    ref='userData'
    :data="tableData"
    @selection-change="handleSelectionChange"
    style="width: 100%" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中">
      <el-table-column
        type="selection"
        v-if='isMDel'
        :reserve-selection=true
        :selectable='isSelect'
        width="55">
      </el-table-column>
      <el-table-column
      prop="num"
      label="序号"
      width="150">
      </el-table-column>
      <el-table-column
      prop="user_name"
      label="用户名">
      </el-table-column>
      <el-table-column
      prop="user_account"
      label="账号">
      </el-table-column>
      <el-table-column
      prop="user_role_name"
      label="角色">
      </el-table-column>
      <el-table-column
      prop="user_phone"
      label="手机号">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template scope="scope">
          <el-button
            type="danger"
            size="small"
            @click="confirmDelete(scope.row)">
            删除
          </el-button>
          <router-link :to="{ name: 'userEdit', params: { id: scope.row.user_id }}" class="btn-link edit-btn">
            编辑
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20">
      <div class="block pages m-b-10">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="pagesize"
          :total="dataCount">
        </el-pagination>
      </div>
    </div>
    <div class="fl">
      <el-button type="primary" size="small" v-show='!isMDel' @click='multiDelete'>批量删除</el-button>
      <el-button type="primary" size="small" v-show='isMDel' @click='cancelDel'>取消</el-button>
      <el-button type="primary" size="small" v-show='isMDel' @click='sureDel'>确定删除</el-button>
    </div>
  </div>
</template>

<script>
  import http from '../../../assets/js/http'

  export default {
    watch: {
      '$route'(to, from) {
        var self = this
        self.init()
      }
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        dataCount: null,
        keyword: '',
        pagesize: 15,
        isMDel: false,
        delList: [],
        fullscreenLoading: false
      }
    },
    methods: {
      select(num) {
        var self = this
        if (num) {
          self.currentPage = 1
        }
        router.push({ path: '/system/rule/userList', query: { page: self.currentPage, pagesize: self.pagesize, keyword: self.keyword }})
      },
      init() {
        this.fullscreenLoading = true
        var self = this
        if (self.$route.fullPath == '/system/rule/userList') {
          self.currentPage = 1
          self.keyword = ''
          self.pagesize = 15
        } else {
          self.currentPage = self.$route.query.page * 1
          self.keyword = self.$route.query.keyword
          self.pagesize = self.$route.query.pagesize * 1
        }
        self.getAllUsers()
      },
      isSelect(row, index) {
        return true
      },
      multiDelete() {
        this.isMDel = true
      },
      sureDel() {
        if (this.delList.length != 0) {
          this.apiPost('users/deletes', { ids: this.delList }).then((res) => {
            if (res.code == 200) {
              // 重新获取列表数据
              this.isMDel = false
              this.getAllUsers()
              _g.toastMsg(this, 'success', '删除成功')
            } else {
              _g.dealError(this, res)
            }
          })
        } else {
          _g.toastMsg(this, 'warning', '请勾选数据')
        }
      },
      cancelDel() {
        this.$refs.userData.clearSelection(this.tableData)
        this.isMDel = false
      },
      handleSelectionChange(val) {
        this.delList = []
        _(val).forEach((res, key) => {
          this.delList.push(res.user_id)
        })
      },
      confirmDelete(item) {
        this.$confirm('确认删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('users/', item.user_id).then((res) => {
            console.log(res)
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              setTimeout(() => {
                this.getAllUsers()
              }, 200)
            } else {
              _g.dealError(this, res)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.select()
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.select(1)
      },
      searchWord() {
        this.getAllUsers()
      },
      getAllUsers() {
        this.apiGet('users?page=' + this.currentPage + '&pagesize=' + this.pagesize + '&keyword=' + this.keyword).then((res) => {
          this.fullscreenLoading = false
          console.log(res)
          if (res.code == 200) {
            this.tableData = _(res.data.list).forEach((val, key) => {
              val.num = key + 1
            })
            this.dataCount = res.data.page.total_count
            console.log(this.dataCount)
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.init()
    },
    computed: {
    },
    mixins: [http]
  }
</script>