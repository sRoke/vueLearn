<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="close" @conf="conf">
        <ScanInput v-for="(item,index) in scopeUnit" :key="index" :title="'商品条码（' + item.name + '）'" label="false" :value="code[item.type]" @clickEvent="scanOn(item)"></ScanInput>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import ScanInput from '../basicComponents/ScanInput.vue'
    import modal from '../../../common/modal.js'
    export default {
        data () {
            return {
                title: '商品条码',
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
        },
        props:['unit','code'],
        methods: {
            close() {
                this.$emit('close')
            },
            conf() {
                this.close()
            },
            scanOn(item) {
                this.$emit('scanOn',item.type)
            }
        },
        components: {
            buModal,
            ScanInput
        }
    }
</script>
<style scoped>
    .div{
        background-color: #EEEEEE;
        padding-bottom: 20px;
    }
</style>