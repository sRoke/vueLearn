<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="close" @conf="conf">
        <buInput v-for="(item,index) in scopeUnit" :key="index" :title="'商品库存（' + item.name + '）'" :disable="disable" placeholder="输入商品库存" type="number" v-model="scopeCount[item.type]"></buInput>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import buInput from '../basicComponents/Input.vue'
    import modal from '../../../common/modal.js'
    export default {
        data () {
            return {
                title: '商品库存',
                showWrite: false,
                showAdd: false,
                showConf: true,
                disable: false,
                scopeCount: {},
                scopeUnit: []
            }
        },
        mounted() {
            this.unit.map(ele => {
                if(ele.id) {
                    this.scopeUnit.push(ele)
                }
            })
            this.scopeCount = JSON.parse(JSON.stringify(this.count))
        },
        props:['unit','count'],
        methods: {
            close() {
                this.$emit('close')
            },
            conf() {
                // if(this.checkData()){
                    this.disable = true
                    this.$emit('submit',this.scopeCount)
                    setTimeout(() => {
                        this.close()
                    },200)
                // }
            },
            checkData() {
                this.scopeUnit.forEach(ele =>{
                    if(this.scopeCount[ele.type] === '') {
                        modal.toast({message:'请输入库存', duration: 2})
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