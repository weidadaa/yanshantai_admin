import request from '@/utils/request'

export function listSurvey(query) {
  return request({
    url: '/Store',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/ad/create',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/ad/read',
    method: 'get',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/ad/update',
    method: 'post',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: '/ad/delete',
    method: 'post',
    data
  })
}
