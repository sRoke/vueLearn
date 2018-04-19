<template>
    <div class="nav" :class="[theme == 'light' ? 'light' :'dark']">
        <scroller class="scrol" scroll-direction="horizontal">
            <div class="list" v-for="(item,i) in list">
                <div class="card" :class="[item.theme,i == 0 ? 'mg-l' : '']">
                    <text class="title">{{item.title}}</text>
                    <div class="row">
                        <text class="value font24" v-if="item.showCoin">￥</text>
                        <text class="value" :class="[(item.value + '').length > 6 ? 'font36' : 'font46']">{{item.value}}</text>
                    </div>
                </div>
            </div>  
        </scroller>
    </div>
</template>
<style scoped>
    .nav{
        width: 750px;
    }
    .light{
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-color: #D6D7DC;
    }
    .dark{
        background-color: #171B22;
    }
    .scrol{
        flex-direction: row;
        width: 750px;
        height: 215px;
    }
    .row{
        flex-direction: row;
        align-items: flex-end;
    }
    .list{
        height: 215px;
        justify-content: center;
    }
    .card{
        width: 220px;
        height: 163px;
        padding: 20px;
        border-radius: 10px;
        margin-right: 20px;
    }
    .mg-l{
        margin-left: 20px;
    }
    .title{
        font-size: 24px;
        color: #fff;
        margin-bottom: 20px;
    }
    .value{
        color: #fff;
    }
    .font36{
        font-size: 40px;
    }
    .font46{
        font-size: 46px;
    }
    .font24{
        font-size: 24px;
        padding-bottom: 2px;
    }
    .purple{
        background-color: #9839E6;
    }
    .orange{
        background-color: #FA7900;
    }
    .blue{
        background-color: #0048FF;
    }
</style>
<script>
    export default {
        props:['list','theme']
    }
</script>