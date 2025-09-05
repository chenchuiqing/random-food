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
        { id: 10, name: '烤肉', image: '' },
        { id: 11, name: '轻乳茶', image: '' },
        { id: 12, name: '螺蛳粉', image: '' },
        { id: 13, name: '羊肉串', image: '' },
        { id: 14, name: '酸辣粉', image: '' },
        { id: 15, name: '炸鸡腿', image: '' },
        { id: 16, name: '虾饺', image: '' },
        { id: 17, name: '牛肉粉丝汤', image: '' },
        { id: 18, name: '麻辣烫', image: '' },
        { id: 19, name: '烤鱿鱼', image: '' },
        { id: 20, name: '铁饼', image: '' },
        { id: 21, name: '肉夹馍', image: '' },
        { id: 22, name: '炒粉丝', image: '' },
        { id: 23, name: '龙虾', image: '' },
        { id: 24, name: '烤猪面', image: '' },
        { id: 25, name: '螃蟹', image: '' },
        { id: 26, name: '鸭脖', image: '' },
        { id: 27, name: '可乐', image: '' },
        { id: 28, name: '牛肠粉', image: '' },
        { id: 29, name: '虾饭', image: '' },
        { id: 30, name: '烧肉', image: '' },
        { id: 31, name: '牛锅', image: '' },
        { id: 32, name: '鸡柳卷饼', image: '' },
        { id: 33, name: '肯德基', image: '' },
        { id: 34, name: '火锅底料', image: '' },
        { id: 35, name: '烧烤', image: '' },
        { id: 36, name: '雪糕', image: '' },
        { id: 37, name: '酱香米线', image: '' },
        { id: 38, name: '小鸡面', image: '' },
        { id: 39, name: '小酥肉', image: '' },
        { id: 40, name: '大肠粉', image: '' },
        { id: 41, name: '青柳', image: '' },
        { id: 42, name: '螺蛳饭', image: '' },
        { id: 43, name: '凉皮凉面', image: '' },
        { id: 44, name: '卤肥牛卷', image: '' },
        { id: 45, name: '香辣面', image: '' },
        { id: 46, name: '牛肉立烤', image: '' },
        { id: 47, name: '卤味小炒', image: '' },
        { id: 48, name: '青提', image: '' },
        { id: 49, name: '铁牛', image: '' },
        { id: 50, name: '鲶鱼', image: '' },
        { id: 51, name: '韭菜饼', image: '' },
        { id: 52, name: '鲅鱼', image: '' },
        { id: 53, name: '香香饼', image: '' },
        { id: 54, name: '水果捞', image: '' },
        { id: 55, name: '卤鸡翅', image: '' },
        { id: 56, name: '鱼香肉丝', image: '' },
        { id: 57, name: '酸辣鱼', image: '' },
        { id: 58, name: '鲍鱼', image: '' },
        { id: 59, name: '干锅菜花', image: '' },
        { id: 60, name: '韭菜盒子', image: '' },
        { id: 61, name: '鸭血豆腐', image: '' },
        { id: 62, name: '炒蚬', image: '' },
        { id: 63, name: '麻婆豆腐', image: '' },
        { id: 64, name: '脆皮鸡排饭', image: '' },
        { id: 65, name: '豆浆豆腐脑', image: '' },
        { id: 66, name: '烤串', image: '' },
        { id: 67, name: '煎饼果子', image: '' },
        { id: 68, name: '螺丝鸡', image: '' },
        { id: 69, name: '牛肚', image: '' },
        { id: 70, name: '臭豆腐', image: '' },
        { id: 71, name: '羊杂汤', image: '' },
        { id: 72, name: '烤肠', image: '' },
        { id: 73, name: '煲仔饭', image: '' },
        { id: 74, name: '螺丝肉', image: '' },
        { id: 75, name: '鸭头', image: '' },
        { id: 76, name: '烤鸡翅', image: '' },
        { id: 77, name: '羊肉汤', image: '' },
        { id: 78, name: '滑蛋饭', image: '' },
        { id: 79, name: '牛筋面', image: '' }
      ]
      
      this.foods = defaultFoods
      this.nextId = 80
      
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