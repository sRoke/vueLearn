<template>
    <bu-view :config="configData" @event="viewEvent">
        <orderProgressBar :state="state" :type="'add'"></orderProgressBar>
        <orderPayItem :msg="payMsg"></orderPayItem>
        <orderMsg :list="formData" :remark="remark"></orderMsg>
        <prdCard :list="prdList" :msg="sumPrice"></prdCard>
        <buttonBar slot="footer" :data="btnList" :show="showModify" @event="clickBtn"></buttonBar>
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
    import modal from '../../../common/modal.js'
    import prdCard from '../components/prd-card.vue'
    import orderMsg from '../components/order-msg.vue'
    import orderProgressBar from '../components/order-progress-bar.vue'
    import orderPayItem from '../components/order-pay-item.vue'
    import buttonBar from '../components/button-bar.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '客户订单',
                    titleAlgin: 'center',
                    secondTitle: '',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'refresh'
                },
                getById:'/bee/order/new/parent/getById?ORDER_PARENT.RETURIE_TARGET=true',
                cancelApi:'/bee/order/new/parent/cancelBySalesMan?ORDER_PARENT.ORDER_PARENT_ID=',
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
                        name:'开  单  人',
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
                },
                payMsg:{
                    paied:'',
                    waitPay:''
                },
                state:'',
                showModify: false,
                orderStateModify: false,
                btnList:[{name:'作废',type:'default',event:'cancel'},{name:'修改',type:'primary',event:'change'}],
            }
        },
        components:{
            buView,
            prdCard,
            orderMsg,
            orderProgressBar,
            orderPayItem,
            buttonBar
        },
        mounted(){
            let id = navigator.getQuery('id',this)
            this.getData(id)
            // this.getData(23947)
        },
        methods:{
            refresh(){
                if(this.orderStateModify){
                    this.getData(this.order['ORDER_PARENT.ORDER_PARENT_ID'])
                }
            },
            viewEvent(name , call){
                this[name](call)
            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '&ORDER_PARENT.ORDER_PARENT_ID=' + id
                },res=>{
                    this.order = res.data[0]
                    let info = res.data[0]
                    let addr = (typeof info['ORDER_PARENT.DELIVERY_ADDR'] == 'object'? info['ORDER_PARENT.DELIVERY_ADDR'] : JSON.parse(info['ORDER_PARENT.DELIVERY_ADDR']))
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.configData.secondTitle = info['ORDER_PARENT.USER_NAME']
                    this.payMsg.paied = info['ORDER_PARENT.PAID_PRICE']
                    this.payMsg.waitPay = info['ORDER_PARENT.WAIT_PAY_MONEY']
                    this.state = info['ORDER_PARENT.TARGET']

                    if(this.state == 'WAIT'){
                        this.showModify = true
                        this.configData.bottom = '140px'
                    }
                    this.prdList = this.changeArr(info['ORDER_PARENT.ORDER_DETAILS'])
                    this.sumPrice = {
                        discount: info['ORDER_PARENT.DISCOUNT_PRICE'],
                        freight: info['ORDER_PARENT.SUM_FREIGHT_PRICE'],
                        overPrice: info['ORDER_PARENT.SUM_OVER_PRICE']
                    }
                    this.remark = info['ORDER_PARENT.REMARK']['0'] ? JSON.parse(info['ORDER_PARENT.REMARK'])['0'].remark : ''
                    obj[0].value =  info['ORDER_PARENT.ORDER_DATETIME'] ? info['ORDER_PARENT.ORDER_DATETIME'].substr(0,16) : ''
                    obj[1].value = info['ORDER_PARENT.ORDER_CODE']
                    obj[2].value = info['ORDER_PARENT.CREATE_NAME']
                    obj2[0].value = addr['USER_ADDR.USERNAME'] && addr['USER_ADDR.PHONE'] ? (addr['USER_ADDR.USERNAME'] + '  ' + addr['USER_ADDR.PHONE']) : ''
                    obj2[1].value = info['ORDER_PARENT.DELIVERY_DATETIME'] ? info['ORDER_PARENT.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[2].value = filters.address(addr)
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(obj){
                let arr = []
                for(let i in obj ){
                    arr.push(obj[i])
                }
                return arr
            },
            clickBtn(event){
                this[event]()
            },
            change(){
                let arr = []
                let result = {}
                this.prdList.forEach(ele =>{
                    let num = filters.count(ele['ORDER_DETAIL.ORDER_COUNT'])
                    let obj ={
                        'IMG':JSON.parse(ele['ORDER_DETAIL.IMG'])['COVER'],
                        'NAME':ele['ORDER_DETAIL.PRD_NAME'],
                        'PRD_ID':ele['ORDER_DETAIL.PRD_ID'],
                        'SKU_ID':ele['ORDER_DETAIL.SKU_ID'],
                        'CODE':ele['ORDER_DETAIL.MANAGE_CODE'],
                        'CONTENT':ele['ORDER_DETAIL.SKU_CONTENT']?JSON.parse(ele['ORDER_DETAIL.SKU_CONTENT'])['CONTENT'] : '',
                        'TYPE':'1',
                        'UNIT':[{
                            name: ele['ORDER_DETAIL.ORDER_UNIT'],
                            type: ele['ORDER_DETAIL.UNIT_TYPE'],
                            price: filters.number(ele['ORDER_DETAIL.ORDER_PRICE']),
                            range: ele['ORDER_DETAIL.ORDER_RANGE'],
                            remark: (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? ele['ORDER_DETAIL.REMARK'] : ''),
                            count: (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? filters.count(ele['ORDER_DETAIL.ORDER_COUNT']) : ''),
                            presentCount: (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? '' : filters.count(ele['ORDER_DETAIL.ORDER_COUNT'])),
                            sumPrice: (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? filters.number(ele['ORDER_DETAIL.ORDER_COUNT'] * ele['ORDER_DETAIL.ORDER_PRICE']) : '')
                        }],
                        'IS_PRESENT': (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? false : true),
                        'PRESENT_REMARK': (ele['ORDER_DETAIL.PRD_TYPE'] == 'PRD' ? '' : ele['ORDER_DETAIL.REMARK']),
                        'IS_ORIGINAL':true
                    }
                    arr.push(obj)
                    
                })
                result = {
                    'ORDER_ID': this.order['ORDER_PARENT.ORDER_PARENT_ID'],
                    'USER_NAME': this.order['ORDER_PARENT.USER_NAME'],
                    'USER_ID': this.order['ORDER_PARENT.UID'],
                    'ORDER_ADDR': this.order['ORDER_PARENT.DELIVERY_ADDR'],
                    'REMARK':JSON.parse(this.order['ORDER_PARENT.REMARK'])[0].remark,
                    'DELIVERY_DATETIME': this.order['ORDER_PARENT.DELIVERY_DATETIME']? this.order['ORDER_PARENT.DELIVERY_DATETIME'].substr(0,10) :'',
                    'DISCOUNT':filters.number(this.order['ORDER_PARENT.DISCOUNT_PRICE']),
                    'FREIGHT':filters.number(this.order['ORDER_PARENT.SUM_FREIGHT_PRICE']),
                    'DETAIL':arr
                }
                storage.setItem('SET_ORDER_INFO',JSON.stringify(result),res=>{
                    this.orderStateModify = true
                    navigator.push({
                        url:'/modules/orderKing/modifyOrder/modify-order',
                        query:'?type=change'
                    })
                })
            },
            cancel(){
                modal.confirm({
                    message: '确认作废？',
                    okTitle:'确认',
                    cancelTitle:'取消'
                },res =>{
                    if(res === '确认'){
                      this.configData.pageRender = true
                      this.index = -1
                      stream.fetch({
                        method:'POST',
                        url: this.cancelApi + this.order['ORDER_PARENT.ORDER_PARENT_ID']
                      },res =>{
                        modal.toast({message:'订单已作废',duration: 1})
                        this.pagePop()     
                      },() =>{
                        this.configData.pageRender = false
                      })
                    }
                })
            },
            pagePop(){
                storage.setItem('order_page_refresh','true',res=>{
                    setTimeout(()=>{
                        navigator.pop()               
                    },1000)
                })  
            }
        },
        computed:{

        }
    };
</script>