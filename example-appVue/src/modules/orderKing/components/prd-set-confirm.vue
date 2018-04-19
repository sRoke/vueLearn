<template>
    <!-- 商品订购信息编辑 -->
    <div class="page rgba4" v-if="display" @click="closeConfirm">        
        <div class="con" @click="stopClick">
            <div class="prd">                
                <image class="prd-img" :src="nowData['IMG'] | image(120)" resize="cover"></image>
                <div class="prd-con">
                    <div>
                        <div class="row-between">
                            <text class="font32 font-gray33 line1">{{nowData.NAME}}</text>
                            <div class="del-btn" @click="deletePrd">
                                <image :src="deleteicon" class="del-icon"></image>
                            </div>
                            
                        </div>                   
                    <text class="font30 font-gray99">{{nowData.CODE}}</text>
                    </div>
                    <div class="row-between">
                        <!-- <text class="font32 font-gray33">库存: {{nowData['REPOS_NUM']}}{{nowData['UNIT']}}</text> -->
                        <div>
                            <div class="row-between" v-if="nowData.UNIT.length > 1">
                                <text class="font30 font-gray99" v-for="(item,index) in nowData.UNIT">{{index== 0 ? '' : '='}}{{index == 0 ? '1' : nowData.UNIT[index-1].range * (index >1 ? nowData.UNIT[index-2].range : 1)}}{{item.name}}</text>
                            </div>
                        </div>          
                        <div class="row-between" @click="addPresent" v-if="nowData.TYPE != '-1' && !nowData['IS_ORIGINAL']">
                            <div class="radio-icon">
                                <image class="select-icon" :src="select" v-if="nowData.IS_PRESENT"></image>
                            </div>                    
                            <text class="font32 font-gray33">赠品</text>
                        </div>
                    </div>                                                             
                </div>
            </div>
            <div class="div" v-if="!nowData['IS_ORIGINAL'] || !nowData['IS_PRESENT']">
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
                <div class="table row-between" v-for="(item,index) in nowData.UNIT">
                    <div class="l-1">
                        <div class="border">
                            <input class="input input1" type="number" @input="changeCount(item)" :autofocus="index == 0 ? 'true' : 'false'" @focus="inputFocus($event,item)" :disabled="inputdisabled"  return-key-type="next" v-model="item.count" />
                        </div>
                        <text class="font32 font-gray33">{{item.name}}</text>             
                    </div>
                    <div class="l-2">
                        <div class="border">
                            <input class="input input2" type="number" @input="changePrice(item)" :disabled="inputdisabled" return-key-type="next" v-model="item.price"/>
                        </div>
                    </div>
                    <div class="l-3">
                        <div class="border">
                            <input class="input2 input" type="number" @input="changeSumPrice(item)" :disabled="inputdisabled" return-key-type="next" v-model="item.sumPrice" />
                        </div>
                    </div>
                    <div class="l-4">
                        <div class="border">
                            <input class="input input3" placeholder="备注" return-key-type="next" :disabled="inputdisabled" v-model="item.remark" />
                        </div>
                    </div>
                </div>
            </div>   
            <div class="spec" v-if="nowData.IS_PRESENT">
                <text class="font32 fontc-ac">赠品:</text>
                <div class="row-between" v-for="(item,index) in nowData['UNIT']">
                    <div class="border mg-l">
                        <input class="input4 al-right" type="number" :ref="'present' + index" return-key-type="next" :disabled="inputdisabled" v-model="item.presentCount"/>
                    </div>
                    <text class="font32 font-gray33">{{item.name}}</text>
                </div>
                <div class="border mg-l">
                    <input  class="input input3" placeholder="备注" ref="presentremark" return-key-type="next" :disabled="inputdisabled" v-model="nowData['PRESENT_REMARK']"/>
                </div>
            </div>
            <div class="header">
                <div class="icon-btn icon-btn2" @click="closeConfirm">
                    <image class="back" :src="back"></image>
                </div>
                <div class="icon-btn icon-btn1" @click="submitAndChange">
                    <image class="conf" :src="conf"></image>
                </div>
            </div>
        </div>
    </div>
