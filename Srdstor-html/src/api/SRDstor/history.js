import request from '@/utils/request'

export function getHistory(params) {
  return request({
    url: '/SRDStor/physicalresource/userlog/getlog',
    method: 'post',
    data: params
  })
}
