<template>
    <div class="item">
        <text class="font28">选择退货仓库</text>
        <div class="div">
            <div class="btn" v-for="(item,i) in list" :class="[index == i ? 'bg' : '']" @click="change(i)">
                <text class="font32" :class="[index == i ? 'fontc-ff' : 'fontc-33']">{{item['REPOSITORY.REPOS_NAME']}}</text>
            </div>
        </div>      
    </div>
</template>
<style scoped>
    .item{
        width: 750px;
        margin-top: 40px;
        align-items: center;
    }
    .font28{
        font-size: 28px;
        color: #333;
        width: 690px;
    } 
    .div{
        width: 710px;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .btn{
        border-radius: 10px;
        width: 334px;
        margin-right: 10px;
        margin-left: 10px;
        margin-top: 20px;
        height: 80px;
        align-items: center;
        justify-content: center;
        border-color: #cf411b;
        border-width: 1px;
    } 
    .bg{
        background-color: #cf411b;
    }  
    .font32{
        font-size: 32px;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-ff{
        color: #fff;
    }
</style>
<script>
    export default {
        props:['list','index'],
        methods:{
            change(index){
                if(index != this.index){
                    this.$emit('event',index)
                }
            }
        }
    }
</script>