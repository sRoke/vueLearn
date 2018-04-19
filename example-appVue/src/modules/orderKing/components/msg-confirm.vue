<template>
    <div v-if="display == 0">
        <div class="item" @click="setDiscount" v-if="discount !== undefined">
            <text class="font-gray33 font32">优惠</text>
            <div class="row">
                <text class="font-gray33 font34" v-if="discount != 0">{{discount | price}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setReturn" v-if="returnmoney !== undefined">
            <text class="font-gray33 font32">退款</text>
            <div class="row">
                <text class="font-gray33 font34">{{returnmoney | price}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setReturnType" v-if="returntype !== undefined">
            <text class="font-gray33 font32">退货方式</text>
            <div class="row">
                <text class="font-gray33 font34 line1">{{returntype.name}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setFreight" v-if="freight !== undefined">
            <text class="font-gray33 font32">运费</text>
            <div class="row">
                <text class="font-gray33 font34" v-if="freight != 0">{{freight | price}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setDate" v-if="date !== undefined">
            <text class="font-gray33 font32">收货日期</text>
            <div class="row">
                <text class="font-gray33 font34 line1">{{date}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setAddress" v-if="address !== undefined">
            <text class="font-gray33 font32">收货地址</text>
            <div class="row">
                <text class="font-gray33 font34 line1">{{addressName}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="item" @click="setRemark" v-if="remark !== undefined">
            <text class="font-gray33 font32 ">备注</text>
            <div class="row">
                <text class="font-gray33 font34 line1">{{remark}}</text>
                <image class="item-go" :src='itemGo'></image>
            </div>
        </div>
        <div class="btn-item">
            <div class="btn" @click="submit">
                <text class="font30 font-grayff">提交</text>
            </div>
        </div>
    </div>   
</template>     

<style scoped>
    .row{
        flex-direction:row;
        align-items: center;
    }
    .font-gray33{
        color:#333;
    }
    .btn-item{
        width: 750px;
        height: 146px;
        justify-content: center;
        align-items: center;
    }
    .btn{
        width: 690px;
        height: 80px;
        align-items: center;
        justify-content: center;
        background-color: #cf411b;
        border-radius: 5px;
    }
    .btn:active{
        background-color: #C5320A;
    }
    .font-grayff{
        color:#fff;
    }
    .font34{
        font-size: 34px;
    }
    .font32{
        font-size: 34px;
    }
    .font30{
        font-size: 30px;
    }
    .item{
        width: 750px;
        height: 100px;
        padding-left: 25px;
        padding-right: 25px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .item:active{
        background-color: #d8d8d8;
    }
    .item-go{
        width: 14px;
        height: 24px;
        margin-left: 10px;
    }
    .line1{
        width: 500px;
        lines: 1;
        text-align: right;
        text-overflow: ellipsis; 
    }
</style>
<script>
    import ordericon from '../../../assets/orderIcon/icon.js'
    import stream from '../../../common/stream.js'
    import navigator from '../../../common/navigator.js'
    import modal from '../../../common/modal.js'
    import filters from '../../../common/filters.js'
    import format from '../../../common/format.js'
    const picker = weex.requireModule('picker');
    export default {
        data() {
            return {
                itemGo: ordericon.itemGo,
                
            };
        },
        props:['display','discount','freight','remark','date','address','returntype','returnmoney'],
        created(){

        },
        computed:{
            addressName(){
                if(this.address['USER_ADDR.ADDR_ID']){
                    let add = ''
                    if(this.address['USER_ADDR.ADDR_GUO'] == '中国'){
                        add = (this.address['USER_ADDR.ADDR_SHENG'] ? this.address['USER_ADDR.ADDR_SHENG'] : '') + (this.address['USER_ADDR.ADDR_SHI'] ? this.address['USER_ADDR.ADDR_SHI'] : '') + (this.address['USER_ADDR.ADDR_XIAN'] ? this.address['USER_ADDR.ADDR_XIAN'] : '') + (this.address['USER_ADDR.ADDR_DETAIL'] ? this.address['USER_ADDR.ADDR_DETAIL'] : '')
                    }else{
                        add = (this.address['USER_ADDR.ADDR_GUO'] ? this.address['USER_ADDR.ADDR_GUO'] : '') + (this.address['USER_ADDR.ADDR_DETAIL'] ? this.address['USER_ADDR.ADDR_DETAIL'] : '')
                    }
                    return add
                }else{
                    return '暂无收货地址'
                }
            }
        },
        methods:{
            //设置退货方式
            setReturnType(){
                this.$emit('event',1,'returnType')
            },
            setReturn(){
                 this.$emit('event',2,'returnMoney')
            },
            //设置优惠
            setDiscount(){
                this.$emit('event',2,'discount')
            },
            // 设置运费
            setFreight(){
                this.$emit('event',2,'freight')
            },
            // 设置收货日期
            setDate(){
                let day = format.day()
                picker.pickDate({
                    value: day,
                    min: day
                }, ret => {
                    if(ret.result == 'success'){
                        this.$emit('getDate',ret.data)
                    }
                })

            },
            // 设置收货地址
            setAddress(){
                navigator.push({url:'/modules/orderKing/getAddress/get-address'})
            },
            // 设置备注
            setRemark(){
                this.$emit('event',2,'remark')
            },
            // 提交订单
            submit(){
                this.$emit('submit','')
            }
        },
        filters:{
            price:filters.price
        }
    };
</script>