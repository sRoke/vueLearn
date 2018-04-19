<template>
    <bu-view :config="configData" @event="viewEvent">
        <order-account :price="overPrice" :over="paiedMoney" :wait="waitMoney" :remark="remark"></order-account>
        <prdCard :list="prdList" @event="setPrd"></prdCard>
        <button-bar slot="footer" @discount="setDiscount" @remark="setRemark" @submit="setPrice"></button-bar>
        <confirm slot="footer" ref="update" @ok="updatePrd">
            <confirm-update :title="nowPrd.index + '  ' + nowPrd.name" :content="nowPrd.content" ref="product" :val="nowPrd"></confirm-update>
        </confirm>
        <confirm slot="footer" ref="discount" :title="'小计'" @ok="getDiscount">
            <confirm-input :val="overPrice" ref="disprice" :title="'请输入核销金额'" @event="getDiscount"></confirm-input>
        </confirm>
        <confirm  slot="footer" ref="remark" :title="'备注'" @ok="getRemark">
            <confirm-area :val="remark" ref="remarkarea" @event="getRemark"></confirm-area>
        </confirm>
        <confirm slot="footer" ref="submit" :title="'选择收款方式'" @ok="getPrice">
            <select-area :list="payTypeList" :index="payTypeIndex" @event="changePayType"></select-area>
            <confirm-input ref="price" :val="waitMoney" :title="'应收¥' + waitMoney + '，请输入实收金额'" :type="'showTip'" @event="getPrice"></confirm-input>
        </confirm> 
    </bu-view>    
