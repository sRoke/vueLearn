<template>
    <div class="item">
        <div class="input-item">
            <textarea ref="input" autofocus="true" class="input" placeholder="输入备注/退换货原因" v-model="value" return-key-type="done" @return="submit"></textarea>
        </div>
    </div> 
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
        padding-bottom: 100px;
    }
    .input-item{
        height: 170px;
        width: 690px;
        align-items: center;
    }
    .input{
        font-size: 32px;
        width: 690px;
        height: 168px;
        padding-top: 40px;
        color: #333;
        background-color: #fff;
    }
</style>
<script>
    export default {
        data(){
            return {
                value: ''
            }
        },
        props:['val'],
        mounted(){
            this.value = this.val
        },
        methods:{
            submit(){
                this.$emit('event',this.value)
            }
        },
        beforeDestroy(){
            this.$refs.input.blur()
        }
    }
</script>