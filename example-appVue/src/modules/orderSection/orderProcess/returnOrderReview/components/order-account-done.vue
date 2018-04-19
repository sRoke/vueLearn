<template>
    <div class="item">
        <div class="big-div">
            <div class="div-item">
                <text class="font30 fontc-op">核销金额</text>
                <text class="font60 fontc-red">{{price | price}}</text>
            </div>
            <div class="div-item">
                <text class="font30 fontc-op">实收金额</text>
                <text class="font60 fontc-red">{{over | price}}</text>
            </div>
            <div class="div-item">
                <text class="font30 fontc-op">挂账金额</text>
                <text class="font60 fontc-red">{{dept | price}}</text>
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
        props:['price','over','dept','remark'],
        filters:{
            price:filters.price
        }
    }
</script>