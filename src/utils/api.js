import request from './request.js'

/**
 * 统一 API 接口封装
 */
class ApiClient {
  /**
   * GET 请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @param {object} config - 请求配置
   * @returns {Promise}
   */
  static get(url, params = {}, config = {}) {
    return request({
      method: 'get',
      url,
      params,
      ...config
    })
  }

  /**
   * POST 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {object} config - 请求配置
   * @returns {Promise}
   */
  static post(url, data = {}, config = {}) {
    return request({
      method: 'post',
      url,
      data,
      ...config
    })
  }

  /**
   * PUT 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {object} config - 请求配置
   * @returns {Promise}
   */
  static put(url, data = {}, config = {}) {
    return request({
      method: 'put',
      url,
      data,
      ...config
    })
  }

  /**
   * DELETE 请求
   * @param {string} url - 请求地址
   * @param {object} params - 请求参数
   * @param {object} config - 请求配置
   * @returns {Promise}
   */
  static delete(url, params = {}, config = {}) {
    return request({
      method: 'delete',
      url,
      params,
      ...config
    })
  }

  /**
   * PATCH 请求
   * @param {string} url - 请求地址
   * @param {object} data - 请求数据
   * @param {object} config - 请求配置
   * @returns {Promise}
   */
  static patch(url, data = {}, config = {}) {
    return request({
      method: 'patch',
      url,
      data,
      ...config
    })
  }
}

export default ApiClient