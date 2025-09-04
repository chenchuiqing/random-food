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
      console.warn('plus对象不存在，可能在H5环境下运行，无法使用SQLite')
      return false
    }

    try {
      // 打开或创建数据库
      plus.sqlite.openDatabase({
        name: this.dbName,
        path: this.dbPath,
        success: (e) => {
          console.log('数据库打开成功', e)
        },
        fail: (e) => {
          console.error('数据库打开失败', e)
          return false
        }
      })

      // 创建食物表
      await this.createTable()
      
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('数据库初始化失败', error)
      return false
    }
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
          console.error('食物添加失败', e)
          reject(e)
        }
      })
    })
  }

  /**
   * 获取所有食物
   */
  getAllFoods() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM foods ORDER BY id DESC'
      
      plus.sqlite.selectSql({
        name: this.dbName,
        sql: sql,
        success: (data) => {
          console.log('获取食物列表成功', data)
          resolve(data)
        },
        fail: (e) => {
          console.error('获取食物列表失败', e)
          reject(e)
        }
      })
    })
  }

  /**
   * 删除食物
   * @param {number} id - 食物ID
   */
  deleteFood(id) {
    return new Promise((resolve, reject) => {
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
          console.error('食物删除失败', e)
          reject(e)
        }
      })
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
          console.error('食物更新失败', e)
          reject(e)
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