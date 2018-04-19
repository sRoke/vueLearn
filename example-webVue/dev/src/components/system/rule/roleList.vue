<template>
  <div>
    <div class="m-b-20">
    <router-link class="btn-link-large add-btn" to="roleAdd">
    <i class="el-icon-plus"></i>&nbsp;&nbsp;添加角色
    </router-link>
    </div>
    <el-table
    ref='roleData'
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
      prop="role_name"
      label="角色">
      </el-table-column>
      <el-table-column
      prop="role_depict"
      label="描述">
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
          <router-link :to="{ name: 'roleEdit', params: { id: scope.row.role_id }}" class="btn-link edit-btn">
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
        dataCount: 1,
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
        router.push({ path: '/system/rule/roleList', query: { page: self.currentPage, pagesize: self.pagesize }})
      },
      isSelect(row, index) {
        if (row.role_name == '销售人员' || row.role_name == '客服' || row.role_name == '地推') {
          return false
        }
        return true
      },
      multiDelete() {
        this.isMDel = true
      },
      sureDel() {
        if (this.delList.length != 0) {
          this.apiPost('groups/deletes', { ids: this.delList }).then((res) => {
            if (res.code == 200) {
              // 重新获取列表数据
              this.isMDel = false
              this.getAllRoles()
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
        this.$refs.roleData.clearSelection(this.tableData)
        this.isMDel = false
      },
      handleSelectionChange(val) {
        this.delList = []
        _(val).forEach((res, key) => {
          this.delList.push(res.role_id)
        })
      },
      init() {
        this.fullscreenLoading = true
        var self = this
        if (self.$route.fullPath == '/system/rule/roleList') {
          self.currentPage = 1
          self.pagesize = 15
        } else {
          self.currentPage = self.$route.query.page * 1
          self.pagesize = self.$route.query.pagesize * 1
        }
        self.getAllRoles()
      },
      confirmDelete(item) {
        this.$confirm('确认删除该角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('groups/', item.role_id).then((res) => {
            console.log(res)
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              setTimeout(() => {
                this.getAllRoles()
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
      getAllRoles() {
        this.apiGet('groups?page=' + this.currentPage + '&pagesize=' + this.pagesize).then((res) => {
          this.fullscreenLoading = false
          console.log(res)
          if (res.code == 200) {
            this.tableData = _(res.data.list).forEach((val, key) => {
              val.num = key + 1
            })
            this.dataCount = res.data.page.total_count
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