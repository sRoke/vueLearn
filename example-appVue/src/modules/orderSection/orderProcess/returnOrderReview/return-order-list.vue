<template>
    <bu-view :config="configData" @event="viewEvent">
        <orderSearch></orderSearch>
        <orderTabBar :list="tabList" :index="index" @change="tabChange"></orderTabBar>
        <list-card :list="tabList[index].list" @jump="jump"></list-card>
    </bu-view>
</template>     
<script>
    import buView from '../../../../components/bu-view.vue'
    import stream from '../../../../common/stream.js'
    import navigator from '../../../../common/navigator.js'
    import orderTabBar from '../../components/tab-bar.vue'
    import listCard from './components/list-card.vue'
    import orderSearch from '../../components/order-search.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '退单核销',
                    titleAlgin: 'left',
                    bottom: '0',
                    pageRender: false,
                    refresh:true,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'refresh'
                },
                getReturnApi:'/bee/returnOrder/order/queryReturnOrder?PAGE_SIZE=20&TYPE=',
                processId:'',
                tabList:[{
                    name:'未核销',
                    list: [],
                    state:'WAIT',
                    pn: 1
                },{
                    name:'已核销',
                    list: [],
                    state:'DONE',
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
        },
        computed:{

        },
        methods:{
            viewEvent(name , call){
              this[name](call)
            },
            getData(index,pn){
              return new Promise((resolve , reject) =>{
                let query = this.getReturnApi + this.tabList[index].state + '&PN=' + pn 
                stream.fetch({
                  method:'GET',
                  url: query
                },res=>{
                    let val = res.data
                    let arr = []
                    val.forEach(ele =>{
                        arr.push({
                          name: ele['ORDER_RETURN.USER_NAME'],
                          code: ele['ORDER_RETURN.ORDER_RETURN_CODE'],
                          money: ele['ORDER_RETURN.SUM_OVER_RETURN_PRICE'],
                          count: ele['ORDERE_RETURN.PRD_COUNT'],
                          class: ele['ORDERE_RETURN.PRD_NUM'],
                          id: ele['ORDER_RETURN.ORDER_RETURN_ID']
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
              }else {
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
                let url = '/modules/orderSection/orderProcess/returnOrderReview/return-order-detail'
                navigator.push({
                    url: url,
                    query:'?id=' + id
                })
            }
        },
    };
</script>