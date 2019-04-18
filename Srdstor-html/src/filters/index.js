// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'
import { formatBytes } from '@/utils/index'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function bytesFormatter(a, b) {
  return formatBytes(a, b)
}

export function statusFormatter(status) {
  return status ? '健康' : '即将发生故障'
}

export function statusFilter(status) {
  return status ? 'success' : 'danger'
}

export function usedFlagFormatter(val) {
  return val ? '是' : '否'
}

export function raidLevel(val) {
  const level = {
    1: 'RAID0',
    2: 'RAID1',
    3: 'RAID10',
    4: 'RAID5',
    5: 'RAID50',
    6: 'RAID6',
    7: 'RAID60',
    8: 'RAIDX'
  }
  return level[val] || val
}
