// 导入需要的模块
import { useFoodStore } from '../stores/food.js'

/**
 * SQLite数据库服务
 */
class DatabaseService {
  constructor() {
    this.dbName = 'food_database'
    this.dbPath = '_doc/food.db'
    this.isInitialized = false
  }

  /**
   * 初始化数据库
   */
  async init() {
    // 检查plus对象是否存在（确保在App环境下运行）
    if (!window.plus) {
      console.warn('plus对象不存在，可能在H5环境下运行，使用本地存储作为备用')
      this.isInitialized = true
      return true
    }

    try {
      // 等待plus对象完全加载
      await this.waitForPlus()
      
      // 打开或创建数据库
      await this.openDatabase()

      // 创建食物表
      await this.createTable()
      
      this.isInitialized = true
      console.log('SQLite数据库初始化成功')
      return true
    } catch (error) {
      console.error('SQLite数据库初始化失败，使用本地存储作为备用:', error)
      this.isInitialized = true
      return true
    }
  }

  /**
   * 等待plus对象加载完成
   */
  waitForPlus() {
    return new Promise((resolve, reject) => {
      if (window.plus && window.plus.sqlite) {
        resolve()
        return
      }
      
      let attempts = 0
      const maxAttempts = 50 // 最多等待5秒
      const interval = setInterval(() => {
        attempts++
        if (window.plus && window.plus.sqlite) {
          clearInterval(interval)
          resolve()
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          reject(new Error('plus对象加载超时'))
        }
      }, 100)
    })
  }

  /**
   * 打开数据库
   */
  openDatabase() {
    return new Promise((resolve, reject) => {
      plus.sqlite.openDatabase({
        name: this.dbName,
        path: this.dbPath,
        success: (e) => {
          console.log('数据库打开成功', e)
          resolve(e)
        },
        fail: (e) => {
          console.error('数据库打开失败', e)
          reject(e)
        }
      })
    })
  }

