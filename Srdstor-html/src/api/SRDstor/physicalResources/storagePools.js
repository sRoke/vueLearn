import request from '@/utils/request'

export function createStoragePool(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/create',
    method: 'post',
    data: params
  })
}

export function editStoragePool(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/edit',
    method: 'post',
    data: params
  })
}

export function expandStoragePool(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/expand',
    method: 'post',
    data: params
  })
}

export function deleteStoragePool(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/delete',
    method: 'post',
    data: params
  })
}

export function getStoragePools() {
  return request({
    url: '/SRDStor/physicalresource/storagepool/list',
    method: 'get'
  })
}

export function getSystemDisk() {
  return request({
    url: '/SRDStor/physicalresource/storagepool/getsystemdisk',
    method: 'get'
  })
}

export function getStoragePool(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/fetch',
    method: 'post',
    data: params
  })
}

export function getStoragePoolProperty(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/fetch/property',
    method: 'post',
    data: params
  })
}

export function getStoragePoolDevTree(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/fetch/devtree',
    method: 'post',
    data: params
  })
}

export function getStoragePoolNameMap() {
  return request({
    url: '/SRDStor/physicalresource/storagepool/getmap',
    method: 'get'
  })
}
export function addPhysicalDevice(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/addextra',
    method: 'post',
    data: params
  })
}

export function removePhysicalDevice(params) {
  return request({
    url: '/SRDStor/physicalresource/storagepool/remove',
    method: 'post',
    data: params
  })
}
