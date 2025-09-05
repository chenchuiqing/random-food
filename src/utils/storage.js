/**
 * uni-app Storage 工具类
 * 封装 uni.setStorageSync/uni.getStorageSync 等 API
 * 支持不同端的自动转换
 */

class StorageService {
  constructor() {
    this.storageKey = 'food_app_data'
    this.foodsKey = 'foods_list'
    this.nextIdKey = 'next_food_id'
  }

  /**
   * 设置存储数据
   * @param {string} key - 存储键
   * @param {any} data - 存储数据
   */
  setItem(key, data) {
    try {
      uni.setStorageSync(key, data)
      return true
    } catch (error) {
      console.error('存储数据失败:', error)
      return false
    }
  }

  /**
   * 获取存储数据
   * @param {string} key - 存储键
   * @param {any} defaultValue - 默认值
   */
  getItem(key, defaultValue = null) {
    try {
      const data = uni.getStorageSync(key)
      return data !== '' ? data : defaultValue
    } catch (error) {
      console.error('获取存储数据失败:', error)
      return defaultValue
    }
  }

  /**
   * 删除存储数据
   * @param {string} key - 存储键
   */
  removeItem(key) {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('删除存储数据失败:', error)
      return false
    }
  }

  /**
   * 清空所有存储数据
   */
  clear() {
    try {
      uni.clearStorageSync()
      return true
    } catch (error) {
      console.error('清空存储数据失败:', error)
      return false
    }
  }

  /**
   * 获取所有美食数据
   */
  getAllFoods() {
    return this.getItem(this.foodsKey, [])
  }

  /**
   * 保存所有美食数据
   * @param {Array} foods - 美食列表
   */
  saveAllFoods(foods) {
    return this.setItem(this.foodsKey, foods)
  }

  /**
   * 获取下一个美食ID
   */
  getNextFoodId() {
    return this.getItem(this.nextIdKey, 1)
  }

  /**
   * 设置下一个美食ID
   * @param {number} id - 下一个ID
   */
  setNextFoodId(id) {
    return this.setItem(this.nextIdKey, id)
  }

  /**
   * 添加美食
   * @param {string} name - 美食名称
   * @param {string} image - 美食图片路径
   */
  addFood(name, image = '') {
    try {
      const foods = this.getAllFoods()
      const nextId = this.getNextFoodId()
      
      const newFood = {
        id: nextId,
        name: name.trim(),
        image: image,
        createdAt: new Date().toISOString()
      }
      
      foods.unshift(newFood)
      
      // 保存数据
      this.saveAllFoods(foods)
      this.setNextFoodId(nextId + 1)
      
      return newFood
    } catch (error) {
      console.error('添加美食失败:', error)
      throw error
    }
  }

  /**
   * 更新美食
   * @param {number} id - 美食ID
   * @param {string} name - 美食名称
   * @param {string} image - 美食图片路径
   */
  updateFood(id, name, image = '') {
    try {
      const foods = this.getAllFoods()
      const index = foods.findIndex(food => food.id === id)
      
      if (index === -1) {
        throw new Error('美食不存在')
      }
      
      foods[index] = {
        ...foods[index],
        name: name.trim(),
        image: image,
        updatedAt: new Date().toISOString()
      }
      
      this.saveAllFoods(foods)
      return foods[index]
    } catch (error) {
      console.error('更新美食失败:', error)
      throw error
    }
  }

  /**
   * 删除美食
   * @param {number} id - 美食ID
   */
  deleteFood(id) {
    try {
      const foods = this.getAllFoods()
      const filteredFoods = foods.filter(food => food.id !== id)
      
      if (filteredFoods.length === foods.length) {
        throw new Error('美食不存在')
      }
      
      this.saveAllFoods(filteredFoods)
      return true
    } catch (error) {
      console.error('删除美食失败:', error)
      throw error
    }
  }

  /**
   * 检查美食名称是否存在
   * @param {string} name - 美食名称
   * @param {number} excludeId - 排除的ID（用于编辑时检查）
   */
  checkFoodNameExists(name, excludeId = null) {
    const foods = this.getAllFoods()
    return foods.some(food => 
      food.name.toLowerCase() === name.toLowerCase() && 
      food.id !== excludeId
    )
  }

  /**
   * 获取存储信息
   */
  getStorageInfo() {
    try {
      const info = uni.getStorageInfoSync()
      return {
        keys: info.keys,
        currentSize: info.currentSize,
        limitSize: info.limitSize,
        success: true
      }
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 测试存储功能
   */
  async testStorage() {
    const results = {
      setItem: false,
      getItem: false,
      removeItem: false,
      addFood: false,
      updateFood: false,
      deleteFood: false,
      errors: []
    }

    try {
      // 测试基本存储
      const testKey = 'test_key'
      const testData = { test: 'data', timestamp: Date.now() }
      
      // 测试设置
      results.setItem = this.setItem(testKey, testData)
      
      // 测试获取
      const retrieved = this.getItem(testKey)
      results.getItem = JSON.stringify(retrieved) === JSON.stringify(testData)
      
      // 测试删除
      results.removeItem = this.removeItem(testKey)
      
      // 测试美食相关功能
      const testFood = this.addFood('测试美食', '/static/logo.png')
      results.addFood = testFood && testFood.id > 0
      
      if (results.addFood) {
        // 测试更新
        const updated = this.updateFood(testFood.id, '更新后的测试美食', '/static/logo.png')
        results.updateFood = updated && updated.name === '更新后的测试美食'
        
        // 测试删除
        results.deleteFood = this.deleteFood(testFood.id)
      }
      
    } catch (error) {
      results.errors.push(`测试失败: ${error.message}`)
    }

    return results
  }
}

// 导出单例实例
export default new StorageService()
