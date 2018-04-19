<template>
  <el-dialog ref="dialog"
             title="选择分类"
             class="category-dialog"
             v-model="dialogVisible">
  
    <el-form ref="form"
             :rules="rules"
             label-position="top"
             :model="categoryForm">
  
      <el-form-item prop="first"
                    :required="true"
                    class="category first"
                    label-width="100px">
        <el-radio-group v-model="selectedFirst">
          <el-radio v-for="item in firstLevels"
                    :label="item.id">
            {{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
  
      <transition name="slide-fade">
        <el-form-item prop="second"
                      v-if="showSecond"
                      label-width="100px"
                      class="category second">
          <el-checkbox-group v-model="selectedSecond">
            <el-checkbox v-for="item in secondLevels"
                         :label="item.id">
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </transition>
  
      <transition name="slide-fade">
        <el-form-item v-if="showThird"
                      class="category third">
          <div prop="third"
               class="third-wrapper"
               style="width:460px;"
               v-for="third in thirdLevels"
               label-width="100px">
            <p>{{ third.name }}</p>
            <el-checkbox-group v-model="selectedThird">
              <el-checkbox v-for="item in third.child"
                           :label="item.id">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </transition>
  
    </el-form>
  
    <div slot="footer"
         class="dialog-footer selected-row"
         style="clear:both;">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary"
                 v-if="addMode"
                 @click="submit()">添加</el-button>
      <el-button type="primary"
                 v-else
                 @click="submit()">保存</el-button>
    </div>
  </el-dialog>
</template>

<style>
.staff-dialog .el-dialog {
  min-width: 760px;
}

.el-dialog__wrapper.category-dialog .el-form-item__label {
  margin-right: 0 !important;
}

.category .el-radio+.el-radio {
  margin-left: 0;
}

.category.second .el-checkbox,
.category.first .el-radio {
  margin-left: 0;
}

.category.second .el-checkbox:not(:last-child),
.category.first .el-radio:not(:last-child) {
  border-bottom: 1px solid #eeeeee;
}

.category.third .el-checkbox {
  margin-left: 0px;
  margin-right: 15px;
}

.category {
  float: left;
  padding: 0 15px;
  border: 1px solid #eeeeee;
}

.category .el-form-item__label {
  text-align: center;
}

.category.first,
.category.second {
  margin-right: 5px;
}

.category.second {
  width: 200px;
}

.category.third .third-wrapper:not(:last-child) {
  border-bottom: 1px solid #eeeeee;
}

.category.first .el-radio {
  display: block;
  padding: 8px 15px;
}

.category.second .el-checkbox {
  display: block;
}
</style>

<script>
/**
 * ---------------- Usage ----------------

  <category ref="DOM的key"
            v-if="visible:对话框是否可见(bool)"
            :type="添加或编辑模式(string:'add' or 'edit')"
            :handleSubmit="处理添加:function(category)"
            :handleEdit="处理编辑:function(category)"
            :sourceData="源数据:object(树形结构)">
  </category>

  1.将visible设置为true进行渲染
  2.通过nextTick调用ref的fetchData方法

 * ---------------- Usage ----------------
 * **/
import options from 'assets/json/category-option.json'
import http from 'assets/js/http'
import _ from 'lodash'
export default {
  props: ['sourceData', 'type', 'handleSubmit', 'handleEdit'],
  data() {
    return {
      dialogVisible: false,
      selectedFirst: null,
      selectedSecond: [],
      selectedThird: [],
      firstLevels: [],
      secondLevels: [],
      thirdLevels: [],
      categoryForm: {
        first: null,
        second: [],
        third: []
      },
      results: {},
      rules: {
        // first: [
        //   { required: true, message: '请选择一个一级类目' }
        // ],
        // second: [
        //   { type: 'array', required: false }
        // ],
        // third: [
        //   { type: 'array', required: false }
        // ]
      }
    }
  },
  watch: {
    selectedFirst(val) {
      this.selectFirst(val)
    },
    selectedSecond(val) {
      this.selectSecond(val)
    },
    selectedThird(val) {
      this.selectThird(val)
    }
  },
  methods: {
    render() { // 请求营业品类数据并渲染组件
      this.apiGet('types-products-words').then(res => {
        this.firstLevels = res.data
        this.open()
      })
    },
    selectFirst(val) { // 设置一级类目
      this.selectedFirst = val
      this.selectedSecond = []
      this.selectedThird = []
      this.secondLevels = []
      let second = _.find(this.firstLevels, { id: val })
      if (!second) {
        return
      }
      this.secondLevels.push(...second.child)
      this.results = {
        id: val,
        name: _.find(this.firstLevels, { id: val }).name,
        child: []
      }
      if (this.editMode) {
        this.selectedSecond = _.map(this.sourceData.child, 'id') || []
      }
    },
    selectSecond(secondList) { // 设置二级类目
      this.thirdLevels.splice(0, this.thirdLevels.length)
      this.$set(this.results, 'child', [])
      this.secondLevels.forEach(item => {
        if (_.includes(secondList, item.id)) {
          this.results.child.push({
            id: item.id,
            name: item.name,
            child: []
          })
          this.thirdLevels.push(item)
        }
      })
      if (this.editMode) {
        this.sourceData.child.map(item => {
          let arr = _.map(item.child, 'id') || []
          this.selectedThird.push(...arr)
        })
      }
    },
    selectThird(val) { // 设置三级类目
      let number = 0
      let checkIndexArr = []
      if (!this.results || this.results.child.length === 0) { // 没有已选，返回
        return
      }
      if (val.length === 0) { // 没有选择任何三级类别时，清空二级下的child
        this.results.child.forEach(item => {
          item.child = []
        })
        return
      }
      val.forEach(tid => {
        let needReset = !(_.includes(checkIndexArr, number))
        if (needReset) {
          this.results.child[number].child = []
        }
        this.thirdLevels.forEach((third, index) => {
          if (!(_.includes(checkIndexArr, index))) { // 首次进行列表重置
            checkIndexArr.push(index)
            this.results.child[index].child = []
          }
          let arr = _.map(third.child, 'id')
          if (_.includes(arr, tid)) {
            let category = _.find(third.child, { id: tid })
            this.results.child[index].child.push(category)
          }
        })
      })
      if (val.length > 0) { // 没有选择任何三级类别时，清空二级下的child
        this.results.child.forEach(item => {
          item.child = _.unionBy(item.child, 'id')
        })
      }
    },
    resetSelect() { // 重置所有已选择数据
      this.selectedFirst = null
      this.selectedSecond = []
      this.selectedThird = []
      this.results = {}
    },
    open() { // 打开模态框
      this.resetSelect()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.selectedFirst = this.sourceData.id || null
      })
    },
    destory() {
      this.$refs.dialog.close()
    },
    submit() { // 确定
      this.addMode ? this.handleSubmit({ ...this.results }) : null
      this.editMode ? this.handleEdit({ ...this.results }) : null
    },
    getCurrent() { // 获取当前的结果
      return this.results
    }
  },
  computed: {
    addMode() {
      return this.type === 'add'
    },
    editMode() {
      return this.type === 'edit'
    },
    showSecond() { // 是否显示二级类目
      return this.secondLevels.length > 0
    },
    showThird() { // 是否显示三级类目
      return this.thirdLevels.length > 0
    }
  },
  mixins: [http]
}
</script>