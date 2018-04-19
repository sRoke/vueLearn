<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="back" @add="add" @write="write" @conf="conf">
        <buRadio v-if="!modify" :data="data" v-model="key" @select="close"></buRadio>
        <RadioModify v-if="modify" :data="data" @delete="delBrand" show-delete="true"></RadioModify>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import buRadio from '../basicComponents/Radio.vue'
    import RadioModify from '../basicComponents/RadioModify.vue'
    import modal from '../../../common/modal.js'
    import stream from '../../../common/stream.js'
    export default {
        data () {
            return {
                title: '',
                showWrite: true,
                showAdd: true,
                showConf: false,
                showUnit: false,
                modify: false
            }
        },
        mounted() {
            this.title = "选择品牌"
        },
        props:['data','value'],
        computed: {
            key: {
                get: function() {
                    return this.value
                },
                set: function(val) {
                    this.$emit('input',val)
                }
            }
        },
        methods: {
            close() {
                this.$emit('close')
            },
            
            back() {
                if(this.modify) {
                    this.modify = false
                    this.showWrite = true
                    this.title = '选择品牌'
                }else {
                    this.close()
                }
            },
            delBrand(item , call){
                this.$emit('delBrand', item , call)
            },
            write() {
                this.modify = true
                this.showWrite = false
                this.title = '修改品牌'
            },
            add() {
                modal.prompt({
                    message:'输入品牌名称',
                    okTitle: '确认',
                    cancelTitle: '取消'
                },res =>{
                    if(res.result === '确认') {
                        this.$emit('newBrand',res.data, id => {
                            this.key.name = res.data
                            this.key.id = id
                            this.close()
                        })
                    }
                })  
            },
            conf() {

            }
        },
        components: {
            buModal,
            buRadio,
            RadioModify
        }
    }
</script>