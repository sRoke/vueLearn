<template>
    <!-- 菜单栏 -->
    <div class="sidebar">   
    <scroller scroll-direction="vertical">
        <div v-for="item in list">
            <div class="sidebar-list" @click="openClass(item,'1')" :class="[item.focus?'sidebar-list-ac':'']">
                <text class="sidebar-h1" :class="[item.focus ?'sidebar-h1-ac':'']">{{item['PRODUCT_CLASS.CLASS_NAME']}}</text>
            </div>
            <div class="sidebar-sec-list" v-for="(sec,index) in item['childList']" v-if="item.focus" @click="openClass(sec,'2',item)">
                <text class="sidebar-h2" :class="[sec.focus ?'sidebar-h2-ac':'']">{{sec['PRODUCT_CLASS.CLASS_NAME']}}</text>
            </div>
        </div>
    </scroller>
    </div>
</template>
<style scoped>
    .sidebar{
        flex-direction: column;
        width: 188;
        background-color: #f5f5f5;
        border-right-color: #d6d7dc;
        border-right-style: solid;
        border-right-width: 1;
    }
    .sidebar-list{
        height: 80;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom-color: #d6d7dc;
        border-bottom-style: solid;
        border-bottom-width: 1;
    }
    .sidebar-list-ac{
        background-color: #cf411b;
    }
    .sidebar-sec-list{
        height: 80;
        background-color: #ffffff;
        align-items: center;
        justify-content: center;        
    }
    .sidebar-h1{
        font-size: 32;
        color: #333333;
        height: 40;
        line-height: 40;        
        width: 188;
        text-align: center;
    }
    .sidebar-h1-ac{
        color: #fff;
    }
    .sidebar-h2{
        font-size: 28;
        color: #333;
        height: 40;
        line-height: 40;
        width: 188;
        text-align: center;
        border-left-color: rgba(0,0,0,0);
        border-left-style: solid;
        border-left-width: 5;
        border-right-color: rgba(0,0,0,0);
        border-right-style: solid;
        border-right-width: 5;
    }
    .sidebar-h2-ac{
        color: #cf411b;
        border-left-color: #cf411b;
    }
</style>
<script>
    import stream from '../../../../common/stream.js' 
    export default {
        data(){return{
            productClassUrl:"/bee/prdclass/query?PRODUCT_CLASS.IS_DEL=-1",
            list:[],
            classId: ''
        }},
        mounted(){
            stream.fetch({
                method:"GET",
                url:this.productClassUrl
            },res =>{
                this.list = this.modalClass(res.data)

            } ,res =>{
            })
        },
        methods:{
            recover(){
                if(!this.list[0].focus){ 
                    this.list.forEach(ele =>{
                        if(ele.focus){
                            ele.focus = false
                            ele['childList'].forEach(ele2 =>{
                                if(ele2.focus){
                                    ele2.focus = false
                                }
                            })
                        }
                    })
                    this.list[0].focus = true
                    this.classId = ''
                }
            },
            /*

                菜单选择

            */
            openClass: function(val,index,item){
                if(!val.focus){
                    if(index == 1){
                        this.list.forEach(ele =>{
                            if(ele.focus){
                                ele.focus = false
                                ele['childList'].forEach(ele2 =>{
                                    if(ele2.focus){
                                        ele2.focus = false
                                    }
                                })
                            }
                        })

                    }else{
                        item['childList'].forEach(ele2 =>{
                            if(ele2.focus){
                                ele2.focus = false
                            }
                        })
                    } 
                    val.focus = true
                    this.classId = val['PRODUCT_CLASS.PRODUCT_CLASS_ID']  
                    this.$emit('event',this.classId) 
                }                                      
                            
            },
            /*

            处理商品分类接口的方法  在一级分类中加入二级分类  二级分类中加入三级分类。。。

            */
            modalClass: function (obj) {

                var result = [];
                if(obj != null && obj.length != 0) {

                    //格式化map 
                    var classMap = new Map;

                    obj.forEach (function (ele) {
                        ele.focus = false
                        classMap.set(ele['PRODUCT_CLASS.PRODUCT_CLASS_ID'], ele);
                    })
                    obj.forEach(function(ele) {
                        var parentId = ele['PRODUCT_CLASS.PARENT_CLASS_ID'];
                        var parentObj = classMap.get(parentId);
                        if(parentObj == undefined) {
                            result.push(ele);
                        }else {
                            var childList = parentObj.childList;
                            if(childList == undefined) {
                                var temp = [];
                                temp.push(ele);
                                parentObj.childList = temp;

                            }else {
                                childList.push(ele);
                            }
                        }
                    })

                }
                result.forEach (function (ele) {
                    if(ele.childList == undefined){
                        ele.childList = [];
                    }       
                })
                result.unshift({
                    'PRODUCT_CLASS.CLASS_NAME':'全部商品',
                    'PRODUCT_CLASS.PARENT_CLASS_ID':'',
                    'childList':[],
                    'focus': true
                })
                return result;
            },
        }
    }
</script>