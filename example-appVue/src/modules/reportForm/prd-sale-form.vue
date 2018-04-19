<!-- 

    商品销售报表

 -->
<template>
  <bu-view :config="configData">
      <selector @event="renderData">
        <form-nav :list="navList"></form-nav>
        <report-table :data="tableData"></report-table>
      </selector>
  </bu-view>
</template>     
<script>
    import buView from '../../components/bu-view.vue'
    import formNav from './components/form-nav.vue'
    import reportTable from './components/report-table.vue'
    import selector from './components/selector.vue'
    import stream from '../../common/stream.js'
    import filters from '../../common/filters.js'
    export default {
        data() {
            return {
                // 页面配置
                configData:{
                    theme:'dark',
                    title: '商品销售报表',
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
                  value:'0',
                },{
                  title:'利润',
                  theme:'orange',
                  value:'0',
                },{
                  title:'利润率',
                  theme:'blue',
                  value:'0',
                },{
                  title:'净销售额',
                  theme:'purple',
                  value:'0',
                },{
                  title:'退货金额',
                  theme:'orange',
                  value:'0',
                }],
                tableData:[{
                  title: '商品名称',
                  value: []
                },{
                  title: '销售额',
                  value: []
                },{
                  title: '利润率',
                  value: []
                },{
                  title: '利润',
                  value: []
                },{
                  title: '退货金额',
                  value: []
                }]     
            };
        },
        components:{
            buView,
            formNav,
            selector,
            reportTable
        },
        mounted(){

        },
        computed:{

        },
        methods:{
            renderData(start , end){
              this.getData(start , end)
              this.getReport(start , end)
            },
            getData(start , end){
              this.configData.pageRender = true
              stream.fetch({
                method:'GET',
                url:'/bee/order/new/settlement/bill/getPrdAnlysisReport' + '?TYPE=SKU' + '&ORDER_FLAG=SETTLEMENT' + '&START_DATETIME=' + start + '&END_DATETIME=' + end
              },res =>{
                let value = res.data
                let arr1 = [] 
                let arr2 = []
                let arr3 = []
                let arr4 = []
                let arr5 = []
                value.forEach(ele =>{ 
                  arr1.push(ele['ORDER_SETTLEMENT_BILL_DETAIL.PRD_NAME'])
                  arr2.push(filters.census(ele['MONEY']))
                  arr3.push(filters.census((ele['MONEY'] - ele['COSTMONEY'])/ele['MONEY']* 100) + '%')
                  arr4.push(filters.census(ele['MONEY'] - ele['COSTMONEY']))
                  arr5.push(filters.census(ele['RETURNMONEY']))
                })
                this.tableData[0].value = arr1
                this.tableData[1].value = arr2
                this.tableData[2].value = arr3
                this.tableData[3].value = arr4
                this.tableData[4].value = arr5
              },res=>{
                this.configData.pageRender = false
              })
            },
            getReport(start , end){
              stream.fetch({
                method:'GET',
                url:'/bee/order/new/settlement/bill/getPrdAnlysisRegion' + '?TYPE=SKU' + '&ORDER_FLAG=SETTLEMENT' + '&START_DATETIME=' + start + '&END_DATETIME=' + end
              },res =>{
                let value = res.data[0]
                this.navList[0].value = filters.census(value.MONEY)
                this.navList[1].value = filters.census(value.MONEY - value.COSTMONEY)
                this.navList[2].value = filters.census((value.MONEY - value.COSTMONEY) / value.MONEY * 100) + '%'
                this.navList[3].value = filters.census(value.MONEY - value.RETURNMONEY)
                this.navList[4].value = filters.census(value.RETURNMONEY)
              },res=>{

              })
            }
        },
    };
</script>