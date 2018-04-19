<template>
  <bu-view :config="configData" @event="viewEvent">
    <orderSearch></orderSearch>
    <div v-if="bottomIndex == 0" v-for="item in addTabList">
      <text class="title" v-if="item.list.length > 0">{{item.name}}</text>  
      <orderCard :list="item.list" @jump="jumpToAddOrder"></orderCard>
    </div>
    <div v-if="bottomIndex == 1">
      <orderCard :list="returnTabList.list" @jump="jumpToReturnOrder"></orderCard>
    </div>  
    <bottomBar slot="footer" :list="btnBar" :index="bottomIndex" @change="bottomChange"></bottomBar>
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
    bottom: 100px;
    left: 0px;
    width: 750px;
   }
   .title{
    padding-top: 55px;
    padding-left: 30px;
    font-size: 38px;
    color: #333;
   }
</style>
<script>
    import buView from '../../../components/bu-view.vue'
    import icon from '../../../assets/orderIcon/icon.js'
    import stream from '../../../common/stream.js'
    import navigator from '../../../common/navigator.js'
    import orderTabBar from '../../orderSection/components/tab-bar.vue'
    import orderCard from '../components/order-card.vue'
    import bottomBar from '../../orderSection/components/bottom-bar.vue'
    import orderSearch from '../../orderSection/components/order-search.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '采购管理',
                    titleAlgin: 'left',
                    bottom: '100px',
                    addEvent: 'jumpIndex',
                    dropDownList: [{
                      name:'新增采购',
                      type:'add'
                    },{
                      name:'采购退货',
                      type:'return'
                    }],
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'refresh'
                },
                getPurchaseApi:'/simple/purchaseBill/querAllByState',
                getReturnPurchaseApi:'/simple/purchase/returnBill/queryAll?PAGE_SIZE=20',
                processId:'',
                addTabList:[{
                    name:'待入库',
                    list: [],
                    state:'WAIT',
                    pn: -1
                },{
                    name:'已入库',
                    list: [],
                    state:'DONE',
                    pn: 1
                }],
                returnTabList:{
                  list:[],
                  pn:1
                },
                addIndex: 0,
                returnIndex: 0,
                bottomIndex: 0,
                btnBar:[{
                  name:'订单',
                  icon: icon.orderIcon,
                  iconAc: icon.orderIconAc
                },{
                  name:'退单',
                  icon: icon.returnOrderIcon,
                  iconAc: icon.returnOrderIconAc
                }]
            };
        },
        components:{
            buView,
            orderTabBar,
            orderCard,
            bottomBar,
            orderSearch
        },
        mounted(){
            this.getData(0)
            this.getData(1)
        },
        computed:{

        },
        methods:{
            viewEvent(name,call){
              this[name](call)
            },
            getData(index){
              let query
              if(index == 0){
                query = this.getPurchaseApi + '?PURCHASE_BILL.STATE=' + this.addTabList[index].state
              }else{
                query = this.getPurchaseApi + '?PAGE_SIZE=20&PN=' + this.addTabList[index].pn + '&PURCHASE_BILL.STATE=' + this.addTabList[index].state
              }
              this.addTabList[index].pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      name: ele['PURCHASE_BILL.SUPPLIER_NAME'],
                      code: ele['PURCHASE_BILL.PURCHASE_CODE'],
                      money: ele['PURCHASE_BILL.SUM_OVER_PRICE'],
                      repos: ele['PURCHASE_BILL.REPOS_NAME'],
                      state: ele['PURCHASE_BILL.STATE'],
                      id: ele['PURCHASE_BILL.PURCHASE_BILL_ID']
                    })
                  })
                  this.addTabList[index].list = this.addTabList[index].list.concat(arr)                
              },res=>{
                this.configData.pageRender = false
              })
            },
            getReturnData(pn){
              let query = this.getReturnPurchaseApi + '&PN=' + pn
              pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      name: ele['PURCHASE_RETURN_BILL.SUPPLIER_NAME'],
                      code: ele['PURCHASE_RETURN_BILL.PURCHASE_RETURN_CODE'],
                      money: ele['PURCHASE_RETURN_BILL.SUM_OVER_PRICE'],
                      repos: ele['PURCHASE_RETURN_BILL.REPOS_NAME'],
                      state: ele['PURCHASE_RETURN_BILL.STATE'],
                      id: ele['PURCHASE_RETURN_BILL.PURCHASE_RETURN_BILL_ID']
                    })
                  })
                  this.returnTabList.list = this.returnTabList.list.concat(arr)             
              },res=>{
                this.configData.pageRender = false
              })
            },
            bottomChange(ret){
              if(this.bottomIndex != ret){
                this.bottomIndex = ret
                if(ret == 1 && this.returnTabList.list.length == 0){
                  this.returnTabList.pn = 1
                  this.getReturnData(this.returnTabList.pn)
                } 
              }     
            },
            loadmore(){
              if(this.bottomIndex == 0) {
                this.addTabList[1].pn ++ 
                this.getData(1)
              }else{
                this.returnTabList.pn ++ 
                this.getReturnData(this.returnTabList.pn)
              }
            },
            jumpToAddOrder(item){
              let url
              if(item.state == 'WAIT'){
                url = '/modules/purchaseSection/add-purchase'
              }else{
                url = '/modules/purchaseSection/purchaseOrder/purchase-detail'
              }
              navigator.push({
                  url: url,
                  query:'?id=' + item.id
              })
            },
            jumpToReturnOrder(item){
               navigator.push({
                  url:'/modules/purchaseSection/purchaseOrder/return-purchase-detail',
                  query:'?id=' + item.id
              }) 
            },
            jumpIndex(res){ 
              navigator.push({
                  url:'/modules/purchaseSection/supplier-repos-list',
                  query: '?type=' + res.type
              })
            },
            refresh(){
              let list 
              let event
              storage.getItem('order_page_refresh',res =>{
                if(res.result == 'success' && res.data == 'true'){
                  if(this.bottomIndex == 0){
                    this.addTabList[0].list = []
                    this.addTabList[1].list = []
                    this.addTabList[1].pn = 1
                    this.getData(0)
                    this.getData(1)
                  }else{
                    this.returnTabList.list = []
                    this.returnTabList.pn = 1
                    this.getReturnData(1)
                  }
                  storage.removeItem('order_page_refresh',res =>{})
                }
              })
            }
        },
    };
</script>