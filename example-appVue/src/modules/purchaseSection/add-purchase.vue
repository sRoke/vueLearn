<!-- 访销订单 开单 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
      <prd-list :list="cartList" @event="setPrd" :overprice="sumOverPrice" :discount="discount" :freight="freight" ></prd-list>
      <bottomBar 
        slot="footer" 
        :index="index" 
        :config="'purchase'" 
        :showdel="purchaseChange"
        :type="'add'"
        :repos="repos['REPOSITORY.REPOSITORY_ID']" 
        :supplier= "supplier['SUPPLIER.SUPPLIER_ID']"
        ref="button"
        @event="tabClick"  
        @addprd="scanAddPrd" 
        @del="deletePurchase"
      ></bottomBar>
      <confirm slot="footer" :price="sumOverPrice" :display="index" :payplan="payPlan" :date="date" :discount="discount" :freight="freight" :remark="remark" @getPayPlan="getPayPlan" @getInput="getInput" @close="close" @getDate="getDate" @submit="nextStep"></confirm> 
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
        discount:0,
        freight:0,
        date:'',
        remark:'',
        purchaseId:'',
        index: -1,

        postPurchaseApi:'/simple/purchaseBill/addPurchase',
        modifyApi:'/simple/purchaseBill/modifyAll',
        settingPrd:{},
        payPlan:{},
        setDisplay: false,
        settingIndex: -1,
        showTitle: false,
        configData:{
            title: '采购单',
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
        showSucess: false,
        showType: false,
        orderPrice: 0,
        purchaseType: true,
        repos:{},
        supplier:{},
        purchaseChange: false
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
        let id = navigator.getQuery('id',this)
        if(id){
          /*
            当ID存在的时候 表示当前为修改待入库采购单页面
          */
          this.getPruchaseData(id)
          this.purchaseChange = true
        }else{
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
        } 
    },
    methods:{
      viewEvent(event,callback){
          this[event](callback);
      },
      /*删除待入库单*/
      deletePurchase(){
        modal.confirm({
          message: '确认删除此待入库单？',
          okTitle:'确认',
          cancelTitle:'取消'
        },res =>{
          if(res === '确认'){
            this.configData.pageRender = true
            stream.fetch({
              method:'POST',
              url: '/simple/purchaseBill/delByWait?PURCHASE_BILL.PURCHASE_BILL_ID=' + this.purchaseId
            },res =>{
              modal.alert({message:'采购单已删除',duration: 1})
              storage.setItem('order_page_refresh','true',res=>{
                  setTimeout(()=>{
                      navigator.pop()              
                  },1000)
              })               
            },() =>{
              this.configData.pageRender = false
            })
          }
        })
      },
      nextStep(){
        this.index = -1
        this.showType = true
      },
      //  提交订单
      submit(){
        if(this.cartList.length > 0){
          let form = this.renderFormData()
          modal.confirm({
            message: '确认提交采购单？',
            okTitle:'确认',
            cancelTitle:'取消'
          },res =>{
            if(res === '确认'){
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
        this.index = val
      },
      getPayPlan(val){
        this.payPlan = val
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
                  "PURCHASE_BILL_DETAIL.SKU_ID": item['SKU_ID'],
                  "PURCHASE_BILL_DETAIL.PRD_ID": item['PRD_ID'],
                  'PURCHASE_BILL_DETAIL.PURCHASE_COUNT': ele.count,
                  'PURCHASE_BILL_DETAIL.PURCHASE_PRD_OVER_PRICE': ele.price,
                  'PURCHASE_BILL_DETAIL.REMARK': ele.remark,
                  'PURCHASE_BILL_DETAIL.PRD_TYPE': 'PRD',
                  'PURCHASE_BILL_DETAIL.UNIT_TYPE': ele.type
                })    
            }
            if(ele.presentCount > 0 && item['IS_PRESENT']){
              prdList.push({
                  "PURCHASE_BILL_DETAIL.SKU_ID": item['SKU_ID'],
                  "PURCHASE_BILL_DETAIL.PURCHASE_COUNT": item['PRD_ID'],
                  'PURCHASE_BILL_DETAIL.PURCHASE_COUNT': ele.presentCount,
                  'PURCHASE_BILL_DETAIL.PURCHASE_PRD_OVER_PRICE': '0',
                  'PURCHASE_BILL_DETAIL.REMARK': item.PRESENT_REMARK,
                  'PURCHASE_BILL_DETAIL.PRD_TYPE': 'PRESENT',
                  'PURCHASE_BILL_DETAIL.UNIT_TYPE': ele.type
                })
            }
          })
        }) 
        return {
            "PURCHASE_BILL.PURCHASE_BILL_ID": this.purchaseId,
            "PURCHASE_BILL.FREIGHT_PRICE": this.freight,
            "PURCHASE_BILL.DISCOUNT_PRICE": this.discount,
            "PURCHASE_BILL.DELIVERY_DATETIME": this.date,
            "PURCHASE_BILL.REMARK": this.remark,
            "PURCHASE_BILL.REPOS_ID": this.repos['REPOSITORY.REPOSITORY_ID'],
            "PURCHASE_BILL.REPOS_NAME": this.repos['REPOSITORY.REPOS_NAME'],
            "PURCHASE_BILL.SUPPLIER_ID":  this.supplier['SUPPLIER.SUPPLIER_ID'],
            "PURCHASE_BILL.SUPPLIER_NAME": this.supplier['SUPPLIER.SUPPLIER_NAME'],
            "PURCHASE_BILL.REPOS_TYPE": this.repos['REPOSITORY.TYPE'],
            "PURCHASE_BILL.HAS_IN_REPOS": this.purchaseType,
            "PURCHASE_BILL.PURCHASE_BILL_DETAILS": JSON.stringify(prdList)
        }
        
      },
      /*获取采购单详情*/
      getPruchaseData(id){
        this.configData.pageRender = true
        stream.fetch({
            method:'GET',
            url: '/simple/purchaseBill/getById?PURCHASE_BILL.PURCHASE_BILL_ID=' + id
        },res=>{
            let result = res.data[0]
            this.cartList = this.renderPurchase(result['PURCHASE_BILL.PURCHASE_BILL_DETAILS'])
            this.purchaseId = result['PURCHASE_BILL.PURCHASE_BILL_ID']
            this.repos = {
              'REPOSITORY.TYPE' : result['PURCHASE_BILL.REPOS_TYPE'],
              'REPOSITORY.REPOS_NAME' : result['PURCHASE_BILL.REPOS_NAME'],
              'REPOSITORY.REPOSITORY_ID':result['PURCHASE_BILL.REPOS_ID']
            }
            this.supplier = {
              'SUPPLIER.SUPPLIER_ID' : result['PURCHASE_BILL.SUPPLIER_ID'],
              'SUPPLIER.SUPPLIER_NAME' : result['PURCHASE_BILL.SUPPLIER_NAME']
            }
            this.configData.secondTitle = this.supplier['SUPPLIER.SUPPLIER_NAME']
            this.discount = filters.number(result['PURCHASE_BILL.DISCOUNT_PRICE'])
            this.freight = filters.number(result['PURCHASE_BILL.FREIGHT_PRICE'])
            this.remark = result['PURCHASE_BILL.REMARK'] ? result['PURCHASE_BILL.REMARK'] : ''
            this.date = result['PURCHASE_BILL.DELIVERY_DATETIME'] ? result['PURCHASE_BILL.DELIVERY_DATETIME'].substr(0,10) : ''
        },res=>{
            this.configData.pageRender = false
        })
      },
      renderPurchase(list){
          let arr = []
          list.forEach(ele =>{
              let num = filters.count(ele['PURCHASE_BILL_DETAIL.PURCHASE_COUNT'])
              let prdType = ele['PURCHASE_BILL_DETAIL.PRD_TYPE'] === 'PRD' ? true : false
              let obj ={
                  'IMG':JSON.parse(ele['PURCHASE_BILL_DETAIL.PRD_IMG'])['COVER'],
                  'NAME':ele['PURCHASE_BILL_DETAIL.PRD_NAME'],
                  'PRD_ID':ele['PURCHASE_BILL_DETAIL.PRD_ID'],
                  'SKU_ID':ele['PURCHASE_BILL_DETAIL.SKU_ID'],
                  'CODE':ele['PURCHASE_BILL_DETAIL.OWN_SKU_CODE'],
                  'CONTENT':ele['PURCHASE_BILL_DETAIL.SKU_CONTENT']?JSON.parse(ele['PURCHASE_BILL_DETAIL.SKU_CONTENT'])['CONTENT'] : '',
                  'TYPE':'1',
                  'UNIT':[{
                      name: ele['PURCHASE_BILL_DETAIL.PURCHASE_UNIT'],
                      type: ele['PURCHASE_BILL_DETAIL.UNIT_TYPE'],
                      price: filters.number(ele['PURCHASE_BILL_DETAIL.PURCHASE_PRICE']),
                      range: ele['PURCHASE_BILL_DETAIL.PURCHASE_RANGE'],
                      remark: (prdType ? (ele['PURCHASE_BILL_DETAIL.REMARK'] || '') : ''),
                      count: (prdType ? num : ''),
                      presentCount: (prdType ? '' : num),
                      sumPrice: (prdType ? filters.number(num * ele['PURCHASE_BILL_DETAIL.PURCHASE_PRICE']) : '')
                  }],
                  'IS_PRESENT':(prdType ? false : true),
                  'PRESENT_REMARK':(prdType ? '' : (ele['PURCHASE_BILL_DETAIL.REMARK'] || '')),
                  'IS_ORIGINAL':true,
              }
              arr.push(obj)
              
          })
          return arr
      },
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
        return s - this.discount + this.freight/1
      }
    }
  }
</script>