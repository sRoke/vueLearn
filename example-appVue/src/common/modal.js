const modal = weex.requireModule('modal')
const toastEvent = weex.requireModule('toastEvent')

function toast(options){
    if(toastEvent && typeof(toastEvent.toast) == "function"){
        toastEvent.toast(options.duration,options.message)
    }else{
        modal.toast(options)
    }
}
function alert(options, callback){
    options.okTitle = '确认'
    modal.alert(options, callback)

}
function confirm(options, callback){
    
    modal.confirm(options, callback)

}
function prompt(options, callback){
    
    modal.prompt(options, callback)

}
export default {
    toast,
    alert,
    confirm,
    prompt
}