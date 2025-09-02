/**
 * 环境变量工具类
 */

/**
 * 获取环境变量
 * @param {string} key - 环境变量键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 环境变量值
 */
export function getEnv(key, defaultValue = null) {
  const value = import.meta.env[key];
  return value !== undefined ? value : defaultValue;
}

/**
 * 获取字符串类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {string} defaultValue - 默认值
 * @returns {string} 环境变量值
 */
export function getEnvString(key, defaultValue = '') {
  return import.meta.env[key] || defaultValue;
}

/**
 * 获取数字类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {number} defaultValue - 默认值
 * @returns {number} 环境变量值
 */
export function getEnvNumber(key, defaultValue = 0) {
  const value = import.meta.env[key];
  return value ? Number(value) : defaultValue;
}

/**
 * 获取布尔类型的环境变量
 * @param {string} key - 环境变量键名
 * @param {boolean} defaultValue - 默认值
 * @returns {boolean} 环境变量值
 */
export function getEnvBoolean(key, defaultValue = false) {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  
  // 支持字符串转布尔值
  return value === 'true' || value === true;
}

/**
 * 检查是否为开发环境
 * @returns {boolean}
 */
export function isDev() {
  return import.meta.env.MODE === 'development';
}

/**
 * 检查是否为生产环境
 * @returns {boolean}
 */
export function isProd() {
  return import.meta.env.MODE === 'production';
}

/**
 * 检查是否为测试环境
 * @returns {boolean}
 */
export function isTest() {
  return import.meta.env.MODE === 'test';
}

export default {
  getEnv,
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  isDev,
  isProd,
  isTest
};