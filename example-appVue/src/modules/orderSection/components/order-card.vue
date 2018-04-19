<template>
    <div class="item">
        <div class="card" v-for="item in list" @click="jump(item.id)">
            <div class="left-bar">
                <image class="image" :src="item.img | image(100)" resize="cover"></image>
                <div class="content">
                    <div class="row">
                        <div class="tag" v-if="type" :class="[item.type +'border']">
                            <text class="font24" :class="[item.type]">{{type[item.type]}}</text>
                        </div>
                        <text class="font32 fontc-33 line1 mg">{{item['name']}}</text>
                    </div>                   
                    <text class="font30 fontc-66 line1">{{item['code']}}</text>
                </div>
            </div>
            <div class="right-bar">
                <text class="font34 fontc-33 mg">{{item['money'] | price}}</text>
                <text class="font28 fontc-99">{{item['class'] + '种，' + item['count'] + '件商品'}}</text>
            </div>
        </div>
    </div>   
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .card{
        width: 690px;
        height: 179px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .card:active{
        
        background-color: #D8D8D8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .tag{
        width: 85px;
        height: 30px;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        border-width: 1px;
        border-radius: 4px;
    }
    .WAITborder{
        border-color: #CF411B;
    }
    .DELIVERYborder{
        border-color: #0F9B80;
    }
    .DONEborder{
        border-color: #650EB1;
    }
    .CANCELborder{
        border-color: #FF640E;
    }
    .WAIT{
        color: #CF411B;
    }
    .DELIVERY{
        color: #0F9B80;
    }
    .DONE{
        color: #650EB1;
    }
    .CANCEL{
        color: #FF640E;
    }
    .line1{
        width: 300px;
        lines:1;
        text-overflow: ellipsis;
    }
    .left-bar{
        flex-direction: row;
        align-items: center;
    }
    .right-bar{
        position: absolute;
        height: 179px;
        right: 0;
        justify-content: center;
        align-items: flex-end;
    }
    .image{
        width: 112px;
        height: 112px;
        border-radius: 18px;
    }
    .mg{
        margin-bottom: 5px;
    }
    .content{
        margin-left: 20px;
    }
    .font34{
        font-size: 34px;
    }
    .font32{
        font-size: 32px;
    }
    .font30{
        font-size: 30px;
    }
    .font28{
        font-size: 28px;
    }
    .font24{
        font-size: 24px;
    }
    .fw{
        font-weight: bold;
    }
    .fontc-33{
        color: #000;
    }
    .fontc-66{
        color: #666;
    }
    .fontc-99{
        color: #999;
    }
</style>
<script>
    import filters from '../../../common/filters.js'
    import navigator from '../../../common/navigator.js'
    export default {
        data(){
            return {
                
            }
        },
        filters:{
            image:filters.image,
            price: filters.price
        },
        props:['list','type'],
        methods:{
            jump(id){
                this.$emit('jump',id)
            }
        }
    }
</script>