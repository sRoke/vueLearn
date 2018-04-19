<!-- 

    商品销售报表

 -->
<template>
  <bu-view :config="configData">
    <selector></selector> 
      <form-nav :list="navList"></form-nav>
      <report-table-change :data="tableData"></report-table-change>
  </bu-view>
</template>     
<style scoped>

</style>
<script>
    import buView from '../../components/bu-view.vue'
    import formNav from './components/form-nav.vue'
    import reportTableChange from './components/report-table-change.vue'
    import selector from './components/selector-old.vue'
    import stream from '../../common/stream.js'
    import format from '../../common/format.js'
    import filters from '../../common/filters.js'
    export default {
        data() {
            return {
                // 页面配置
                configData:{
                    theme:'dark',
                    title: '销售趋势报表',
                    titleAlgin: 'left',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                // 导航栏
                navList: [{
                  title:'销售额',
                  theme:'purple',
                  value:'10',
                },{
                  title:'利润',
                  theme:'orange',
                  value:'--',
                },{
                  title:'利润率',
                  theme:'blue',
                  value:'--',
                },{
                  title:'净销售额',
                  theme:'purple',
                  value:'3000.00',
                },{
                  title:'退货金额',
                  theme:'orange',
                  value:'100.00',
                }],
                tableData:{
                    td:[]
                }
            };
        },
        components:{
            buView,
            formNav,
            selector,
            reportTableChange
        },
        mounted(){
          let end = format.day()
          let start = format.day(-29) 
          this.getData(start , end)
        },
        computed:{

        },
        methods:{
            getData(start , end){
              this.configData.pageRender = true
              stream.fetch({
                method:'GET',
                url:'/bee/order/new/parent/salesReport' + '?START_DATE=' + start + '&END_DATE=' + end
              },res =>{
                let value = res.data
                let result = res.extraData
                value.forEach((ele,i) =>{
                  let obj = {
                    time: ele['ADD_DATETIME'] , price: filters.census(ele['SUM_PRICE']) , return : filters.census(ele['RETURN_SUM_PRICE']) , profits: filters.census(ele['PROFITS_PRICE']), margin: filters.census(ele['PROFITS_MARGIN']*100) + '%'
                  }
                  this.tableData.td.push(obj)
                })
                this.navList[0].value = filters.census(result['ORDER_ALL_SUM_PRICE'])
                this.navList[1].value = filters.census(result['PROFITS_ALL_PRICE'])
                this.navList[2].value = filters.census(result['PROFITS_ALL_MARGIN']) + '%'
                this.navList[3].value = filters.census(result['SALES_ALL_SUM_PRICE'])
                this.navList[4].value = filters.census(result['RETURN_ALL_SUM_PRICE'])
              },res=>{
                this.configData.pageRender = false
              })
            }
        },
    };
</script>