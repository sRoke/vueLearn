<template>  
<bu-view :config="configData" @event="viewEvent">
    <visitRecord ref="visitrecords" :show="nowIndex"  @watchimg="watchphoto"></visitRecord>
    <photoList :list="tabList[1].list" v-if="nowIndex == 1"> </photoList>
    <visitAll ref="visitalls" :show="nowIndex" > </visitAll>
    <photoDetail  :imginfo="photoinfos" v-if="showphoto" @toback="closeimg" slot="footer"> </photoDetail>
    <bottomTabBar slot="footer" :list="tabList" :index="nowIndex" @change="choosenear" v-if='!showphoto'></bottomTabBar>
</bu-view>
</template>
<script>
    import buView from '../../components/bu-view.vue';
    import navigator from '../../common/navigator.js';
    import modal from '../../common/modal.js';
    import filters     from '../../common/filters.js';
    import stream    from '../../common/stream.js';
    import icon      from '../tagSection/icon/icon.js';
    import photoList from './components/photo-list.vue';
    import bottomTabBar from './components/bottom-tab.vue';
    import visitAll from './components/visit-all.vue';
    import visitRecord from './components/visit-record.vue';
    import photoDetail from '../../components/photo-detail.vue';
    const getEvent  = weex.requireModule('event');
    const locationEvent = weex.requireModule('locationEvent');
    const globalEvent = weex.requireModule('globalEvent');
    const photoEvent = weex.requireModule('photoEvent');
    const storage = weex.requireModule('storage');
    export default {
        components:{
            buView,
            bottomTabBar,
            photoList,
            visitAll,
            visitRecord,
            photoDetail
        },
        data() {
            return {
                controlPage: '/modules/visiting/photoControl',
                showphoto: false,
                configData:{
                    title: '历史拜访',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '105px',
                    addEvent: '',
                    btnText: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'reload',
                },
                tabList:[{
                    name:'历史拜访',
                },{
                    name:'云相册',
                    list: [],
                },{
                    name:'拜访统计',
                    list: [],
                }],
                nowIndex: -1,
                photoinfos: {},
                nowIndex1: -1,
                firstenter: true
            };
        },
        created(){
        },
        mounted(){
            var key = 0
            this.configData['title'] = this.tabList[key]['name']
            if(key == 1){
                this.configData['btnText'] = '管理相册'
                this.configData['addEvent'] = 'controlphoto'
                this.choosenear(key)
            }else if(key == 2 ){
                this.choosenear(key)
            } else if(key ==0){
                this.choosenear(key)
            }

        },

        methods:{
            viewEvent(name,call){
                this[name](call)
            },
            choosenear(key){
                if(key != this.nowIndex){
                    this.nowIndex = key;
                    this.nowIndex1 = this.nowIndex
                    this.configData['title'] = this.tabList[key]['name']
                    if(key == 1 ){
                        this.getphoto(key)
                        this.configData['btnText'] = '管理相册'
                        this.configData['addEvent'] = 'controlphoto'
                    }else if(key == 2 ){
                        this.configData['btnText'] = ''
                        this.configData['addEvent'] = ''
                        this.$refs.visitalls.getdata()
                    } else if(key ==0){
                        this.configData['btnText'] = ''
                        this.configData['addEvent'] = ''
                        this.$refs.visitrecords.getlist()
                    }
                    if(key ==1){
                        this.configData['btnText'] = '管理相册'
                        this.configData['addEvent'] = 'controlphoto'
                    }
                }
            },
            reload(){
                if(!this.firstenter){
                    if(this.nowIndex == 1){
                        this.nowIndex =-1
                        this.nowIndex1 = 1
                        this.choosenear(this.nowIndex1)
                    }
                    
                    
                }else{
                    this.firstenter = false
                }
                // if(this,nowIndex == 1){
                //     this.getphoto(key)
                //     this.configData['btnText'] = '管理相册'
                //     this.configData['addEvent'] = 'controlphoto'
                // }
            },
            watchphoto(value){
                this.showphoto = true;
                this.photoinfos = value;
            },
            closeimg(value){
                if(!value){
                    this.showphoto = false
                }
            },
            getphoto(key){
                stream.fetch({
                    method:'GET',
                    url:'/visit/photo/task/queryAll',
                },res =>{
                    this.tabList[key].list = res.data;
                    this.tabList[key].list.forEach(function(item,index){
                        // console.log(item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL'])
                        if(item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL'] == undefined){
                            item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL']="product.png"
                        }
                        item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
                    })
                    console.log(this.tabList[key].list)
                })
            },
            controlphoto(){
                navigator.push({
                    url: this.controlPage,
                },res=>{})
            },

        }   
    };
</script>
