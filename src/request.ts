import { message } from 'ant-design-vue'
import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'http://localhost:8200',
  timeout: 60000,
  withCredentials: true,
})

// Add a request interceptor
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
myAxios.interceptors.response.use(
  function onFulfilled(response) {
    const { data } = response
    //未登录
    if (data.code === 40100) {
      //不是获取用户信息的请求，并且用户目前不是用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.error('请先登录')
        window.location.href = '/user/login?redirect=${window.location.pathname}'
      }
    }
    return response
  },
  function onRejected(error) {
    return Promise.reject(error)
  },
)

export default myAxios
