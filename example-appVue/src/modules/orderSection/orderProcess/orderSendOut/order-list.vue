<template>
    <bu-view :config="configData" @event="viewEvent">
        <headerLeft :title="title" @hidden="hidden"></headerLeft>
        <orderSearch></orderSearch>
        <orderTabBar :list="tabList" :index="index" @change="tabChange"></orderTabBar>
        <orderCard :list="tabList[index].list" @jump="jump"></orderCard>
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
    import stream from '../../../../common/stream.js'
    import navigator from '../../../../common/navigator.js'
    import orderTabBar from '../../components/tab-bar.vue'
    import orderCard from '../../components/order-card.vue'
    import orderSearch from '../../components/order-search.vue'
    import buView from '../../../../components/bu-view.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '订单发货',
                    titleAlgin: 'left',
                    bottom: '0',
                    pageRender: false,
                    refresh:true,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'refresh'
                },
                getClientApi:'/buyer/queryAll',
                getWaitApi:'/bee/order/new/commonbill/queryAllForAppByHandGoodsBill?PAGE_SIZE=20&ORDER_CHECK_COMMON_BILL.STATE=',
                getDoneApi:'/bee/order/new/commonbill/queryAllForAppByHandGoodsBill?PAGE_SIZE=20&ORDER_CHECK_COMMON_BILL.STATE=',
                scrolConfig:{
                  refresh:true,
                  loadmore: true
                },
                processId:'',
                tabList:[{
                    name:'待发货',
                    state:"WAIT",
                    list: [],
                    pn: 1
                },{
                    name:'已发货',
                    state: "DONE",
                    list: [],
                    pn: 1
                }],
                index: 0,
            };
        },
        components:{
            buView,
            orderTabBar,
            orderCard,
            orderSearch
        },
        mounted(){
            this.configData.pageRender = true
            this.getData(this.index , this.tabList[this.index].pn).then(()=>{
              this.configData.pageRender = false
            })
        },
        computed:{

        },
        methods:{
            viewEvent(name,call){
              this[name](call);
            },
            getData(index,pn){
              return new Promise((resolve , reject) =>{
                let query = (index == 0 ? this.getWaitApi : this.getDoneApi) + this.tabList[index].state + '&PN=' + pn 
                stream.fetch({
                  method:'GET',
                  url: query
                },res=>{
                    let val = res.data
                    let arr = []
                    val.forEach(ele =>{
                      arr.push({
                        img:ele['ORDER_CHECK_COMMON_BILL.PRODUCT_IMG'],
                        name: ele['ORDER_CHECK_COMMON_BILL.USER_NAME'],
                        code: ele['ORDER_CHECK_COMMON_BILL.ORDER_CHILD_CODE'],
                        money: ele['ORDER_CHECK_COMMON_BILL.SUM_OVER_PRICE'],
                        class: ele['ORDER_CHECK_COMMON_BILL.SKU_COUNT'],
                        count: ele['ORDER_CHECK_COMMON_BILL.BUY_COUNT'],
                        id: ele['ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID']
                      })
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
              let url = '/modules/orderSection/orderProcess/orderSendOut/order-detail'
              navigator.push({
                  url: url,
                  query:'?id=' + id
              })
            }
        },
    };
</script>