<template>
    <div class="item">
        <slot></slot>    
    </div>   
</template>
<style scoped>
    .item{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 750px;
        padding-left: 15px;
        padding-right: 15px;
        height: 140px;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        background-color: #fff;
    }
</style>
<script>
    export default {
        data(){
            return {
                
            }
        },
        methods:{

        }
    }
</script>
