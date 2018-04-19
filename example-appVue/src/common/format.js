 
function time(type){
    let date = new Date()
    let year = date.getFullYear()
    let m = date.getMonth() + 1
    let month = m >= 10 ? m : '0' + m
    let d = date.getDate()
    let day = d >= 10 ? d : '0' + d
    let h = date.getHours()
    let hour = h >= 10 ? h : '0' + h
    let min = date.getMinutes()
    let minutes = min >= 10 ? min : '0' + min
    let sec = date.getSeconds()
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
}
function day(dis){
    let date = new Date()
    if(dis){
      date.setTime(date.getTime()+ dis * 24 * 60 * 60 * 1000);
    }
    let year = date.getFullYear()
    let m = date.getMonth() + 1
    let month = m >= 10 ? m : '0' + m
    let d = date.getDate()
    let day = d >= 10 ? d : '0' + d
    return year + '-' + month + '-' + day
}
export default {
    day,
    time
}