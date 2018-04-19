<template>
  <div id='editLabel'>
    <el-dialog ref="dialog" custom-class="w-1000" :title='title'>
      <el-row>
        <el-col>
          <div class="fl edit_label_list">
            <div class="bor-ra-5 edit_label fl" v-for="(la, index) in selectTag">{{la.label_name}}<i class="el-icon-circle-close m-l-5" @click="del(la, index)"></i></div>
          </div>
        </el-col>
      </el-row>
      <el-row type='flex' justify='space-between'>
        <el-col>
          <el-row type='flex' justify='end'>
            <div class='m-l-10 w-300'>
              <el-input v-model="searchVal " placeholder="请输入产品类型或标签搜索">
                <el-button slot="append" icon="search" @click="getLabel()"></el-button>
              </el-input>
            </div>
          </el-row>
        </el-col>
      </el-row>
      <el-row class='main-cont'>
        <div v-for='(section, se_index) in show_tags'>
          <el-row type='flex' justify='start'>
            <el-col :span='3' class='m-t-15 tx-r'>
              {{section.name}}:
            </el-col>
            <el-col>
              <div>
                <ul>
                  <li class='fl m-b-5' v-for='(tag, tag_index) in section.tag'>
                    <el-button
                    type="primary"
                    class='tag-block'
                    v-bind:class="{ tag_selected: tag.selected}"
                    size='small m-r-10'
                    @click='match(tag, se_index, tag_index)'>{{tag.name}}
                    </el-button>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-row>
      <div class="btn_group">
        <el-button class="fr m-r-20" @click="close()">取消</el-button>
        <el-button type="primary" class="fr m-r-30" @click="submit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style type="text/css">
  #editLabel .main-cont{
    height: 400px;
    margin: 10px 0px;
    overflow: hidden;
    overflow-y:auto;
  }
  #editLabel .tx-r{
    text-align: right;
  }
  #editLabel .tag_selected{
    background: #20a0ff !important;
  }
  #editLabel .del-icon{
    position: absolute;
      top: -5px;
  }
  #editLabel .selectedArea{
    background: #f1f2f7;
    padding: 10px;

  }
  #editLabel .tag-block{
    background: #CCCCCC;
    border: 0px !important;
    color: #000;
  }
  #editLabel .w-1000 {
    height: 680px;
    top: 50% !important;
    margin-top: -340px;
    margin-bottom: 0 !important;
  }
  #editLabel .edit_label_list {
    width: 100%;
    background: #eeeeee;
    margin-bottom: 10px;
    max-height: 96px;
    overflow-y: auto;
  }
  #editLabel .edit_label {
    min-width: 60px;
    height: 18px;
    line-height: 18px;
    padding: 5px 8px;
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    background: #20a0ff;
    font-size: 14px;
  }
  #editLabel .btn_group{
    position: absolute;
    bottom: 15px;
    right: 20px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import tagClass from '../../../assets/js/class'
  import Vue from 'vue'
  export default {
    props: ['title', 'label'],
    data() {
      return {
        searchVal: '',
        show_tags: [],
        selectTag: []
      }
    },
    methods: {
      match(tag, se_index, tag_index) {
        let tagSel = false
        if (tag.selected) {
          tagSel = false
          tag.selected = false
        } else {
          tagSel = true
          tag.selected = true
        }
        if (tagSel) {
          this.selectTag.push({
            label_name: tag.name,
            label_id: tag.id,
            se_index: se_index,
            tag_index: tag_index
          })
        } else {
          let index = null
          _(this.selectTag).forEach((res, key) => {
            if (tag.id == res.label_id) {
              index = key
            }
          })
          if (index != null) {
            this.selectTag.splice(index, 1)
          }
        }
      },
      open() {
        this.searchVal = ''
        this.getLabel()
      },
      close() {
        this.$refs.dialog.close()
      },
      matchSel() {
        this.selectTag = this.label
        // console.log(this.label)
        _(this.show_tags).forEach((res, key) => {
          _(res.tag).forEach((tagRes, tagKey) => {
            if (this.selectTag.length > 0) {
              _(this.selectTag).forEach((sres, skey) => {
                if (sres.label_id == tagRes.id) {
                  tagRes.selected = true
                  Vue.set(this.show_tags[key]['tag'], tagKey, tagRes)
                  sres.tag_index = tagKey
                  sres.se_index = key
                }
              })
            }
          })
        })
        this.$refs.dialog.open()
      },
      del(tag, index) {
        this.show_tags[tag.se_index]['tag'][tag.tag_index].selected = false
        this.selectTag.splice(index, 1)
      },
      submit() {
        this.$parent.setLabel()
        this.$refs.dialog.close()
      },
      getLabel() {
        this.show_tags = []
        var data = {
          params: {
            keyword: this.searchVal
          }
        }
        this.apiGet('classification', data).then((resObj) => {
          if (resObj.code == 200) {
            if (resObj.data.length != 0) {
              this.show_tags = _(resObj.data).forEach((obj, key) => {
                _(obj.tag).forEach((val, i) => {
                  val.selected = false
                })
              })
            }
            this.matchSel()
          } else {
            _g.dealError(this, resObj)
          }
        })
      }
    },
    created() {
    },
    mounted() {
    },
    mixins: [http]
  }
</script>