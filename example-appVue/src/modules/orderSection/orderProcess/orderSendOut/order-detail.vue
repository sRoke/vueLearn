<template>
    <bu-view :config="configData" @event="viewEvent">
            <segmentingLine></segmentingLine>
            <orderMsg :list="formData" :remark="remark"></orderMsg>
            <prdCard :list="prdList" :msg="sumPrice"></prdCard>
        <buttonBar slot="footer" :data="btnList" :show="isWait" @event="clickBtn"></buttonBar>
        <confirm slot="footer" :display="showConfirm" :remark="submitRemark"  @getInput="getInput" @close="close" @submit="submit"></confirm> 
    </bu-view>
</template>     
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
    import confirm from '../../components/confirm.vue'
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
                    loadmoreEvent:'loadmore',
                    viewappear:'update'

                },
                getById:'/bee/order/new/commonbill/getById',
                applyApi:'/bee/order/new/commonbill/passWaitHandgoodsBill',
                orderId: '',
                titleList:{
                    'WAIT':'待发货',
                    'DONE':'已发货',
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
                btnList:[{name:'发货',type:'primary',event:'change'}],
                isWait: true,
                submitRemark:'',
                showConfirm: false,
                orderChildId: ''
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
            // this.getData(28887)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            update(){
                storage.getItem('order_detail_update',res =>{
                    if(res.result == 'success' && res.data == 'true'){                  
                        storage.removeItem('order_detail_update',res =>{
                            storage.setItem('order_list_update','true',res =>{
                                this.getData(this.orderId)
                            })
                        })                
                    }
                })         
            },
            getData(id){
              
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID=' + id
                },res=>{
                    let result = res.data[0]
                    let info = JSON.parse(result['ORDER_CHECK_COMMON_BILL.ORDER_INFO'])
                    this.order = result
                    let addr = info['ORDER_CHILD.DELIVERY_ADDR']
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.prdList = info['ORDER_CHILD.ORDER_DETAILS']
                    this.orderChildId = info['ORDER_CHILD.ORDER_CHILD_ID']
                    this.configData.secondTitle = result['ORDER_CHECK_COMMON_BILL.USER_NAME']
                    this.configData.title = this.titleList[result['ORDER_CHECK_COMMON_BILL.STATE']]
                    if(result['ORDER_CHECK_COMMON_BILL.STATE'] !== 'WAIT'){
                        this.btnList = [{name:'针式三联打印',type:'primary',event:'printTrue'},{name:'掌上便携打印',type:'primary',event:'printFalse'}]
                    }
                    this.sumPrice = {
                        discount: info['ORDER_CHILD.DISCOUNT_PRICE'],
                        freight: info['ORDER_CHILD.SUM_FREIGHT_PRICE'],
                        overPrice: info['ORDER_CHILD.SUM_OVER_PRICE']
                    }
                    this.remark = info['ORDER_CHILD.REMARK'] ? info['ORDER_CHILD.REMARK'][0].remark : ''
                    obj[0].value =  info['ORDER_CHILD.ORDER_CHILD_CODE']
                    obj2[0].value = addr['USER_ADDR.USERNAME'] ? (addr['USER_ADDR.USERNAME'] + '  ' + addr['USER_ADDR.PHONE']) : ''
                    obj2[1].value = info['ORDER_CHILD.DELIVERY_DATETIME'] ? info['ORDER_CHILD.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[2].value = filters.address(addr)
                },res=>{
                    this.configData.pageRender = false
                })
            },
            clickBtn(event){
                this[event]()
            },
            getInput(val,type){
                this[type == 'remark' ? 'submitRemark' : type] = val
            },
            close(){
                this.showConfirm = false
            },
            change(){
                this.showConfirm = true
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
            },
            submit(){
                modal.confirm({message:'确认发货？', okTitle: '确认', cancelTitle:'取消'},res =>{
                    if(res == '确认'){
                        this.showConfirm = false
                        this.configData.pageRender = true
                        stream.fetch({
                            method:'POST',
                            url: this.applyApi,
                            body: {
                                'ORDER_CHECK_COMMON_BILL.STATE' : 'DONE',
                                'ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID' : this.order['ORDER_CHECK_COMMON_BILL.ORDER_CHECK_COMMON_BILL_ID'],
                                'ORDER_CHECK_COMMON_BILL.ORDER_CHILD_ID' : this.order['ORDER_CHECK_COMMON_BILL.ORDER_CHILD_ID'],
                                'ORDER_CHECK_COMMON_BILL.REMARK' : this.submitRemark
                            }
                        },res =>{
                            modal.toast({message:'发货成功',duration: 1})
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