<template>
	<div 
  id='labelLabel'
  v-loading.fullscreen.lock="fullscreenLoading">
 		<el-row>
			<div class='fr'>
        <!-- <el-select class='ver-top' v-model="cLassVal" placeholder="请选择" @change="search()">
            <el-option
              v-for="item in cLass"
              :label="item.title"
              :value="item.id">
            </el-option>
        </el-select> -->
				<el-input 
				class='w-300' 
				v-model="searchVal" 
				placeholder="输入可以搜索产品类型名称或标签">  
        <el-button slot="append" icon="search" @click="search()"></el-button>
        </el-input>
				</el-input>
        <el-button type="primary" @click='openDetail("add")'>添加类型</el-button>
			</div>
		</el-row>

		<el-row type='flex' justify='space-between' class='p-b-10'>
      <el-row class='w-100p'>
        <div v-for='(section,type_index) in show_tags'>
          <el-row type='flex' justify='start' class='m-t-5'>
            <el-col :span='3'>
              <div class='section' @click='openDetail("edit", section)'>{{section.name}}:</div>
            </el-col>
            <el-col style='margin:auto'>
              <el-tag class='m-r-10 m-b-5' v-for='(tag,tag_index) in section.tag'>{{tag.name}}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-row> 
    <classDetail ref='classDetail' :type='type' :stitle='smallTit' :btitle='bigTit' :detail='childData'></classDetail>
	</div>
