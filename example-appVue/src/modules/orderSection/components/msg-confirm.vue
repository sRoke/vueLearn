<template>
    <div v-if="display == 0">
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
    import filters from '../../../common/filters.js'
    export default {
        data() {
            return {
                itemGo: ordericon.itemGo,
                
            };
        },
        props:['display','remark'],
        created(){

        },
        computed:{
        },
        methods:{
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