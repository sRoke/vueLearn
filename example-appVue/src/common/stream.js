const stream = weex.requireModule('stream')
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal')
import shieldApi from './shieldApi.js'
let obj = {}

function param(data) {

    var result = "";

    for (var attr in data) {
        if (data.hasOwnProperty(attr)) {
            if(data[attr] !== null && data[attr] !== undefined && data[attr] !== "")
            result += attr + "=" + data[attr] + "&";
        }
    }

    result = result.substr(0, result.length - 1);  
    return result;
}
function shield(url , over , call){
    storage.getItem('app_state_through',res =>{
        if(res.result === 'success'){
            let api = url
            if(api.indexOf('?') != -1){
                api = api.replace(/\?.*/g,'')
            }
            if(shieldApi[api]){
                modal.alert({message:'对不起，体验状态禁止此操作'})
                if(typeof over == 'function'){
                    over()
                } 
            }else{
                call()
            }
        }else{
            call()
        }
    })
}
function fetch(options,callback,over){
    shield(options.url , over , ()=>{
        storage.getItem('login_token',function(res){
            if(res.result === 'success'){
                let result = JSON.parse(res.data)
                options.headers = {
                    'token': result.bubuid,
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Accept-Encoding":'gzip'
                }
                options.type = 'json'
                if(result.code){
                    if(options.url.indexOf('?') != -1){
                        options.url += '&$DEBUG=' + result.code
                    }else{
                        options.url += '?$DEBUG=' + result.code
                    }
                }
                options.url = result.host + options.url
                if(options.body){
                    options.body = param(options.body)
                }           
            }
            stream.fetch(options,res => {
                if(res.ok){
                    if(res.data.code == 0){
                        callback(res.data)
                        
                    }else{  
                        let msg = res.data.msg
                        if(msg == 'NOT_LOGIN'){
                            msg = '登录过期，请重新登录'
                        }                                  
                        modal.alert({
                            message: msg
                        })                   
                    }

                }else {
                    modal.alert({
                        message:'网络不畅通或服务器链接不上'
                    })
                }
                if(typeof over == 'function'){
                    over(res)
                } 
            })
        })
    })  
}
obj.fetch = fetch
export default obj