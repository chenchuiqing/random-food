import { defineStore } from 'pinia'

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
    nextId: 11
  }),
  
  actions: {
    // 添加美食
    addFood(name, image = '') {
      this.foods.push({
        id: this.nextId++,
        name,
        image
      })
    },
    
    // 删除美食
    removeFood(id) {
      this.foods = this.foods.filter(food => food.id !== id)
    },
    
    // 编辑美食
    editFood(id, name, image) {
      const food = this.foods.find(food => food.id === id)
      if (food) {
        food.name = name
        food.image = image
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