<template>
    <div class="item">
        <div class="tab" v-for="(item,i) in list" :class="[i == index ?'tab-ac':'']" @click="change(i)">
            <image :src="item[i == index ? 'iconAc' : 'icon']" class="image"></image>
            <text class="font20" :class="[i == index ? 'fontc-red':'fontc-66']">{{item.name}}</text>
        </div>
    </div>   
</template>
<style scoped>
    .item{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 750px;
        height: 99px;
        align-items: center;
        flex-direction: row;
        border-top-width: 1px;
        border-top-color: #D8D8D8;
    }
    .tab{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .font20{
        font-size: 20px;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-66{
        color: #666;
    }
    .image{
        width:47px;
        height: 47px;
        margin-bottom: 6px;
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