import request from '@/utils/request'

export function getPCIDevices() {
  return request({
    url: '/os/pcidevices/all',
    method: 'get'
  })
}

export function getPCIDeviceID(params) {
  return request({
    url: '/os/pcidevices/ids',
    method: 'post',
    data: params
  })
}
