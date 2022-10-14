import request from '@/utils/request'


export function listCoupon(query) {
  return request({
    url: '/Coupon/list',
    method: 'get',
    params: query
  })
}




export function Coupon(data) {
  return request({
    url: '/Coupon',
    method: 'post',
    data
  })
}

export function nNotice() {
  return request({
    url: '/profile/nnotice',
    method: 'get'
  })
}

export function listNotice(query) {
  return request({
    url: '/profile/lsnotice',
    method: 'get',
    params: query
  })
}


