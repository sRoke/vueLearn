<template>
   <div class="product-list">
        <!-- 商品操作区 -->
        <div class="product-list-header">
            <div class="product-list-handle">
                <div class="product-list-handle-div">
                    <text class="product-handle-text">排序</text>
                    <image :src="sort" class="sort-icon"></image>
                </div> 
                <div class="product-list-handle-div">
                    <text class="product-handle-text">筛选</text>
                    <image :src="filter" class="filter-icon"></image>
                </div>
            </div>
        </div>
        <scroller class="prd-list" scroll-direction="vertical" loadmoreoffset="10" @loadmore="loadmore">
        <div class="prd" v-for="(product,index) in list" @click="selectPrd(product,index)">
            
            <image class="prd-img" :src="product['PRODUCT_SPU.PRD_IMG']['COVER'] | image(120)" resize="cover"></image>
            <div class="prd-con">
                <div>
                <text class="font32 fontc-33 line2">{{product['PRODUCT_SPU.PRD_NAME']}}</text>
                </div>
                <div class="row-between">
                    <div class="row">
                        <text class="font36 fontc-33">{{ config == 'purchase' ? product['SKU_LIST'][0]['PRODUCT_SKU.COST_S_UNIT']  : product['MIN_PRICE'] | price}}</text>
                        <text class="font20 fontc-66">/{{product['SKU_LIST'][0]['PRODUCT_SKU.UNIT']}}</text>                        
                    </div>
                   <!--  <div class="prd-sel" :class="[product.select? 'bg-ac' : '']" >
                        <image :src="product.select?selected:noselect" class="sel-icon"></image>
                    </div> -->
                    <text class="font22 fontc-66">{{count[product['PRODUCT_SPU.PRD_ID']]}}</text>
                </div>              
            </div>
            <div class="prd-tip" :class="[(repos ? (product['SKU_LIST'][0]['REPOS'] && product['SKU_LIST'][0]['REPOS'][repos]? product['SKU_LIST'][0]['REPOS'][repos]['REPOS_PRODUCT.STOCK']:'0') : (product['SKU_LIST'][0]['REPOS_NUM']? product['SKU_LIST'][0]['REPOS_NUM']:'0')) > 99?'bg-ac':'bg-only']">
                <text class="font26 fontc-ff">余{{repos ? (product['SKU_LIST'][0]['REPOS'] && product['SKU_LIST'][0]['REPOS'][repos]? product['SKU_LIST'][0]['REPOS'][repos]['REPOS_PRODUCT.STOCK']:'0') : (product['SKU_LIST'][0]['REPOS_NUM']? product['SKU_LIST'][0]['REPOS_NUM']:'0') | count}}</text>
            </div>
            <div class="selected" v-if="count[product['PRODUCT_SPU.PRD_ID']]">
                <image :src="selected" class="selected-icon"></image>
            </div>
        </div>
        </scroller>
    </div>
