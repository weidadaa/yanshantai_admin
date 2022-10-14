import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/moneyLog/list',
        method: 'get',
        params: query
    })
}