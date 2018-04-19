<template>
    <div class="page">
        <top-bar :title="title" :show="showTitle" :back="'1'" :close="'0'"></top-bar>
        <scroller class="scrol" show-scrollbar="false">
            <headerCenter :title="title" :content="clientName" :tag="tabName"  @hidden="hidden"></headerCenter>
            <orderMsg :list="formData" :remark="remark"></orderMsg>
            <prdCard :list="prdList" :msg="sumPrice"></prdCard>
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
    import headerCenter from '../../../../components/header-center.vue'
    import topBar from '../../../../components/top-bar.vue'
    import stream from '../../../../common/stream.js'
    import filters from '../../../../common/filters.js'
    import navigator from '../../../../common/navigator.js'
    import renderTip from '../../../../components/render-tip.vue'
    import prdCard from '../../components/prd-card.vue'
    import orderMsg from '../../components/order-msg.vue'
    export default {
        data() {
            return {
                showTitle: false,
                render: false,
                getById:'/bee/order/new/commonbill/getById',
                orderId: 28519,
                titleList:{
                    'WAIT':'待确认',
                    'DONE':'已通过',
                    'CANCEL':'已作废'
                },
                order:{},
                tabName:'',
                remark:'',
                prdList:[],
                formData:[
                    [{
                        name:'下单日期',
                        value:''
                    },{
                        name:'订单编号',
                        value:'',
                    }],[{
                        name:'收  货  人',
                        value:'',
                    },{
                        name:'收货日期',
                        value:''
                    },{
                        name:'收货地址',
                        value:''
                    }]                   
                ],
                sumPrice:{
                    discount:0,
                    freight:0,
                    overPrice:0
                }
            }
        },
        components:{
            headerCenter,
            topBar,
            renderTip,
            prdCard,
            orderMsg
        },
        mounted(){
            let id = navigator.getQuery('id',this)
            this.getData(id)
        },
        methods:{
            // 滚动头部显示
            hidden(ret){
                this.showTitle = ret
            },
            getData(id){
              
                this.render = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID=' + id
                },res=>{
                    this.order = res.data[0]
                    let info = JSON.parse(this.order['ORDER_CHECK_COMMON_BILL.ORDER_INFO'])
                    let addr = info['ORDER_PARENT.DELIVERY_ADDR']
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.prdList = this.changeArr(info['ORDER_PARENT.ORDER_DETAILS'])
                    console.log(this.prdList)
                    this.sumPrice = {
                        discount: info['ORDER_PARENT.DISCOUNT_PRICE'],
                        freight: info['ORDER_PARENT.SUM_FREIGHT_PRICE'],
                        overPrice: info['ORDER_PARENT.SUM_OVER_PRICE']
                    }
                    this.remark = info['ORDER_PARENT.REMARK']['0'] ? info['ORDER_PARENT.REMARK'][0].remark : ''
                    obj[0].value =  info['ORDER_PARENT.ORDER_DATETIME'] ? info['ORDER_PARENT.ORDER_DATETIME'].substr(0,16) : ''
                    obj[1].value = info['ORDER_PARENT.ORDER_CODE']
                    obj2[0].value = addr['USER_ADDR.USERNAME'] + '  ' + addr['USER_ADDR.PHONE'] 
                    obj2[1].value = info['ORDER_PARENT.DELIVERY_DATETIME'] ? info['ORDER_PARENT.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[2].value = filters.address(addr)
                },res=>{
                    this.render = false
                })
            },
            changeArr(obj){
                let arr = []
                for(let i in obj ){
                    arr.push(obj[i])
                }
                return arr
            }
        },
        computed:{
            title(){
                return this.order['ORDER_CHECK_COMMON_BILL.STATE'] ? this.titleList[this.order['ORDER_CHECK_COMMON_BILL.STATE']] : ''
            },
            clientName(){
                return this.order['ORDER_CHECK_COMMON_BILL.USER_NAME'] ? this.order['ORDER_CHECK_COMMON_BILL.USER_NAME'] : ''
            }
        }
    };
</script>