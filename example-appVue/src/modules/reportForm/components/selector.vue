<template>
    <div>
        <div class="nav">
            <div class="btn" @click="prev">
                <image :src="icon" class="icon"></image>
            </div>
            <div class="row" @click="showDrop">
                <text class="font">{{title}}</text>
                <div class="icon-div">
                    <image :src="icon" class="icon down"></image>  
                </div>  
            </div>
            <div class="btn" @click="next">
                <image :src="icon" class="icon tran"></image>
            </div>
        </div>   
        <slot></slot>    
        <div class="select" v-if="show" @click="showDrop">
            <div class="item" v-for="(i,key) in list" @click="select(key)">
                <text class="font28" :class="[index == key ? 'foc-red' : '']">{{i.name}}</text>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .nav{
        height: 110px;
        width: 750px;
        background-color: #171B22;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 40px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .foc-red{
        color: #cf411b;
    }
    .icon-div{
        width: 20px;
        align-items: center;
        justify-content: center;
    }
    .item{
        background-color: #171B22;
        height: 80px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
    .item:active{
        background-color: #04050A;
    }
    .select{
        position: absolute;
        top: 110px;
        bottom: 0px;
        background-color: rgba(0,0,0,0.4);
        width: 750px;
        padding-bottom: 10px;
    }
    .font{
        margin-right: 10px;
        font-size: 30px;
        color: #fff;
    }
    .font28{
        color: #fff;
        font-size: 28px;
    }
    .btn{
        width: 47px;
        height: 47px;
        border-radius: 50px;
        justify-content: center;
        align-items: center;
        background-color: #292929;
    }
    .btn:active{
        background-color: #04050A;
    }
    .row{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .icon{
        width: 10.58px;
        height: 18.8px;
    }
    .tran{
        transform: rotate(180deg);
    }
    .down{
        transform: rotate(-90deg);
    }
</style>
<script>
    export default {
        data(){
            return {
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/backWhiteIcon.png',
                show: false,
                list:[{
                    name:'天',
                    type:'day'
                },{
                    name:'周',
                    type:'week'
                },{
                    name:'近15天',
                    type:'halfMonth'
                },{
                    name:'月',
                    type:'month'
                }],
                index: 2,
                sortIndex: 0,
                titleList:{
                    'day': {
                        'event':'dayDate',
                        'value': ['今天', '昨天']
                    },
                    'week': {
                        'event':'weekDate',
                        'value': ['本周','上周']
                    },
                    'halfMonth': {
                        'event':'halfMonthDate',
                        'value': ['近15天']
                    },
                    'month': {
                        'event':'monthDate',
                        'value': ['本月','上月']
                    },
                },
                title:''
            }
        },
        mounted(){
            this.setTitle()
        },
        methods:{
            showDrop(){
                this.show = !this.show
            },
            setTitle(){
                let type = this.titleList[this.list[this.index].type]
                let val = this[type.event](this.sortIndex)
                this.$emit('event',val[0],val[1] || val[0])
                if(type.value[-1 * this.sortIndex]){
                    this.title = type.value[-1 * this.sortIndex]
                }else{
                    this.title = val.join(' - ')
                } 
            },
            select(i){
                this.show = false
                this.index = i
                this.sortIndex = 0
                this.setTitle()
            },
            prev(){
                this.sortIndex --
                this.setTitle()
            },
            next(){
                if(this.sortIndex < 0){
                    this.sortIndex ++
                    this.setTitle()
                }              
            },
            weekDate(AddWeekCount){
                //起止日期数组   
                var startStop = new Array(); 
                //一天的毫秒数   
                var millisecond = 1000 * 60 * 60 * 24; 
                //获取当前时间   
                var currentDate = new Date();
                //相对于当前日期AddWeekCount个周的日期
                currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
                //返回date是一周中的某一天
                var week = currentDate.getDay(); 
                //返回date是一个月中的某一天   
                var month = currentDate.getDate();
                //减去的天数   
                var minusDay = week != 0 ? week - 1 : 6; 
                //获得当前周的第一天   
                var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay)); 
                //获得当前周的最后一天
                 var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
                //添加至数组   
                startStop.push(this.getDateStr3(currentWeekFirstDay)); 
                startStop.push(this.getDateStr3(currentWeekLastDay)); 
               
                return startStop; 
            },
            dayDate(dis){
                let date = new Date()
                if(dis){
                    date.setTime(date.getTime()+ dis * 24 * 60 * 60 * 1000);
                }
                let year = date.getFullYear()
                let m = date.getMonth() + 1
                let month = m >= 10 ? m : '0' + m
                let d = date.getDate()
                let day = d >= 10 ? d : '0' + d
                return [year + '-' + month + '-' + day]
            },
            halfMonthDate(count){
                //起止日期数组   
                var startStop = new Array(); 
                //添加至数组   
                startStop.push(this.dayDate(15*(count-1) + 1))
                startStop.push(this.dayDate(count * 15))
                //返回   
                return startStop; 
            },
            monthDate(AddMonthCount){
                //起止日期数组   
                var startStop = new Array(); 
                //获取当前时间   
                var currentDate = new Date();
                var month=currentDate.getMonth()+AddMonthCount;
                if(month<0){
                    var n = parseInt((-month)/12);
                    month += n*12;
                    currentDate.setFullYear(currentDate.getFullYear()-n);
                }
                currentDate = new Date(currentDate.setMonth(month));
                //获得当前月份0-11   
                var currentMonth = currentDate.getMonth(); 
                //获得当前年份4位年   
                var currentYear = currentDate.getFullYear(); 
                //获得上一个月的第一天   
                var currentMonthFirstDay = new Date(currentYear, currentMonth,1); 
                //获得上一月的最后一天   
                var currentMonthLastDay = new Date(currentYear, currentMonth+1, 0); 
                //添加至数组   
                startStop.push(this.getDateStr3(currentMonthFirstDay)); 
                startStop.push(this.getDateStr3(currentMonthLastDay)); 
                //返回   
                return startStop; 
            },
            getDateStr3(date) {
                var year = "";
                var month = "";
                var day = "";
                var now = date;
                year = ""+now.getFullYear();
                if((now.getMonth()+1)<10){
                    month = "0"+(now.getMonth()+1);
                }else{
                    month = ""+(now.getMonth()+1);
                }
                if((now.getDate())<10){
                    day = "0"+(now.getDate());
                }else{
                    day = ""+(now.getDate());
                }
                return year+"-"+month+"-"+day;
            }
        }
    }
</script>