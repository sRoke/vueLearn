<template>
  <bu-view :config="configData" @event="viewEvent">
    <orderSearch></orderSearch>
    <div v-if="bottomIndex == 0">
      <orderTabBar :list="addTabList" :index="addIndex" @change="addTabChange"></orderTabBar>
      <orderCard :list="addTabList[addIndex].list" :type="addType" @jump="jumpToAddOrder"></orderCard>
    </div>
    <div v-if="bottomIndex == 1">
      <orderTabBar :list="returnTabList" :index="returnIndex" @change="returnTabChange"></orderTabBar>
      <orderCard :list="returnTabList[returnIndex].list" :type="returnType" @jump="jumpToReturnOrder"></orderCard>
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
</style>
<script>
    import buView from '../../../components/bu-view.vue'
    import icon from '../../../assets/orderIcon/icon.js'
    import stream from '../../../common/stream.js'
    import navigator from '../../../common/navigator.js'
    import orderTabBar from '../components/tab-bar.vue'
    import orderCard from '../components/order-card.vue'
    import bottomBar from '../components/bottom-bar.vue'
    import orderSearch from '../components/order-search.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '客户订单',
                    titleAlgin: 'left',
                    bottom: '100px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'refresh'
                },
                getConfApi:'/bee/order/new/parent/getBySaleman?PAGE_SIZE=20',
                getReturnApi:'/bee/returnOrder/order/queryReturnOrder?PAGE_SIZE=20',
                processId:'',
                addTabList:[
                {
                    name:'全部',
                    state:'',
                    list: [],
                    pn: 1
                },{
                    name:'配货中',
                    state:'WAIT',
                    list: [],
                    pn: 1
                },{
                    name:'发货中',
                    state: 'DELIVERY',
                    list: [],
                    pn: 1
                },{
                    name:'已收货',
                    state:'DONE',
                    list: [],
                    pn: 1
                },{
                    name:'已取消',
                    state:'CANCEL',
                    list: [],
                    pn: 1
                }],
                returnTabList:[{
                    name:'全部',
                    state:'',
                    list: [],
                    pn: 1
                },{
                    name:'待确认',
                    state:'WAIT',
                    list: [],
                    pn: 1
                },{
                    name:'已确认',
                    state:'DONE',
                    list: [],
                    pn: 1
                }],
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
                }],
                addType:{
                    'WAIT':'配货中',
                    'DELIVERY':'发货中',
                    'DONE':'已收货',
                    'CANCEL':'已取消'
                },
                returnType:{
                    'WAIT':'待确认',
                    'DONE':'已确认',
                    'CANCEL':'已作废'
                }
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

            this.getData(this.addIndex , this.addTabList[this.addIndex].pn)

        },
        computed:{

        },
        methods:{
            viewEvent(name,call){
              this[name](call)
            },
            getData(index,pn){
              let type = index > 2 ? '&ORDER_PARENT.STATE=' : '&ORDER_PARENT.TARGET='
              let query = this.getConfApi + '&PN=' + pn + type + this.addTabList[index].state
              pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      img:ele['ORDER_PARENT.PRODUCT_IMG'],
                      name: ele['ORDER_PARENT.USER_NAME'],
                      code: ele['ORDER_PARENT.ORDER_CODE'],
                      money: ele['ORDER_PARENT.SUM_OVER_PRICE'],
                      class: ele['ORDER_PARENT.SKU_COUNT'],
                      count: ele['ORDER_PARENT.BUY_COUNT'],
                      type: ele['ORDER_PARENT.TARGET'],
                      id: ele['ORDER_PARENT.ORDER_PARENT_ID']
                    })
                  })
                  this.addTabList[index].list = this.addTabList[index].list.concat(arr)                
              },res=>{
                this.configData.pageRender = false
              })
            },
            getReturnData(index,pn){
              let query = this.getReturnApi + '&PN=' + pn + '&TYPE=' + this.returnTabList[index].state
              pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      img:ele['ORDERE_RETURN.PRD_IMG'],
                      name: ele['ORDER_RETURN.USER_NAME'],
                      code: ele['ORDER_RETURN.ORDER_RETURN_CODE'],
                      money: ele['ORDER_RETURN.SUM_OVER_RETURN_PRICE'],
                      class: ele['ORDERE_RETURN.PRD_NUM'],
                      count: ele['ORDERE_RETURN.PRD_COUNT'],
                      type: ele['ORDER_RETURN.STATUS'],
                      id: ele['ORDER_RETURN.ORDER_RETURN_ID']
                    })
                  })
                  this.returnTabList[index].list = this.returnTabList[index].list.concat(arr)             
              },res=>{
                this.configData.pageRender = false
              })
            },
            addTabChange(index){
              this.addIndex = index
              if(this.addTabList[index].list.length == 0){
                this.getData(index,this.addTabList[index].pn)
              }          
            },
            returnTabChange(index){
              this.returnIndex = index
              if(this.returnTabList[index].list.length == 0){
                this.getReturnData(index,this.returnTabList[index].pn)
              }          
            },
            bottomChange(ret){
              this.bottomIndex = ret
              if(this.returnTabList[0].list.length == 0){
                this.returnIndex = 0
                this.getReturnData(this.returnIndex,this.addTabList[this.returnIndex].pn)
              }       
            },
            loadmore(){
              this.addTabList[this.addIndex].pn ++ 
              this.getData(this.addIndex,this.addTabList[this.addIndex].pn)
            },
            jumpToAddOrder(id){
              navigator.push({
                  url:'/modules/orderSection/salemanOrder/order-detail',
                  query:'?id=' + id
              })
            },
            jumpToReturnOrder(id){
               navigator.push({
                  url:'/modules/orderSection/salemanOrder/return-order-detail',
                  query:'?id=' + id
              }) 
            },
            refresh(){
              let list 
              let index 
              let event
              if(this.bottomIndex == 0){
                list = this.addTabList
                index = this.addIndex
                event = 'getData'
              }else{
                list = this.returnTabList
                index = this.returnIndex
                event = 'getReturnData'
              }
              storage.getItem('order_page_refresh',res =>{
                if(res.result == 'success' && res.data == 'true'){
                  list.forEach(ele =>{
                    ele.list = []
                    ele.pn = 1
                  })
                  this[event](index,list[index].pn)
                  storage.removeItem('order_page_refresh',res =>{})
                }
              })
            }
        },
    };
</script>