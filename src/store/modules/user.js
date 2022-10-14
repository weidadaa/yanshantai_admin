import {loginByUsername} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const user = {
    state: {
        user: '',
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        perms: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_PERMS: (state, perms) => {
            state.perms = perms
        }
    },

    actions: {
        // 用户名登录
        LoginByUsername({commit}, userInfo) {
            console.log(36,userInfo)
            console.log(37,{commit})
            return new Promise((resolve, reject) => {
                loginByUsername(userInfo).then(response => {
                    console.log(420, response);
                    const token = response.data.data.token
                    const avatar = response.data.data.adminInfo.avatar
                    commit('SET_AVATAR', avatar)
                    commit('SET_TOKEN', token)
                    setToken(token)
                    resolve(response)
                }).catch(response => {
                    if (response.status && response.status === 200) {
                        console.log(41, userInfo);
                        console.log(42, response);
                        const token = response.data.data.token
                        commit('SET_TOKEN', token)
                        setToken(token)
                        resolve(response)
                        return
                    }
                    reject(response)
                })
            })
        },

        // // 获取用户信息
        // GetUserInfo({commit, state}) {
        //     console.log(state)
        //     return new Promise((resolve, reject) => {
        //         console.log(67)
        //         getUserInfo(state.token).then(response => {
        //             const data = response.data.data
        //             console.log("登陆时", data);
        //             if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
        //                 commit('SET_PERMS', data.perms)
        //             } else {
        //                 reject('getInfo: perms must be a non-null array !')
        //             }
        //             commit('SET_ROLES', data.roles)
        //             commit('SET_NAME', data.name)
        //             commit('SET_AVATAR', data.avatar)
        //             resolve(response)
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },

        // 登出
        LogOut({commit, state, dispatch}) {
            console.log('登出')
            return new Promise((resolve, reject) => {
                    commit('SET_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_PERMS', [])
                    removeToken()
                    resetRouter()
                    // reset visited views and cached views
                    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                    dispatch('tagsView/delAllViews', null, {root: true})
                    resolve()

            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles({commit, dispatch}, role) {
            return new Promise(async resolve => {
                commit('SET_TOKEN', role)
                setToken(role)

                const {roles} = await dispatch('GetUserInfo')

                resetRouter()

                const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

                // dynamically add accessible routes
                router.addRoutes(accessRoutes)

                // reset visited views and cached views
                dispatch('tagsView/delAllViews', null, {root: true})

                resolve()
            })
        }
    }
}

export default user
