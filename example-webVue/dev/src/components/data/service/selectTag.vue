<template>
	<div id='selectTag'>
		<el-dialog ref="dialog" custom-class="w-1000 h-700" :title='title'>
			<el-row class='selectedArea'>
				<el-col :span='3'>已关联标签：</el-col>
				<el-col>
          <el-row type='flex' justify='start' class='h-overflow'>
            <ul>
              <li class='fl m-b-5' v-for='(tag,index) in show_info'>
                <div 
                class='pos-rel tag_selected bbn'
                >
                <i class="el-icon-circle-close" @click.stop='removeTag(tag,index)'></i>{{tag.label_name}}
                </div>
              </li>
            </ul>
          </el-row>
				</el-col>
			</el-row>
			<el-row type='flex' justify='space-between' class='m-t-10'>
				<el-col>
					<el-row type='flex' justify='end'>
						<div>
							<el-select v-model="cLassVal" placeholder="请选择" @change="search()">
							    <el-option
							      v-for="item in cLass"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							</el-select>
						</div>
						<div class='m-l-10 w-300'>
							<el-input v-model="searchVal " placeholder="请输入内容搜索">
								<el-button slot="append" icon="search" @click="search()"></el-button>
							</el-input>
						</div>
					</el-row>
					
				</el-col>
			</el-row>
			<el-row class='main-cont'>
				<div v-for='section in show_tags'>
					<el-row type='flex' justify='start'>
						<el-col :span='3' class='m-t-10'>
							{{section.name}}:
						</el-col>
						<el-col id="el_1">
							<div v-for='tag in section.tag'>
								<ul>
									<li class='fl m-b-5'>
                    <el-button 
                    type="primary"
                    class='tag-block' 
                    v-bind:class="{ tag_selected: tag.selected}"
                    size='small m-r-10'
                    @click='match(tag , section.name)'>
                    {{tag.name}}</el-button>
                  </li>
								</ul>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-row>
		    <div>
		      <el-button class="fr m-r-20" @click="close()">取消</el-button>
		      <el-button type="primary" class="fr m-r-30" :disabled="disable" @click="submit()">提交</el-button>
		    </div>
	  </el-dialog>
	</div>
</template>
<style type="text/css">
.bbn{
  width: 100px;
  height: 32px;
  margin-right: 10px;
  background-color: #20A0ff;
  text-align: center;
  line-height: 32px;
  font-size: 12px;
}
#el_1{
  width: 85%
}
  #selectTag .el-button{
    color: #000;
  }
  #selectTag .h-overflow{
    max-height: 90px;
    overflow-y: auto;
  }
  #selectTag .main-cont{
    height: 390px;
    margin: 10px 0px;
    overflow: hidden;
    overflow-y:auto;
  }
  #selectTag .tag_selected{
    background: #20a0ff !important;
  }
	#selectTag .el-icon-circle-close{
              color: #000;
		position: absolute;
		top: -4px;
		right: -5px;
              cursor: pointer;
	}
	#selectTag .selectedArea{
		background: #f1f2f7;
		padding: 10px;

	}
	#selectTag .tag-block{
		background: #CCCCCC;
		border: 0px !important;
		/*color: #000;*/
	}
