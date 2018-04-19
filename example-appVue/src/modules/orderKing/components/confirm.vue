<template>
    <!-- 访销订单基本信息设置 -->
    <div class="page rgba4" v-if="display == 2" @click="closeConfirm"> 
        <image class="liner" resize="cover" :src="liner"></image>       
        <div class="con" @click="stopClick">    
            <div class="header">
                <div class="icon-btn" @click="backClick">
                    <image class="back" :src="back" v-if="index != 0"></image>
                </div>
                <text class="font42 font-gray33" v-if="index == 0">总计：{{price | price}}</text>
                <text class="font42 font-gray33" v-if="index != 0">{{title}}</text>
                <div class="icon-btn" @click="closeOrSelect">
                    <image class="conf" :src="conf" v-if="index == 2"></image>
                    <image class="close" :src="close" v-if="index == 0"></image>
                </div>
            </div>
            <msgConfirm :display="index" @event="selectForm" @getDate="getDate" @submit="submit" :date="date" :discount="discount" :freight="freight" :remark="remark" :address="address" :returntype="returntype" :returnmoney="returnmoney"></msgConfirm>
            <selectConfirm :display="index" :selected="returntype" @getData="getSelectData"></selectConfirm>
            <inputConfirm :display="index" :data="inputValue" ref="inputconfirm" :type="inputNowType" @val="getInputVal" @submit="closeOrSelect"></inputConfirm>         
        </div>
    </div>
</template>     
<style scoped>
    .page{
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        justify-content: flex-end;
    }
    .header{
        width: 750px;
        height: 150px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .icon-btn{
        padding: 25px;
    }
    .icon-btn:active{
        background-color: #d8d8d8;
    }
    .con{
        background-color: #fff;
    }
    .font42{
        font-size: 42px;
    }
    .font-gray33{
        color: #333;
    }
    .close{
        width: 24px;
        height: 24px;
    }
    .conf{
        width: 41px;
        height: 31px;
    }
    .back{
        width: 17px;
        height: 31px;
    }
    .liner{
        width: 750px;
        height: 9px;
    }
    .rgba4{
        background-color: rgba(0,0,0,0.4)
    }
</style>
<script>
    import msgConfirm from './msg-confirm.vue'
    import inputConfirm from './input-confirm.vue'
    import selectConfirm from './select-confirm.vue'
    import ordericon from '../../../assets/orderIcon/icon.js'
    import filters from '../../../common/filters.js'

    export default {
        data() {
            return {
                liner: ordericon.liner,
                back: ordericon.itemBack,
                close: ordericon.smallClose,
                conf: ordericon.confAction,
                index: 0,
                inputValue:'',
                input:'',
                inputType:{
                    discount:'discount',
                    freight:'freight',
                    remark:'remark',
                    returnMoney:'returnmoney'
                },
                inputNowType:'',
                titleObj:{
                    'returnType':'选择退货方式',
                    'discount':'设置优惠',
                    'freight':'设置运费',
                    'remark':'添加备注',
                    'returnMoney':'设置退款'
                }
            }
        },
        props:['price','display','returntype','returnmoney','discount','freight','remark','date','address'],
        created(){

        },
        filters:{
            price:filters.price
        },
        methods:{
            selectForm(index,type){
                this.index = index
                this.title = this.titleObj[type]
                this.inputValue = this[this.inputType[type]]
                this.inputNowType = type
                this.input = ''
            },
            getSelectData(val){
                this.$emit('getReturnType',val)
                this.index = 0
            },
            getDate(ret){
                this.$emit('getDate',ret)
            },
            closeOrSelect(){
                if(this.index == 2){
                    this.$emit('getInput',this.input ? this.input : this.inputValue ,this.inputNowType)
                    this.closeKey(()=>{
                        this.index = 0
                    })                    
                }else if(this.index == 0){
                    this.$emit('close','')
                }
            }, 
            /*
                键盘失去焦点 回调函数中 走键盘失去焦点后的逻辑
            */
            closeKey(callback){
                let inputDom = this.$refs['inputconfirm'].$refs
                inputDom['input1'] ? inputDom['input1'].blur() : ''
                inputDom['input2'] ? inputDom['input2'].blur() : ''
                setTimeout(()=>{
                    callback()
                },300)               
            },
            getInputVal(val){
                this.input = val
            },
            closeConfirm(){
                this.closeKey(()=>{
                    this.$emit('close','')
                    this.index = 0
                })
            },
            backClick(){
                if(this.index != 0){
                    this.closeKey(()=>{
                        this.index = 0
                    }) 
                }
            },
            submit(){
                this.$emit('submit','')
            },
            stopClick(){

            }
        },
        components:{
            msgConfirm,
            inputConfirm,
            selectConfirm
        }
    };
</script>