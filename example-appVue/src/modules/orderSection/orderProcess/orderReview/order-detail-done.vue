<template>
    <bu-view :config="configData" @event="viewEvent">
        <order-account :price="overPrice" :over="paiedMoney" :dept="deptMoney" :remark="remark"></order-account>
        <prdCard :list="prdList" :hide="hide"></prdCard>
    </bu-view>    
</template>     
<script>
    import buView from '../../../../components/bu-view.vue'
    import stream from '../../../../common/stream.js'
    import modal from '../../../../common/modal.js'
    import filters from '../../../../common/filters.js'
    import navigator from '../../../../common/navigator.js'
    import prdCard from './components/prd-card.vue'
    import orderAccount from './components/order-account-done.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                showTitle: false,
                render: false,

                getById:'/bee/order/new/settlement/bill/getById',
                orderId: '',
                order:{},
                tabName:'',
                remark:'',
                overPrice:'',
                paiedMoney:'',
                deptMoney:'',
                remark:'',
                prdList:[],
                nowPrd:{},
                configData:{
                    title: '',
                    titleAlgin: 'center',
                    secondTitle: '',
                    bottom: '0px',
                    pageRender: false,
                    refresh: false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'loadmore'
                },  
                payTypeList:[],
                payTypeIndex: -1,
                hide:true        
            }
        },
        components:{
            buView,
            prdCard,
            orderAccount
        },
        mounted(){
            this.orderId = navigator.getQuery('id',this)
            this.getData(this.orderId)
            // this.getData(20701)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            getData(id){       
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?REQUIRE_DETAIL=true&REQUIRE_ORDER_DEPT=true&ORDER_SETTLEMENT_BILL.ORDER_SETTLEMENT_BILL_ID=' + id
                },res=>{
                    let info = res.data[0]
                    let result = res.extraData
                    let detail = result['ORDER_SETTLEMENT_BILL_DETAILS']
                    let remark = JSON.parse(info['ORDER_SETTLEMENT_BILL.REMARK'] || '[]')
                    this.order = info
                    this.configData.title = info['ORDER_SETTLEMENT_BILL.SETTLEMENT_BILL_CODE']
                    this.configData.secondTitle = info['ORDER_SETTLEMENT_BILL.USER_NAME']
                    this.overPrice = info['ORDER_SETTLEMENT_BILL.SUM_OVER_PRICE']
                    this.paiedMoney = result['ORDER_REAL_MONEY']
                    this.deptMoney = result['ORDER_DEPT_MONEY']
                    this.remark = remark[0] ? remark[0].remark : ''
                    this.prdList = this.changeArr(detail)      
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(a){
                let arr = []
                a.forEach((ele,i) => {
                    let object = {
                        id:ele['ORDER_SETTLEMENT_BILL_DETAIL.ORDER_SETTLEMENT_BILL_DETAIL_ID'],
                        index: i < 9 ? ('0' + (i/1 + 1)) : (i + 1),
                        name: ele['ORDER_SETTLEMENT_BILL_DETAIL.PRD_NAME'],
                        content: ele['ORDER_SETTLEMENT_BILL_DETAIL.SKU_CONTENT'],
                        price: filters.number(ele['ORDER_SETTLEMENT_BILL_DETAIL.ORDER_PRICE']),
                        count: parseFloat(ele['ORDER_SETTLEMENT_BILL_DETAIL.ORDER_COUNT']),
                        unit: ele['ORDER_SETTLEMENT_BILL_DETAIL.ORDER_UNIT'],
                        remark:ele['ORDER_SETTLEMENT_BILL_DETAIL.REMARK'],
                        type: ele['ORDER_SETTLEMENT_BILL_DETAIL.PRD_TYPE'],
                        UNIT_TYPE: ele['ORDER_SETTLEMENT_BILL_DETAIL.UNIT_TYPE']
                    }
                    arr.push(object) 
                })
                return arr
            }
        },
        computed:{
        }
    };
</script>