</style>
<script>
import http from '../../../assets/js/http'
import tagClass from '../../../assets/js/class'
import Vue from 'vue'
export default {
  props: ['info', 'title'],
  data() {
    return {
      show_info: [],
      searchVal: '',
      cLassVal: '',
      cLass: [],
      show_tags: [],
      tags_backup: [], // 对第一次获得的所有标签进行备份，不参与操作
      service_edit: false
    }
  },
  watch: {
    // show_info(newVal, oldVal) {
    //   this.sort_backup()
    //   this.sortTag(this.tags_backup)
    // }
  },
  methods: {
    search() {
      var data = {
        params: {
          id: this.cLassVal,
          keyword: this.searchVal
        }
      }
      this.apiGet('classification', data).then((resObj) => {
        if (resObj.code == 200) {
          if (resObj.data.length != 0) {
            this.tags_backup = JSON.stringify(resObj.data)
            this.tags_backup = JSON.parse(this.tags_backup)
            this.show_tags = JSON.stringify(resObj.data)
            this.show_tags = JSON.parse(this.show_tags)
            _(this.show_info).forEach((res, key) => {
              _(this.show_tags).forEach((rres, rkey) => {
                _(rres.tag).forEach((tag, rkey) => {
                  if (tag.id == res.id) {
                    tag.selected = true
                    return
                  }
                })
              })
            })
          } else {
            this.show_tags = this.tags_backup = []
          }
        } else {
          _g.dealError(this, resObj)
        }
      })
    },
    open() {
      this.$refs.dialog.open()
      console.log(this.title)
      this.show_info = JSON.stringify(this.info)
      this.show_info = JSON.parse(this.show_info)
      this.searchVal = ''
      this.cLassVal = ''
      this.sort_backup()
      this.sortTag(this.tags_backup)
    },
    close() {
      this.$refs.dialog.close()
    },
    submit() {
      this.$refs.dialog.close()
      this.$parent.updateTag(this.show_info)
    },
    removeTag(item, index) {
      this.$confirm('即将移除' + item.label_name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.show_info.splice(index, 1)
        // this.show_selectTag = this.selectTag = this.show_info
        _(this.show_tags).forEach((rres, rkey) => {
          _(rres.tag).forEach((tag, rkey) => {
            if (tag.id == item.id) {
              tag.selected = false
              return
            }
          })
        })
      }).catch(() => {
        _g.toastMsg(this, 'info', '已取消删除')
      })
    },
    match(tag, typeName) {   // 标签是否选中
      console.log(tag)
      console.log(typeName)
      console.log(this.show_tags)
      // let typeIndex = _.findIndex(this.show_tags, {
      //   name: typeName
      // })
      // var typeIndex = null
      // var tagIndex = null
      // this.show_tags.tag.forEach((item, index) => {
      //   if (item.id == tag.id) {
      //     typeIndex = i
      //     console.log(typeIndex)
      //   }
      // })
      // console.log(typeIndex)
      // console.log(this.show_tags[typeIndex])
      // let tagIndex = _.findIndex(this.show_tags.typeIndex['tag'], {
      //   id: tag.id
      // })
      // console.log(tagIndex)
      // console.log(tagIndex)
      // let tagIndex = tags.id
      // for (var x = 0; i < this.show_tags.typeIndex.tag.length; x++) {
      //   if (this.show_tags.typeIndex.tag[x].id == tag.id) {
      //     tagIndex = x
      //   }
      // }
      if (!tag.selected) {
        tag.label_name = tag.name
        this.show_info.push(tag)
        // Vue.set(this['show_tags'][typeIndex]['tag'][tagIndex], 'selected', true)
        tag.selected = true
      } else {
        // 删除
        let delTagIndex = _.findIndex(this.show_info, {
          id: tag.id
        })
        this.show_info.splice(delTagIndex, 1)
        // Vue.set(this['show_tags'][typeIndex]['tag'][tagIndex], 'selected', false)
        tag.selected = false
      }
    },
    sortTag(tagData) {
      this.show_selectTag = this.selectTag = this.show_info
      // 根据labelClass.vue传过来的数据，让选定的标签高亮
      var _tagData = tagData
      this.show_tags = this.tags = []
      if (this.show_selectTag.length > 0) {
        if (this.cLassVal != 0) {
          var showData = []
          _(_tagData).forEach((res, key) => {
            if (res.type == this.cLassVal) {
              showData.push({
                tag: res.tag,
                id: res.id,
                name: res.name
              })
              _(showData).forEach((tagRes, tagKey) => {
                _(tagRes.tag).forEach((arrRes, skey) => {
                  _(this.show_selectTag).forEach((sres, skey) => {
                    if (sres.id == arrRes.id) {
                      arrRes.selected = true
                      return
                    }
                  })
                })
              })
              this.show_tags = this.tags = showData
              return
            }
          })
        } else {
          _(_tagData).forEach((res, key) => {
            _(res.tag).forEach((tagRes, tagKey) => {
              _(this.show_selectTag).forEach((sres, skey) => {
                if (sres.id == tagRes.id) {
                  tagRes.selected = true
                  return
                }
                Vue.set(tagData[key]['tag'], tagKey, tagRes)
              })
            })
          })
          this.show_tags = this.tags = _tagData
        }
      } else {
        this.show_tags = this.tags = this.tags_backup
      }
    },
    sort_backup() {
      _(this.tags_backup).forEach((res, key) => {
        // console.log(JSON.stringify(res))
        // res.name = tagClass[res['type']]['name']
        _(res.tag).forEach((tagRes, tagKey) => {
          tagRes.selected = false
        })
      })
    }
  },
  created() {
    if (Lockr.get('authList')) {
      if (Lockr.get('authList')['service_edit']) {
        this.service_edit = true
      }
    } else {
      this.service_edit = true
    }
    if (this.service_edit) {
      this.apiGet('classification').then((resObj) => {
        if (resObj.code == 200) {
          if (resObj.data.length != 0) {
            this.tags_backup = resObj.data

            this.cLass = JSON.stringify(resObj.data)
            this.cLass = JSON.parse(this.cLass)
            this.cLass.unshift({ id: '', name: '全部', tag: [] })
          }
        } else {
          _g.dealError(this, resObj)
        }
      })
    }
  },
  mixins: [http]
}
</script>