<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="content">
            <image v-for="(item,index) in imageList" resize="cover" :src="item" class="image" @click="show(index)">
            </image> 
            <div class="image border" @click="getPhoto">
                <image resize="cover" :src="addIcon" class="icon">
                </image> 
            </div>
        </div>
        <ButtonItem slot="footer">
            <Button type="primary" @clickEvent="save">保存</Button>
        </ButtonItem>
    </bu-view>       
</template>     
<style scoped>
    .content{
        flex-direction: row;
        width: 750px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 30px;
        flex-wrap: wrap;
    }
    .image{
        width: 209px;
        height: 209px;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    .border{
        background-color: #f7f7f7;
        justify-content: center;
        align-items: center;
    }
    .icon{
        width: 80px;
        height: 80px;
    }
</style>
<script>
    import buView from '../../components/bu-view.vue'
    import navigator from '../../common/navigator.js'
    import modal from '../../common/modal.js'
    import common from './commonJs/common.js'
    import components from '../../basicComponents'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                configData:{
                    title: '已选择的图片',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'getImgUrl'
                },
                imageList:[],
                count: 10,
                addIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/product/bigAddIcon.png'
            };
        },
        components:{
            buView,
            ButtonItem: components.ButtonItem,
            Button: components.Button
        },
        created(){
            
        },
        mounted(){
            common.getStorageImg.call(this)
        },  
        methods:{
            viewEvent(name,call){
                this[name](call)
            },
            show(index) {
                storage.setItem('image_wait_show' , JSON.stringify({index: index , src: this.imageList}) , res => {
                    navigator.push({
                        url: '/modules/commonPage/image'
                    })
                })
            },
            getPhoto() {
                if(this.imageList.length < this.count) {
                    common.getPhoto.call(this)
                }else {
                    modal.toast({message:'最多添加10张图片',duration: 2})
                }
            },
            getImgUrl() {
                common.getImgUrl.call(this)   
            },
            save() {
                storage.setItem('product_selected_image_list' , JSON.stringify(this.imageList) , res => {
                    navigator.pop()
                }) 
            }
        },
    };
</script>