<template>
    <div ref="item">
        <scroller class="scrol">
            <div class="item" v-for="(first,index) in list">
                <div class="div" @click="touch(first,index)">
                    <image class="diricon" resize="contain" :class="[first.deploy ? 'up' : 'down']" v-if="first.list && first.list.length > 0" :src="dir"></image>
                    <div class="row" :class="[first.list && first.list.length > 0 ? 'floor1': 'floor0']">
                        <text class="text">{{first.name}}</text>
                        <image class="icon" v-if="allSelect || !first.list || first.list.length === 0" :src="key.id === first.id ? iconAc : icon"></image>   
                    </div>  
                </div>
                <div class="flex-end" v-if="first.deploy && first.list && first.list.length > 0" v-for="second in first.list">
                    <div class="div" @click="touch(second,index)">
                        <image class="diricon" resize="contain" :class="[second.deploy ? 'up' : 'down']" v-if="second.list && second.list.length > 0" :src="dir"></image>
                        <div class="row" :class="[second.list && second.list.length > 0 ? 'floor2': 'floor1']">
                            <text class="text">{{second.name}}</text>
                            <image class="icon" v-if="allSelect || !second.list || second.list.length === 0" :src="key.id === second.id ? iconAc : icon"></image>   
                        </div>  
                    </div>
                    <div class="flex-end" v-if="second.deploy && second.list && second.list.length > 0" v-for="third in second.list">
                        <div class="div" @click="touch(third,index)">
                            <image class="diricon" resize="contain" :class="[third.deploy ? 'up' : 'down']" v-if="third.list && third.list.length > 0" :src="dir"></image>
                            <div class="row floor3" :class="[third.list && third.list.length > 0 ? 'floor3': 'floor2']">
                                <text class="text">{{third.name}}</text>
                                <image class="icon" v-if="allSelect || !third.list || third.list.length === 0" :src="key.id === third.id ? iconAc : icon"></image>   
                            </div>  
                        </div>
                        <div class="div" @click="touch(forth,index)" v-if="third.deploy && third.list && third.list.length > 0" v-for="forth in third.list">
                            <div class="row floor3">
                                <text class="text">{{forth.name}}</text>
                                <image class="icon" :src="key.id === forth.id ? iconAc : icon"></image>   
                            </div>  
                        </div>
                    </div>
                </div>
        </div>
        </scroller>    
    </div>
</template>
<style scoped>
    .scrol{
        width: 750px;
        height: 582px;
    }
    .item{
        background-color: #fff;
        width: 750px;
        padding-right: 30px; 
        align-items: flex-end;
    }
    .flex-end{
        align-items: flex-end;
    }
    .row{
        height: 97px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .floor0{
        width: 690px;
    }
    .floor1 {
        width: 623px;
    }
    .floor2 {
        width: 563px;
    }
    .floor3 {
        width: 503px;
    }
    .div{
        flex-direction: row;
        align-items: center;
    }
    .text{
        font-size: 32px;
        color: #333;
    }
    .diricon{
        margin-right: 40px;
        width: 25px;
        height: 25px;
    }
    .down{
        transform: rotate(90deg);
    }
    .up{
        transform: rotate(-90deg);
    }
    .icon{
        width: 42px;
        height: 42px;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                iconAc:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioAction.png',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioDefault.png',
                dir: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-jump.png',
                list: [],
                height: ''
            }
        },
        props: [
            'data',
            'value',
            'allSelect'
        ],
        mounted() {
            this.list = JSON.parse(JSON.stringify(this.data))
        },
        computed: {
            key: {
                get:function() {
                    return this.value;
                },
                set:function(val) {
                    this.$emit('input', val);
                }
            }
        },
        methods: {
            touch(item,index) {
                if(item.list && item.list.length > 0) {
                    item.deploy = !item.deploy
                    if(this.allSelect) {
                        this.key = item
                        this.$emit('select')
                    }
                }else {
                    this.key = item
                    this.$emit('select')
                }
            }
        }
    }
</script>