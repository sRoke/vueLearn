<template>
    <div class="item" v-if="show">
        <div class="btn" v-for="(item,index) in data" :class="[item.type == 'primary' ? 'bg' : 'br']" @click="event(item)">
            <text class="font32" :class="[item.type == 'primary' ? 'cwhite' : 'cred']">{{item.name}}</text>
        </div>
    </div>   
</template>
<style scoped>
    .item{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 750px;
        padding-left: 15px;
        padding-right: 15px;
        height: 140px;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        background-color: #fff;
    }
    .btn{
        flex: 1;
        height: 80px;
        margin-left: 15px;
        margin-right: 15px;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
    }
    .bg{
        background-color: #cf411b;
    }
    .br{
        border-width: 1px;
        border-color: #cf411b;
    }
    .cred{
        color: #cf411b;
    }
    .cwhite{
        color: #fff;
    }
    .font32{
        font-size: 32px;
    }
    .bg:active{
        background-color: #C5320A;
    }
    .br:active{
        background-color: rgba(207,65,27,0.1);
    }
</style>
<script>

    export default {
        data(){
            return {
                
            }
        },
        props:['data','show'],
        methods:{
           event(val,index){

            this.$emit('event',val.event)

           }
        }
    }
</script>