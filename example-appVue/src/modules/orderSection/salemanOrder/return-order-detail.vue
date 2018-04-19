<template>
    <bu-view :config="configData" @event="viewEvent">
        <orderProgressBar :state="state" :type="'return'"></orderProgressBar>
        <orderMsg :list="formData" :remark="remark"></orderMsg>
        <returnPrdCard :list="prdList" :msg="sumPrice"></returnPrdCard>
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
    import buView from '../../../components/bu-view.vue'
    import stream from '../../../common/stream.js'
    import filters from '../../../common/filters.js'
    import navigator from '../../../common/navigator.js'
    import returnPrdCard from './components/return-prd-card.vue'
    import orderMsg from '../components/order-msg.vue'
    import orderProgressBar from '../components/order-progress-bar.vue'
    export default {
        data() {
            return {
                configData:{
                    title: '客户退货单',
                    titleAlgin: 'center',
                    secondTitle: '',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                getById:'/bee/returnOrder/order/getById',
                orderId: 28519,
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
                    },{
                        name:'退货方式',
                        value:''
                    },{
                        name:'开  单  人',
                        value:''
                    }]                  
                ],
                sumPrice:{
                    discount:0,
                    freight:0,
                    overPrice:0
                },
                payMsg:{
                    paied:'',
                    waitPay:''
                },
                state:''
            }
        },
        components:{
            buView,
            returnPrdCard,
            orderMsg,
            orderProgressBar
        },
        mounted(){
            let id = navigator.getQuery('id',this)
            this.getData(id)
            // this.getData(1250)
        },
        methods:{
            viewEvent(){

            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_RETURN_ID=' + id
                },res=>{
                    this.order = res.data[0]
                    let info = res.data[0]
                    let obj = this.formData[0]
                    this.configData.secondTitle = info['ORDER_RETURN.USER_NAME']

                    this.payMsg.waitPay = info['ORDER_PARENT.WAIT_PAY_MONEY']
                    this.state = info['ORDER_RETURN.STATUS']
                    this.prdList = this.changeArr(info['ORDER_RETURN.ORDER_DETAILS'])
                    this.sumPrice = {
                        overPrice: info['ORDER_RETURN.SUM_OVER_RETURN_PRICE']
                    }
                    this.remark = JSON.parse(info['ORDER_RETURN.REMARK'])['0'].remark
                    obj[0].value =  info['ORDER_RETURN.ADD_DATETIME'].substr(0,16)
                    obj[1].value = info['ORDER_RETURN.ORDER_RETURN_CODE']
                    obj[2].value = info['ORDER_RETURN.RETURN_TYPE'] == "GOODS_MONEY" ? '退款并退货' : '仅退款'
                    obj[3].value = info['ORDER_RETURN.CREATE_NAME']
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(obj){
                let arr = []
                for(let i in obj ){
                    let prd = JSON.parse(obj[i]['ORDER_RETURN_DETAIL.PRD_SNAPSHOT'])
                    obj[i]['PRD_NAME'] = prd['PRODUCT_SPU.PRD_NAME']
                    prd['SKU_LIST'].forEach(ele=>{
                        if(ele['PRODUCT_SKU.SKU_ID'] == obj[i]['ORDER_RETURN_DETAIL.SKU_ID']){
                            obj[i]['UNIT'] = ele['PRODUCT_SKU.UNIT']
                            obj[i]['CONTENT'] = ele['PRODUCT_SKU.SKU_CONTENT']['CONTENT']
                            obj[i]['IMAGE'] = ele['PRODUCT_SKU.IMG']['COVER']
                        }
                    })
                    arr.push(obj[i])
                }
                return arr
            }
        },
        computed:{

        }
    };
</script>