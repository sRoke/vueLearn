<template>
    <div v-if="display == 1">
        <div class="item" v-for="item in list" @click="select(item)">
            <text class="font34" :class="[selected.type == item.type ? 'font-red' : 'font-gray33']">{{item.name}}</text>
        </div>
    </div>  
</template>     
<style scoped>
    .font-gray33{
        color:#333;
    }
    .font-red{
        color: #cf411b;
    }
    .font34{
        font-size: 34px;
    }
    .item{
        width: 750px;
        height: 100px;
        padding-left: 25px;
        padding-right: 25px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .item:active{
        background-color: #d8d8d8;
    }
</style>
<script>
    export default {
        data() {
            return {
                
                list:[{
                    name:'退款并退货',
                    type:'GOODS_MONEY'
                },{
                    name:'仅退款',
                    type:'MONEY' 
                }]
            }
        },
        props:['display','selected'],
        created(){

        },
        methods:{
            select(val){
                this.$emit('getData',val)
            }
        }
    };
</script>