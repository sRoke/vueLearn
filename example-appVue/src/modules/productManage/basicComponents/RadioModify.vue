<template>
    <div>
        <scroller class="scrol" :style="{height: data.length > 6 ? '582px' : ((97 * data.length) + 'px')}">   
            <div class="item" v-for="(first,index) in list">
                <div class="div" @click="touch(first,index)">
                    <text class="text">{{first.name}}</text>
                    <div class="modify">
                        <image class="write" :src="write" @click="modify(first)" v-if="showModify"></image>
                        <div class="icon" @click="del(first,list,index)" v-if="showDelete">
                            <div class="icon-i"></div>
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
    .div{
        height: 97px;
        width: 690px;
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
            del(data ,item, index) {
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
</script>