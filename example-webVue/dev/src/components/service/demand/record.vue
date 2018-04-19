<template>
  <el-dialog ref="dialog" custom-class="bg-wh w-750" title="匹配记录">
    <div class="service-table" v-show="type == 0">
      <div class="finance-title fl m-r-10">外观设计</div>
      <el-table
      :data="outService"
      height="400"
      class="w-640 fl tx-c">
        <el-table-column
        prop="u_name"
        label="服务商" width="240">
        </el-table-column>
        <el-table-column
        label="标签" width="240">
          <template scope="scope">
            <span v-for="item in scope.row.label" class="detail-label bor-ra-5">{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column
        prop="status_attr"
        label="状态" width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          width="80">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="true">
              {{scope.row.handle}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearn"></div>
    </div>
    <div class="service-table m-t-20" v-show="type == 1">
      <div class="finance-title fl m-r-10">内部结构</div>
      <el-table
      :data="inService"
      height="400"
      class="w-640 fl tx-c">
        <el-table-column
        prop="u_name"
        label="服务商" width="240">
        </el-table-column>
        <el-table-column
        label="标签" width="240">
          <template scope="scope">
            <span v-for="item in scope.row.label" class="detail-label bor-ra-5">{{item}}</span>
          </template>
        </el-table-column>
        <el-table-column
        prop="status_attr"
        label="状态" width="80">
        </el-table-column>
        <el-table-column
          label="操作"
          width="80">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="true">
              {{scope.row.handle}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearn"></div>
    </div>
  </el-dialog>
</template>
<style>
  .w-640 {
    width: 640px;
  }
  .w-750 {
    width: 750px;
  }
  .clearn {
    clear: both;
  }
</style>
<script>
  import http from '../../../assets/js/http'

  export default {
    props: ['type'],
    data() {
      return {
        outService: [],
        inService: [],
        id: null
      }
    },
    methods: {
      open() {
        this.$refs.dialog.open()
      },
      close() {
        this.$refs.dialog.close()
      },
      getRecord() {
        this.apiGet('requires/' + this.id + '/services').then((res) => {
          if (res.code == 200) {
            this.outService = _(res.data.out).forEach((val, key) => {
              switch (val.status) {
                case 10:
                  val.handle = '删除'
                  break
                case 20:
                  val.handle = '删除'
                  break
                case 30:
                  val.handle = '确认匹配'
                  break
                default:
                  val.handle = '--'
                  break
              }
            })
            if (res.data.in.length > 0) {
              this.inService = _(res.data.in).forEach((val, key) => {
                switch (val.status) {
                  case 10:
                    val.handle = '删除'
                    break
                  case 20:
                    val.handle = '删除'
                    break
                  case 30:
                    val.handle = '确认匹配'
                    break
                  default:
                    val.handle = '--'
                }
              })
            }
          } else {
            _g.dealError(this, res)
          }
        })
      }
    },
    created() {
      this.id = this.$route.params.id
      this.getRecord()
    },
    mixins: [http]
  }
</script>