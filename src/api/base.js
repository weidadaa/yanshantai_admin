import request from '@/utils/request'

export function listBase(query) {
  return request({
    url: '/base/list',
    method: 'get',
    params: query
  })
}

export function updateBase(query) {
    return request({
      url: '/base/update',
      method: 'post',
      params: query
    })
  }