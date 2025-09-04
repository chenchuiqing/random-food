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
      { id: 10, name: '烤肉', image: '' }
    ],
    nextId: 11,
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