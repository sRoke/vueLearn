<template>
    <div class="item">
        <div class="bottom">
            <div class="btn" v-for="(item,index) in list" @click="change(index)"> 
                <text class="btn-text">{{item}}</text>   
            </div>
        </div>
    </div> 
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .bottom{
        height: 118px;
        width: 690px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .btn{
        width: 138px;
        height: 54px;
        margin-left: 15px;
        margin-right: 15px;
        align-items: center;
        justify-content: center;
        border-width: 1px;
        border-color: #cf411b;
        border-radius: 10px;
    }
    .btn:active {
        background-color: rgba(207,65,27,0.1);
    }
    .btn-text{
        font-size: 22px;
        color: #cf411b;
    }
    .fontc-ff{
        color: #fff;
    }
    .bg-red{
        background-color: #cf411b;
    }
</style>
<script>
    export default {
        data(){
            return {
                list: ['抹零','抹个位','抹十位']
            }
        },
        methods:{
            change(index){
                this.$emit('event',index)
            }
        }
    }
</script>