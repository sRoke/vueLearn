<template>
    <bu-view :config="configData" @event="viewEvent">
            <segmentingLine></segmentingLine>
            <orderMsg :list="formData" :remark="remark"></orderMsg>
            <prdCard :list="prdList" :msg="sumPrice"></prdCard>
        <buttonBar slot="footer" :data="btnList" :show="isWait" @event="clickBtn"></buttonBar>
    </bu-view>
</template>     
<script>
    import buView from '../../../../components/bu-view.vue'
    import stream from '../../../../common/stream.js'
    import modal from '../../../../common/modal.js'
    import filters from '../../../../common/filters.js'
    import navigator from '../../../../common/navigator.js'
    import prdCard from '../../components/prd-card-delivery.vue'
    import buttonBar from '../../components/button-bar.vue'
    import orderMsg from '../../components/order-msg.vue'
    import segmentingLine from '../../components/segmenting-line.vue'
    const storage = weex.requireModule('storage')
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
                    loadmoreEvent:'loadmore',
                    viewappear:'update'

                },
                getById:'/bee/order/new/waithandgoods/bill/getById',
                applyApi:'/bee/order/new/waithandgoods/bill/allApplyDelivery?ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID=',
                cancelApplyApi:'/bee/order/new/waithandgoods/bill/allNotApply?ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID=',
                orderId: '',
                titleList:{
                    'WAIT':'待配货',
                    'DONE':'已配货',
                    'CANCEL':'已作废'
                },
                order:{},
                tabName:'',
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
                },
                btnList:[{name:'不予配货',type:'default',event:'cancel'},{name:'部分配货',type:'default',event:'change'},{name:'全部配货',type:'primary',event:'submit'}],
                isWait: true,
                refreshPage: false
            }
        },
        components:{
            buView,
            prdCard,
            orderMsg,
            buttonBar,
            segmentingLine
        },
        mounted(){
            this.orderId = navigator.getQuery('id',this)
            this.getData(this.orderId)
            // this.getData(22044)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            update(){
                if(this.refreshPage){
                    this.getData(this.orderId)
                }   
            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID=' + id
                },res=>{
                    let info = res.data[0]
                    this.order = info
                    let addr = JSON.parse(info['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_ADDR'])
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.configData.secondTitle = info['ORDER_WAIT_HAND_GOODS_BILL.USER_NAME']
                    this.configData.title = this.titleList[info['ORDER_WAIT_HAND_GOODS_BILL.STATE']]
                    this.prdList = this.changeArr(info['ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_DETAILS'])
                    this.sumPrice = {
                        discount: info['ORDER_WAIT_HAND_GOODS_BILL.DISCOUNT_PRICE'],
                        freight: info['ORDER_WAIT_HAND_GOODS_BILL.SUM_FREIGHT_PRICE']
                    }
                    this.remark = info['ORDER_WAIT_HAND_GOODS_BILL.REMARK'] ? JSON.parse(info['ORDER_WAIT_HAND_GOODS_BILL.REMARK'])[0].remark : ''
                    obj[0].value =  info['ORDER_WAIT_HAND_GOODS_BILL.ORDER_CODE']
                    obj2[0].value = addr['USER_ADDR.USERNAME'] ? (addr['USER_ADDR.USERNAME'] + '  ' + addr['USER_ADDR.PHONE']) : ''
                    obj2[1].value = info['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_DATETIME'] ? info['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[2].value = filters.address(addr)
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(obj){
                let arr = []
                let t = false
                for(let i in obj ){
                    if(!t && obj[i]['ORDER_WAIT_HAND_GOODS_DETAIL.HAVE_SPLIT_COUNT']/1 > 0 && this.configData.title === '待配货') {
                        t = true
                        this.configData.title = '待配货（已部分配货）'
                    }
                    let num = obj[i]['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_COUNT'] - obj[i]['ORDER_WAIT_HAND_GOODS_DETAIL.HAVE_SPLIT_COUNT']
                    if(num > 0){
                        obj[i]['OVER_COUNT'] = num
                        arr.push(obj[i])
                    }      
                    
                }
                if(arr.length == 0 && this.refreshPage){
                    navigator.pop()
                }else{
                    return arr
                }
                
            },
            clickBtn(event){
                this[event]()
            },
            submit(){
                modal.confirm({message:'确认配货？', okTitle: '确认', cancelTitle:'取消'},res =>{
                    if(res == '确认'){
                        this.configData.pageRender = true
                        stream.fetch({
                            method:'GET',
                            url: this.applyApi + this.order['ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID']
                        },res =>{
                            modal.toast({message:'配货成功',duration: 1})
                            this.pagePop()
                        },res=>{
                            this.configData.pageRender = false
                        })
                    }
                })
            },
            change(){
                let arr = []
                let result = {}
                this.prdList.forEach(ele =>{
                    let num = filters.count(ele['OVER_COUNT'])
                    let prdType = ele['ORDER_WAIT_HAND_GOODS_DETAIL.PRD_TYPE'] === 'PRD' ? true : false
                    let obj ={
                        'IMG':JSON.parse(ele['ORDER_WAIT_HAND_GOODS_DETAIL.IMG'])['COVER'],
                        'NAME':ele['ORDER_WAIT_HAND_GOODS_DETAIL.PRD_NAME'],
                        'PRD_ID':ele['ORDER_WAIT_HAND_GOODS_DETAIL.PRD_ID'],
                        'SKU_ID':ele['ORDER_WAIT_HAND_GOODS_DETAIL.SKU_ID'],
                        'CODE':ele['ORDER_WAIT_HAND_GOODS_DETAIL.MANAGE_CODE'],
                        'CONTENT':ele['ORDER_WAIT_HAND_GOODS_DETAIL.SKU_CONTENT']?JSON.parse(ele['ORDER_WAIT_HAND_GOODS_DETAIL.SKU_CONTENT'])['CONTENT'] : '',
                        'TYPE':'1',
                        'UNIT':[{
                            name: ele['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_UNIT'],
                            type: ele['ORDER_WAIT_HAND_GOODS_DETAIL.UNIT_TYPE'],
                            price: filters.number(ele['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_PRICE']),
                            range: ele['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_RANGE'],
                            remark: (prdType ? (ele['ORDER_WAIT_HAND_GOODS_DETAIL.REMARK'] || '') : ''),
                            count: (prdType ? num : ''),
                            presentCount: (prdType ? '' : num),
                            sumPrice: (prdType ? filters.number(num * ele['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_PRICE']) : '')
                        }],
                        'IS_PRESENT': (prdType ? false : true),
                        'PRESENT_REMARK': (prdType ? '' : (ele['ORDER_WAIT_HAND_GOODS_DETAIL.REMARK'] || '')),
                        'IS_ORIGINAL':true,
                        'ID': ele['ORDER_WAIT_HAND_GOODS_DETAIL.ORDER_WAIT_HAND_GOODS_DETAIL_ID']
                    }
                    if(num > 0){
                        arr.push(obj)
                    }
                    
                })
                result = {
                    'ORDER_ID': this.order['ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID'],
                    'USER_NAME': this.order['ORDER_WAIT_HAND_GOODS_BILL.USER_NAME'],
                    'USER_ID': this.order['ORDER_WAIT_HAND_GOODS_BILL.UID'],
                    'ORDER_ADDR': this.order['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_ADDR'],
                    'REMARK':JSON.parse(this.order['ORDER_WAIT_HAND_GOODS_BILL.REMARK'])[0].remark,
                    'DELIVERY_DATETIME': this.order['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_DATETIME']? this.order['ORDER_WAIT_HAND_GOODS_BILL.DELIVERY_DATETIME'].substr(0,10) :'',
                    'DISCOUNT':filters.number(this.order['ORDER_WAIT_HAND_GOODS_BILL.DISCOUNT_PRICE']),
                    'FREIGHT':filters.number(this.order['ORDER_WAIT_HAND_GOODS_BILL.SUM_FREIGHT_PRICE']),
                    'DETAIL':arr
                }
                storage.setItem('SET_ORDER_INFO',JSON.stringify(result),res=>{
                    navigator.push({
                        url:'/modules/orderKing/order-index',
                        query:'?type=delivery'
                    },res=>{
                        this.refreshPage = true
                    })
                })
            },
            cancel(){
                modal.confirm({message:'确认不予配货？', okTitle: '确认', cancelTitle:'取消'},res =>{
                    if(res == '确认'){
                        this.configData.pageRender = true
                        stream.fetch({
                            method:'GET',
                            url: this.cancelApplyApi + this.order['ORDER_WAIT_HAND_GOODS_BILL.ORDER_WAIT_HAND_GOODS_BILL_ID']
                        },res =>{
                            modal.toast({message:'不予配货成功',duration: 1})
                            this.pagePop()
                        },res=>{
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