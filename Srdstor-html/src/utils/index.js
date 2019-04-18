/**
 * Created by jiachenpan on 16/11/18.
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function formatBytes(a, b) {
  if (a === 0) { return '0 Bytes' }
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

export function formatRAID10(val) {
  const disks = []
  const num = val.length / 2
  for (let i = 0, len = val.length; i < len; i += num) {
    disks.push(val.slice(i, i + num))
  }
  return disks
}

export function formatRAID50(val) {
  const disks = []
  const val2 = val.length % 2
  const val3 = val.length % 3
  const len = val.length
  if (len === 3) {
    disks.push(val)
  } else if ((val2 === 0 || val3 === 0) && (len / 2 >= 3)) {
    let num = 0
    if (val2 === 0 && val3 === 0) {
      num = len / 2
    } else if (val2 === 0) {
      num = len / 2
    } else if (val3 === 0) {
      num = len / 3
    }
    for (let i = 0, len = val.length; i < len; i += num) {
      disks.push(val.slice(i, i + num))
    }
  }
  return disks
}

export function formatRAID60(val) {
  const disks = []
  const val2 = val.length % 2
  const val3 = val.length % 4
  const len = val.length
  if (len === 4) {
    disks.push(val)
  } else if ((val2 === 0 || val3 === 0) && (len / 2 >= 4)) {
    let num = 0
    if (val2 === 0 && val3 === 0) {
      num = len / 4
    } else if (val2 === 0 && val3 !== 0) {
      num = len / 2
    }
    for (let i = 0, len = val.length; i < len; i += num) {
      disks.push(val.slice(i, i + num))
    }
  }
  return disks
}

/**
 * 根据所选RAID类型处理硬盘数据
 **/
export function raidTypeFilter(type, val) {
  const raidType = {
    1: [val],
    2: [val],
    3: formatRAID10(val),
    4: [val], // 3
    5: formatRAID50(val),
    6: [val], // 4
    7: formatRAID60(val),
    8: [val] // 5
  }
  return raidType[type]
}

export const deepClone = obj => {
  const clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  return Array.isArray(obj) && obj.length
    ? (clone.length = obj.length) && Array.from(clone)
    : Array.isArray(obj)
      ? Array.from(obj)
      : clone
}

export const filterUnique = (arr) => [...new Set(arr)]
