<template>
    <div class="item">
        <div class="header">
            <div class="tab" v-for="(item,i) in list" :class="[i == index ?'tab-ac':'tab-no']" @click="change(i)">
                <text class="font32" :class="[i == index ? 'fontc-red':'fontc-66']">{{item.name}}</text>
            </div>
        </div>
    </div>   
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .header{
        width: 690px;
        height: 95px;
        flex-direction: row;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .tab{
        height: 95px;
        flex: 1;
        justify-content: center;
        align-items: center;
        border-top-width: 3px;
        border-bottom-width: 3px;
        border-top-color: #fff;
    }
    .tab-ac{       
        border-bottom-color: #cf411b;
    }
    .tab-no{
        border-bottom-color: #fff;
    }
    .font32{
        font-size: 32px;
    }
    .fontc-66{
        color: #666;
    }
    .fontc-red{
        color: #cf411b;
    }
</style>
<script>
    export default {
        data(){
            return {

            }
        },
        props:['list','index'],
        methods:{
            change(index){
                this.$emit('change',index)
            }
        }
    }
</script>