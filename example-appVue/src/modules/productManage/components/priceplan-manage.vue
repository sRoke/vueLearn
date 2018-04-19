<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="close" @conf="conf">
        <div class="div">
            <div class="con">
                <text class="title">客户等级</text>
                <text class="title al" v-for="item in scopedUnit">{{type ? item.name : '价格'}}</text>
            </div>
            <div class="con" v-for="item in pricePlan">
                <text class="text fc-66">{{item['BUYER_LEVEL.LEVEL_NAME']}}</text>
                <div v-for="item2 in item.unit" @click="change(item,item2)">
                    <text class="text al border" :class="[item2.state ? 'fc-33' : 'fc-66']">{{item2.price | price}}</text>
                </div> 
            </div>
        </div>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import filters from '../../../common/filters.js'
    import modal from '../../../common/modal.js'
    export default {
        data () {
            return {
                title: '价格政策',
                showWrite: false,
                showAdd: false,
                showConf: true,
                disable: false,
                scopeCode: {},
                scopeUnit: [],
                scopeSetted: {}
            }
        },
        props:['list','type','price','unit','setted'],
        mounted(){
            this.scopeSetted = JSON.parse(JSON.stringify(this.setted))
        },
        computed: {
            scopedUnit() {
                let arr = []
                if(!this.type && this.unit[0].id) {
                    arr.push(this.unit[0])
                }else {
                    this.unit.forEach(ele => {
                        if(ele.id) {
                            arr.push(ele)
                        }
                    })
                }
                return arr
            },
            pricePlan() {
                let arr = []
                this.list.forEach(ele => {
                    ele.unit = []
                    this.scopedUnit.forEach(ele2 => {
                        if (this.scopeSetted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']] && this.scopeSetted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']][ele2.type]) {
                            ele.unit.push({
                                state: true,
                                price: this.scopeSetted[ele['BUYER_LEVEL.BUYER_LEVEL_ID']][ele2.type],
                                type: ele2.type
                            })
                        }else {
                            ele.unit.push({
                                state: false,
                                price: this.price[ele2.type] * ele['BUYER_LEVEL.PRICE_OFF']/100,
                                type: ele2.type
                            })
                        }
                        
                    })
                    arr.push(ele)
                })
                return arr
            }
        },
        methods: {
            conf(){
                this.$emit('submit',this.scopeSetted)
                this.$emit('close')
            },
            close(){
                this.$emit('close')
            },
            change(level , unit) {
                modal.prompt({
                    message:'输入调整后的价格',
                    okTitle: '确认',
                    cancelTitle: '取消'
                },res =>{
                    res.data = 30
                    if(res.result === '确认' && res.data !== '') {
                        let result = Number(res.data)
                        if(result >= 0) {
                            let id = level['BUYER_LEVEL.BUYER_LEVEL_ID']
                            let rate = level['BUYER_LEVEL.PRICE_OFF']/100
                            let oldPrice = (this.price[unit.type] * rate).toFixed(2)
                            if(this.scopeSetted[id] && this.scopeSetted[id][unit.type] && Math.abs(result - oldPrice) < 0.001) {
                                console.log('xxx')
                                this.$delete(this.scopeSetted[id] , unit.type)
                            }else if(this.scopeSetted[id] && Math.abs(result - oldPrice) > 0.001) {
                                this.scopeSetted[id][unit.type] = result
                                this.scopeSetted = Object.assign({}, this.scopeSetted)
                            }else if(!this.scopeSetted[id] && Math.abs(result - oldPrice) > 0.001 ) {
                                this.scopeSetted[id] = {
                                    [unit.type]:result
                                }
                                this.scopeSetted = Object.assign({}, this.scopeSetted)
                            }
                        }
                    }
                })  
            }
        },
        filters: {
            price: filters.price
        },
        components: {
            buModal
        }
    }
</script>
<style scoped>
    .div{
        width: 690px;
        padding-bottom: 20px;
        border-bottom-width: 1px;
        border-bottom-color: #d8d8d8;
    }
    .title{
        width: 172px;
        font-size: 24px;
        color: #999;
    }
    .text{
        width: 172px;
        font-size: 32px;
    }
    .fc-66{
        color: #666;
    }
    .fc-33{
        color: #333;
    }
    .al{
        text-align: right;
    }
    .con{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
    }
    .border{
        padding: 10px;
        border-bottom-width: 1px;
        border-bottom-color: #d8d8d8;
    }
</style>