let obj = {}
const navigator = weex.requireModule('navigator')
const storage = weex.requireModule('storage')

function push(options,callback){

    if(typeof window === 'object'){
        var href = 'http://192.168.2.225:8080/web'+ options.url +'.html'+ (options.query? options.query : '')
        window.location.href =  href

    }else{
        /*
          获取需要跳转页面的前缀
        */
        storage.getItem('app_page_src_host',res =>{
          options.url = res.data +  options.url + '.js' + (options.query? options.query : '')
          navigator.push({
              'url':options.url,
              'animated':'false'
          },callback)
        })   
    }
}
function pop(options,callback){

    if(typeof window === 'object'){
        
        window.history.back()

    }else{
        
        navigator.pop({'animated':'false'},callback)
    }

}
function getDataByUrl (name, url) {
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url); 
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function query(name,self){
    let url = self.$getConfig().bundleUrl
    return getDataByUrl(name,url)
}
obj.push = push
obj.pop = pop
obj.getQuery = query
export default obj