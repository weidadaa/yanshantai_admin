import request from '@/utils/request'

export function listRegion() {
  return request({
    url: '/FinancialRecord/platform',
    method: 'get'
  })
}

export function listSubRegion(query) {
  return request({
    url: '/FinancialRecord/income',
    method: 'get',
    params: query
  })
}

export function laedList(query) {
  return request({
    url: '/FinancialRecord/inoutdetail',
    method: 'get',
    params: query
  })
}
export function withdrawList(query) {
  return request({
    url: '/FinancialRecord/withdraw',
    method: 'get',
    params: query
  })
}

