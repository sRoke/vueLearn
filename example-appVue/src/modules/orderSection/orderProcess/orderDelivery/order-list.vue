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
                    title: '订单配货',
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
                getWaitApi:'/bee/order/new/waithandgoods/bill/queryAllForApp?PAGE_SIZE=20&ORDER_WAIT_HAND_GOODS_BILL.STATE=',
                getDoneApi:'/bee/order/new/handgoodsapply/bill/queryAllForApp?PAGE_SIZE=20&ORDER_HAND_GOODS_APPLY_BILL.STATE=',
                scrolConfig:{
                  refresh:true,
                  loadmore: true
                },
                processId:'',
                tabList:[{
                    name:'待配货',
                    state:"WAIT",
                    list: [],
                    pn: 1
                },{
                    name:'已配货',
                    state: "'DONE'",
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
                      if(index == 0){
                        arr.push({
                          img:ele['ORDER_WAIT_HAND_GOODS_BILL.PRODUCT_IMG'],
                          name: ele['ORDER_WAIT_HAND_GOODS_BILL.USER_NAME'],
                          code: ele['ORDER_WAIT_HAND_GOODS_BILL.ORDER_CODE'],
                          money: ele['ORDER_WAIT_HAND_GOODS_BILL.SUM_PRD_PRICE'] - ele['ORDER_WAIT_HAND_GOODS_BILL.DISCOUNT_PRICE'] + ele['ORDER_WAIT_HAND_GOODS_BILL.SUM_FREIGHT_PRICE']/1 + ele['ORDER_WAIT_HAND_GOODS_BILL.TAX_PRICE']/1,
                          class: ele['ORDER_WAIT_HAND_GOODS_BILL.SKU_COUNT'],
                          count: ele['ORDER_WAIT_HAND_GOODS_BILL.BUY_COUNT'],
                          id: ele['ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID']
                        })
                      }else{
                        arr.push({
                          img:ele['ORDER_HAND_GOODS_APPLY_BILL.PRODUCT_IMG'],
                          name: ele['ORDER_HAND_GOODS_APPLY_BILL.USER_NAME'],
                          code: ele['ORDER_HAND_GOODS_APPLY_BILL.ORDER_CODE'],
                          money: ele['ORDER_HAND_GOODS_APPLY_BILL.SUM_OVER_PRICE'],
                          class: ele['ORDER_HAND_GOODS_APPLY_BILL.SKU_COUNT'],
                          count: ele['ORDER_HAND_GOODS_APPLY_BILL.BUY_COUNT'],
                          id: ele['ORDER_HAND_GOODS_APPLY_BILL.ORDER_HAND_GOODS_APPLY_BILL_ID']
                        })
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
              let url = '/modules/orderSection/orderProcess/orderDelivery'
              if(this.index == 0){
                url += '/order-detail'
              }else{
                url += '/order-detail-done'
              }
                navigator.push({
                    url: url,
                    query:'?id=' + id
                })
            }
        },
    };
</script>