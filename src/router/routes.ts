import type { RouteRecordRaw } from 'vue-router'
import { AndroidFilled, HomeOutlined } from '@ant-design/icons-vue'
import HomePage from '@/pages/HomePage.vue'
import UserLoginPage from '@/pages/user/UserLoginPage.vue'
import UserRegisterPage from '@/pages/user/UserRegisterPage.vue'
import UserManagePage from '@/pages/admin/UserManagePage.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '主页',
    component: HomePage,

    meta: {
      title: '主页',
      icon: HomeOutlined,
    },
  },
  {
    path: '/user/login',
    name: '用户登录',
    component: UserLoginPage,
    meta: {
      title: '用户登录',
      showInMenu: false, // 添加此属性控制不显示在菜单中
    },
  },
  {
    path: '/user/register',
    name: '用户注册',
    component: UserRegisterPage,
    meta: {
      title: '用户注册',
      showInMenu: false, // 添加此属性控制不显示在菜单中
    },
  },
  {
    path: '/admin/userManage',
    name: '用户管理',
    component: UserManagePage,
  },
  {
    path: '/about',
    name: '关于',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../pages/AboutPage.vue'),
    meta: {
      title: '关于',
      icon: AndroidFilled,
    },
  },
]
