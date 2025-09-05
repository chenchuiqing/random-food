import { defineStore } from 'pinia'
import storage from '../utils/storage.js'

export const useFoodStore = defineStore('food', {
  state: () => ({
    // 美食列表
    foods: [],
    nextId: 1,
    isStorageReady: false
  }),
  
  actions: {
    // 初始化存储
    async initStorage() {
      try {
        // 从存储中加载数据
        await this.loadFoodsFromStorage()
        this.isStorageReady = true
        console.log('存储初始化成功')
      } catch (error) {
        console.error('存储初始化失败:', error)
        // 如果加载失败，使用默认数据
        this.initDefaultData()
        this.isStorageReady = true
      }
    },
    
    // 初始化默认数据
    initDefaultData() {
      const defaultFoods = [
        { id: 1, name: '汉堡', image: '' },
        { id: 2, name: '披萨', image: '' },
        { id: 3, name: '寿司', image: '' },
        { id: 4, name: '火锅', image: '' },
        { id: 5, name: '炒饭', image: '' },
        { id: 6, name: '拉面', image: '' },
        { id: 7, name: '炸鸡', image: '' },
        { id: 8, name: '牛排', image: '' },
        { id: 9, name: '沙拉', image: '' },
        { id: 10, name: '烤肉', image: '' }
      ]
      
      this.foods = defaultFoods
      this.nextId = 11
      
      // 保存默认数据到存储
      this.saveFoodsToStorage()
    },
    
    // 从存储中加载美食数据
    async loadFoodsFromStorage() {
      try {
        const foods = storage.getAllFoods()
        const nextId = storage.getNextFoodId()
        
        if (foods && foods.length > 0) {
          this.foods = foods
          this.nextId = nextId
        } else {
          // 如果没有数据，初始化默认数据
          this.initDefaultData()
        }
      } catch (error) {
        console.error('从存储加载美食数据失败:', error)
        throw error
      }
    },
    
    // 保存美食数据到存储
    saveFoodsToStorage() {
      try {
        storage.saveAllFoods(this.foods)
        storage.setNextFoodId(this.nextId)
      } catch (error) {
        console.error('保存美食数据到存储失败:', error)
        throw error
      }
    },
    
    // 检查美食名称是否已存在
    async checkFoodNameExists(name, excludeId = null) {
      try {
        return storage.checkFoodNameExists(name, excludeId)
      } catch (error) {
        console.error('检查食物名称失败:', error)
        // 如果存储检查失败，使用内存中的数据作为备用
        return this.foods.some(food => 
          food.name.toLowerCase() === name.toLowerCase() && 
          food.id !== excludeId
        )
      }
    },

    // 添加美食
    async addFood(name, image = '') {
      try {
        // 先检查名称是否已存在
        const nameExists = await this.checkFoodNameExists(name)
        if (nameExists) {
          throw new Error('该美食名称已存在，请使用其他名称')
        }

        // 使用存储服务添加美食
        const newFood = storage.addFood(name, image)
        
        // 更新本地状态
        this.foods.unshift(newFood)
        this.nextId = storage.getNextFoodId()
        
        return newFood
      } catch (error) {
        console.error('添加美食失败:', error)
        throw error
      }
    },
    
    // 删除美食
    async removeFood(id) {
      try {
        // 使用存储服务删除美食
        storage.deleteFood(id)
        
        // 更新本地状态
        this.foods = this.foods.filter(food => food.id !== id)
        
        return true
      } catch (error) {
        console.error('删除美食失败:', error)
        throw error
      }
    },
    
    // 编辑美食
    async editFood(id, name, image) {
      try {
        // 检查名称是否重复（排除当前编辑的项目）
        const nameExists = await this.checkFoodNameExists(name, id)
        if (nameExists) {
          throw new Error('该美食名称已存在，请使用其他名称')
        }

        // 使用存储服务更新美食
        const updatedFood = storage.updateFood(id, name, image)
        
        // 更新本地状态
        const index = this.foods.findIndex(food => food.id === id)
        if (index !== -1) {
          this.foods[index] = updatedFood
        }
        
        return updatedFood
      } catch (error) {
        console.error('编辑美食失败:', error)
        throw error
      }
    },
    
    // 随机选择美食
    randomSelect(count = 1) {
      if (this.foods.length === 0) return []
      
      // 打乱数组并选择指定数量
      const shuffled = [...this.foods].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.min(count, this.foods.length))
    },
    
    // 清空所有美食数据
    async clearAllFoods() {
      try {
        this.foods = []
        this.nextId = 1
        storage.saveAllFoods([])
        storage.setNextFoodId(1)
        return true
      } catch (error) {
        console.error('清空美食数据失败:', error)
        throw error
      }
    },
    
    // 获取存储信息
    getStorageInfo() {
      return storage.getStorageInfo()
    },
    
    // 测试存储功能
    async testStorage() {
      return await storage.testStorage()
    }
  }
})