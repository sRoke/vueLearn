<template>
    <div class="item">
        <text class="font28 fontc-33 line1">{{title}}</text>   
        <div class="input-item">
            <text class="font58">￥</text>
            <input type="number" ref="input" class="input" :class="[value.length > 5 ? 'font70' : 'font94']" placeholder="" v-model="value" return-key-type="done" @return="submit"/>
            <div class="btn-item" v-if="type != 'showTip'">
                <div class="btn" v-for="(item,i) in list" @click="updatePrice(i)" :class="[i == index ? 'bg-red' : 'bg-b']">
                    <text class="font24" :class="[i == index ? 'fontc-ff' : 'fontc-33']">{{item}}</text>
                </div>
            </div>
            <div class="btn-item" v-if="type == 'showTip'">
               <!--  <text class="font24 fontc-red">{{tip}}</text> -->
            </div>
        </div>
    </div> 
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
        padding-top: 40px;
    }
    .input-item{
        height: 135px;
        width: 690px;
        align-items: flex-end;
        padding-bottom: 5px;
        flex-direction: row;
        margin-bottom: 100px;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .line1{
        width: 690px;
    }
    .input{
        width: 320px;
        line-height: 110px;
        height: 129px;
        color: #333;
    }
    .font94{
        font-size: 94px;
    }
    .btn-item{
        position: absolute;
        right: 0;
        bottom: 30px;
        flex-direction: row;
    }
    .font70{
        font-size: 70px;
    }
    .btn{
        width: 100px;
        height: 45px;
        border-radius: 10px;
        align-items: center;
        justify-content: center; 
        margin-left: 20px;
    }
    .bg-red{
        background-color: #cf411b;
    }
    .bg-b{
        background-color: #f2f3f2;
    }
    .font58{
        font-size: 58px;
        padding-bottom: 10px;
        color: #333;
    }
    .font28{
        font-size: 28px;
    }
    .font24{
        font-size: 24px;
    }
    .fontc-ff{
        color: #fff;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-red{
        color: #cf411b;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    import filters from '../../../../../common/filters.js'
    export default {
        data(){
            return {
                value: '',
                list: ['抹零','抹个位','抹十位'],
                index: -1
            }
        },
        props:['title','val','type'],
        mounted(){
            this.index = -1
            this.value = this.val
            this.$refs.input.focus()
        },
        computed:{

        },
        methods:{
            submit(){
                if(this.value !== ''){
                    this.$emit('event',this.value)
                }else{
                    modal.alert({message:'请输入金额'})
                }   
            },
            change(index){
                this.$emit('event',index)
            },
            updatePrice(type){
                this.index = type
                if(type == 0){
                    this.value = parseInt(this.value)
                }else if(type == 1){
                    this.value = parseInt(this.value/10) * 10
                }else if(type == 2){
                    this.value = parseInt(this.value/100) * 100
                }
            },
        },
        beforeDestroy(){
            this.$refs.input.blur()
        }
    }
</script>