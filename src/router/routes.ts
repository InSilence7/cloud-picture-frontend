import type { RouteRecordRaw } from 'vue-router'
import { AndroidFilled, HomeOutlined } from '@ant-design/icons-vue'
import HomePage from '@/pages/HomePage.vue'

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