</template>     
<style scoped>
    .select-icon{
        width: 23px;
        height: 17px;
    }
    .page{
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
    }
    .header{
        width: 750px;
        height: 100px;
        margin-top: 40px;
        border-top-width: 1px;
        border-top-color: #D8D8D8;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .icon-btn{
        width: 100px;
        height: 100px;
        justify-content: center;
    }
    .icon-btn1{      
        align-items: center;
    }
    .icon-btn2{
        padding-left: 30px;
    }
    .icon-btn:active{
        background-color: #d8d8d8;
    }
    .close{
        width: 24px;
        height: 24px;
    }
    .conf{
        width: 41px;
        height: 31px;
    }
    .tab{
        width:350px;
        height: 100px;
        border-bottom-width: 3px;
        border-top-color: rgba(0,0,0,0);
        border-top-width: 3px;
        justify-content: center;
        align-items: center;
    }
    .l-1{
        width: 160px;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
    }
    .prd{
        width: 690px;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
        flex-direction: row;
        justify-content: space-between;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .prd-con{
        width: 534px;
        justify-content: space-between;
    }
    .prd-img{
        width: 148px;
        height: 148px;
    }
    .tab-ac{
        border-bottom-color: #cf411b;
    }
    .tab-o{
        border-bottom-color: rgba(0,0,0,0);
    }
    .con{
        background-color: #fff;
        width: 750px;
        padding-top: 30px;
        align-items: center;
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
    .font-grayff{
        color: #fff;
    }
    .back{
        width: 17px;
        height: 31px;
    }
    .liner{
        position: absolute;
        top: 0px;
        width: 750px;
        height: 9px;
    }
    .line1{
        width: 480px;
        lines:1;
        text-overflow: ellipsis;
    }
    .rgba4{
        background-color: rgba(0,0,0,0.4)
    }
    .row-between{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .del-btn{
        padding: 10px;
    }
    .del-btn:active{
        background-color: #D8D8D8;
    }
    .del-icon{
        width: 31px;
        height: 31px;
    }
    .table{
        margin-bottom: 20px;
        width: 700px;
    }
    .div{
        padding-top: 20px;
    }
    .input{
        padding-right: 5px;
        height: 50px;
        text-align: right;
        font-size: 32px;
        background-color: rgba(0,0,0,0);
        margin-right: 5px;
    }
    .border{
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #D8D8D8;
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
        text-align: left;
    }
    .input4{
        width: 70px;
        height: 50px;
        padding-left: 5px;
        padding-right: 5px;
        font-size: 32px;
        margin-right: 10px;
    }
    .mg-l{
        margin-left: 30px;
    }
    .input4:focus{
        color: #CF411B;
    }
    .al-right{
        text-align: right;
    }
    .spec{
        width: 690px;
        height: 100px;
        margin-top: 20px;
        background-color: rgba(254,197,161,0.3);
        border-radius: 14px;
        flex-direction: row;
        align-items: center;
        padding-right: 25px;
        padding-left: 25px;
    }
    .footer{
        height: 110px;
        width: 700px;
    }
    .btn{
        width: 257px;
        height: 70px;
        justify-content: center;
        align-items: center;
        background-color: #cf411b;
        border-radius: 4px;
    }
    .btn:active{
        background-color: #C5320A;
    }
    .radio-icon{
        width: 30px;
        height: 30px;
        border-radius: 4px;
        border-width: 1px;
        border-color: #9B9B9B;
        margin: 10px;
        justify-content: center;
        align-items: center;
    }
</style>
<script>
    import ordericon from '../../../assets/orderIcon/icon.js'
    import filters from '../../../common/filters.js' 
    import modal from '../../../common/modal.js'
    export default {
        data() {
            return {
                back: ordericon.itemBack,
                conf: ordericon.confAction,
                deleteicon:ordericon.delete,
                radio:ordericon.radio,
                select:ordericon.noselect,
                nowData:{},
                bigSumPrice: 0,
                sumPrice: 0,
                control: 1,
                inputdisabled: false
            };
        },
        props:['display','data'],
        created(){

        },
        watch:{
            display(){
                if(this.display){
                    this.nowData = JSON.parse(JSON.stringify(this.data)) 
                    this.inputdisabled = false         
                }
            }
        },
        mounted(){

        },
        computed:{
        },
        methods:{
            changeSumPrice(item){
                if(item.count && item.count > 0){
                    item.price = filters.number(item.sumPrice / item.count)
                }               
            },
            inputFocus(e,item){
                e.target.setSelectionRange(0,(item.count + '').length)
            },
            changeCount(item){
                item.sumPrice = filters.number(item.count * item.price)
            },
            changePrice(item){
                item.sumPrice = filters.number(item.count * item.price)
            },
            addPresent(){
                if(this.control == 1){
                    this.nowData.IS_PRESENT = !this.nowData.IS_PRESENT
                }
            },
            submitAndChange(){
                if(this.isInnerCount(this.nowData.UNIT)){
                    this.$emit('change',this.nowData)
                }else{
                    this.$emit('change',false)
                }
                this.closeConfirm()
            },
            isInnerCount(data){
                let state = false
                data.forEach(ele =>{
                    if(ele.count > 0 || ele.presentCount){
                        state = true
                    }
                })
                return state
            },
            deletePrd(){
                modal.confirm({message:'确认移除此商品吗？',okTitle:'确认',cancelTitle:'取消'},res=>{
                    if(res == '确认'){
                        this.$emit('delete')
        
                        this.closeConfirm()

                    }
                })         
            },
            closeConfirm(){
                this.inputdisabled = true
                let ref = this.$refs
                setTimeout(()=>{
                    this.$emit('close',false)
                },200)
            },
            stopClick(){},
        },
        filters:{
            image: filters.image,
            price: filters.price
        }
    }
</script>