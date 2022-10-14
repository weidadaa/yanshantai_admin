import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie  从 cookie 中获取令牌

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function 权限判断功能
function hasPermission(perms, permissions) {
  if (perms.indexOf('*') >= 0) return true // admin permission passed directly  管理员权限直接通过
  if (!permissions) return true
  return perms.some(perm => permissions.indexOf(perm) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist  没有重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar  开始进度条
  if (getToken()) { // determine if there has token  判断是否有token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it  如果当前页面是dashboard，afterEach钩子不会触发，所以手动处理
    } else {
      // if (store.getters.perms.length === 0) { // 判断当前用户是否已拉取完user_info信息
      //   store.dispatch('GetUserInfo').then(res => { // 拉取user_info
      //     const perms = res.data.data.perms // note: perms must be a array! such as: ['GET /aaa','POST /bbb']
      //     store.dispatch('GenerateRoutes', { perms }).then(() => { // 根据perms权限生成可访问的路由表
      //       router.addRoutes(store.getters.addRoutes) // 动态添加可访问路由表
      //       next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //     })
      //   }).catch((err) => {
      //     store.dispatch('FedLogOut').then(() => {
      //       Message.error(err || 'Verification failed, please login again')
      //       next({ path: '/' })
      //     })
      //   })
      // } else {
      // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      if (hasPermission(store.getters.perms, to.meta.perms)) {
        next()
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true } })
      }
      // 可删 ↑
      // }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
