<template>
    <div class="page">
        <top-bar :title="title" :show="showTitle" :back="'1'" :close="'0'"></top-bar>
        <scroller class="scrol" show-scrollbar="false" loadmoreoffset="10" @loadmore="loading">
            <headerLeft :title="title" @hidden="hidden"></headerLeft>
            <orderTabBar :list="tabList" :index="index" @change="tabChange"></orderTabBar>
            <orderCard :list="tabList[index].list" @jump="jump"></orderCard>
        </scroller>
        <renderTip :render="render"></renderTip>
    </div>
</template>     
<style scoped>
   .page{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
   }
   .scrol{
    position: absolute;
    top: 78px;
    bottom: 0px;
    left: 0px;
    width: 750px;
   }
</style>
<script>
    import headerLeft from '../../../../components/header-left.vue'
    import topBar from '../../../../components/top-bar.vue'
    import stream from '../../../../common/stream.js'
    import navigator from '../../../../common/navigator.js'
    import orderTabBar from '../../components/tab-bar.vue'
    import orderCard from '../../components/order-card.vue'
    import renderTip from '../../../../components/render-tip.vue'
    export default {
        data() {
            return {
                title: '订单确认',
                getClientApi:'/buyer/queryAll',
                getConfApi:'/bee/order/new/commonbill/queryAllForApp?PAGE_SIZE=20&ORDER_CHECK_COMMON_BILL.PROCESS_ID=',
                getProcessApi:'/bee/order/new/process/getAllCanUse',
                showTitle: false,
                render: false,
                processId:'',
                tabList:[{
                    name:'待确认',
                    state:'WAIT',
                    list: [],
                    pn: 1
                },{
                    name:'已通过',
                    state: 'DONE',
                    list: [],
                    pn: 1
                },{
                    name:'已作废',
                    state:'CANCEL',
                    list: [],
                    pn: 1
                }],
                index: 0,
            };
        },
        components:{
            headerLeft,
            topBar,
            orderTabBar,
            orderCard,
            renderTip
        },
        mounted(){
          this.getProcess().then(res=>{
            this.getData(this.index , this.tabList[this.index].pn)
          }).catch(res=>{ 
            this.render = false
          })
        },
        computed:{

        },
        methods:{
            // 滚动头部显示
            hidden(ret){
                this.showTitle = ret
            },
            getData(index,pn){
              let query = this.getConfApi + '&PN=' + pn + '&ORDER_CHECK_COMMON_BILL.STATE=' + this.tabList[index].state
              pn == 1 ? (this.render = true) : ''
              stream.fetch({
                method:'GET',
                url: query
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      img:ele['ORDER_CHECK_COMMON_BILL.PRODUCT_IMG'],
                      name: ele['ORDER_CHECK_COMMON_BILL.USER_NAME'],
                      code: ele['ORDER_CHECK_COMMON_BILL.ORDER_CODE'],
                      money: ele['ORDER_CHECK_COMMON_BILL.SUM_OVER_PRICE'],
                      class: ele['ORDER_CHECK_COMMON_BILL.SKU_COUNT'],
                      count: ele['ORDER_CHECK_COMMON_BILL.BUY_COUNT'],
                      id: ele['ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID']
                    })
                  })
                  this.tabList[index].list = this.tabList[index].list.concat(arr)                
              },res=>{
                this.render = false
              })
            },
            tabChange(index){
              this.index = index
              if(this.tabList[index].list.length == 0){
                this.getData(index,this.tabList[index].pn)
              }          
            },
            getProcess(){
              return new Promise((resolve ,reject) =>{
                stream.fetch({
                  method:'GET',
                  url: this.getProcessApi
                },res=>{
                  let data = res.data
                  data.forEach(ele =>{
                    if(ele['ORDER_PROCESS.TYPE'] === 'PROCESS_CONFIRM'){
                      this.getConfApi += ele['ORDER_PROCESS.ORDER_PROCESS_ID']
                      resolve('over')
                      return
                    }
                  })
                },res=>{
                  if(!res.ok || res.data.code != 0){
                    reject('over')
                  }                
                })
              })              
            },
            loading(){
              this.tabList[this.index].pn ++ 
              this.getData(this.index,this.tabList[this.index].pn)
            },
            jump(id){
                navigator.push({
                    url:'/modules/orderSection/orderProcess/orderConf/order-detail',
                    query:'?id=' + id
                })
            }
        },
    };
</script>