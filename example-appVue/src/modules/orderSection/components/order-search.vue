<template>
    <div class="item">
        <div class="search">
            <image :src="searchicon" class="icon"></image>
            <input class="input" placeholder="客户名/订单号" />
        </div>
    </div>
</template>     
<style scoped>
   .item{
        width: 750px;
        margin-top: 30px;
        align-items: center;
   }
   .search{
        width: 690px;
        height: 66px;
        background-color: #F3F3F3;
        border-radius: 10px;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        padding-right: 20px;
   }
   .input{
        width: 600px;
        height: 64px;
        background-color: #F3F3F3;
        font-size: 28px;
        color: #333;
        padding-left: 10px;
   }
   .icon{
        width: 30px;
        height: 30px;
   }
</style>
<script>
    import icon from '../../../assets/orderIcon/icon.js'
    export default {
        data() {
            return {
                searchicon:icon.searchIcon
            }
        }
    };
</script>