import axios from 'axios'
import { getEnvString, getEnvNumber } from './env.js'

// 创建 axios 实例
const service = axios.create({
  // 基础URL，从环境变量中获取
  baseURL: getEnvString('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  // 请求超时时间，从环境变量中获取
  timeout: getEnvNumber('VITE_HTTP_TIMEOUT', 10000),
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 可以添加认证 token 等操作
    // config.headers['Authorization'] = 'Bearer ' + getToken()
    
    // 显示请求日志（仅在开发环境）
    if (import.meta.env.MODE === 'development') {
      console.log('发起请求:', config)
    }
    
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const res = response.data
    
    // 显示响应日志（仅在开发环境）
    if (import.meta.env.MODE === 'development') {
      console.log('收到响应:', res)
    }
    
    // 可以根据返回的状态码进行统一处理
    // 例如：token过期、权限不足等
    
    return res
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    // 根据不同状态码进行相应处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可以跳转到登录页
          console.warn('未授权，请重新登录')
          break
        case 403:
          // 拒绝访问
          console.warn('拒绝访问')
          break
        case 404:
          // 请求资源不存在
          console.warn('请求资源不存在')
          break
        case 500:
          // 服务器内部错误
          console.error('服务器内部错误')
          break
        default:
          console.error(`连接错误${error.response.status}`)
      }
    } else {
      // 请求超时或网络错误
      if (error.code === 'ECONNABORTED') {
        console.error('请求超时')
      } else {
        console.error('网络错误')
      }
    }
    
    return Promise.reject(error)
  }
)

export default service