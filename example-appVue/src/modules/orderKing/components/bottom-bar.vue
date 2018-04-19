<template>
    <!-- 访销订单底部操作栏 -->
    <div class="foot">
        <image class="liner" resize="cover" :src="liner"></image>
        <div class="bottom" >    
            <div class="row">
                <div class="btn" @click="tabClick(1)">
                    <image class="add" resize="cover" :src="add"></image>
                </div>
                <div class="btn ma-l" @click="jumpSearch">
                    <image class="search" resize="cover" :src="search"></image>
                </div>
                <div class="btn ma-l" @click="scanEvent">
                    <image class="scan" resize="cover" :src="scan"></image>
                </div>
            </div>
            <div class="row">
                <div class="btn" v-if="showdel" @click="deleteData">
                    <image class="del" resize="cover" :src="delIcon"></image>
                </div>
                <div class="btn" @click="tabClick(2)">
                    <image class="conf" resize="cover" :src="conf"></image>
                </div>
            </div>      
        </div>
    </div>   
</template>     
<style scoped>
    .foot{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .bottom{
        width: 750px;
        height: 98px;
        background-color: #fff;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .btn{
        width: 97px;
        height: 97px;
        align-items: center;
        justify-content: center;
    }
    .btn:active{
        background-color: #D8D8D8;
    }
    .conf{
        width: 41px;
        height: 31px;
    }
    .add{
        width: 41px;
        height: 41px;
    }
    .scan{
        width: 34px;
        height: 34px;
    }
    .del{
        width: 34px;
        height: 34px;
    }
    .search{
        width: 36px;
        height: 36px;
    }
    .write{
        width: 37px;
        height: 36px;
    }
    .liner{
        width: 750px;
        height: 9px;
    }
    .ma-l{
        margin-left: 20px;
    }
</style>
<script>
    import ordericon from '../../../assets/orderIcon/icon.js'
    import navigator from '../../../common/navigator.js'
    import stream from '../../../common/stream.js'
    const scanEvent = weex.requireModule('scanEvent')
    const modal = weex.requireModule('modal')
    const globalEvent = weex.requireModule('globalEvent')
    export default {
        data() {
            return {
                conf: ordericon.conf,
                write: ordericon.write,
                writeAc: ordericon.writeAction,
                search:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/bottom-search.png',
                scan:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/bottom-scan.png',
                delIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/del-black.png',
                add:ordericon.add,
                liner:ordericon.liner,
            };
        },
        props:['index','type','client','config','showdel','repos','supplier'],
        created(){

        },
        mounted(){
            if(typeof(globalEvent.addEventListener) == "function"){
                globalEvent.addEventListener("globalScan", val => {
                    var value = this.getDataByUrl('params',val.scanInfo)
                    if(value){
                        this.searchPrd(value)
                    }else{
                        this.searchPrd(val.scanInfo)
                    }    
                });
            }
        },
        methods:{
            searchPrd(keys){
                stream.fetch({
                    method:"GET",
                    url:'/bee/product/query?HAS_REPOS=true&IS_DEL=-1&PAGE_SIZE=20&PN=1&SEARCH_SIGN=' + encodeURI(keys) + (this.config !== 'purchase' ? ('&UID=' + this.client) : ''),
                },res =>{
                    let val = res.data[0]
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


                        let obj = {
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
                        this.$emit('addprd',obj) 
                    })  
                },res =>{
                    
                })
            },
            /*

                获取上次采购价 并确认当前应该显示出来的价格

            */
            getPurchasePrice(sku,callback){
                if(this.config == 'purchase'){
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

                    })
                }else{
                    callback({
                        price:sku['PRODUCT_SKU.ORDER_PRICE'],
                        bigPrice: sku['PRODUCT_SKU.BIG_UNIT_PRICE'],
                        largePrice: sku['PRODUCT_SKU.LARGE_UNIT_PRICE']
                    })
                }
                
            },
            tabClick(val){
                if(val == 1){
                    navigator.push({
                        'url': '/modules/orderKing/product/prd-list',
                        'query': this.setQuery()
                    },res=>{})
                }else{
                    this.$emit('event',val)
                }               
            },
            jumpSearch(){
                
                navigator.push({
                    'url': '/modules/orderKing/product/prd-search',
                    'query': this.setQuery()
                },res=>{})
            },
            scanEvent(){
                if(typeof(scanEvent.startScan) == "function"){
                    scanEvent.startScan()
                }
            },
            setQuery(){
                let query
                if(this.type == 'return'){
                    query = '?type=return'
                }else{
                    query = '?type=add'
                }
                if(this.config == 'purchase'){
                    query += '&page=purchase'
                }else{
                    query += '&page=order'
                }
                if(this.repos){
                    query += '&repos=' + this.repos + '&supplier=' + this.supplier

                }
                return query
            },
            deleteData(){
                this.$emit('del')
            },
            startScan(){
                setTimeout(()=>{
                    this.scanEvent()
                },500)
            },
            getDataByUrl (name, url) {
                name = name.replace(/[\[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url); 
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
        }
    };
</script>