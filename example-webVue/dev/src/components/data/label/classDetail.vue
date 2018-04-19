<template>
  <div id='classDetail'>
    <el-dialog ref="dialog" custom-class="w-1000" :title='bTit'>
    <el-form :inline="true" :rules="rules" :model="formInline" class="demo-form-inline"  label-width="100px">
      <el-row class='m-t-10'>
        <el-col :span='10'>
          <el-form-item :label="btitle + '名称:'" prop='name'>
            <el-input v-model="formInline.name" :placeholder='"请输入" + btitle + "名称"'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='10'>
          <el-form-item :label='stitle + ":"'>
            <el-input v-model="addTag" :placeholder='"请输入要添加的" + stitle'>
              <el-button slot="append" icon="plus" @click="add()"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class='main-cont'>
        <div>
          <el-row type='flex' justify='start'>
            <el-col class='w-100 tx-r m-t-10'>
              已添加{{stitle}}:
            </el-col>
            <el-col>
              <el-tag
                v-for="(tag, index) in formInline.tag"
                class='tag-class'
                :closable="true"
                :type="gray"
                @close='delTag(tag, index)'
              >
              {{tag.name}}
              </el-tag>
            </el-col>
          </el-row>
        </div>
      </el-row>

    </el-form>
    <div class="dn">
      <el-button class="fr" @click="close()">取消</el-button>
      <el-button type="primary" class="fr m-r-15" @click="submit()" :loading="isLoading">确定</el-button>
      <el-button type="danger" class="fr m-r-15" v-if='type == "edit-label" || type == "edit-pro"' @click="deleteP()" :loading="isLoading1">删除</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<style type="text/css">
  .dn{
    height: 30px;
  }
  #classDetail .tag-class{
    margin: 8px 0px 0px 8px;
  }
  #classDetail .main-cont{
    height: 235px;
    margin: 10px 0px;
    overflow: hidden;
    overflow-y:auto;
  }
  #classDetail .tx-r{
    text-align: right;
  }
  #classDetail .tag_selected{
    background: #20a0ff !important;
  }
  #classDetail .del-icon{ 
    position: absolute;
      top: -5px;
  }
  #classDetail .selectedArea{
    background: #f1f2f7;
    padding: 10px;

  }
  #classDetail .tag-block{
    background: #CCCCCC;
    border: 0px !important;
    color: #000;
  }
</style>
<script>
import http from '../../../assets/js/http'
import Vue from 'vue'
export default {
  props: ['stitle', 'btitle', 'detail', 'type'],
  data() {
    return {
      isLoading: false,
      isLoading1: false,
      bTit: '',
      formInline: {
        name: '',
        id: '',
        tag: []
      },
      addTag: '',
      rules: {
        name: [
          { required: true, message: '请填写产品名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'detail'() {
      // console.log(this.detail)
      this.sort()
      if (this.type.indexOf('edit') > -1) {
        this.bTit = '编辑' + this.btitle
      } else {
        this.bTit = '添加' + this.btitle
      }
    }
  },
  methods: {
    sort() {
      if (this.detail.id != '' && this.detail.id != undefined && this.detail.id != null) {
        this.formInline = this.detail
        this.formInline = _g.s2j(_g.j2s(this.formInline))
      } else {
        this.formInline = {
          name: '',
          tag: []
        }
      }
    },
    add() {
      var tag_index = _.findLastIndex(this.formInline.tag, {
        name: this.addTag.trim('')
      })
      if (this.addTag.trim('') == '') {
        _g.toastMsg(this, 'warning', '请填写匹配项')
      } else {
        if (tag_index < 0) {
          this.formInline.tag.push({ name: this.addTag })
          this.addTag = ''
        } else {
          _g.toastMsg(this, 'warning', '已存在该' + this.stitle + '名称')
        }
      }
    },
    delTag(tag, index) {
      this.$confirm('即将移除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formInline.tag.splice(index, 1)
        _g.toastMsg(this, 'success', '删除成功')
      }).catch(() => {
        _g.toastMsg(this, 'info', '已取消删除')
      })
    },
    deleteP() {
      this.$confirm('即将移除该' + this.btitle + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading1 = true
        var path = ''
        // console.log(this.type)
        if (this.type == 'edit-label') {
          path = 'classification/'
        } else {
          path = 'products/'
        }
        this.apiDelete(path, this.formInline.id).then((res) => {
          if (res.code == 200) {
            this.$parent.delete()
            _g.toastMsg(this, 'success', '删除成功')
            // this.$parent.init()
            this.close()
          } else {
            this.isLoading1 = false
            _g.dealError(this, res)
          }
        })
      }).catch(() => {
        _g.toastMsg(this, 'info', '已取消删除')
      })
    },
    submit() {
      // console.log(this.formInline.tag)
      if (this.formInline.tag.length == 0) {
        this.isLoading = false
        _g.toastMsg(this, 'warning', '请添加匹配项')
        return
      }
      if (this.formInline.name.trim('') != '') {
        this.isLoading = true
        this.$parent.save(this.type, this.formInline)
        // console.log(this.$parent.allTag)
        // console.log(this.isLoading + '组件')
      } else {
        this.isLoading = false
        _g.toastMsg(this, 'warning', '请填写类型名称')
      }
    },
    open() {
      this.$refs.dialog.open()
      this.addTag = ''
      this.sort()
      this.isLoading = false
      this.isLoading1 = false
    },
    close() {
      this.formInline = {
        name: '',
        id: '',
        tag: []
      }
      this.$refs.dialog.close()
    }
  },
  created() {
  },
  mixins: [http]
}
</script>