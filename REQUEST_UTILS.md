# 请求工具使用说明

## 概述

本项目使用 Axios 作为 HTTP 客户端，封装了统一的请求工具，便于在项目中进行 HTTP 请求处理。请求工具具有以下特性：

1. 基于环境变量配置基础 URL 和超时时间
2. 包含请求和响应拦截器
3. 统一的错误处理机制
4. 支持常见的 HTTP 方法（GET、POST、PUT、DELETE、PATCH）

## 目录结构

```
src/
├── utils/
│   ├── request.js     # Axios 实例和拦截器配置
│   ├── api.js         # API 方法封装
│   └── env.js         # 环境变量工具（已存在）
├── api/
│   └── index.js       # 业务相关 API 接口封装
```

## 使用方法

### 1. 基础 HTTP 请求

可以直接使用 `request.js` 中导出的 Axios 实例：

```javascript
import request from '@/utils/request.js'

// GET 请求
request.get('/users')

// POST 请求
request.post('/users', { name: 'John' })

// 带配置的请求
request.get('/users', { 
  params: { page: 1 },
  headers: { 'Authorization': 'Bearer token' }
})
```

### 2. 使用封装的 API 方法

使用 [src/utils/api.js](file:///E:/Desktop/you-pin/my-food/src/utils/api.js) 中封装的静态方法：

```javascript
import ApiClient from '@/utils/api.js'

// GET 请求
ApiClient.get('/users', { page: 1 })

// POST 请求
ApiClient.post('/users', { name: 'John' })

// PUT 请求
ApiClient.put('/users/1', { name: 'Jane' })

// DELETE 请求
ApiClient.delete('/users/1')
```

### 3. 使用业务 API 封装

在 [src/api/index.js](file:///E:/Desktop/you-pin/my-food/src/api/index.js) 中按照业务模块封装了 API 接口：

```javascript
import { userApi } from '@/api/index.js'

// 获取用户信息
userApi.getUserInfo(1)

// 获取用户列表
userApi.getUserList({ page: 1, size: 10 })

// 创建用户
userApi.createUser({ name: 'John', email: 'john@example.com' })
```

## 拦截器说明

### 请求拦截器

1. 在发送请求前打印请求日志（仅开发环境）
2. 可以添加认证 token 等操作（已预留位置）

### 响应拦截器

1. 在收到响应后打印响应日志（仅开发环境）
2. 统一处理常见的 HTTP 错误状态码：
   - 401: 未授权
   - 403: 拒绝访问
   - 404: 请求资源不存在
   - 500: 服务器内部错误

## 环境变量配置

请求工具会读取以下环境变量：

- `VITE_API_BASE_URL`: API 基础地址
- `VITE_HTTP_TIMEOUT`: 请求超时时间（毫秒）

## 错误处理

所有请求的错误都会被统一捕获和处理，组件中可以直接使用 `try/catch` 处理异常：

```javascript
try {
  const data = await userApi.getUserInfo(1)
  // 处理数据
} catch (error) {
  // 处理错误
  console.error('获取用户信息失败:', error.message)
}
```

## 扩展建议

1. 可以根据项目需求在拦截器中添加更多功能，如：
   - 认证 token 的自动添加和刷新
   - 请求进度提示
   - 缓存机制

2. 可以在业务 API 封装中添加更具体的业务逻辑处理