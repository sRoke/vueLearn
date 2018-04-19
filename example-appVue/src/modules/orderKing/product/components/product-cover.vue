<template>
   <div class="product-list">
        <scroller class="prd-list" scroll-direction="vertical" loadmoreoffset="10" @loadmore="loadmore">
        <div class="prd" v-for="(product,index) in list" @click="selectPrd(product,index)">    
            <image class="prd-img" :src="product['PRODUCT_SPU.PRD_IMG']['COVER'] | image(300)" resize="cover"></image>
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
    .product-list{
        flex-direction: column;
        width: 750;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
    }
    .prd-list{
        flex-direction: column;
        width: 750;
        background-color: #ffffff;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
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
    .prd{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;
        width: 750px;
    }
    .prd:active{
        background-color: #D8D8D8;
    }
    .prd-con{
        width: 530px;
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