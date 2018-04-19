<template>
  <div id='honorList'>
    <el-dialog ref="dialog" custom-class="w-500 h-700" title='选择勋章'>
      <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            width="55">
            <template scope="scope">
              <el-checkbox v-model="scope.row.selected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="勋章名称"
            width="278">
          </el-table-column>
          <el-table-column
            label="图标"
            width="125">
            <template scope="scope"><img :src="scope.row.url"></template>
          </el-table-column>
      </el-table>
      <div class='m-t-20'>
        <el-button class="fr m-r-20" @click="close()">取消</el-button>
        <el-button type="primary" class="fr m-r-30" :disabled="disable" @click="submit()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style type="text/css">
  #honorList .page-part{
    margin-top: 10px;
  }
  #honorList .cell img{
    margin-top: 5px;
    margin-bottom: -3px;
  }
</style>

<script>
  import honorList from '../../../assets/js/honorList'
  import Vue from 'vue'
export default{
    props: ['info'],
    data() {
      return {
        h1: require('../../../assets/images/honor_icon/h1.png'),
        h2: require('../../../assets/images/honor_icon/h2.png'),
        h3: require('../../../assets/images/honor_icon/h3.png'),
        h4: require('../../../assets/images/honor_icon/h4.png'),
        h5: require('../../../assets/images/honor_icon/h5.png'),
        h6: require('../../../assets/images/honor_icon/h6.png'),
        h7: require('../../../assets/images/honor_icon/h7.png'),
        h8: require('../../../assets/images/honor_icon/h8.png'),
        multipleSelection: [], // 勾选中的数据
        tableData: honorList
      }
    },
    methods: {
      open() {
        this.$refs.dialog.open()
        this.sorttableData() // 把数组里的selected都设为false
        this.settableData()  // 根据info，把对应的数据的selected设为true
      },
      sorttableData() {
        _(this.tableData).forEach((res, key) => {
          res.selected = false
        })
      },
      settableData() {
        _(this.tableData).forEach((res, key) => {
          _(this.info).forEach((hres, hkey) => {
            if (res.id == hres.id) {
              res.selected = true
              return
            }
          })
        })
      },
      close() {
        this.$refs.dialog.close()
      },
      submit() {
        let newInfo = []
        _(this.tableData).forEach((res, key) => {
          if (res.selected) {
            let index = _.findIndex(this.tableData, {
              id: parseInt(res.id)
            })
            newInfo.push({ id: res.id, name: res.title, val: res.val, path: this['h' + res.id] })
          }
        })
        this.$parent.updateHonor(newInfo)
        console.log(this.$parent)
        console.log(this.$parent)
        this.$refs.dialog.close()
      }
    },
    created() {
      var that = this
      _(honorList).forEach((res, key) => {
        res.url = that[res.tag]
      })
      that.tableData = honorList
    }
}
</script>