import request from '@/utils/request'
import Qs from "qs";

export function fetchList(query) { //获取用户列表
    return request({
        url: '/User/list',
        method: 'get',
        params: query
    })
}

export function listStoreVip(query) {//获取会员等级列表
    return request({
        url: '/StoreVip/list',
        method: 'get',
        params: query
    })
}

export function addStoreVip(data) { //添加会员等级
    return request({
        url: '/StoreVip',
        method: 'post',
        data
    })
}

export function deleteStoreVip(vipId) { //删除分类
    return request({
        url: '/StoreVip',
        method: 'delete',
        params: { vipId }
    })
}

export function updataSvip(data) {
    return request({
        url: '/StoreVip',
        method: 'put',
        data
    })
}

export function updateUser(data) { //修改用户信息
    return request({
        url: '/User',
        method: 'put',
        data
    })
}

export function listAddress(query) {
    return request({
        url: '/address/list',
        method: 'get',
        params: query
    })
}

// 提现管理接口
export function listCollect(query) {
    return request({
        url: '/tixian/list/wtx',
        method: 'get',
        params: query
    })
}
// 提现管理接口
export function listshenpi(query) {
    return request({
        url: '/tixian/shenpi',
        method: 'post',
        data: query,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
    })
}

export function listFeedback(query) {
    return request({
        url: '/feedback/list',
        method: 'get',
        params: query
    })
}

export function listFootprint(query) {
    return request({
        url: '/footprint/list',
        method: 'get',
        params: query
    })
}

export function listHistory(query) {
    return request({
        url: '/history/list',
        method: 'get',
        params: query
    })
}