</template>     
<script>
    import buView from '../../../../components/bu-view.vue'
    import stream from '../../../../common/stream.js'
    import modal from '../../../../common/modal.js'
    import filters from '../../../../common/filters.js'
    import navigator from '../../../../common/navigator.js'
    import prdCard from './components/prd-card.vue'
    import orderAccount from './components/order-account.vue'
    import buttonBar from './components/button-bar.vue'
    import confirm from './components/confirm.vue'
    import confirmInput from './components/confirm-input.vue'
    import confirmSelect from './components/confirm-select.vue'
    import confirmTip from './components/confirm-tip.vue'
    import confirmUpdate from './components/confirm-update.vue'
    import confirmArea from './components/confirm-area.vue'
    import selectArea from './components/select-area.vue'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                showTitle: false,
                render: false,
                getById:'/bee/order/new/waitdelivergoods/bill/getById',
                confApi:'/bee/order/new/waitdelivergoods/bill/applyDeliverForAfterVerification',
                orderId: '',
                order:{},
                tabName:'',
                remark:'',
                overPrice:'',
                oldOverPrice:'',
                paiedMoney:'',
                remark:'',
                prdList:[],
                nowPrd:{},
                configData:{
                    title: '',
                    titleAlgin: 'center',
                    secondTitle: '',
                    bottom: '245px',
                    pageRender: false,
                    refresh: false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'loadmore'
                },  
                payTypeList:[],
                payTypeIndex: -1        
            }
        },
        components:{
            buView,
            buttonBar,
            prdCard,
            orderAccount,
            confirm,
            confirmInput,
            confirmSelect,
            confirmTip,
            confirmUpdate,
            confirmArea,
            selectArea
        },
        mounted(){
            this.orderId = navigator.getQuery('id',this)
            this.getData(this.orderId)
            // this.getData(21910)
            this.getPayType()
            storage.getItem('login_user_info',res =>{
                this.configData.secondTitle = '核销人 ' + JSON.parse(res.data)['USER.NAME']
            })
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            // 获取收款方式
            getPayType(){
                stream.fetch({
                    method:'GET',
                    url:'/realAcct/queryAll'
                },res =>{
                    this.payTypeList = res.data
                    if(this.payTypeList.length > 0){
                        this.payTypeIndex = 0
                    }else{
                        modal.alert({message:'请先配置收款方式'})
                    }
                },res=>{

                })
            },
            // 切换收款方式
            changePayType(index){
                this.payTypeIndex = index
            },
            getData(id){       
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_BILL_ID=' + id 
                },res=>{
                    let info = res.data[0]
                    this.order = info
                    this.configData.title = info['ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_CHILD_CODE']
                    this.overPrice = filters.number(info['ORDER_WAIT_DELIVER_GOODS_BILL.SUM_OVER_PRICE']) 
                    this.oldOverPrice = filters.number(info['ORDER_WAIT_DELIVER_GOODS_BILL.SUM_OVER_PRICE']) 
                    this.paiedMoney = filters.number(info['ORDER_WAIT_DELIVER_GOODS_BILL.PAID_PRICE'])
                    this.prdList = this.changeArr(info['ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_DETAILS'])      
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(obj){
                let arr = []
                for(let i in obj ){
                    let object = {
                        id:obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.ORDER_WAIT_DELIVER_GOODS_DETAIL_ID'],
                        index: i < 9 ? ('0' + (i/1 + 1)) : (i/1 + 1),
                        name: obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.PRD_NAME'],
                        content: obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.SKU_CONTENT'],
                        price: filters.number(obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.ORDER_PRICE']),
                        count: parseFloat(obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.ORDER_COUNT']),
                        unit: obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.ORDER_UNIT'],
                        remark:obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.REMARK'],
                        type: obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.PRD_TYPE'],
                        UNIT_TYPE: obj[i]['ORDER_WAIT_DELIVER_GOODS_DETAIL.UNIT_TYPE']
                    }
                    arr.push(object)          
                }
                return arr
            },
            setPrd(val){
                this.nowPrd = val
                this.$refs.update.show = true
            },
            updatePrd(){
                let index = parseInt(this.nowPrd.index) - 1
                let val = this.$refs.product.value
                let old = this.prdList[index]
                let res = (val.count/1 * val.price) - (old.count/1 * old.price)
                this.overPrice = this.overPrice/1 + res
                this.$refs.update.show = false
                this.$set(this.prdList,index,val)
            },
            setDiscount(){
                this.$refs.discount.show = true
            },
            getDiscount(res){
                if((res === undefined && this.$refs['disprice'].value === '') || res === ''){
                    modal.alert({message:'请输入金额'})
                    
                }else{
                    if(res !== undefined){
                        this.overPrice = res
                    }else{
                        this.overPrice = this.$refs['disprice'].value 
                    }
                    this.$refs.discount.show = false
                }
            },
            getPrice(res){
                let sum 
                if(res !== undefined){
                    sum = res
                }else{
                    sum = this.$refs['price'].value 
                }
                this.submit(sum)
            },
            setRemark(){
                this.$refs.remark.show = true
            },
            getRemark(res){
                if(res) {
                    this.remark = res
                }else{
                    this.remark = this.$refs.remarkarea.value
                }
                this.$refs.remark.show = false
            },
            setPrice(){
                this.$refs.submit.show = true
            },
            submit(sum){
                if(sum !== '' && sum !== undefined){
                    modal.confirm({message:'确认核销？', okTitle: '确认', cancelTitle:'取消'},res =>{
                        if(res == '确认'){
                            let arr = []
                            let obj 
                            this.$refs.submit.show = false
                            this.prdList.forEach(function(ele){
                                let obj = {
                                    'ORDER_WAIT_DELIVER_GOODS_DETAIL.ORDER_WAIT_DELIVER_GOODS_DETAIL_ID': ele.id,
                                    'ORDER_WAIT_DELIVER_GOODS_DETAIL.NEW_COUNT': ele.count,
                                    'ORDER_WAIT_DELIVER_GOODS_DETAIL.NEW_PRD_PRICE': ele.price,
                                    'ORDER_WAIT_DELIVER_GOODS_DETAIL.REMARK': ele.remark
                                }
                                arr.push(obj)
                            })
                            obj = {
                                'ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_BILL_ID' : this.order['ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_BILL_ID'],
                                'ORDER_WAIT_DELIVER_GOODS_BILL.SUM_OVER_PRICE' : this.overPrice,
                                'ORDER_WAIT_DELIVER_GOODS_BILL.OLD_SUM_OVER_PRICE' : this.oldOverPrice,
                                'REAL_MONEY':sum,
                                'ACCOUNT_ID':this.payTypeList[this.payTypeIndex]['REAL_ACCT.REAL_ACCT_ID'],
                                'ORDER_WAIT_DELIVER_GOODS_BILL.REMARK' : this.remark,
                                'ORDER_WAIT_DELIVER_GOODS_BILL.ORDER_WAIT_DELIVER_GOODS_DETAILS': JSON.stringify(arr)
                            }
                            this.configData.pageRender = true
                            stream.fetch({
                                method:'POST',
                                url: this.confApi,
                                body: obj
                            },res =>{
                                modal.toast({message:'核销成功', duration: 1.5})
                                storage.setItem('order_page_refresh','true',res=>{
                                    setTimeout(()=>{
                                        navigator.pop()
                                    },1500)
                                })
                            },res =>{
                                this.configData.pageRender = false
                            })
                        }
                    })
                }else{
                    modal.alert({message:'请输入金额'})
                }                     
            }
        },
        computed:{
            waitMoney(){
                return filters.number(this.overPrice - this.paiedMoney)
            }
        }
    };
</script>