  /**
   * 创建食物表
   */
  createTable() {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
      
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: sql,
        success: (e) => {
          console.log('食物表创建成功', e)
          resolve(e)
        },
        fail: (e) => {
          console.error('食物表创建失败', e)
          reject(e)
        }
      })
    })
  }

  /**
   * 添加食物
   * @param {string} name - 食物名称
   * @param {string} image - 食物图片路径
   */
  addFood(name, image = '') {
    return new Promise((resolve, reject) => {
      // 如果SQLite不可用，使用本地存储
      if (!window.plus || !window.plus.sqlite) {
        this.addFoodToStorage(name, image)
          .then(resolve)
          .catch(reject)
        return
      }

      const sql = 'INSERT INTO foods (name, image) VALUES (?, ?)'
      const params = [name, image]
      
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: sql,
        data: params,
        success: (e) => {
          console.log('食物添加成功', e)
          resolve(e)
        },
        fail: (e) => {
          console.error('食物添加失败，尝试使用本地存储', e)
          // SQLite失败时，使用本地存储作为备用
          this.addFoodToStorage(name, image)
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }

  /**
   * 使用本地存储添加食物
   */
  addFoodToStorage(name, image = '') {
    return new Promise((resolve, reject) => {
      try {
        const foods = this.getFoodsFromStorage()
        const newFood = {
          id: Date.now(), // 使用时间戳作为ID
          name,
          image,
          created_at: new Date().toISOString()
        }
        foods.unshift(newFood)
        uni.setStorageSync('foods_data', foods)
        console.log('食物添加到本地存储成功', newFood)
        resolve(newFood)
      } catch (error) {
        console.error('本地存储添加食物失败', error)
        reject(error)
      }
    })
  }

  /**
   * 获取所有食物
   */
  getAllFoods() {
    return new Promise((resolve, reject) => {
      // 如果SQLite不可用，使用本地存储
      if (!window.plus || !window.plus.sqlite) {
        try {
          const foods = this.getFoodsFromStorage()
          console.log('从本地存储获取食物列表成功', foods)
          resolve(foods)
        } catch (error) {
          console.error('从本地存储获取食物列表失败', error)
          reject(error)
        }
        return
      }

      const sql = 'SELECT * FROM foods ORDER BY id DESC'
      
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        success: (data) => {
          console.log('获取食物列表成功', data)
          resolve(data)
        },
        fail: (e) => {
          console.error('获取食物列表失败，尝试使用本地存储', e)
          // SQLite失败时，使用本地存储作为备用
          try {
            const foods = this.getFoodsFromStorage()
            console.log('从本地存储获取食物列表成功', foods)
            resolve(foods)
          } catch (error) {
            console.error('从本地存储获取食物列表失败', error)
            reject(error)
          }
        }
      })
    })
  }

  /**
   * 从本地存储获取食物列表
   */
  getFoodsFromStorage() {
    try {
      const foods = uni.getStorageSync('foods_data')
      return foods || []
    } catch (error) {
      console.error('读取本地存储失败', error)
      return []
    }
  }

  /**
   * 删除食物
   * @param {number} id - 食物ID
   */
  deleteFood(id) {
    return new Promise((resolve, reject) => {
      // 如果SQLite不可用，使用本地存储
      if (!window.plus || !window.plus.sqlite) {
        this.deleteFoodFromStorage(id)
          .then(resolve)
          .catch(reject)
        return
      }

      const sql = 'DELETE FROM foods WHERE id = ?'
      const params = [id]
      
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: sql,
        data: params,
        success: (e) => {
          console.log('食物删除成功', e)
          resolve(e)
        },
        fail: (e) => {
          console.error('食物删除失败，尝试使用本地存储', e)
          // SQLite失败时，使用本地存储作为备用
          this.deleteFoodFromStorage(id)
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }

  /**
   * 从本地存储删除食物
   */
  deleteFoodFromStorage(id) {
    return new Promise((resolve, reject) => {
      try {
        const foods = this.getFoodsFromStorage()
        const filteredFoods = foods.filter(food => food.id !== id)
        uni.setStorageSync('foods_data', filteredFoods)
        console.log('从本地存储删除食物成功', id)
        resolve({ id })
      } catch (error) {
        console.error('从本地存储删除食物失败', error)
        reject(error)
      }
    })
  }

  /**
   * 更新食物
   * @param {number} id - 食物ID
   * @param {string} name - 食物名称
   * @param {string} image - 食物图片路径
   */
  updateFood(id, name, image = '') {
    return new Promise((resolve, reject) => {
      // 如果SQLite不可用，使用本地存储
      if (!window.plus || !window.plus.sqlite) {
        this.updateFoodInStorage(id, name, image)
          .then(resolve)
          .catch(reject)
        return
      }

      const sql = 'UPDATE foods SET name = ?, image = ? WHERE id = ?'
      const params = [name, image, id]
      
      plus.sqlite.executeSql({
        name: this.dbName,
        sql: sql,
        data: params,
        success: (e) => {
          console.log('食物更新成功', e)
          resolve(e)
        },
        fail: (e) => {
          console.error('食物更新失败，尝试使用本地存储', e)
          // SQLite失败时，使用本地存储作为备用
          this.updateFoodInStorage(id, name, image)
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }

  /**
   * 在本地存储中更新食物
   */
  updateFoodInStorage(id, name, image = '') {
    return new Promise((resolve, reject) => {
      try {
        const foods = this.getFoodsFromStorage()
        const foodIndex = foods.findIndex(food => food.id === id)
        if (foodIndex !== -1) {
          foods[foodIndex] = {
            ...foods[foodIndex],
            name,
            image
          }
          uni.setStorageSync('foods_data', foods)
          console.log('在本地存储中更新食物成功', { id, name, image })
          resolve({ id, name, image })
        } else {
          reject(new Error('食物不存在'))
        }
      } catch (error) {
        console.error('在本地存储中更新食物失败', error)
        reject(error)
      }
    })
  }

  /**
   * 检查食物名称是否已存在
   * @param {string} name - 食物名称
   * @param {number} excludeId - 排除的ID（用于编辑时排除自身）
   */
  checkFoodNameExists(name, excludeId = null) {
    return new Promise((resolve, reject) => {
      // 如果SQLite不可用，使用本地存储
      if (!window.plus || !window.plus.sqlite) {
        try {
          const foods = this.getFoodsFromStorage()
          const exists = foods.some(food => 
            food.name.toLowerCase() === name.toLowerCase() && 
            food.id !== excludeId
          )
          resolve(exists)
        } catch (error) {
          console.error('从本地存储检查食物名称失败', error)
          reject(error)
        }
        return
      }

      let sql = 'SELECT COUNT(*) as count FROM foods WHERE LOWER(name) = LOWER(?)'
      let params = [name]
      
      if (excludeId) {
        sql += ' AND id != ?'
        params.push(excludeId)
      }
      
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        data: params,
        success: (data) => {
          const exists = data && data.length > 0 && data[0].count > 0
          resolve(exists)
        },
        fail: (e) => {
          console.error('检查食物名称失败，尝试使用本地存储', e)
          // SQLite失败时，使用本地存储作为备用
          try {
            const foods = this.getFoodsFromStorage()
            const exists = foods.some(food => 
              food.name.toLowerCase() === name.toLowerCase() && 
              food.id !== excludeId
            )
            resolve(exists)
          } catch (error) {
            console.error('从本地存储检查食物名称失败', error)
            reject(error)
          }
        }
      })
    })
  }

  /**
   * 关闭数据库
   */
  close() {
    if (this.isInitialized) {
      plus.sqlite.closeDatabase({
        name: this.dbName,
        success: (e) => {
          console.log('数据库关闭成功', e)
        },
        fail: (e) => {
          console.error('数据库关闭失败', e)
        }
      })
    }
  }
}

// 导出单例实例
export default new DatabaseService()