<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="close" @conf="conf">
        <buInput v-for="(item,index) in scopeUnit" :key="index" :title="'商品价格（' + item.name + '）'" :disable="disable" placeholder="输入商品价格" type="number" v-model="scopePrice[item.type]"></buInput>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import buInput from '../basicComponents/Input.vue'
    import modal from '../../../common/modal.js'
    export default {
        data () {
            return {
                title: '商品价格',
                showWrite: false,
                showAdd: false,
                showConf: true,
                disable: false,
                scopePrice: {},
                scopeUnit: []
            }
        },
        mounted() {
            this.unit.map(ele => {
                if(ele.id) {
                    this.scopeUnit.push(ele)
                }
            })
            this.scopePrice = JSON.parse(JSON.stringify(this.price))
        },
        props:['unit','price'],
        methods: {
            close() {
                this.$emit('close')
            },
            conf() {
                if(this.checkData()){
                    this.disable = true
                    this.$emit('submit',this.scopePrice)
                    setTimeout(() => {
                        this.close()
                    },200)
                }
            },
            checkData() {
                this.scopeUnit.forEach(ele =>{
                    if(this.scopePrice[ele.type] === '') {
                        modal.toast({message:'请输入价格', duration: 2})
                        return false
                    }
                })   
                return true
            }
        },
        components: {
            buModal,
            buInput
        }
    }
</script>
<style scoped>
    .div{
        background-color: #EEEEEE;
        padding-bottom: 20px;
    }
</style>