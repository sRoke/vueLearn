<template>
    <div>
        <scroller class="scrol" :style="{height: data.length > 6 ? '582px' : ((97 * data.length) + 'px')}"> 
            <div class="item" @click="selectNone" v-if="showNone">
                <div class="div">
                    <text class="text">无</text>
                    <div class="row"> 
                        <image class="icon" :src="icon"></image>   
                    </div>
                </div>
            </div>
            <div class="item" v-for="item in data" @click="touch(item)">
                <div class="div">
                    <text class="text">{{item.name}}</text>
                    <div class="row"> 
                        <image class="icon" :src="key.id === item.id ? iconAc : icon"></image>   
                    </div>
                </div>
            </div>
        </scroller>
    </div>
</template>
<style scoped>
    .scrol{
        width: 750px;
    }
    .item{
        background-color: #fff;
        width: 750px;
        height: 97px;
        align-items: center;
    }
    .item:active {
        background-color: #D8D8D8;
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
        font-size: 32px;
        color: #333;
    }
    .icon{
        width: 42px;
        height: 42px;
    }
</style>
<script>
    export default {
        data () {
            return {
                iconAc:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioAction.png',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioDefault.png'
            }
        },
        props: [
            'data',
            'value',
            'showNone'
        ],
        computed: {
            key: {
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    this.$emit('input', JSON.parse(JSON.stringify(val)));
                }
            }
        },
        methods: {
            touch(index) {
                this.key = index
                this.$emit('select',true)
            },
            selectNone() {
                this.$emit('select',false)
            }
        }
    }
</script>