</template>
<style type="text/css">
	.ver-top{
    vertical-align: top !important;
  }
  #labelLabel .section{
    text-align: right;
    margin-right: 10px;
    font-size: 14px;
    color: #4db3ff;
    cursor: pointer;
  }
  #labelLabel .hide{
    display: none;
  }
  #labelLabel .tag-block{
    position: relative;
    background: #CCCCCC;
    border: 0px !important;
    color: #000;
  }
  #labelLabel .tag-active{
    background:#20a0ff;
  }
  #labelLabel .label-type{
    width: 130px;
    text-align: right;
    margin-top: 17px;
  }
  #labelLabel .el-icon-circle-close{
    position: absolute;
    top: -4px;
    right: -5px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import classDetail from './classDetail.vue'
  import Vue from 'vue'

  export default {
    data() {
      return {
        fullscreenLoading: false,
        searchVal: '',  //   搜索框内容
        cLassVal: '',  //  类别id
        bigTit: '',
        smallTit: '',
        childData: {},
        cLass: [{ title: '全部', id: 0 }],
        tags: [],
        type: '',
        show_tags: [], //  显示的数据
        allTag: [],
        x: 0
      }
    },
    methods: {
      search() {  // 搜索框
        // console.log(this.cLassVal)
        this.init()
        // this.show_tags = []
        // this.searchVal = this.searchVal.trim('')
        // if (this.searchVal != '' && (this.cLassVal == '0' || this.cLassVal == '')) {
        //   let showTags = []
        //   _(this.tags).forEach((res, key) => {
        //     let showTagsItem = {}
        //     showTagsItem.id = this.cLassVal
        //     showTagsItem.name = res.name
        //     showTagsItem.tag = []

        //     _(res.tag).forEach((rres, rkey) => {
        //       if (rres.name.indexOf(this.searchVal) > -1) {
        //         showTagsItem.tag.push(rres)
        //       }
        //     })
        //     if (showTagsItem.tag.length != 0) {
        //       showTags.push(showTagsItem)
        //     }
        //   })
        //   this.show_tags = showTags
        // } else if (this.searchVal == '' && (this.cLassVal == '0' || this.cLassVal == '')) {
        //   this.show_tags = this.tags
        // } else {
        //   let showTags = []

        //   _(this.tags).forEach((res, key) => {
        //     if (this.cLassVal == res.id) {
        //       let showTagsItem = {}
        //       showTagsItem.id = this.cLassVal
        //       showTagsItem.name = res.name
        //       showTagsItem.tag = []
        //       _(res.tag).forEach((rres, rkey) => {
        //         if (rres.name.indexOf(this.searchVal) > -1) {
        //           showTagsItem.tag.push(rres)
        //         }
        //       })
        //       showTags.push(showTagsItem)
        //       this.show_tags = showTags
        //       return
        //     }
        //   })
        // }
      },
      openDetail(mode, data) {
        console.log(mode)
        console.log(data)
        // console.log(this.allTag[index1])
        if (mode == 'add') {
          this.childData = {}
          this.type = 'add-label'
        } else {
          var index1 = data.id
          console.log(data.id)
          console.log(this.allTag)
          if (this.allTag.length != 0) {
            // console.log('选择了的')
            console.log(this.allTag)
            this.childData = this.allTag[index1]
          } else {
            // console.log('没选择的')
            this.childData = data
          }
          // console.log(this.childData)
          this.type = 'edit-label'
        }
        this.bigTit = '类型'
        this.smallTit = '标签'
        // console.log(this.childData)
        console.log(this.childData)
        this.$refs.classDetail.open()
        console.log('父没问题')
      },
      hasType(type) {
        // 判断类型名称是否存在
        var has = false
        _(this.tags).forEach((res, key) => {
          if (res.name.trim('') == type) {
            has = true
            return
          }
        })
        return has
      },
      save(type, detail) {
        if (type == 'edit-label') {
          var param = {
            id: detail.id,
            name: detail.name.trim(''),
            tag: detail.tag
          }
          var isSame = true
          if (this.childData.name != detail.name.trim('')) {
            isSame = false
          }
          if (this.hasType(detail.name.trim('')) && !isSame) {
            _g.toastMsg(this, 'warning', '类型名称已存在')
            console.log('编辑')
            this.$refs.classDetail.isLoading = false
            console.log(this.$children.isLoading + '父')
          } else {
            this.apiPut('classification/', param.id, param).then((resObj) => {
              if (resObj.code == 200) {
                this.x = 0
                // console.log(this.x)
                this.init()
                // this.$refs.classDetail.close()
                this.$refs.classDetail.close()
              } else {
                _g.dealError(this, resObj)
              }
            })
          }
        } else {
          var tag = []
          _(detail.tag).forEach((res, key) => {
            tag.push(res.name.trim(''))
          })
          if (this.hasType(detail.name.trim(''))) {
            _g.toastMsg(this, 'warning', '类型名称已存在')
            console.log('添加')
            this.$refs.classDetail.isLoading = false
            console.log(this.$children.isLoading + '父')
          } else {
            this.apiPost('classification', {
              name: detail.name.trim(''),
              tag: tag
            }).then((resObj) => {
              if (resObj.code == 200) {
                this.searchVal = null
                this.x = 0
                this.init()
                this.$refs.classDetail.close()
              } else {
                _g.dealError(this, resObj)
              }
            })
          }
        }
      },
      delete() {
        this.init()
        // var show_tag_index = _.findLastIndex(this.show_tags, {
        //   name: this.childData.name
        // })
        // console.log(show_tag_index)
        // this.show_tags.splice(show_tag_index, 1)
        // var tag_index = _.findLastIndex(this.tags, {
        //   name: this.childData.name
        // })
        // this.tags.splice(tag_index, 1)
      },
      init() {
        // console.log(this.x)
        this.x ++
        // console.log(this.x)
        // console.log(this.x)
        let that = this
        this.fullscreenLoading = true
        // var data = {
        //   param: {
        //     keyword: this.searchVal,
        //     id: id
        //   }
        // }
        // console.log(data)
        var data = {
          params: {
            keyword: this.searchVal
          }
        }
        this.apiGet('classification', data).then((resObj) => {
          this.fullscreenLoading = false
          if (resObj.code == 200) {
            if (resObj.data.length != 0) {
              // console.log(resObj)
              // console.log(this.tags)
              if (this.x == 1) {
                console.log(this.x)
                this.allTag = resObj.data
                // console.log(this.allTag)
              }
              this.tags = this.show_tags = resObj.data
              this.tags = _g.s2j(_g.j2s(this.tags))
              this.show_tags = _g.s2j(_g.j2s(this.show_tags))
              _(this.show_tags).forEach((res, key) => {
                this.cLass.push({ title: res.name, id: res.id })
              })
            } else {
              this.tags = this.show_tags = []
            }
          } else {
            _g.dealError(this, resObj)
          }
        })
      }
    },
    created() {
      this.init()
    },
    components: {
      classDetail
    },
    mixins: [http]
  }
</script>