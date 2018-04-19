<template>
    <bu-view :config="configData" @event="viewEvent">
        <order-account :price="overPrice" :type="orderType" :remark="remark" :repo="orderRepo"></order-account>
        <prdCard :display="orderState != 'DONE' " :list="prdList" @event="setPrd"></prdCard>
        <button-bar :display="orderState != 'DONE' " slot="footer" @discount="setDiscount" @remark="setRemark" @submit="setPrice"></button-bar>
        <confirm slot="footer" ref="update" @ok="updatePrd">
            <confirm-update :title="nowPrd.INDEX + '  ' + nowPrd.NAME" :content="nowPrd.CONTENT" ref="product" :val="nowPrd"></confirm-update>
        </confirm>
        <confirm slot="footer" ref="discount" :title="'调整'" @ok="getDiscount">
            <confirm-input :val="overPrice" ref="disprice" :title="'请输入调整后金额'" @event="getDiscount"></confirm-input>
        </confirm>
        <confirm  slot="footer" ref="remark" :title="'备注'" @ok="getRemark">
            <confirm-area :val="remark" ref="remarkarea" @event="getRemark"></confirm-area>
        </confirm>
        <confirm slot="footer" ref="submit" :title="showSelect ? '选择退货仓' : '' " @ok="getPrice">
            <div v-if="showSelect">
                <select-area :list="reposList" :index="reposIndex" @event="changeRepos"></select-area>
            </div>
            <confirm-input ref="price" :val="overPrice" :title="'应退¥' + overPrice + '，请输入实退金额'" :type="'showTip'" @event="getPrice"></confirm-input>
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
                getById:'/bee/returnOrder/order/getById',
                confApi:'/bee/returnOrder/order/checkAndPass',
                orderId: '',
                order:{},
                orderState:'',
                tabName:'',
                remark:'',
                overPrice:'',
                orderType:'',
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
                orderRepo:'',
                reposList:[],
                reposIndex: -1        
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
            // this.getData(1271)
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            // 切换收款方式
            changeRepos(index){
                this.reposIndex = index
            },
            getRepos(){
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url:'/bee/repos/repository/queryAll'
                },res=>{
                    this.reposList = res.data
                    if(this.reposList.length > 0){
                        this.reposIndex = 0
                    }
                },res=>{
                    this.configData.pageRender = false
                })
            },
            getData(id){       
                this.configData.pageRender = true
                stream.fetch({
                    method:'GET',
                    url: this.getById + '?ORDER_RETURN_ID=' + id 
                },res=>{
                    let info = res.data[0]
                    this.orderState = info['ORDER_RETURN.STATUS']
                    this.orderRepo = info['ORDER_RETURN.RETURN_TYPE'] == 'GOODS_MONEY' && this.orderState == 'DONE' ? info['ORDER_RETURN.REPOS_NAME'] : ''
                    this.remark =  this.orderState == 'DONE' ? info['ORDER_RETURN.RETURN_REASON'] : ''
                    this.order = info
                    this.configData.title = info['ORDER_RETURN.ORDER_RETURN_CODE']
                    this.configData.secondTitle = info['ORDER_RETURN.USER_NAME']
                    this.overPrice = filters.number(info['ORDER_RETURN.SUM_OVER_RETURN_PRICE']) 
                    this.orderType = info['ORDER_RETURN.RETURN_TYPE'] == 'GOODS_MONEY' ? '退款并退货' : '仅退款'
                    this.prdList = this.changeArr(info['ORDER_RETURN.ORDER_DETAILS'])
                    if(this.orderState == 'DONE'){
                        this.configData.bottom == '0px'
                    }    
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changeArr(obj){
                let arr = []
                for(let i in obj ){
                    let prd = JSON.parse(obj[i]['ORDER_RETURN_DETAIL.PRD_SNAPSHOT'])
                    let res = {}
                    res.PRD_ID = obj[i]['ORDER_RETURN_DETAIL.PRD_ID']
                    res.SKU_ID = obj[i]['ORDER_RETURN_DETAIL.SKU_ID']
                    res.NAME = prd['PRODUCT_SPU.PRD_NAME']
                    res.UNIT = obj[i]['ORDER_RETURN_DETAIL.ORDER_UNIT']
                    res.PRICE = filters.number(obj[i]['ORDER_RETURN_DETAIL.ORDER_PRICE']) 
                    res.COUNT = filters.count(obj[i]['ORDER_RETURN_DETAIL.ORDER_COUNT'])
                    res.REMARK = obj[i]['ORDER_RETURN_DETAIL.REMARK']
                    res['UNIT_TYPE'] = obj[i]['ORDER_RETURN_DETAIL.UNIT_TYPE']
                    res.INDEX = i < 9 ? ('0' + (i/1 + 1)) : (i/1 + 1),
                    prd['SKU_LIST'].forEach(ele=>{
                        if(ele['PRODUCT_SKU.SKU_ID'] == obj[i]['ORDER_RETURN_DETAIL.SKU_ID']){
                            
                            res.CONTENT = ele['PRODUCT_SKU.SKU_CONTENT']['CONTENT']
                        }
                    })
                    arr.push(res)
                }
                return arr
            },
            setPrd(val){
                this.nowPrd = val
                this.$refs.update.show = true
            },
            updatePrd(){
                let index = parseInt(this.nowPrd.INDEX) - 1
                let val = this.$refs.product.value
                let old = this.prdList[index]
                let res = (val.COUNT/1 * val.PRICE) - (old.COUNT/1 * old.PRICE)
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
                if((res === undefined && this.$refs['price'].value === '') || res === ''){
                    modal.alert({message:'请输入金额'})
                }else{
                    if(res !== undefined){
                        this.overPrice = res
                    }else{
                        this.overPrice = this.$refs['price'].value 
                    }
                    this.submit()
                } 
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
                if(this.reposList.length == 0 && this.showSelect){
                    this.getRepos()
                }
            },
            submit(){
                
                modal.confirm({message:'确认核销？', okTitle: '确认', cancelTitle:'取消'},res =>{
                    if(res == '确认'){
                        let arr = []
                        let obj 
                        let repo = this.reposIndex != -1 ? this.reposList[this.reposIndex] : {
                            'REPOSITORY.REPOSITORY_ID':'',
                            'REPOSITORY.REPOS_NAME':''
                        }
                        this.$refs.submit.show = false
                        obj = {
                            'ORDER_RETURN_ID' : this.order['ORDER_RETURN.ORDER_RETURN_ID'],
                            'RETURN_PRICE' : this.overPrice,       
                            'REPOS_ID':repo['REPOSITORY.REPOSITORY_ID'],
                            'REPOS_NAME':repo['REPOSITORY.REPOS_NAME'],
                            'REASON' : this.remark,
                            'ORDER_DETAIL_LIST': JSON.stringify(this.prdList)
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
                                  
            }
        },
        computed:{
            showSelect(){
                return this.order['ORDER_RETURN.RETURN_TYPE'] != 'MONEY' ? true : false
            }
        }
    };
</script>