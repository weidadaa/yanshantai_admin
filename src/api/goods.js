import request from '@/utils/request'

export function listGoods(query) { //商品列表
  return request({
    url: '/ShanglalaProduct/sale/page',
    method: 'get',
    params: query
  })
}

export function deleteGoods(productId) { //删除商品
  return request({
    url: '/ShanglalaProduct/delete',
    method: 'delete',
    params: { productId }
  })
}

export function publishGoods(data) { //发布商品
  return request({
    url: '/ShanglalaProduct/save',
    method: 'post',
    data
  })
}

export function detailGoods(productId) {  //商品详细
  return request({
    url: '/ShanglalaProduct/details',
    method: 'get',
    params: { productId }
  })
}

export function editGoods(data) { //编辑商品
  return request({
    url: '/ShanglalaProduct/update',
    method: 'put',
    data
  })
}

export function listSellout() { //商品售罄列表
  return request({
    url: '/ShanglalaProduct/saleEnd/page',
    method: 'get'
  })
}
export function listStore() { //在仓库中列表
  return request({
    url: '/ShanglalaProduct/store/page',
    method: 'get'
  })
}

export function listGrouping() { //商品分组列表
  return request({
    url: '/ProductGroup/list',
    method: 'get'
  })
}
export function publishGroup(data) { //新建分组
  return request({
    url: '/ProductGroup/save',
    method: 'post',
    data
  })
}
export function deleteGroup(groupId) { //删除分组
  return request({
    url: '/ProductGroup/delete',
    method: 'delete',
    params: { groupId }
  })
}

export function updateGroup(data) { //编辑商品
  return request({
    url: '/ProductGroup/update',
    method: 'put',
    data
  })
}
export function listCatAndBrand() { //商品分类列表
  return request({
    url: '/ProductCategory/list',
    method: 'get'
  })
}
export function publishCategory(data) { //新建类目
  return request({
    url: '/ProductCategory/save',
    method: 'post',
    data
  })
}
export function updateCategory(data) { //修改类目
  return request({
    url: '/ProductCategory/update',
    method: 'put',
    data
  })
}
export function deleteCategory(catId) { //删除分类
  return request({
    url: '/ProductCategory/delete',
    method: 'delete',
    params: { catId }
  })
}





