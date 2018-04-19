<template>
<prd-view @over="backTo" :render="render" :count="count">
    <header-search slot="header" @event="search" @clean="cleanSearch"></header-search>
    <!-- 菜单栏 -->
    <class-bar :list="classList" ref="class" @event="getPrd"></class-bar>
    <product :list="productList" :config="pageConfig" @select="selectPrd" @load="loadmore" :count="addPrdContent" :repos="reposId"></product>
    <prdSetConfirm slot="confirm" :display="setDisplay" :data="prdData" @close="closeSetConfirm" @delete="deletePrd" @change="changeAddList"></prdSetConfirm>
</prd-view>
</template>
<script>
    import stream from '../../../common/stream.js' 
    import navigator from '../../../common/navigator.js' 
    import modal from '../../../common/modal.js'
    import prdSetConfirm from '../components/prd-set-confirm.vue'
    import prdView from './components/prd-view.vue'
    import classBar from './components/class-bar.vue'
    import headerSearch from './components/header-search.vue'
    import product from './components/product.vue'
    const storage = weex.requireModule('storage')
    const globalEvent = weex.requireModule('globalEvent')
    export default {
        data(){
            return{ 
                productClassUrl:"/bee/prdclass/query?PRODUCT_CLASS.IS_DEL=-1",
                prdApi:'/bee/product/query?HAS_REPOS=true&IS_DEL=-1&PAGE_SIZE=20&UID=',
                classList:[],
                baceClass:"&CLASS_ID=",
                baceSort:"&ORDERBY=PRODUCT_SPU.SORT_NUM+DESC,PRODUCT_SPU.",
                sortType:"ADD_DATETIME+DESC",
                baceBrandId : "&BRAND_ID=",
                baceTagId : "&TAG=",
                
                tagId:"",
                brandId:"",
                filterUrl:"123",

                productContaniner:{

                },
                classId:'',
                productList:[],
                addList:[],
                addPrdContent:{},
                pageNumber: 1,
                setDisplay: false,
                typeObj:{
                    'return':'-1',
                    'add': '1'
                },
                pageType:'',
                prdData:{},
                render: false,
                selectIndex: '',
                pageConfig:'',
                reposId:'',
                supplier:''
            }            
        },
        components:{
            headerSearch,
            classBar,
            product,
            prdSetConfirm,
            prdView
        },
        mounted(){
            let type = navigator.getQuery('type',this)
            this.pageConfig = navigator.getQuery('page',this)
            this.pageType = this.typeObj[type] || '1'
            this.reposId = navigator.getQuery('repos',this)
            this.supplier = navigator.getQuery('supplier',this)

            storage.getItem('select_client_msg',res=>{
                this.prdApi = this.prdApi + JSON.parse(res.data)['BUYER.UID']+'&PN='
                this.getPrd()
            })
            if(typeof(globalEvent.addEventListener) == "function"){
                globalEvent.addEventListener("globalScan", val => {
                    var value = this.getDataByUrl('params',val.scanInfo)
                    if(value){
                        this.search(value)
                    }else{
                        this.search(val.scanInfo)
                    }       
                });
            }
        },
        computed:{
            count(){
                return this.addList.length
            }
        },
        methods: {
            /*
                商品搜索
            */
            search(keys){
                this.render = true
                this.$refs.class.recover()
                stream.fetch({
                    method:"GET",
                    url:this.prdApi + 1 + '&SEARCH_SIGN=' + encodeURI(keys),
                },res =>{
                    this.productList = res.data
                },res =>{
                    this.render = false
                })
            },
            cleanSearch(){
                this.productList = this.productContaniner[this.classId == '' ? '0' : this.classId]
            },
            /*启动已选择商品填写数量 修改价格*/
            setPrd(){
                if(this.addList.length == 0){
                    modal.toast({message:'没有选择商品呦',duration:1})
                }else{
                    this.setDisplay = true
                }
            },
            backTo(){
                if( this.addList.length > 0 ){
                    storage.setItem('new_cart_list',JSON.stringify( this.addList ),res =>{
                        
                    })
                }
                navigator.pop()
            },
            closeSetConfirm(){
                this.setDisplay = false
            },
            selectPrd(val,index){
                if(this.addPrdContent[val['PRODUCT_SPU.PRD_ID']]){
                    this.addList.forEach((ele,index) =>{
                        if(ele['PRD_ID'] == val['PRODUCT_SPU.PRD_ID']){
                            this.prdData = ele
                            return
                        }
                    })
                    this.setDisplay = true
                    this.selectIndex = index 
                }else{
                    let sku = val['SKU_LIST'][0]
                    this.getPurchasePrice(sku, res=>{
                        /*

                            处理商品多单位 把所有单位放在数组中 用来统一管理   大  中  小  三单位

                        */
                        let unitList = []
                        if(sku['PRODUCT_SKU.LARGE_UNIT_NAME']){
                            unitList.push({
                                name: sku['PRODUCT_SKU.LARGE_UNIT_NAME'],
                                type: 'large',
                                price: res.largePrice/1 == NaN ? 0 : res.largePrice/1,
                                range: sku['PRODUCT_SKU.L_UNIT_RANGE'],
                                remark:'',
                                count:'',
                                presentCount:'',
                                sumPrice:0
                            })
                        }
                        if(sku['PRODUCT_SKU.BIG_UNIT_NAME']){
                            unitList.push({
                                name: sku['PRODUCT_SKU.BIG_UNIT_NAME'],
                                type: 'big',
                                price: res.bigPrice/1 == NaN ? 0 : res.bigPrice/1,
                                range: sku['PRODUCT_SKU.UNIT_RANGE'],
                                remark:'',
                                count:'',
                                presentCount:'',
                                sumPrice:0
                            })
                        }
                        if(sku['PRODUCT_SKU.UNIT']){
                            unitList.push({
                                name: sku['PRODUCT_SKU.UNIT'],
                                type: 'small',
                                price: res.price/1 == NaN ? 0 : res.price/1,
                                range: 1,
                                remark:'',
                                count:'',
                                presentCount:'',
                                sumPrice:0
                            })
                        }


                        this.prdData = {
                            'IMG':sku['PRODUCT_SKU.IMG']['COVER'],
                            'NAME':val['PRODUCT_SPU.PRD_NAME'],
                            'PRD_ID':val['PRODUCT_SPU.PRD_ID'],
                            'SKU_ID':sku['PRODUCT_SKU.SKU_ID'],
                            'CODE':sku['PRODUCT_SKU.MANAGE_CODE'],
                            'CONTENT':sku['PRODUCT_SKU.SKU_CONTENT']['CONTENT'],
                            'TYPE':this.pageType,
                            'IS_PRESENT':false,
                            'PRESENT_REMARK': '',
                            'UNIT': unitList
                        }
                        this.setDisplay = true
                        this.selectIndex = index   
                    })   
                }          
            },
            /*

                获取上次采购价 并确认当前应该显示出来的价格

            */
            getPurchasePrice(sku,callback){
                if(this.pageConfig == 'purchase'){
                    this.render = true
                    stream.fetch({
                        method:"GET",
                        url:'/user/product/price/getLastPurchasePrdPrice?PN=1&PAGE_SIZE=1&USER_PRODUCT_PRICE.SUPPLIER_ID=' + this.supplier + '&USER_PRODUCT_PRICE.SKU_ID=' + sku['PRODUCT_SKU.SKU_ID']
                    },res=>{
                        if(res.data[0]){
                            let val = res.data[0]['USER_PRODUCT_PRICE.CURRENT_PRD_PRICE']
                            callback({
                                price:val,
                                bigPrice: sku['PRODUCT_SKU.BIG_UNIT_PRICE'],
                                largePrice: sku['PRODUCT_SKU.LARGE_UNIT_PRICE']
                            })
                        }else{
                            callback({
                                price: sku['PRODUCT_SKU.COST_S_UNIT'] && sku['PRODUCT_SKU.COST_S_UNIT'] != null ? sku['PRODUCT_SKU.COST_S_UNIT'] : 0,
                                bigPrice: sku['PRODUCT_SKU.BIG_UNIT_PRICE'],
                                largePrice: sku['PRODUCT_SKU.LARGE_UNIT_PRICE']
                            })
                        }
                        
                    },res=>{
                        this.render = false
                    })
                }else{
                    callback({
                        price:sku['PRODUCT_SKU.ORDER_PRICE'],
                        bigPrice: sku['PRODUCT_SKU.BIG_UNIT_PRICE'],
                        largePrice: sku['PRODUCT_SKU.LARGE_UNIT_PRICE']
                    })
                }
                
            },
            changeAddList(obj){
                if(typeof obj == 'object'){
                    let count = this.getCount(obj)
                    if(!this.addPrdContent[obj.PRD_ID]){
                        this.addList.push(obj)
                    }else{
                        this.addList.forEach((ele,index) =>{
                            if(ele.PRD_ID == obj.PRD_ID){
                                this.addList.splice(index,1,obj)
                            }
                        })
                    }
                    this.addPrdContent[obj.PRD_ID] = count
                    this.$set(this.productList,this.selectIndex,this.productList[this.selectIndex])
                }else{
                    this.deletePrd()
                }                       
            },
            getCount(val){
                let prd = ''
                let present = 0
                let obj = {
                    'small' : '小',
                    'big':'中',
                    'large': '大'
                }
                val.UNIT.forEach(ele =>{
                    if(ele.count > 0){
                        prd += ele.count + obj[ele.type]
                    }
                    if(ele.presentCount > 0){
                        present += ele.presentCount/1
                    }
                })
                return prd + (present > 0 ? (present + '赠') : '')
            },
            deletePrd(){    
                let id = this.productList[this.selectIndex]['PRODUCT_SPU.PRD_ID']           
                if(this.addPrdContent[id]){
                    this.addList.forEach((ele,index) =>{
                        if(ele.PRD_ID === id){
                            this.addList.splice(index,1)
                        }
                    })
                    delete this.addPrdContent[id]
                    this.$set(this.productList,this.selectIndex,this.productList[this.selectIndex])
                }            
            },
            getPrd(classid){
                let api = ''
                let id = classid ? classid : '0'
                if(this.productContaniner[id]){
                    this.productList = this.productContaniner[id]
                    let length = this.productList.length
                    this.pageNumber = length%20 == 0 ? length /20 : (parseInt(length /20) + 1)
                    this.productList.forEach(ele =>{
                        if(this.addPrdContent[ele['PRODUCT_SPU.PRD_ID']]){
                            ele.select = true
                        }
                    })
                }else{
                    this.pageNumber = 1
                    api = this.prdApi + this.pageNumber + this.baceSort + this.sortType + this.baceBrandId + this.baceClass + classid
                    this.renderPrd(api,classid)
                }                
            },
            renderPrd(api,id){
                stream.fetch({
                    method:"GET",
                    url:api
                },res=>{
                    if(this.pageNumber > 1){

                        this.productList = this.productList.concat(res.data)

                    }else{                   
                        this.productList = res.data
                    } 
                    this.productContaniner[id?id:'0'] = this.productList                                  
                    
                },res=>{

                })
            },
            loadmore: function(e){
                this.pageNumber ++ 
                let classid = this.$refs.class.classId
                let api = this.prdApi + this.pageNumber + this.baceSort + this.sortType + this.baceBrandId + this.baceClass + classid
                this.renderPrd(api,classid)              
            },
            getDataByUrl (name, url) {
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url); 
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },                                                                                       
            stopClick: function(e){

            },

        }
    }
</script>