<template>
    <div class="btn" :class="[type]" @click="click">
        <text class="font32" :class="['font' + type]"><slot></slot></text>
    </div>
</template>
<style scoped>
    .btn{
        flex: 1;
        height: 80px;
        margin-left: 15px;
        margin-right: 15px;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
    }
    .primary{
        background-color: #cf411b;
    }
    .default{
        border-width: 1px;
        border-color: #cf411b;
    }
    .fontdefault{
        color: #cf411b;
    }
    .fontprimary{
        color: #fff;
    }
    .font32{
        font-size: 32px;
    }
    .primary:active{
        background-color: #C5320A;
    }
    .default:active{
        background-color: rgba(207,65,27,0.1);
    }
</style>
<script>

    export default {
        data(){
            return {
                
            }
        },
        props:['type'],
        methods: {
            click() {
                this.$emit('clickEvent')
            }
        }
    }
</script>