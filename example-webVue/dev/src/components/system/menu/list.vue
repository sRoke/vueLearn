<template>
	<div>
		<div class="m-b-20">
		<router-link v-show="addShow" class="btn-link-large add-btn" to="add">
		<i class="el-icon-plus"></i>&nbsp;&nbsp;添加菜单
		</router-link>
		</div>
		<el-table
		:data="tableDataShow"
		style="width: 100%"
		@selection-change="selectItem">
			<el-table-column
			type="selection"
			:context="_self"
			width="50">
			</el-table-column>
			<el-table-column
			prop="p_title"
			label="上级菜单"
			width="150">
			</el-table-column>
			<el-table-column
			prop="title"
			label="标题">
			</el-table-column>
		<!-- <el-table-column
		prop="menu_type"
		label="类型"
		width="200">
		</el-table-column> -->
			<el-table-column
			inline-template
			label="状态"
			width="100">
				<div>
					{{ row.status | status}}
				</div>
			</el-table-column>
			<el-table-column
			label="操作"
			inline-template
			width="200">
				<div>
					<span v-show="editShow">
						<router-link :to="{ name: 'MenuEdit', params: { id: row.id }}" class="btn-link edit-btn">
						编辑
						</router-link>
					</span>
					<span v-show="deleteShow">
						<el-button
						size="small"
						type="danger"
						@click="confirmDelete(row)">
						删除
						</el-button>
					</span>
				</div>
			</el-table-column>
		</el-table>
		<div class="pos-rel p-t-20">
			<btnGroup :selectedData="multipleSelection" :type="'menus'"></btnGroup>
		</div>
	</div>
</template>

<script>
  import btnGroup from '../../common/btn-group.vue'
  import http from '../../../assets/js/http'

  export default {
    data() {
      return {
        tableData: [],
        tableDataShow: [],
        multipleSelection: []
      }
    },
    methods: {
      selectItem(val) {
        this.multipleSelection = val
      },
      confirmDelete(item) {
        this.$confirm('确认删除该菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('menus/', item.id).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              setTimeout(() => {
                location.reload()
              }, 1500)
            } else {
              _g.dealError(this, res)
            }
          })
        }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
        })
      }
    },
    created() {
      this.apiGet('menus').then((res) => {
        if (res.code == 200) {
          this.tableData = res.data
          this.tableDataShow = _(res.data).forEach((val, key) => {
            val.index = key
            val.folder = false
          })
        } else {
          _g.dealError(this, res)
        }
      })
    },
    computed: {
      addShow() {
        return _g.getHasRule('menus-save')
      },
      editShow() {
        return _g.getHasRule('menus-update')
      },
      deleteShow() {
        return _g.getHasRule('menus-delete')
      }
    },
    components: {
      btnGroup
    },
    mixins: [http]
  }
</script>