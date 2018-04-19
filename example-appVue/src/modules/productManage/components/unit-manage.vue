<template>
    <buModal :title="title" :writeshow="showWrite" :addshow="showAdd" :confshow="showConf" @close="close" @back="back" @add="add" @write="write" @conf="conf">
        <div v-if="!modify && !showUnit">
            <div class="div" v-if="!showDefault">
                <buSwitch title="该商品多单位" v-model="isMuch" @change="change"></buSwitch>
                <buSelect v-if="isMuch" title="小单位" :value="result[0].name" @clickEvent="showList(0)"></buSelect>
            </div>
            <div class="div" v-if="isMuch && !showDefault">
                <buSelect title="中单位" :value="result[1].name"  @clickEvent="showList(1)"></buSelect>
                <buInput title="换算关系" :disable="disable" placeholder="中单位=？小单位" type="number" v-model="result[1].range"></buInput>
            </div>
            <div class="div" v-if="isMuch && !showDefault">
                <buSelect title="大单位" :value="result[2].name"  @clickEvent="showList(2)"></buSelect>
                <buInput title="换算关系" :disable="disable" placeholder="大单位=？小单位" type="number" v-model="result[2].range"></buInput>
            </div>
            <buSelect v-if="isMuch && !showDefault" title="默认订货单位" :value="defaultUnit.name" @clickEvent="selectDefault"></buSelect>
            <buRadio v-if="!isMuch" :data="data" v-model="key[0]" @select="selectUnit"></buRadio>
            <buRadio v-if="isMuch && showDefault" :data="selectedList" v-model="defaultUnit" @select="closeDefault"></buRadio>
        </div>
        <buRadio v-if="!modify && showUnit" :data="data" v-model="result[index]" @select="specSelectUnit" :show-none="showNone"></buRadio>
        <Modify v-if="modify" :data="data" @delete="delUnit" show-delete="true"></Modify>
    </buModal>
</template>
<script>
    import buModal from '../basicComponents/Modal.vue'
    import buRadio from '../basicComponents/Radio.vue'
    import Modify from '../basicComponents/Modify.vue'
    import buInput from '../basicComponents/Input.vue'
    import modal from '../../../common/modal.js'
    import stream from '../../../common/stream.js'
    import buSwitch from '../basicComponents/Switch.vue'
    import buSelect from '../basicComponents/Select.vue'
    export default {
        data () {
            return {
                title: '',
                showWrite: true,
                showAdd: true,
                showConf: false,
                showUnit: false,
                index: 0,
                isMuch: false,
                result: [],
                unitType: {
                    0: 'small',
                    1: 'middle',
                    2: 'large'
                },
                disable: false,
                modify: false,
                showDefault: false,
                defaultUnit: {},
                showNone: false,
                selectedList: []
            }
        },
        mounted() {
            this.result = JSON.parse(JSON.stringify(this.key))
            this.defaultUnit = JSON.parse(JSON.stringify(this.defaultunit))
            if(!this.defaultUnit.id){
                this.defaultUnit = this.result[0]
            }
            this.isMuch = this.type
            this.showDetail(this.isMuch)
        },
        props:['data','value','type','defaultunit'],
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
            showDetail(state) {
                if(state) {
                    this.title = '设置单位'
                    this.showConf = true
                    this.showWrite = false
                    this.showAdd = false
                }else {
                    this.title = '选择单位'
                    this.showConf = false
                    this.showWrite = true
                    this.showAdd = true
                }
            },
            change() {
                
                this.showDetail(this.isMuch)
            },
            back() {
                if(this.title === '选择默认订货单位') {
                    this.showConf = true
                    this.showDefault = false
                }else{
                    if(this.showUnit) {
                        this.showUnit = false
                        this.disable = false
                        this.showDetail(true)
                    }else {
                        this.disable = true
                        setTimeout(() =>{
                            this.close()
                        },200)
                    }
                }  
            },
            showList(index) {
                this.index = index
                this.disable = true
                if(index === 0) {
                    this.showNone = false
                }else {
                    this.showNone = true
                }
                setTimeout(() => {
                    this.showUnit = true
                    this.showDetail(false)
                },200)
            },
            selectUnit() {
                this.key[0].type = 'small'
                this.$emit('changeUnit',false)
                this.close()
            },
            specSelectUnit(res) {
                if(!res) {
                    this.result[this.index] = {
                        name: '',
                        id: ''
                    }
                }
                this.result[this.index].type = this.unitType[this.index]
                if(this.defaultUnit.type === this.result[this.index].type) {
                    this.defaultUnit = this.result[this.index]
                }
                this.selectedList = []
                this.result.forEach(ele => {
                    if(ele.id) {
                        this.selectedList.push(ele)
                    }
                })
                this.disable = false
                this.showUnit = false
                this.showDetail(true)
            },
            add() {
                modal.prompt({
                    message:'输入单位名称',
                    okTitle: '确认',
                    cancelTitle: '取消'
                },res =>{
                    if(res.result === '确认') {
                        this.$emit('newUnit',res.data, id => {
                            if(!this.isMuch) {
                                this.key[0].name = res.data
                                this.key[0].id = id
                                this.$emit('changeUnit',false)
                                this.close()
                            }else {
                                this.result[this.index].name = res.data
                                this.result[this.index].id = id
                                this.showUnit = false
                            }
                        })
                    }
                })  
            },
            write() {
                this.modify = true
                this.title = '修改单位'
            },
            checkData() {
                if(!this.result[0].id) {
                    modal.toast({message:'必须设置小单位',duration: 2})
                    return false
                }else {
                    let res = true
                    let arr = [...new Set(this.result.map(ele => {
                        return ele.id
                    }))]
                    if(arr.length !== this.result.length) {
                        modal.toast({message:'单位不能重名',duration: 2})
                        return false
                    }
                    this.result.forEach( ele => {
                        if(ele.id && ele.type !== 'small' && !ele.range) {
                            modal.toast({message:'请填写换算关系',duration: 2})
                            res = false
                        }
                        if(ele.type === 'small') {
                            ele.range = 1
                        }
                    })
                    return res
                }
            },
            closeDefault() {
                this.showConf = true
                this.showDefault = false
            },
            conf() {
                if(this.checkData()){
                    this.disable = true
                    this.$emit('changeUnit',this.result, this.defaultUnit)
                    setTimeout(() => {
                        this.close()
                    },200)
                }
            },
            selectDefault(){
                this.title = "选择默认订货单位"
                this.showConf = false
                this.showDefault = true
            },
            delUnit (item ,call){
                this.$emit('delUnit', item , call)
            }
        },
        components: {
            buModal,
            buRadio,
            buSwitch,
            buInput,
            buSelect,
            Modify
        }
    }
</script>
<style scoped>
    .div{
        background-color: #EEEEEE;
        padding-bottom: 20px;
    }
</style>