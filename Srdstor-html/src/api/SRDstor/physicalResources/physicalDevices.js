import request from '@/utils/request'

export function getDisk(params) {
  return request({
    url: '/SRDStor/physicalresource/disk/fetch',
    method: 'post',
    data: params
  })
}

export function getDisks() {
  return request({
    url: '/SRDStor/physicalresource/disk/list',
    method: 'get'
  })
}

export function rescanDisk() {
  return request({
    url: '/SRDStor/physicalresource/disk/rescan',
    method: 'get'
  })
}

export function lightDisk(params) {
  return request({
    url: '/SRDStor/physicalresource/disk/light',
    method: 'post',
    data: params
  })
}

export function extinguishDisk(params) {
  return request({
    url: '/SRDStor/physicalresource/disk/extinguish',
    method: 'post',
    data: params
  })
}

export function getLightStatus() {
  return request({
    url: '/SRDStor/physicalresource/disk/lightStatus',
    method: 'get'
  })
}

export function getDisksAndLightStatus() {
  return request.all([getDisks(), getLightStatus()])
}

