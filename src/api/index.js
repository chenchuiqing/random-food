import ApiClient from '../utils/api.js'

/**
 * 用户相关接口
 */
export const userApi = {
  // 获取用户信息
  getUserInfo(id) {
    return ApiClient.get(`/users/${id}`)
  },
  
  // 获取用户列表
  getUserList(params) {
    return ApiClient.get('/users', params)
  },
  
  // 创建用户
  createUser(data) {
    return ApiClient.post('/users', data)
  },
  
  // 更新用户
  updateUser(id, data) {
    return ApiClient.put(`/users/${id}`, data)
  },
  
  // 删除用户
  deleteUser(id) {
    return ApiClient.delete(`/users/${id}`)
  }
}

/**
 * 产品相关接口
 */
export const productApi = {
  // 获取产品列表
  getProductList(params) {
    return ApiClient.get('/products', params)
  },
  
  // 获取产品详情
  getProductDetail(id) {
    return ApiClient.get(`/products/${id}`)
  },
  
  // 创建产品
  createProduct(data) {
    return ApiClient.post('/products', data)
  },
  
  // 更新产品
  updateProduct(id, data) {
    return ApiClient.put(`/products/${id}`, data)
  },
  
  // 删除产品
  deleteProduct(id) {
    return ApiClient.delete(`/products/${id}`)
  }
}

/**
 * 订单相关接口
 */
export const orderApi = {
  // 获取订单列表
  getOrderList(params) {
    return ApiClient.get('/orders', params)
  },
  
  // 获取订单详情
  getOrderDetail(id) {
    return ApiClient.get(`/orders/${id}`)
  },
  
  // 创建订单
  createOrder(data) {
    return ApiClient.post('/orders', data)
  },
  
  // 更新订单
  updateOrder(id, data) {
    return ApiClient.put(`/orders/${id}`, data)
  },
  
  // 删除订单
  deleteOrder(id) {
    return ApiClient.delete(`/orders/${id}`)
  }
}

export default {
  userApi,
  productApi,
  orderApi
}