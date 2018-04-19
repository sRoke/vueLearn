<template>
    <bu-view :config="configData" @event="viewEvent">
        <segmentingLine></segmentingLine>
        <orderMsg :list="formData" :remark="remark"></orderMsg>
        <prdCard :list="prdList" :msg="sumPrice"></prdCard>
    </bu-view>
</template>     
<script>
    import buView from '../../../components/bu-view.vue'
    import stream from '../../../common/stream.js'
    import modal from '../../../common/modal.js'
    import filters from '../../../common/filters.js'
    import navigator from '../../../common/navigator.js'
    import prdCard from '../components/return-prd-card.vue'
    import buttonBar from '../../orderSection/components/button-bar.vue'
    import orderMsg from '../../orderSection/components/order-msg.vue'
    import segmentingLine from '../../orderSection/components/segmenting-line.vue'
    import confirm from '../../orderSection/components/confirm.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '采购退货单',
                    titleAlgin: 'center',
                    secondTitle:'',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'loadmore'
                },
                getById:'/simple/purchase/returnBill/getById',
                orderId: '',
                order:{},
                remark:'',
                prdList:[],
                formData:[
                    [{
                        name:'订单编号',
                        value:'',
                    },{
                        name:'添  加  人',
                        value:'',
                    }],[{
                        name:'退货类型',
                        value:''
                    },{
                        name:'退货仓库',
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
            buView,
            prdCard,
            orderMsg,
            buttonBar,
            segmentingLine,
            confirm
        },
        mounted(){
            this.orderId = navigator.getQuery('id',this)
            this.getData(this.orderId)
            // this.getData(1002)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?PURCHASE_RETURN_BILL.PURCHASE_RETURN_BILL_ID=' + id
                },res=>{
                    let result = res.data[0]
                    this.order = result
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.prdList = result['PURCHASE_RETURN_BILL.PURCHASE_RETURN_BILL_DETAILS']
                    this.configData.secondTitle = result['PURCHASE_RETURN_BILL.SUPPLIER_NAME']
                    this.sumPrice = {
                        overPrice: result['PURCHASE_RETURN_BILL.SUM_OVER_PRICE']
                    }
                    this.remark = result['PURCHASE_RETURN_BILL.REMARK'] ? result['PURCHASE_RETURN_BILL.REMARK'] : ''
                    obj[0].value =  result['PURCHASE_RETURN_BILL.PURCHASE_RETURN_CODE']
                    obj[1].value =  result['PURCHASE_RETURN_BILL.CREATER_NAME']
                    obj2[0].value = result['PURCHASE_RETURN_BILL.RETURN_TYPE'] == 'GOODS_MONEY' ? '退款并退货' : '仅退款'
                    obj2[1].value = result['PURCHASE_RETURN_BILL.REPOS_NAME']
                },res=>{
                    this.configData.pageRender = false
                })
            }
        },
        computed:{
        }
    };
</script>