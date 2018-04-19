<template>
  <bu-view :config="configData" @event="viewEvent">
      <orderSearch></orderSearch>
      <orderTabBar :list="tabList" :index="index" @change="tabChange"></orderTabBar>
      <list-card :list="tabList[index].list" @jump="jump"></list-card>
  </bu-view>
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
    import buView from '../../../../components/bu-view.vue'
    import stream from '../../../../common/stream.js'
    import navigator from '../../../../common/navigator.js'
    import orderTabBar from '../../components/tab-bar.vue'
    import listCard from './components/list-card.vue'
    import orderSearch from '../../components/order-search.vue'
    const storage = weex.requireModule('storage')
    const scanEvent = weex.requireModule('scanEvent')
    const globalEvent = weex.requireModule('globalEvent')
    export default {
        data() {
            return {
                configData:{
                    title: '订单核销',
                    titleAlgin: 'left',
                    bottom: '0',
                    scanEvent:'scanEvent',
                    pageRender: false,
                    refresh:true,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'refresh'
                },
                getWaitApi:'/bee/order/new/waitdelivergoods/bill/queryAllForApp?PAGE_SIZE=20&ORDER_WAIT_DELIVER_GOODS_BILL.STATE=WAIT',
                getDoneApi:'/bee/order/new/settlement/bill/queryAllForAfterVerification?PAGE_SIZE=20',
                processId:'',
                tabList:[{
                    name:'未核销',
                    list: [],
                    pn: 1
                },{
                    name:'已核销',
                    list: [],
                    pn: 1
                }],
                index: 0,
            };
        },
        components:{
            buView,
            orderTabBar,
            listCard,
            orderSearch
        },
        mounted(){
            this.configData.pageRender = true
            this.getData(this.index , this.tabList[this.index].pn).then(()=>{
              this.configData.pageRender = false
            })
            if(typeof(globalEvent.addEventListener) == "function"){
                globalEvent.addEventListener("globalScan", val => {

                  this.scanResponse(val.scanInfo)
 
                });
            }
        },
        computed:{

        },
        methods:{
            viewEvent(name , call){
              this[name](call)
            },
            getData(index,pn){
              return new Promise((resolve , reject) =>{
                let query = (index == 0 ? this.getWaitApi : this.getDoneApi) + '&PN=' + pn 
                stream.fetch({
                  method:'GET',
                  url: query
                },res=>{
                    let val = res.data
                    let arr = []
                    val.forEach(ele =>{
                      if(index == 0){
                        arr.push({
                          name: ele['ORDER_WAIT_DELIVER_GOODS_BILL.USER_NAME'],
                          code: ele['ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_CODE'],
                          money: ele['ORDER_WAIT_DELIVER_GOODS_BILL.SUM_OVER_PRICE'],
                          bigCount: ele['ORDER_WAIT_DELIVER_GOODS_BILL.BIG_UNIT_COUNT'],
                          count: ele['ORDER_WAIT_DELIVER_GOODS_BILL.SMALL_UNIT_COUNT'],
                          present: ele['ORDER_WAIT_DELIVER_GOODS_BILL.PRESENT_COUNT'],
                          id: ele['ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_BILL_ID']
                        })
                      }else{
                        if(ele['DATE']){
                          arr.push(ele)
                        }else{
                          arr.push({
                            name: ele['ORDER_SETTLEMENT_BILL.USER_NAME'],
                            code: ele['ORDER_SETTLEMENT_BILL.ORDER_CODE'],
                            money: ele['ORDER_SETTLEMENT_BILL.SUM_OVER_PRICE'],
                            bigCount: ele['ORDER_SETTLEMENT_BILL.BIG_UNIT_COUNT'],
                            count: ele['ORDER_SETTLEMENT_BILL.SMALL_UNIT_COUNT'],
                            present: ele['ORDER_SETTLEMENT_BILL.PRESENT_COUNT'],
                            id: ele['ORDER_SETTLEMENT_BILL.ORDER_SETTLEMENT_BILL_ID']
                          })
                        }              
                      }
                      
                    })
                    this.tabList[index].list = this.tabList[index].list.concat(arr)                
                },res=>{
                    resolve('over')
                })
              })
              
            },
            tabChange(index){
              this.index = index
              if(this.tabList[index].list.length == 0){
                this.configData.pageRender = true
                this.getData(index,this.tabList[index].pn).then(()=>{
                  this.configData.pageRender = false
                })
              }          
            },
            update(){

            },
            refresh(callback){
              if(typeof callback == 'function'){
                  this.tabList.forEach(ele =>{
                    ele.list = []
                    ele.pn = 1
                  })
                  this.getData(this.index,this.tabList[this.index].pn).then(() =>{
                      callback()
                  })
              }else{
                storage.getItem('order_page_refresh',res =>{
                  if(res.result == 'success' && res.data == 'true'){
                    this.tabList.forEach(ele =>{
                      ele.list = []
                      ele.pn = 1
                    })
                    this.getData(this.index,this.tabList[this.index].pn).then(() =>{
                    })
                    storage.removeItem('order_page_refresh',res =>{})
                  }
                })
              }
            },
            loadmore(){
              this.tabList[this.index].pn ++ 
              this.getData(this.index,this.tabList[this.index].pn)
            },
            jump(id){
              let url = '/modules/orderSection/orderProcess/orderReview'
              if(this.index == 0){
                url += '/order-detail'
              }else{
                url += '/order-detail-done'
              }
                navigator.push({
                    url: url,
                    query:'?id=' + id
                })
            },
            scanEvent(){
              if(typeof(scanEvent.startScan) == "function"){
                  scanEvent.startScan()
              }
            },
            scanResponse(val){
              let url = '/modules/orderSection/orderProcess/orderReview/order-detail'
              navigator.push({
                  url: url,
                  query:'?id=' + val
              })
            }
        },
    };
</script>