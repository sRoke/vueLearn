<!-- 

    商品库存详情

 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
    <div class="header" v-if="prdInfo['PRODUCT_SPU.PRD_NAME']">
        <image class="image" :src="JSON.parse(prdInfo['PRODUCT_SKU.IMG']).COVER | image(120)"></image>
        <div class="header-con">
            <text class="f32 cb line2">{{prdInfo['PRODUCT_SPU.PRD_NAME']}}</text>
            <text class="f30 c99">{{prdInfo['PRODUCT_SKU.OWN_SKU_CODE']}}</text>
        </div>   
    </div>
    <div class="sec">
        <div class="sec-header border" v-if="reposInfo.length > 1">
            <text class="f30 cff line">总计</text>
            <div class="row">
                <div class="sec-item">
                    <div class="tip bg-red">
                        <text class="f22 cff">可售</text>    
                    </div>
                    <text class="f30 cff">{{allCount | count}}</text>
                </div>
                <div class="sec-item2">
                    <div class="tip bg-def">
                        <text class="f22 cff">锁</text>    
                    </div>
                    <text class="f30 cff">{{lockCount | count}}</text>
                </div>
            </div>
        </div>
        <div class="sec-header" v-for="item in reposInfo">
            <text class="f30 cff line">{{item['REPOSITORY.REPOS_NAME']}}</text>
            <div class="row">
                <div class="sec-item">
                    <div class="tip bg-red">
                        <text class="f22 cff">可售</text>    
                    </div>
                    <text class="f30 cff">{{item['REPOS_PRODUCT.STOCK'] - item['REPOS_PRODUCT.LOCK_COUNT'] | count}}</text>
                </div>
                <div class="sec-item2">
                    <div class="tip bg-def">
                        <text class="f22 cff">锁</text>    
                    </div>
                    <text class="f30 cff">{{item['REPOS_PRODUCT.LOCK_COUNT'] | count}}</text>
                </div>
            </div>
        </div>
    </div>
    <div class="nav">
        <div class="nav-item">
            <div class="row">
                <div class="tab" v-for="(item,index) in tabList" :class="[index == tabIndex? 'border-ac': 'border-no']" @click="tabClick(index)">
                    <text class="f32 cff">{{item.name}}</text>
                </div>
            </div>
        </div>
        <div class="nav-con nav-item" v-if="tabIndex == 0" v-for="item in historyList">
            <div>
                <div class="row">
                    <div class="tip bo-red" v-if="item['REPOS_IN_OUT_DETAIL.COUNT'] > 0">
                        <text class="f26 cr">入库</text>
                    </div>
                    <div class="tip bo-green" v-if="item['REPOS_IN_OUT_DETAIL.COUNT'] < 0">
                        <text class="f26 cg">出库</text>
                    </div>
                    <text class="f32 cff">{{type[item['REPOS_IN_OUT.TYPE']]}}</text>
                </div>
                <text class="f30 c66 mt">{{(item['REPOS_IN_OUT.IN_OUT_DATETIME']).substr(0,16)}}</text>
            </div>
            <div class="end">
                <text class="f34 cff">{{item['REPOS_IN_OUT_DETAIL.COUNT'] | count}}{{item['REPOS_IN_OUT_DETAIL.UNIT']}}</text>
                <text class="f28 c99 mt">{{item['REPOS_IN_OUT_DETAIL.REPOS_NAME']}} 余{{item['REPOS_IN_OUT_DETAIL.CURRENT_STOCK'] | count}}{{item['REPOS_IN_OUT_DETAIL.UNIT']}}</text>
            </div>  
        </div>
        <div class="nav-con nav-item" v-if="tabIndex == 1" v-for="item in lockHistoryList">
            <div>
                <div class="row">
                    <text class="f32 cff">销售锁定</text>
                </div>
                <text class="f30 c66 mt">{{(item['REPOS_LOCK.ADD_DATETIME']).substr(0,16)}}</text>
            </div>
            <div class="end">
                <text class="f34 cff">{{item['REPOS_LOCK_DETAIL.LOCK_COUNT'] - item['REPOS_LOCK_DETAIL.RELEASE_COUNT'] | count}}{{item['REPOS_LOCK_DETAIL.UNIT']}}</text>
                <text class="f28 c99 mt">{{item['REPOS_LOCK_DETAIL.REPOS_NAME']}}</text>
            </div>  
        </div>
    </div>
  </bu-view>
