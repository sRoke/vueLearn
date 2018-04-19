<template>
    <div>
        <!-- 访销订单商品搜索操作栏 -->
        <div class="header" >
            <div class="btn" @click="pop">
                <image class="back" :src="back"></image>
            </div>
            <div class="input">
                <image class="search" :src="searchIcon"></image> 
                <input class="fs-28 fc-33 wid" v-model="searchVal" placeholder="商品名称/编码" return-key-type="search" ref="input" @return="search"/>
                <div class="btn" @click="cleanEvent">
                    <image class="clean" :src="clean"></image>
                </div>           
            </div>
            <div class="btn" @click="scan">
                <image class="scan" :src="scanIcon"></image> 
            </div>
        </div>
    </div>
</template>     
<style scoped>
    .header{
        width: 750px;
        height: 100px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .fs-28{
        font-size: 28px;
    }
    .fc-99{
        color: #999;
    }
    .fc-33{
        color: #333;
    }
    .back{
        width: 17px;
        height: 31px;
    }
    .wid{
        width: 415px;
        height: 64px;
        background-color: #F3F3F3;
    }
    .search{
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }
    .scan{
        width: 50px;
        height: 50px;
    }
    .btn{
        padding-left: 25px;
        padding-right: 25px;
        height: 66px;
        justify-content: center;
        align-items: center;
    }
    .btn:active{
        background-color: #D8D8D8;
    }
    .input{
        height: 66px;
        width: 558px;
        background-color: #f3f3f3;
        border-radius: 5px;
        flex-direction: row;
        align-items: center;
        padding-left: 25px;
        padding-right: 25px;
    }
    .clean{
        width: 30px;
        height: 30px;
    }
</style>
<script>
    import ordericon from '../../../../assets/orderIcon/icon.js'
    import navigator from '../../../../common/navigator.js'
    const scanEvent = weex.requireModule('scanEvent')
    export default {
        data() {
            return {
                back: ordericon.itemBack,
                searchIcon: ordericon.searchIcon,
                scanIcon: ordericon.scanIcon,
                clean: ordericon.clean,
                searchVal:''
            };
        },
        created(){

        },
        methods:{
            pop(){
                navigator.pop()
            },
            scan(){
                if(typeof(scanEvent.startScan) == "function"){
                    scanEvent.startScan()
                }
            },
            search(){
                this.$refs.input.blur()
                this.$emit('event',this.searchVal)
            },
            cleanEvent(){
                this.searchVal = ''
                this.$emit('clean')
            }
        }
    };
</script>