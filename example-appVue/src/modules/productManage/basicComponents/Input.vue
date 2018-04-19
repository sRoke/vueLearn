<template>
    <div class="item">
        <text class="label" v-if="label === 'true'">*</text>  
        <div class="div">
            <text class="text" :class="[label === 'true' ? 'fw' : '']">{{title}}</text>
            <div class="row">
                <input ref="input1" return-key-type="done" :disabled="disable" v-if="type === 'number'" type="number" class="input" :placeholder="placeholder" v-model="inputValue"/>
                <input ref="input2" return-key-type="done" :disabled="disable" v-if="type === 'text'" type="text" class="input" :placeholder="placeholder" v-model="inputValue"/>
                <input ref="input3" return-key-type="done" :disabled="disable" v-if="type === 'password'" type="password" class="input" :placeholder="placeholder" v-model="inputValue"/>
                <input ref="input4" return-key-type="done" :disabled="disable" v-if="type === 'tel'" type="tel" class="input" :placeholder="placeholder" v-model="inputValue"/>  
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        background-color: #fff;
        width: 750px;
        height: 97px;
        align-items: center;
    }
    .label{
        position: absolute;
        top: 25px;
        left: 14px;
        font-size: 24px;
        color: #E32E1B;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .div{
        width: 690px;
        height: 97px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .input{
        font-size: 32px;
        color: #666;
        width: 400px;
        height: 90px;
        text-align: right;
    }
    .icon{
        width: 14px;
        height: 25px;
    }
    .text{
        font-size: 34px;
        color: #333;
    }
    .fw{
        font-weight: bold;
    }
</style>
<script>
    import formVali from '../../../common/formValidation.js'
    export default {
        data () {
            return {
            }
        },
        props: [
            'type',
            'placeholder',
            'label',
            'title',
            'value',
            'disable'
        ],
        computed:{
            inputValue: {
                get:function() {
                    console.log('xxxsasda')
                    return this.value;
                },
                set:function(val) {
                    if(val.indexOf('?') !== -1) {
                        this.inputValue = val.replace('?','')
                    }
                    this.$emit('input', this.inputValue);
                }
            }
        },
        methods: {
            // validation() {
            //     this.inputValue = formVali.islegal(this.inputValue)
            //     console.log(this.inputValue)
            // }
        }
    }
</script>