</template>    
<style scoped>
    .header{
        width: 750px;
        padding-top: 30px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 37px;
        flex-direction: row;
        background-color: #171B22;
    }
    .border{
        border-top-width: 1px;
        border-top-color: #363636;
        border-bottom-width: 1px;
        border-bottom-color: #363636;
    }
    .nav{
        width: 750px;
        padding-top: 30px;
        align-items: center;
    }
    .end{
        align-items: flex-end;
    }
    .nav-item{
        width: 690px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #2b2b2b;
    }
    .nav-con{
        height: 152px;
    }
    .sec{
        width: 750px;
        padding-bottom: 20px;
        align-items: center;
        background-color: #171B22;
    }
    .sec-header{
        height: 90px;
        width: 690px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .sec-item{
        width: 200px;
        flex-direction: row;
        align-items: center;
    }
    .sec-item2{
        width: 140px;
        flex-direction: row;
        align-items: center
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .tip{
        justify-content: center;
        align-items: center;
        padding-left: 5px;
        padding-right: 5px;
        margin-right: 10px;
        border-radius: 4px;
    }
    .tab{
        height: 85px;
        margin-right: 58px;
        justify-content: center;
        align-items: center; 
        border-top-width: 3px;
        border-top-color: rgba(0,0,0,0); 
        border-bottom-width: 3px;
    }
    .border-ac{
        border-bottom-color: #cf411b;
    }
    .border-no{
        border-bottom-color: rgba(0,0,0,0);
    }
    .bg-red{
        background-color: #cf411b;
    }
    .bg-def{
        background-color: #383838;
    }
    .bo-red{
        border-color: #cf411b;
        border-width: 1px;
    }
    .bo-green{
        border-color: #49BA06;
        border-width: 1px;
    }
    .header-con{
        padding-left: 15px;
        padding-top: 10px;
    }
    .image{
        background-color: #333;
        width: 148px;
        height: 148px;
    }
    .line2{
        width: 500px;
        text-overflow: ellipsis;
        lines: 2;
    }
    .line{
        width: 340px;
        text-overflow: ellipsis;
        lines: 1;
    }
    .f32{
        font-size: 32px;
    }
    .f34{
        font-size: 34px;
    }
    .f30{
        font-size: 30px;
    }
    .f28{
        font-size: 28px;
    }
    .f26{
        font-size: 26px;
    }
    .f22{
        font-size: 22px;
    }
    .cff{
        color: #fff;
    }
    .c33{
        color: #333;
    }
    .c66{
        color: #666;
    }
    .c99{
        color: #999;
    }
    .cb{
        color: #BABABA;
    }
    .cr{
        color: #cf411b;
    }
    .cg{
        color: #49BA06;
    }
    .mt{
        margin-top: 8px;
    }
</style> 
<script>
    import buView from '../../components/bu-view.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    import filters from '../../common/filters.js'
    import modal from '../../common/modal.js'
    export default {
        data() {
            return {
                filterIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/filterIocn.png',
                // 页面配置
                configData:{
                    theme:'dark',
                    title: '库存详情',
                    titleAlgin: 'left',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore'
                },
                getPrdApi:'/bee/product/sku/getBySkuId?PRODUCT_SKU.SKU_ID=',
                getHistoryApi:'/bee/repos/reposInOutDetail/getBySkuIdAndReposId?REPOS_IN_OUT_DETAIL.SKU_ID=',
                getLockHistoryApi:'/bee/reposLockDetail/getBySkuIdAndReposIdNoAllRelease?REPOS_LOCK_DETAIL.SKU_ID=',
                historyList: [],
                lockHistoryList:[],
                skuId:'',
                type:{
                    'IN_CG':'采购入库',
                    'IN_TH':'退货入库',
                    'IN_DK':'调库入库',
                    'IN_PY':'盘盈入库',
                    'IN_QC':'初期入库',
                    'IN_SG':'手工入库',
                    'OUT_XS':'销售出库',
                    'OUT_SH':'损坏出库',
                    'OUT_DK':'调库出库',
                    'OUT_PK':'盘亏出库',
                    'OUT_SG':'手工出库'
                },
                prdInfo:{},
                reposInfo:[],
                tabList:[{
                    name:'库存明细',
                    pn:1
                },{
                    name:'锁定明细',
                    pn:1
                }],
                tabIndex:0
            };
        },
        components:{
            buView
        },
        filters:{
            image: filters.image,
            count: filters.count
        },
        mounted(){
            this.skuId = navigator.getQuery('id',this)
            this.getData(this.skuId)
            this.getHistory(this.skuId)
        },
        computed:{
            allCount(){
                let sum = 0
                this.reposInfo.forEach(ele =>{
                    let count = ele['REPOS_PRODUCT.STOCK'] - ele['REPOS_PRODUCT.LOCK_COUNT']
                    sum += count
                })
                return sum
            },
            lockCount(){
                let sum = 0
                this.reposInfo.forEach(ele =>{
                    let count = ele['REPOS_PRODUCT.LOCK_COUNT']
                    sum += count/1
                })
                return sum
            }
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            getHistory(id){
                stream.fetch({
                    method:'GET',
                    url: this.getHistoryApi + id + '&PAGE_SIZE=20&PN=' + this.tabList[0].pn
                },res=>{
                    if(this.historyList.length > 0 && res.data.length == 0){
                        this.tabList[0].pn --
                    }
                    this.historyList = this.historyList.concat(res.data) 
                },res=>{})
            },
            getData(id){
                stream.fetch({
                    method:'GET',
                    url: this.getPrdApi + id
                },res=>{
                    this.prdInfo = res.data[0]
                    this.reposInfo = res.extraData['REPOS_INFO']
                },res=>{})
            },
            getLockHistory(id){
                stream.fetch({
                    method:'GET',
                    url: this.getLockHistoryApi + id + '&PAGE_SIZE=20&PN=' + this.tabList[1].pn
                },res=>{
                    if(this.lockHistoryList.length > 0 && res.data.length == 0){
                        this.tabList[1].pn --
                    }
                    this.lockHistoryList = this.lockHistoryList.concat(res.data)
                },res=>{})
            },
            tabClick(index){
                if(index != this.tabIndex){
                    this.tabIndex = index
                    if(this.tabIndex == 0 && this.historyList.length == 0){
                        this.getHistory(this.skuId)
                    }else if(this.tabIndex == 1 && this.lockHistoryList.length == 0){
                        this.getLockHistory(this.skuId)
                    }
                }
            },
            loadmore(){
                if(this.tabIndex == 0 && this.historyList.length != 0){
                    this.tabList[0].pn ++ 
                    this.getHistory(this.skuId)
                }else if(this.tabIndex == 1 && this.lockHistoryList.length != 0){
                    this.tabList[1].pn ++ 
                    this.getLockHistory(this.skuId)
                }
            }
        }
    };
</script>