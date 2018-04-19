<template>
    <bu-view :config="configData" @event="viewEvent">
        <segmentingLine></segmentingLine>
        <orderMsg :list="formData" :remark="remark"></orderMsg>
        <prdCard :list="prdList" :msg="sumPrice"></prdCard>
        <ButtonItem slot="footer">
            <Button type="primary" @clickEvent="printTrue">针式三联打印</Button>
            <Button type="primary" @clickEvent="printFalse">掌上便携打印</Button>
        </ButtonItem>
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
    import modal from '../../../../common/modal.js'
    import filters from '../../../../common/filters.js'
    import navigator from '../../../../common/navigator.js'
    import prdCard from '../../components/prd-card.vue'
    import buttonBar from '../../components/button-bar.vue'
    import orderMsg from '../../components/order-msg.vue'
    import segmentingLine from '../../components/segmenting-line.vue'
    import components from '../../../../basicComponents'
    const storage = weex.requireModule('storage')
    const event = weex.requireModule('event')
    export default {
        data() {
            return {
                configData:{
                    title: '',
                    titleAlgin: 'center',
                    secondTitle:'',
                    bottom: '140px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'loadmore'
                },
                getById:'/bee/order/new/handgoodsapply/bill/getById',
                orderId: 28519,
                titleList:{
                    'WAIT':'待配货',
                    'DONE':'已配货',
                    'NOT_APPLY':'不予配货'
                },
                order:{},
                tabName:'',
                orderChildId: '',
                remark:'',
                prdList:[],
                formData:[
                    [{
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
            buView,
            prdCard,
            orderMsg,
            buttonBar,
            segmentingLine,
            ButtonItem: components.ButtonItem,
            Button: components.Button
        },
        mounted(){
            let id = navigator.getQuery('id',this)
            this.getData(id)
            // this.getData(22160)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_HAND_GOODS_APPLY_BILL.ORDER_HAND_GOODS_APPLY_BILL_ID=' + id
                },res=>{
                    let info = res.data[0]
                    let orderInfo = JSON.parse(info['ORDER_HAND_GOODS_APPLY_BILL.ORDER_INFO'])
                    let addr = orderInfo['ORDER_CHILD.DELIVERY_ADDR']
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.prdList = orderInfo['ORDER_CHILD.ORDER_DETAILS']
                    this.orderChildId = orderInfo['ORDER_CHILD.ORDER_CHILD_ID']
                    this.configData.title = this.titleList[info['ORDER_HAND_GOODS_APPLY_BILL.STATE']]
                    this.configData.secondTitle = info['ORDER_HAND_GOODS_APPLY_BILL.USER_NAME']
                    this.sumPrice = {
                        discount: orderInfo['ORDER_CHILD.DISCOUNT_PRICE'],
                        freight: orderInfo['ORDER_CHILD.SUM_FREIGHT_PRICE'],
                        overPrice: orderInfo['ORDER_CHILD.SUM_OVER_PRICE']
                    }
                    this.remark = orderInfo['ORDER_CHILD.REMARK'] ? orderInfo['ORDER_CHILD.REMARK'][0].remark : ''
                    obj[0].value = orderInfo['ORDER_CHILD.ORDER_CHILD_CODE']
                    obj2[0].value = addr['USER_ADDR.USERNAME'] ? (addr['USER_ADDR.USERNAME'] + '  ' + addr['USER_ADDR.PHONE']) : '' 
                    obj2[1].value = orderInfo['ORDER_CHILD.DELIVERY_DATETIME'] ? orderInfo['ORDER_CHILD.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[2].value = filters.address(addr)
                },res=>{
                    this.configData.pageRender = false
                })
            },
            print() {
                if(weex.config.env.osName === 'android') {
                    let url = '/bee/order/new/child/getPrintByIdForBluetoothNeedle?ORDER_CHILD.ORDER_CHILD_ID=' + this.orderChildId
                    this.configData.pageRender = true
                    stream.fetch({
                        method:'GET',
                        url: url
                    },res=>{
                        event.goPrint(JSON.parse(res.extraData.printList) , true)
                    },res=>{
                        this.configData.pageRender = false
                    })
                }else {
                    modal.alert({message: '苹果手机暂不支持打印'})
                }
                
            },
            printTrue() {
                if(weex.config.env.osName === 'android') {
                    let url = '/bee/order/new/child/getPrintByIdForBluetoothNeedle?ORDER_CHILD.ORDER_CHILD_ID=' + this.orderChildId
                    this.configData.pageRender = true
                    stream.fetch({
                        method:'GET',
                        url: url
                    },res=>{
                        event.goPrint(JSON.parse(res.extraData.printList) , true)
                    },res=>{
                        this.configData.pageRender = false
                    })
                }else {
                    modal.alert({message: '苹果手机暂不支持打印'})
                }
            },
            printFalse() {
                if(weex.config.env.osName === 'android') {
                    let url = '/bee/order/new/child/getByIdForPrintApp?ORDER_CHILD.ORDER_CHILD_ID=' + this.orderChildId
                    this.configData.pageRender = true
                    stream.fetch({
                        method:'GET',
                        url: url
                    },res=>{
                        event.goPrint(JSON.parse(res.extraData.printList) , false)
                    },res=>{
                        this.configData.pageRender = false
                    })
                }else {
                    modal.alert({message: '苹果手机暂不支持打印'})
                }
            }
        },
        computed:{
        }
    };
</script>