</template>
<style scoped>
    .sort-icon{
        width:20; 
        height: 10;
    }
    .filter-icon{
        width:20;
        height: 20;
    }
    .product-list{
        flex-direction: column;
        width: 562;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
    }
    .prd-list{
        flex-direction: column;
        width: 562;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 81;
    }
    .product-list-header{
        flex-direction: row;
        border-bottom-color: #d6d7dc;
        border-bottom-style: solid;
        border-bottom-width: 1;
        height: 80;
        align-items: center;
    }
    .product-list-handle{
        flex-direction: row;
        width: 563;
    }
    .product-list-handle-right{
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 80;
        height: 80;
    }
    .product-list-handle-div{
        flex-direction: row;    
        align-items: center;
        justify-content: center;
        height: 80;
        width: 285;
    }
    .product-handle-text{
        font-size: 32;
        color: #333333;
        margin-right: 10;
    }
    .product-sort{
        position: absolute;
        top: 80;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
    }
    .product-class{
        position: absolute;
        top: 160;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.4);
    }
    .product-class-item{
        background-color: #ffffff;
        
    }
    .product-class-row{
        width: 570;
        height: 80;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-right: 30;
        padding-left: 77;
        border-bottom-color: #D9D9D9;
        border-bottom-style: solid;
        border-bottom-width: 1;
    }
    .product-sort-tab{
        background-color: #ffffff;
        padding-left: 77;
        padding-right: 77;
        justify-content: center;
        align-items: space-between;
    }
    .product-sort-text{
        font-size: 28;
        color: #333333;
        height: 70;
        line-height: 60;
    }
    .product-filter{
        position: absolute;
        top: 80;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff;
        flex-direction: column;
        justify-content: space-between;
    }
    .product-filter-title{
        padding-left: 70;
        padding-right: 70;
        font-size: 26;
        color: #666666;
        padding-top: 20;
        padding-bottom: 20; 
    }
    .product-filter-tab{
        padding-left: 70;
        padding-right: 50;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .product-filter-div{
        background-color: #F2F2F2;
        border-style: solid;
        border-width: 1;
        border-radius: 4;
        height: 60;
        padding-right: 25;
        padding-left: 25;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-right: 20;
        margin-bottom: 20;
    }
    .product-filter-type{
        font-size: 30;
    }
    .product-filter-footer{
        height: 104;
        border-top-color: #D9D9D9;
        border-top-style: solid;
        border-top-width: 1;
        padding-left: 70;
        padding-right: 70;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }
    .product-filter-reset{
        height: 65;
        width: 184;
        border-radius: 6;
        border-color: #D9D9D9;
        border-style: solid;
        border-width: 1;
        align-items: center;
        justify-content: center;
    }
    .product-filter-submit{
        height: 65;
        width: 184;
        border-radius: 6;
        background-color: #CF411B;
        margin-left: 30;
        align-items: center;
        justify-content: center;
    }
    .prd{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;
        width: 562px;
    }
    .prd:active{
        background-color: #D8D8D8;
    }
    .prd-con{
        width: 350px;
        height: 203px;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
        justify-content: space-between;
        padding-top: 10px;
        padding-bottom: 5px;
        padding-right: 25px;
    }
    .prd-img{
        width: 195px;
        height: 195px;
    }
    .sel-icon{
        width: 23px;
        height: 17px;
    }
    .font36{
        font-size: 36px;
    }
    .font32{
        font-size: 32px;
    }
    .font30{
        font-size: 30px;
    }
    .font20{
        font-size: 20px;
    }
    .fontc-33{
        color: #333;
    }
    .font26{
        font-size: 26px;
    }
    .font22{
        font-size: 22px;
    }
    .fontc-99{
        color: #999;
    }
    .fontc-66{
        color: #666;
    }
    .fontc-ff{
        color: #fff;
    }
    .fontc-red{
        color: #cf411b;
    }
    .row-between{
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .prd-sel{
        width: 54px;
        height: 54px;
        justify-content: center;
        align-items: center;
        
        border-color: #cf411b;
        border-width: 1px;
        border-radius: 3px;
        margin-bottom: 10px;
    }
    .bg-ac{
        background-color: #cf411b;
    }
    .line2{
        lines:2;
        text-overflow: ellipsis;
    }
    .prd-tip{
        position: absolute;
        top: 5px;
        left: 5px;
        padding-left: 10px;
        padding-right: 15px;
        border-bottom-right-radius: 99px;
        border-top-right-radius: 99px;
        height: 40px;
        justify-content: center;
    }
    .bg-only{
        background-color: #FF640E;
    }
    .selected{
        background-color: rgba(0,0,0,0.25);
        width: 195px;
        height: 195px;
        position: absolute;
        top: 5px;
        left: 5px;
        justify-content: center;
        align-items: center;
    }
    .selected-icon{
        width: 52px;
        height: 38px;
    }
</style>
<script>
    import icon from '../../../../assets/orderIcon/icon.js' 
    import filters from '../../../../common/filters.js' 
    export default {
        data(){
            return {
                sort: icon.sort,
                filter: icon.filter,
                selected: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/bigSelected.png',
            }
        },
        props:['list','count','config','repos'],
        filters:{
            price:filters.price,
            count:filters.count,
            image:filters.image
        },
        methods:{
            selectPrd(item,index){
                this.$emit('select',item,index)
            },
            loadmore(){
                this.$emit('load')
            }
        }
    }
</script>