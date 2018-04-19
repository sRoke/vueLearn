<template>
    <bu-view :config="configData" @event="viewEvent">
            <segmentingLine></segmentingLine>
            <orderMsg :list="formData" :remark="remark"></orderMsg>
            <prdCard :list="prdList" :msg="sumPrice"></prdCard>
        <buttonBar slot="footer" :data="btnList" :show="isWait" @event="clickBtn"></buttonBar>
        <!-- <confirm slot="footer" :display="showConfirm" :remark="submitRemark"  @getInput="getInput" @close="close" @submit="submit"></confirm>  -->
    </bu-view>
</template>     
<script>
    import buView from '../../../components/bu-view.vue'
    import stream from '../../../common/stream.js'
    import modal from '../../../common/modal.js'
    import filters from '../../../common/filters.js'
    import navigator from '../../../common/navigator.js'
    import prdCard from '../components/prd-card.vue'
    import buttonBar from '../../orderSection/components/button-bar.vue'
    import orderMsg from '../../orderSection/components/order-msg.vue'
    import segmentingLine from '../../orderSection/components/segmenting-line.vue'
    import confirm from '../../orderSection/components/confirm.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '采购单',
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
                getById:'/simple/purchaseBill/getById',
                applyApi:'/simple/purchaseBill/outReposBillByDone?PURCHASE_BILL.PURCHASE_BILL_ID=',
                orderId: '',
                order:{},
                tabName:'',
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
                        name:'收货日期',
                        value:''
                    },{
                        name:'收货仓库',
                        value:''
                    }]                   
                ],
                sumPrice:{
                    discount:0,
                    freight:0,
                    overPrice:0
                },
                btnList:[{name:'作废',type:'primary',event:'submit'}],
                isWait: true,

                showConfirm: false
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
            // this.getData(1021)
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
                    url: this.getById + '?PURCHASE_BILL.PURCHASE_BILL_ID=' + id
                },res=>{
                    let result = res.data[0]
                    this.order = result
                    let obj = this.formData[0]
                    let obj2 = this.formData[1]
                    this.prdList = result['PURCHASE_BILL.PURCHASE_BILL_DETAILS']
                    this.configData.secondTitle = result['PURCHASE_BILL.SUPPLIER_NAME']
                    this.sumPrice = {
                        discount: result['PURCHASE_BILL.DISCOUNT_PRICE'],
                        freight: result['PURCHASE_BILL.FREIGHT_PRICE'],
                        overPrice: result['PURCHASE_BILL.SUM_OVER_PRICE']
                    }
                    this.remark = result['PURCHASE_BILL.REMARK'] ? result['PURCHASE_BILL.REMARK'] : ''
                    obj[0].value =  result['PURCHASE_BILL.PURCHASE_CODE']
                    obj[1].value =  result['PURCHASE_BILL.CREATER_NAME']
                    obj2[0].value = result['PURCHASE_BILL.DELIVERY_DATETIME'] ? result['PURCHASE_BILL.DELIVERY_DATETIME'].substr(0,10) : ''
                    obj2[1].value = result['PURCHASE_BILL.REPOS_NAME']
                },res=>{
                    this.configData.pageRender = false
                })
            },
            clickBtn(event){
                this[event]()
            },
            submit(){
                modal.confirm({message:'确认作废？', okTitle: '确认', cancelTitle:'取消'},res =>{
                    if(res == '确认'){
                        this.configData.pageRender = true
                        stream.fetch({
                            method:'GET',
                            url: this.applyApi + this.order['PURCHASE_BILL.PURCHASE_BILL_ID']
                        },res =>{
                            modal.toast({message:'入库单已作废',duration: 1})
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