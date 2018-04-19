<template>
  <div>
    <el-row :gutter="20" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中">
      <div class="m-t-10 m-b-15">
        <el-col :span="2">
          <a href="#/data/info/article"><span class="now">文件管理</span></a>
        </el-col>
        <el-col :span="2">          
            <a class="older" href="#/data/info/feedback"><span>用户反馈</span><router-link v-show="addShow"  to="add"></router-link>
            </a>         
        </el-col>
      </div>
    </el-row>
    <el-table :data="tableData" class="article_table">
      <el-row :gutter="20">
      <el-col>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="articleEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
      </el-col>
      <el-col :span='6'>
      <el-table-column label="类型">
        <template scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      </el-col>
      <el-col :span='4'>
      <el-table-column label="编号">
        <template scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      </el-col>
      </el-row>
    </el-table>
    <articleEdit ref="articleEdit" :info="tableData"></articleEdit>
  </div> 
</template>
<style >
  .article_table{
    width: 100%;
    margin-top:20px
  }
  .now{
    color: #44B5DF!important;
    cursor:pointer;
    text-decoration:underline
  }
  .older{
    color: #000;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import articleEdit from './article-edit.vue'
  export default{
    methods: {
      getData() {
        this.apiGet('feedback/article').then((res) => {
          this.fullscreenLoading = false
          console.log(res.data)
          if (res.code == 200) {
            this.tableData = _(res.data.list).forEach((val, key) => {

            })
          } else {
            _g.dealError(this, res)
          }
        })
      },
      articleEdit(id) {
        this.tableData = this.tableData
        this.$refs.articleEdit.open(id)
      }
    },
    data() {
      return {
        tableData: [],
        fullscreenLoading: false
      }
    },
    created() {
      this.fullscreenLoading = true
      this.getData()
    },
    components: {
      articleEdit
    },
    mixins: [http]
  }
</script>