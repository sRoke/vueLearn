<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="back" @add="add" @write="write" @conf="conf">
        <SelectRadio v-if="title === '选择分类'" :data="data" v-model="key" @select="close"></SelectRadio>
        <buInput v-if="title === '新建分类' || title === '修改此分类'" title="分类名称" :disable="disable" placeholder="输入名称" type="text" v-model="newClassName"></buInput>
        <buSelect v-if="title === '新建分类' || title === '修改此分类'" title="选择分类位置" :value="classSeat.name" @clickEvent="showSelect"></buSelect> 
        <SelectRadio v-if="title === '选择分类位置'" :data="classSeatList" v-model="classSeat" @select="" all-select="true"></SelectRadio>
        <Modify v-if="title === '修改分类'" :data="data" @modify="modifyClass" @delete="delClass" show-modify="true" show-delete="true"></Modify>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import SelectRadio from '../basicComponents/SelectRadio.vue'
    import Modify from '../basicComponents/Modify.vue'
    import buInput from '../basicComponents/Input.vue'
    import modal from '../../../common/modal.js'
    import stream from '../../../common/stream.js'
    import buSelect from '../basicComponents/Select.vue'
    export default {
        data () {
            return {
                title: '',
                showWrite: true,
                showAdd: true,
                showConf: false,
                addClassParent: {
                    name: '',
                    id: ''
                },
                classSeatList: [{name:'默认分类', deploy: true,id:'0', list:[]}],
                classSeat: {
                    name: '',
                    id: ''
                },
                isModify: false,
                newClassName: '',
                classId: '',
                disable: false
            }
        },
        mounted() {
            this.title = '选择分类'
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
            selectCall() {
                if(this.title === '选择分类') {
                    this.close()
                }
            },
            back() {
                if(this.title === '新建分类' || this.title === '修改分类') {
                    this.disable = true
                    setTimeout(() => {
                        this.title = '选择分类'
                        this.showWrite = true
                        this.showAdd = true
                        this.showConf = false
                    },200)
                    
                }else if(this.title === '选择分类') {
                    this.close()
                }else if(this.title === '选择分类位置') {
                    let name = this.isModify ? '修改此分类' : '新建分类'
                    this.title = name
                    this.disable = false
                    this.showWrite = false
                    this.showAdd = false
                    this.showConf = true
                }else if(this.title === '修改此分类') {
                    this.disable = true
                    setTimeout(() => {
                        this.title = '修改分类'
                        this.showWrite = false
                        this.showAdd = true
                        this.showConf = false
                    },200)
                }
            },
            add() {
                this.showConf = true
                this.disable = false
                this.title = '新建分类'
                this.showWrite = false
                this.showAdd = false
                this.isModify = false
            },
            write() {
                this.title = '修改分类'
                this.showWrite = false
            },
            conf() {
                if(this.title === '选择分类位置') {
                    let name = this.isModify ? '修改此分类' : '新建分类'
                    this.title = name
                    this.disable = false
                }else if(this.title === '新建分类') {
                    if( !this.newClassName ) {
                        modal.toast({message: '请输入分类名称'})
                    } else if (this.classSeat.id === '') {
                        modal.toast({message: '请选择分类位置'})
                    } else {
                        this.$emit('refreshClass',this.newClassName,this.classSeat.id)
                        this.disable = true
                        setTimeout(() => {
                            this.close()
                        },200)
                    }
                }else if(this.title === '修改此分类') {
                    this.$emit('modifyClass',{
                        name:this.newClassName,
                        id: this.classId,
                        parent: this.classSeat.id
                    })
                    this.disable = true
                    setTimeout(() => {
                        this.close()
                    },200)
                }
            },
            modifyClass(item) {
                this.title = '修改此分类'
                this.isModify = true
                this.classSeat.name = item.parent.name
                this.classSeat.id = item.parent.id
                this.newClassName = item.name
                this.classId = item.id
                this.showConf = true
                this.disable = false
                this.showWrite = false
                this.showAdd = false
            },
            delClass(item , call) {
                this.$emit('delClass',item , call)
            },
            showSelect() {
                this.disable = true
                this.classSeatList[0].list = this.data
                setTimeout(() => {
                    this.title = '选择分类位置'
                    this.showConf = true
                },200)
            }
        },
        components: {
            buModal,
            SelectRadio,
            buInput,
            buSelect,
            Modify
        }
    }
</script>