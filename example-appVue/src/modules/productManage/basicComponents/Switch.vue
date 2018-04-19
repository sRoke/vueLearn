<template>
    <div class="item">  
        <div class="div">
            <text class="text fw">{{title}}</text>
            <div class="switch" :class="[state? 'on' : 'off']" @click="touch">
                <div class="switch-tab"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        background-color: #fff;
        width: 750px;
        height: 97px;
        align-items: center;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .div{
        width: 690px;
        height: 97px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .text{
        font-size: 34px;
        color: #333;
    }
    .fw{
        font-weight: bold;
    }
    .switch{
        width: 72px;
        height: 44px;
        border-radius: 99px;
        background-color: #333;
        flex-direction: row;
        align-items: center;
        padding-left: 3px;
        padding-right: 3px;
    }
    .off{
        background-color: #B4B4B4;
        justify-content: flex-start;
    }
    .on{
        background-color: #cf411b;
        justify-content: flex-end;
    }
    .switch-tab{
        width: 38px;
        height: 38px;
        background-color: #fff;
        border-radius: 99px;
    }
</style>
<script>
    export default {
        data () {
            return {

            }
        },
        props: [
            'title',
            'value'
        ],
        methods: {
            touch() {
                this.state = !this.state
                this.$emit('change')
            }
        },
        computed:{
            state: {
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    this.$emit('input', val);
                }
            }
        }
    }
</script>