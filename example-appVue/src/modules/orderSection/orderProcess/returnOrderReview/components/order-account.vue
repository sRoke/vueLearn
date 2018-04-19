<template>
    <div class="item">
        <div class="big-div">
            <div class="div-item">
                <text class="font30 fontc-op">退单金额</text>
                <text class="fontc-red" :class="[repo?'font50' : 'font60']">{{price | price}}</text>
            </div>
            <div class="div-item" v-if="!repo">
                <text class="font30 fontc-op">退货方式</text>
                <text class="fontc-red" :class="[repo?'font50' : 'font60']">{{type}}</text>
            </div>
            <div class="div-item" v-if="repo">
                <text class="font30 fontc-op">退货仓库</text>
                <text class="fontc-red" :class="[repo?'font50' : 'font60']">{{repo}}</text>
            </div>
        </div>
        <div class="remark" v-if="remark">
            <text class="font30 fontc-g">{{remark}}</text>
        </div>
    </div>
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .big-div{
        background-color: #F7F7F7;
        width: 690px;
        height: 202px;
        border-radius: 18px;
        flex-direction: row;
        align-items:center;
        margin-bottom: 20px;
    }
    .div-item{
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .remark{
        width: 690px;
        align-items: center;
        justify-content: center;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #EBEBEB;
    }
    .font60{
        font-size: 60px;
    }
    .font30{
        font-size: 30px;
    }
    .font28{
        font-size: 28px;
    }
    .font50{
        font-size: 45px;
    }
    .fontc-g{
        color: #0F9B80;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-op{
        color: #333;
        opacity: 0.69;
    }
</style>
<script>
    import filters from '../../../../../common/filters.js'
    export default {
        props:['price','type','remark','repo'],
        filters:{
            price:filters.price
        }
    }
</script>