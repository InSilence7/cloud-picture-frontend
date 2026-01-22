import router from '@/router'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 是否为首次获取登录用户
let firstFetchLoginUser = true

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  console.log('=== 路由守卫开始 ===')
  console.log('from:', from.fullPath)
  console.log('to:', to.fullPath)

  const loginUserStore = useLoginUserStore()
  let loginUser = loginUserStore.loginUser
  // 确保页面刷新，首次加载时，能够等后端返回用户信息后再校验权限

  console.log('当前存储的用户:', loginUserStore.loginUser)

  if (firstFetchLoginUser) {
    await loginUserStore.fetchLoginUser()
    loginUser = loginUserStore.loginUser
    firstFetchLoginUser = false
  }
  const toUrl = to.fullPath

  console.log('toUrl', toUrl)

  if (toUrl.startsWith('/admin')) {
    if (!loginUser || loginUser.userRole !== 'admin') {
      message.error('没有权限')
      next(`/user/login?redirect=${to.fullPath}`)
      console.log('=== 路由守卫结束false ===')
      return
    }
  }
  console.log('=== 路由守卫结束true ===')
  next()
})
