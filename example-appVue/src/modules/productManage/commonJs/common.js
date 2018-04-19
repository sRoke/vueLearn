/*
    打开照片选择  （可选数量  是否打开相机）
*/
var photoEvent = weex.requireModule('photoEvent')
var modal = weex.requireModule('modal')
var storage = weex.requireModule('storage')

function getPhoto() {
    photoEvent.takePhoto(this.count,false,function(res){})
}
function getStorageImg() {
    storage.getItem('product_selected_image_list' , res => {
        if( res.result === 'success' ){
            this.imageList = JSON.parse( res.data )
        }
    })
}
function getImgUrl() {
    new Promise((reject,resolve) => {
        let file = "file://"
        if(typeof(photoEvent.getIosPhoto) === "function"){
            photoEvent.getIosPhoto(res => {
                if(res.value.length > 0) {
                    let arr = res.value.map(res =>{
                        return res.indexOf(file) != -1 ? res : (file + res)
                    })
                    reject(arr)
                } 
            })
        }else{
            //安卓
            setTimeout(() => {
                storage.getItem('IMG_LIST',e =>{
                    if(e.result === "success"){
                        let data = JSON.parse(e.data)
                        let arr = data.map(res =>{
                            return res.indexOf(file) !== -1 ? res : (file + res)
                        })
                        storage.removeItem("IMG_LIST", e=>{})
                        reject(arr)
                    }
                })    
            },200)
        }
    }).then(res => {
        if(this.count === 1) {
            this.imageList = res
        }else{
            this.imageList = this.imageList.concat(res)
            if(this.imageList.length > this.count) {
                this.imageList.length = this.count
            }
        }
        storage.setItem('product_selected_image_list', JSON.stringify(this.imageList) , e => {

        })
    })
    
}
export default {
    getPhoto,
    getImgUrl,
    getStorageImg
}