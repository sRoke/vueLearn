import request from '@/utils/request'

export function createCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/open',
    method: 'post',
    data: params
  })
}

export function deleteCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/remove',
    method: 'post',
    data: params
  })
}

export function updateCDPJournalProperties(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/update',
    method: 'post',
    data: params
  })
}

export function getCDPJournalProperties(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/fetch',
    method: 'post',
    data: params
  })
}

export function suspendCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/suspend',
    method: 'post',
    data: params
  })
}

export function resumeCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/resume',
    method: 'post',
    data: params
  })
}

export function getTags(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/markList',
    method: 'post',
    data: params
  })
}

export function addTag(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/mark',
    method: 'post',
    data: params
  })
}

export function deleteTag(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/delMark',
    method: 'post',
    data: params
  })
}

export function retrieveCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/view',
    method: 'post',
    data: params
  })
}

export function extractCDPJournal(params) {
  return request({
    url: '/SRDStor/logicalresource/cdp/extract',
    method: 'post',
    data: params
  })
}
