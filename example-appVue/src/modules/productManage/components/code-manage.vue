<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="close" @conf="conf">
        <buInput v-for="(item,index) in scopeUnit" :key="index" :title="'商品编码（' + item.name + '）'" :disable="disable" placeholder="输入商品编码" type="text" v-model="scopeCode[item.type]"></buInput>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import buInput from '../basicComponents/Input.vue'
    import modal from '../../../common/modal.js'
    export default {
        data () {
            return {
                title: '商品编码',
                showWrite: false,
                showAdd: false,
                showConf: true,
                disable: false,
                scopeCode: {},
                scopeUnit: []
            }
        },
        mounted() {
            this.unit.map(ele => {
                if(ele.id) {
                    this.scopeUnit.push(ele)
                }
            })
            this.scopeCode = JSON.parse(JSON.stringify(this.code))
        },
        props:['unit','code'],
        methods: {
            close() {
                this.$emit('close')
            },
            conf() {
                // if(this.checkData()){
                    this.disable = true
                    this.$emit('submit',this.scopeCode)
                    setTimeout(() => {
                        this.close()
                    },200)
                // }
            },
            checkData() {
                this.scopeUnit.forEach(ele => {
                    if(this.scopeCode[ele.type] === '') {
                        modal.toast({message:'请输入编码', duration: 2})
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