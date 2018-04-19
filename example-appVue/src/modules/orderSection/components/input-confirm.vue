<template>
    <div class="item" v-if="display == 2">
        <textarea v-if=" type== 'remark' " placeholder="备注" type="text" ref="input1" class="textarea" autofocus="true" return-key-type="next"  @input="oninput" :value="data" @return="submit"></textarea>
        <div v-if=" type != 'remark' " class="input-item">
            <text class="point">￥</text>
            <input type="number" class="input" ref="input2" autofocus="true" return-key-type="next" @input="oninput" :value="data" @return="submit"/>
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
    .font34{
        font-size: 34px;
    }
    .item{
        width: 750px;
        align-items: center;
        padding-bottom: 100px;
    }
    .item-go{
        width: 14px;
        height: 24px;
        margin-left: 10px;
    }
    .input{
        width: 500px;
        height: 130px;
        font-size: 96px;
        color: #333;
    }
    .textarea{
        font-size: 32px;
        width: 690px;
        height: 168px;
        padding-top: 40px;
        color: #333;
        background-color: #fff;
    }
    .input-item{
        height: 142px;
        width: 690px;
        align-items: flex-end;
        flex-direction: row;
        padding-bottom: 10px;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .point{
        font-size: 58px;
        color: #333; 
        padding-bottom: 10px;  
    }
</style>
<script>
    import ordericon from '../../../assets/orderIcon/icon.js'
    export default {
        data() {
            return {
                
                
            };
        },
        props:['display','data','type'],
        created(){

        },
        methods:{
            oninput(e){
                this.$emit('val',e.value)
            },
            submit(e){
                this.$emit('submit','')
            }
        }
    };
</script>