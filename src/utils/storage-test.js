/**
 * 存储功能测试工具
 * 用于测试SQLite和本地存储的持久化功能
 */

import database from './database.js'

export class StorageTest {
  /**
   * 测试存储功能
   */
  static async testStorage() {
    console.log('开始测试存储功能...')
    
    try {
      // 1. 测试数据库初始化
      console.log('1. 测试数据库初始化...')
      const initResult = await database.init()
      console.log('数据库初始化结果:', initResult)
      
      // 2. 测试添加食物
      console.log('2. 测试添加食物...')
      const testFood = {
        name: '测试美食_' + Date.now(),
        image: '/static/logo.png'
      }
      await database.addFood(testFood.name, testFood.image)
      console.log('添加食物成功:', testFood)
      
      // 3. 测试获取所有食物
      console.log('3. 测试获取所有食物...')
      const allFoods = await database.getAllFoods()
      console.log('获取所有食物成功，数量:', allFoods.length)
      console.log('最新添加的食物:', allFoods[0])
      
      // 4. 测试更新食物
      if (allFoods.length > 0) {
        console.log('4. 测试更新食物...')
        const foodToUpdate = allFoods[0]
        const newName = '更新后的美食_' + Date.now()
        await database.updateFood(foodToUpdate.id, newName, foodToUpdate.image)
        console.log('更新食物成功:', { id: foodToUpdate.id, newName })
        
        // 验证更新结果
        const updatedFoods = await database.getAllFoods()
        const updatedFood = updatedFoods.find(f => f.id === foodToUpdate.id)
        console.log('验证更新结果:', updatedFood)
      }
      
      // 5. 测试删除食物
      if (allFoods.length > 0) {
        console.log('5. 测试删除食物...')
        const foodToDelete = allFoods[0]
        await database.deleteFood(foodToDelete.id)
        console.log('删除食物成功:', foodToDelete.id)
        
        // 验证删除结果
        const remainingFoods = await database.getAllFoods()
        const deletedFood = remainingFoods.find(f => f.id === foodToDelete.id)
        console.log('验证删除结果:', deletedFood ? '删除失败' : '删除成功')
      }
      
      console.log('存储功能测试完成！')
      return true
      
    } catch (error) {
      console.error('存储功能测试失败:', error)
      return false
    }
  }
  
  /**
   * 测试本地存储
   */
  static testLocalStorage() {
    console.log('开始测试本地存储...')
    
    try {
      const testKey = 'test_key_' + Date.now()
      const testData = { message: '测试数据', timestamp: Date.now() }
      
      // 设置数据
      uni.setStorageSync(testKey, testData)
      console.log('设置本地存储成功:', testData)
      
      // 获取数据
      const retrievedData = uni.getStorageSync(testKey)
      console.log('获取本地存储成功:', retrievedData)
      
      // 验证数据
      const isEqual = JSON.stringify(testData) === JSON.stringify(retrievedData)
      console.log('数据验证结果:', isEqual ? '成功' : '失败')
      
      // 清理测试数据
      uni.removeStorageSync(testKey)
      console.log('清理测试数据完成')
      
      return isEqual
      
    } catch (error) {
      console.error('本地存储测试失败:', error)
      return false
    }
  }
  
  /**
   * 检查存储环境
   */
  static checkStorageEnvironment() {
    console.log('检查存储环境...')
    
    const environment = {
      hasPlus: !!window.plus,
      hasSqlite: !!(window.plus && window.plus.sqlite),
      hasUniStorage: typeof uni !== 'undefined' && typeof uni.setStorageSync === 'function',
      platform: uni.getSystemInfoSync().platform,
      version: uni.getSystemInfoSync().version
    }
    
    console.log('存储环境信息:', environment)
    return environment
  }
}

// 导出测试函数
export default StorageTest
