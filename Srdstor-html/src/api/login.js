import request from '@/utils/request'

export function login(username, password, server) {
  return request({
    url: '/SRDStor/user/auth/login',
    method: 'post',
    data: {
      username,
      password,
      server
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(id) {
  return request({
    url: '/SRDStor/user/auth/logout',
    method: 'post',
    data: {
      id
    }
  })
}
