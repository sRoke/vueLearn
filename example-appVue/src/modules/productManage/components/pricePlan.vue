<template>
    <div class="item">
        <div class="div">
            <div class="con">
                <text class="title">客户等级</text>
                <text class="title al" v-for="item in unit">{{type ? item.name : '价格'}}</text>
            </div>
            <div class="con" v-for="item in pricePlan">
                <text class="text fc-66">{{item['BUYER_LEVEL.LEVEL_NAME']}}</text>
                <div v-for="item2 in item.unit">
                    <text class="text al" :class="[item2.state ? 'fc-33' : 'fc-66']">{{item2.price | priceFilter}}</text>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
    import filters from '../../../common/filters.js'
    export default {
        props:['list','type','price','unit','setted'],
        mounted(){

        },
        computed: {
            pricePlan() {
                let arr = []
                this.list.forEach(ele => {
                    ele.unit = []
                    this.unit.forEach(ele2 => {
                        if (this.setted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']] && this.setted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']][ele2.type]) {
                            ele.unit.push({
                                state:  true,
                                price:  this.setted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']][ele2.type]
                            })
                        }else {
                            ele.unit.push({
                                state:  false,
                                price:  this.price[ele2.type] * ele['BUYER_LEVEL.PRICE_OFF']/100
                            })
                        }
                        
                    })
                    arr.push(ele)
                })
                return arr
            }
        },
        filters: {
            priceFilter: filters.price
        }
    }
</script>
<style scoped>
    .item{
        background-color: #fff;
        align-items: center;
        width: 750px;
    }
    .div{
        width: 690px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #d8d8d8;
    }
    .title{
        width: 172px;
        font-size: 24px;
        color: #999;
    }
    .text{
        width: 172px;
        font-size: 32px;
    }
    .fc-66{
        color: #666;
    }
    .fc-33{
        color: #333;
    }
    .al{
        text-align: right;
    }
    .con{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
</style>