<template>
    <div>
        <scroller class="scrol">   
            <div class="item" v-for="(first,index) in list">
                <div class="div" @click="touch(first,index)">
                    <image class="diricon" resize="contain" :class="[first.deploy ? 'up' : 'down']" v-if="first.list && first.list.length > 0" :src="dir"></image>
                    <div class="row" :class="[first.list && first.list.length > 0 ? 'floor1': 'floor0']">
                        <text class="text">{{first.name}}</text>
                        <div class="modify">
                            <image class="write" :src="write" @click="modify(first)" v-if="showModify"></image>
                            <div class="icon" @click="del(first,list,index)" v-if="showDelete">
                                <div class="icon-i"></div>
                            </div>
                        </div>
                        
                    </div>  
                </div>
                <div class="flex-end" v-if="first.deploy && first.list && first.list.length > 0" v-for="(second,secIndex) in first.list">
                    <div class="div" @click="touch(second,index)">
                        <image class="diricon" resize="contain" :class="[second.deploy ? 'up' : 'down']" v-if="second.list && second.list.length > 0" :src="dir"></image>
                        <div class="row" :class="[second.list && second.list.length > 0 ? 'floor2': 'floor1']">
                            <text class="text">{{second.name}}</text>
                            <div class="modify">
                                <image class="write" :src="write" @click="modify(second,first)" v-if="showModify"></image>
                                <div class="icon" @click="del(second,first.list,secIndex)" v-if="showDelete">
                                    <div class="icon-i"></div>
                                </div>
                            </div>
                        </div>  
                    </div>
                    <div class="flex-end" v-if="second.deploy && second.list && second.list.length > 0" v-for="(third,thirdIndex) in second.list">
                        <div class="div" @click="touch(third,index)">
                            <image class="diricon" resize="contain" :class="[third.deploy ? 'up' : 'down']" v-if="third.list && third.list.length > 0" :src="dir"></image>
                            <div class="row floor3" :class="[third.list && third.list.length > 0 ? 'floor3': 'floor2']">
                                <text class="text">{{third.name}}</text>
                                <div class="modify">
                                    <image class="write" :src="write" @click="modify(third,second)" v-if="showModify"></image>
                                    <div class="icon" @click="del(third,second.list,thirdIndex)" v-if="showDelete">
                                        <div class="icon-i"></div>
                                    </div>
                                </div>
                            </div>  
                        </div>
                        <div class="div" @click="touch(forth,index)" v-if="third.deploy && third.list && third.list.length > 0" v-for="(forth,forthIndex) in third.list">
                            <div class="row floor3">
                                <text class="text">{{forth.name}}</text>
                                <div class="modify">
                                    <image class="write" :src="write" @click="modify(forth,third)" v-if="showModify"></image>
                                    <div class="icon" @click="del(forth,third.list,forthIndex)" v-if="showDelete">
                                        <div class="icon-i"></div>
                                    </div>
                                </div>
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
    .modify{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .write{
        width: 29px;
        height: 35px;
        margin-right: 50px;
    }
    .icon{
        width: 40px;
        height: 40px;
        justify-content: center;
        align-items: center;
        border-radius: 99px;
        background-color: #cf411b;
    }
    .icon-i{
        width: 25px;
        height: 3px;
        background-color: #fff;
    }
</style>
<script>
    const modal = weex.requireModule('modal')
    export default {
        data () {
            return {
                write: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/product/wirte.png',
                dir: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-jump.png',
                list: [],
                height: ''
            }
        },
        props: [
            'data',
            'showDelete',
            'showModify'
        ],
        mounted() {
            this.list = JSON.parse(JSON.stringify(this.data))
        },
        computed: {

        },
        methods: {
            touch(item,index) {
                if(item.list && item.list.length > 0) {
                    item.deploy = !item.deploy
                }
            },
            modify(item,parent) {
                if(!parent) {
                    parent = {name: '默认分类',id: '0'}
                }
                this.$emit('modify', {
                    'id' : item.id,
                    'name': item.name,
                    'parent': parent
                })
            },
            del(data ,item, index) {
                if(data.list && data.list.length > 0) {
                    modal.alert({message: '存在子分类不可删除',okTitle: '确认'})
                }else {
                    modal.confirm({
                        message: '确认删除？',
                        okTitle: '确认',
                        cancelTitle: '取消'
                    },res => {
                        if(res === '确认') {
                            this.$emit('delete',data, () => {
                                item.splice(index , 1)
                            })
                        }
                    })
                }
            }
        }
    }
</script>