<!-- 访销订单 开单 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
      <prd-list :list="cartList" @event="setPrd" :overprice="sumOverPrice"></prd-list>
      <bottomBar 
        slot="footer" 
        :index="index" 
        :config="'purchase'"
        :type="'return'"
        :repos="repos['REPOSITORY.REPOSITORY_ID']" 
        :supplier= "supplier['SUPPLIER.SUPPLIER_ID']"
        ref="button"
        @event="tabClick"  
        @addprd="scanAddPrd" 
      ></bottomBar>
      <confirm slot="footer" :price="sumOverPrice" :display="index" :remark="remark" :returntype="returnType" :returnmoney="returnMoney" @getInput="getInput" @close="close" @submit="submit" @getReturnType="getReturnType"></confirm> 
      <prdSetConfirm slot="footer" :display="setDisplay" :data="settingPrd" @close="closeSetConfirm" @delete="deletePrd" @change="changePrd"></prdSetConfirm>
      <select-purchase-type slot="footer" :show="showType" @close="closeSelectType" @submit="submit" @select="changePurchaseType" :type="purchaseType"></select-purchase-type>
      <success-tip slot="footer" :show="showSucess" :name="configData.secondTitle" :money="orderPrice" :tip="'新采购单创建成功'" :btn1="'false'" @jump="jumpDetail" @close="closeSccess"></success-tip>
  </bu-view>
