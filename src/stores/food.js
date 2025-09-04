import { defineStore } from 'pinia'
import database from '../utils/database.js'

export const useFoodStore = defineStore('food', {
  state: () => ({
    // 默认美食列表
    foods: [
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
      { id: 65, name: '豆浆', image: '' },
      { id: 66, name: '豆腐脑', image: '' },
      { id: 67, name: '烤串', image: '' },
      { id: 68, name: '煎饼果子', image: '' },
      { id: 69, name: '螺丝鸡', image: '' },
      { id: 70, name: '牛肚', image: '' },
      { id: 71, name: '臭豆腐', image: '' },
      { id: 72, name: '羊杂汤', image: '' },
      { id: 73, name: '烤肠', image: '' },
      { id: 74, name: '煲仔饭', image: '' },
      { id: 75, name: '螺丝肉', image: '' },
      { id: 76, name: '鸭头', image: '' },
      { id: 77, name: '烤鸡翅', image: '' },
      { id: 78, name: '羊肉汤', image: '' },
      { id: 79, name: '滑蛋饭', image: '' },
      { id: 80, name: '牛筋面', image: '' }
    ],
    nextId: 81,
    isDatabaseReady: false
  }),
  
  actions: {
    // 初始化数据库
    async initDatabase() {
      try {
        const result = await database.init()
        if (result) {
          this.isDatabaseReady = true
          // 从数据库加载食物数据
          await this.loadFoodsFromDatabase()
        }
      } catch (error) {
        console.error('数据库初始化失败:', error)
      }
    },
    
    // 从数据库加载食物数据
    async loadFoodsFromDatabase() {
      if (!this.isDatabaseReady) return
      
      try {
        const foods = await database.getAllFoods()
        // 如果数据库中有数据，则替换默认数据
        if (foods && foods.length > 0) {
          this.foods = foods.map(food => ({
            id: food.id,
            name: food.name,
            image: food.image
          }))
          // 更新nextId以确保新添加的食物ID不会冲突
          if (this.foods.length > 0) {
            this.nextId = Math.max(...this.foods.map(f => f.id)) + 1
          }
        }
      } catch (error) {
        console.error('从数据库加载食物数据失败:', error)
      }
    },
    
    // 添加美食
    async addFood(name, image = '') {
      if (this.isDatabaseReady) {
        try {
          // 先添加到数据库
          await database.addFood(name, image)
          // 重新加载数据以获取正确的ID
          await this.loadFoodsFromDatabase()
        } catch (error) {
          console.error('添加食物到数据库失败:', error)
          // 如果数据库操作失败，仍然添加到内存中（添加到最前面）
          this.foods.unshift({
            id: this.nextId++,
            name,
            image
          })
        }
      } else {
        // 如果数据库未就绪，直接添加到内存中（添加到最前面）
        this.foods.unshift({
          id: this.nextId++,
          name,
          image
        })
      }
    },
    
    // 删除美食
    async removeFood(id) {
      if (this.isDatabaseReady) {
        try {
          await database.deleteFood(id)
          await this.loadFoodsFromDatabase()
        } catch (error) {
          console.error('从数据库删除食物失败:', error)
          // 如果数据库操作失败，直接从内存中删除
          this.foods = this.foods.filter(food => food.id !== id)
        }
      } else {
        // 如果数据库未就绪，直接从内存中删除
        this.foods = this.foods.filter(food => food.id !== id)
      }
    },
    
    // 编辑美食
    async editFood(id, name, image) {
      if (this.isDatabaseReady) {
        try {
          await database.updateFood(id, name, image)
          await this.loadFoodsFromDatabase()
        } catch (error) {
          console.error('更新数据库中的食物失败:', error)
          // 如果数据库操作失败，直接更新内存中的数据
          const food = this.foods.find(food => food.id === id)
          if (food) {
            food.name = name
            food.image = image
          }
        }
      } else {
        // 如果数据库未就绪，直接更新内存中的数据
        const food = this.foods.find(food => food.id === id)
        if (food) {
          food.name = name
          food.image = image
        }
      }
    },
    
    // 随机选择美食
    randomSelect(count = 1) {
      if (this.foods.length === 0) return []
      
      // 打乱数组并选择指定数量
      const shuffled = [...this.foods].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.min(count, this.foods.length))
    }
  }
})