<template>
    <div class="item">
        <div class="header">
            <text class="font32 font-gray33 line1">{{title}}</text>    
            <text class="font30 font-gray99 line1 mg-t">{{content}}</text>
        </div>
        
        <div class="con">
            <div class="table row-between">
                <div class="l-1">
                    <text class="font24 font-gray99 input1" >数量</text>                  
                </div>
                <div class="l-2">
                    <text class="font24 font-gray99 input2">单价</text>
                </div>
                <div class="l-3">
                    <text class="font24 font-gray99 input2">小计</text>
                </div>
                <div class="l-4">
                    <text class="font24 font-gray99 input3">备注</text>
                </div>
            </div>
            <div class="table row-between">
                <div class="l-1">
                    <input class="input input1" type="number" ref="input1" @input="changeCount" return-key-type="next" :value="value.COUNT" autofocus="true" />
                    <text class="font32 font-gray33">{{value.UNIT}}</text>             
                </div>
                <div class="l-2">

                    <input class="input input2" type="number" ref="input2" @input="changePrice" return-key-type="next" :value="value.PRICE"/>

                </div>
                <div class="l-3">

                    <input class="input2 input" type="number" ref="input3" @input="changeSumPrice" return-key-type="next" :value="sumPrice" />

                </div>
                <div class="l-4">
                    <input class="input input3" ref="input4" placeholder="备注" return-key-type="next" v-model="value.remark" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
        padding-bottom: 100px;
    }
    .con{
        width: 690px;
        margin-top: 20px;
        padding-top: 20px;
        border-top-color: #EBEBEB;
        border-top-width: 1px;
    }
    .header{
        padding-top: 30px;
        padding-bottom: 10px;
    }
    .mg-t{
        margin-top: 5px;
    }
    .row-between{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .line1{
        width: 690px;
        lines: 1;
        text-overflow: ellipsis;
    }
    .l-1{
        width: 160px;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
    }
     .font30{
        font-size: 30px;
    }
    .font32{
        font-size: 32px;
    }
    .font24{
        font-size: 24px;
    }
    .fontc-ac{
        color: #cf411b;
    }
    .font-gray33{
        color: #333;
    }
    .font-gray99{
        color: #999;
    }
    .table{
        width: 700px;
    }
    .div{
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .input{
        padding-top: 20px;
        padding-right: 5px;
        margin-bottom: 20px;
        text-align: right;
        font-size: 32px;
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
        margin-right: 5px;
    }
    .input:focus{
        color: #CF411B;
    }
    .input1{
        width: 90px;
        text-align: right;
    }
    .input2{
        width: 160px;
        padding-right: 5px;
        text-align: right;
    }
    .input3{
        width: 120px;
    }
    .input4{
        width: 130px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 32px;
        margin-left: 30px;
        margin-right: 10px;
        background-color: rgba(0,0,0,0);
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .input4:focus{
        color: #CF411B;
    }
</style>
<script>
    import filters from '../../../../../common/filters.js'
    export default {
        data(){
            return {
                sumPrice:'',
                value:{}
            }
        },
        props:['val','title','content'],
        mounted(){
            this.value = JSON.parse(JSON.stringify(this.val))
            this.sumPrice = this.value.COUNT * this.value.PRICE
        },
        methods:{
            changeCount(e){
                this.value.COUNT = e.value 
                this.sumPrice = filters.number(this.value.COUNT * this.value.PRICE)
            },
            changePrice(e){
                this.value.PRICE = e.value 
                this.sumPrice = filters.number(this.value.COUNT * this.value.PRICE)
            },
            changeSumPrice(e){
                this.sumPrice = e.value 
                if(this.value.COUNT && this.value.COUNT > 0){
                    this.value.PRICE = filters.number(this.sumPrice/this.value.COUNT)
                } 
            }
        },
        beforeDestroy(){
            let ref = this.$refs
            ref['input1'].blur()
            ref['input2'].blur()
            ref['input3'].blur()
            ref['input4'].blur()
        }
    }
</script>