# 手机端持久化问题修复说明

## 问题分析

在手机端APK中，添加的食物数据没有持久化保存，主要原因是：

1. **数据库初始化时机问题**：`App.vue` 中的 `initDatabase()` 是异步操作，但没有等待完成
2. **plus对象检查问题**：在某些情况下，plus对象可能还未完全加载
3. **缺少备用存储方案**：当SQLite不可用时，没有使用uni-app的本地存储作为备用

## 修复方案

### 1. 修复数据库初始化时机

**文件**: `src/App.vue`

```javascript
// 修改前
onLaunch: function() {
  const foodStore = useFoodStore()
  foodStore.initDatabase() // 没有等待完成
}

// 修改后
async onLaunch() {
  const foodStore = useFoodStore()
  try {
    await foodStore.initDatabase() // 等待初始化完成
    console.log('数据库初始化完成')
  } catch (error) {
    console.error('数据库初始化失败:', error)
  }
}
```

### 2. 增强数据库服务

**文件**: `src/utils/database.js`

#### 2.1 添加plus对象等待机制
```javascript
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
```

#### 2.2 添加本地存储备用方案
为所有数据库操作添加了本地存储备用方案：

- `addFoodToStorage()` - 本地存储添加食物
- `getFoodsFromStorage()` - 本地存储获取食物
- `deleteFoodFromStorage()` - 本地存储删除食物
- `updateFoodInStorage()` - 本地存储更新食物

#### 2.3 智能存储选择
```javascript
// 优先使用SQLite，失败时自动切换到本地存储
if (!window.plus || !window.plus.sqlite) {
  // 使用本地存储
  this.addFoodToStorage(name, image)
} else {
  // 使用SQLite，失败时自动切换到本地存储
  plus.sqlite.executeSql({
    // ... SQLite操作
    fail: (e) => {
      this.addFoodToStorage(name, image) // 自动备用
    }
  })
}
```

### 3. 添加测试工具

**文件**: `src/utils/storage-test.js`

创建了完整的存储功能测试工具，包括：

- 存储环境检查
- 本地存储测试
- 数据库操作测试
- 完整的CRUD操作验证

**文件**: `src/pages/food/add-food.vue`

在添加美食页面添加了"测试存储功能"按钮，方便调试和验证。

## 使用说明

### 1. 正常使用
修复后的应用会自动：
- 优先尝试使用SQLite数据库
- 如果SQLite不可用，自动切换到本地存储
- 确保数据持久化保存

### 2. 调试测试
1. 打开添加美食页面
2. 点击"测试存储功能"按钮
3. 查看测试结果，了解当前存储环境状态

### 3. 数据迁移
- 如果之前有数据丢失，可以重新添加
- 新添加的数据会正确持久化保存
- 支持编辑和删除操作

## 技术特点

1. **双重保障**：SQLite + 本地存储双重保障
2. **自动降级**：SQLite失败时自动使用本地存储
3. **环境适配**：自动检测运行环境（App/H5）
4. **完整测试**：提供完整的测试工具
5. **向后兼容**：不影响现有功能

## 验证方法

1. 添加一个美食
2. 关闭应用
3. 重新打开应用
4. 检查美食列表是否包含之前添加的美食

如果测试按钮显示"本地存储: 正常"，说明持久化功能已经修复。
