<template>
    <web-view :pagesrc="src"></web-view>
</template>
<script>
    import webView from './components/web-view.vue'
    export default {
        data(){
            return {
                src:'http://f.ok.eerrpp.cc/app/orderKing/1000/html/index.html'
            }
        },
        components:{
            webView
        }
    }
</script>