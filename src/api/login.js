import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    // url: '/auth/login',
    url: '/Admin/login',
    method: 'post',
    data
  })
}

// export function logout() {
//   return request({
//     url: '/auth/logout',
//     method: 'post'
//   })
// }

// export function getUserInfo(token) {
//   return request({
//     url: '/auth/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function getKaptcha() {
//   return request({
//     // url: '/Admin/login',
//     url: '/auth/kaptcha',
//     method: 'get'
//   })
// }