</template>
<script>
  import buView from '../../components/bu-view.vue'
  import bottomBar from '../orderKing/components/bottom-bar.vue'
  import successTip from '../orderKing/components/success-tip.vue'
  import prdList from '../orderKing/components/prd-list.vue'
  import confirm from '../orderKing/components/confirm.vue'
  import prdSetConfirm from '../orderKing/components/prd-set-confirm.vue'
  import selectPurchaseType from './components/select-purchase-type.vue'
  import stream from '../../common/stream.js'
  import navigator from '../../common/navigator.js'
  import modal from '../../common/modal.js'
  import filters from '../../common/filters.js'
  const storage = weex.requireModule('storage')
  export default {
    data: {
        cartList:[],
        returnType:{
            name:'退款并退货',
            type:'GOODS_MONEY'
        },
        returnMoney:'',
        remark:'',
        purchaseId:'',
        index: -1,
        postPurchaseApi:'/simple/purchase/returnBill/addPurchaseReturn',
        settingPrd:{},
        setDisplay: false,
        settingIndex: -1,
        clientId:'',
        clientName:'',
        configData:{
            title: '采购退货',
            titleAlgin: 'center',
            secondTitle:'',
            bottom: '99px',
            pageRender: false,
            refresh:false,
            refreshEvent: 'refresh',
            loadmore: false,
            loadmoreEvent:'',
            viewappear:'refreshPrd'
        },
        address:{},
        showSucess: false,
        showType: false,
        orderPrice: 0,
        purchaseType: true,
        repos:{},
        supplier:{}
    },
    components:{
      buView,
      prdList,
      bottomBar,
      confirm,
      prdSetConfirm,
      selectPurchaseType,
      successTip
    },
    created(){
        
    },
    mounted(){
        storage.getItem('repos_supplier_info',res =>{
            let msg = JSON.parse(res.data)
            this.repos = msg.repos
            this.supplier = msg.supplier
            this.configData.secondTitle = this.supplier['SUPPLIER.SUPPLIER_NAME']
            storage.getItem('add_purchase_list',res =>{
              if(res.result =='success'){
                this.cartList = JSON.parse(res.data)
              }
            })
        }) 
    },
    methods:{
      viewEvent(event,callback){
          this[event](callback);
      },
      //  提交订单
      submit(){
        if(this.cartList.length > 0){
          let form = this.renderFormData()
          modal.confirm({
            message: '确认提交采购退货单？',
            okTitle:'确认',
            cancelTitle:'取消'
          },res =>{
            if(res === '确认'){
              this.index = -1
              this.configData.pageRender = true
              this.showType = false
              stream.fetch({
                method:'POST',
                url: this.purchaseChange ? this.modifyApi : this.postPurchaseApi,
                body: form
              },res =>{
                this.orderPrice = this.sumOverPrice
                this.cartList = []
                storage.removeItem('add_purchase_list',res =>{})
                storage.setItem('order_page_refresh','true',res=>{}) 
                this.showSucess = true
                this.orderId = res.extraData['ORDER_PARENT.ORDER_PARENT_ID']                 
              },() =>{
                this.configData.pageRender = false
              })
            }
          })
        }else{
          modal.toast({message:'请先选择商品',duration: 1})
        }   
      },
      getReturnType(val){
        this.returnType = val
      },
      changePurchaseType(val){
        this.purchaseType = val
      },
      closeSelectType(){
        this.showType = false
      },
      closeSccess(){
        this.showSucess = false
      },
      jumpDetail(){
        navigator.push({
          url:'/modules/orderSection/salemanOrder/order-detail',
          query:'?id=' + this.orderId
        })
      },
      refreshPrd(){
        storage.getItem('new_cart_list',res =>{
          this.cartList = JSON.parse(res.data).concat( this.cartList )
          if(!this.purchaseChange){
            storage.setItem('add_purchase_list',JSON.stringify(this.cartList),res => {})
          }
          storage.removeItem('new_cart_list',res =>{
          })          
        })      
      },
      tabClick(val){
        this.returnMoney = this.sumOverPrice
        this.index = val
      },
      getInput(val,type){
        this[type] = val
      },
      getDate(ret){
        this.date = ret
      },
      close(){
        this.index = -1
      },
      closeSetConfirm(){
        this.setDisplay = false
        if(!this.purchaseChange){
          storage.setItem('add_purchase_list',JSON.stringify(this.cartList))
        }
      },
      deletePrd(){
        this.cartList.splice(this.settingIndex,1)
      },
      setPrd(index){
        this.settingIndex = index
        this.settingPrd = this.cartList[this.settingIndex]
        this.setDisplay = true
      },
      changePrd(obj){
        if(typeof obj == 'object'){
          if(this.settingIndex === -1){

            this.$refs.button.startScan()
            this.cartList.unshift(obj)
          }else{
            this.cartList[this.settingIndex] = obj
            this.$set(this.cartList,this.settingIndex,this.cartList[this.settingIndex])
          } 
        }else if(this.settingIndex !== -1){
          this.deletePrd()
        }
      },
      scanAddPrd(obj){
        this.settingIndex = -1
        this.settingPrd = obj
        this.setDisplay = true
      },
      renderFormData(){
        let prdList = []
        this.cartList.forEach(item => {
          item.UNIT.forEach(ele =>{
            if(ele.count > 0){
                prdList.push({
                  "PURCHASE_RETURN_BILL_DETAIL.SKU_ID": item['SKU_ID'],
                  "PURCHASE_RETURN_BILL_DETAIL.PRD_ID": item['PRD_ID'],
                  'PURCHASE_RETURN_BILL_DETAIL.RETURN_COUNT': ele.count,
                  'PURCHASE_RETURN_BILL_DETAIL.RETURN_PRD_OVER_PRICE': ele.price,
                  'PURCHASE_RETURN_BILL_DETAIL.REMARK': ele.remark,
                  'PURCHASE_RETURN_BILL_DETAIL.UNIT_TYPE': ele.type
                })    
            }
          })
        }) 
        return {
            'PURCHASE_RETURN_BILL.SUM_OVER_PRICE': this.returnMoney,
            'PURCHASE_RETURN_BILL.RETURN_TYPE': this.returnType.type,
            "PURCHASE_RETURN_BILL.REMARK": this.remark,
            "PURCHASE_RETURN_BILL.REPOS_ID": this.repos['REPOSITORY.REPOSITORY_ID'],
            "PURCHASE_RETURN_BILL.REPOS_NAME": this.repos['REPOSITORY.REPOS_NAME'],
            "PURCHASE_RETURN_BILL.SUPPLIER_ID":  this.supplier['SUPPLIER.SUPPLIER_ID'],
            "PURCHASE_RETURN_BILL.SUPPLIER_NAME": this.supplier['SUPPLIER.SUPPLIER_NAME'],
            "PURCHASE_RETURN_BILL.REPOS_TYPE": this.repos['REPOSITORY.TYPE'],

            "PURCHASE_RETURN_BILL.PURCHASE_RETURN_BILL_DETAILS": JSON.stringify(prdList)
        }
        
      }
    },
    computed:{
      sumOverPrice(){
        let s = 0
        this.cartList.forEach(item =>{
          item.UNIT.forEach(ele =>{
            if(ele.count > 0){
              s += (ele.count * ele.price)
            }
          })
        })
        return s
      }
    }
  }
</script>