# 环境变量配置说明

## 环境变量文件

项目中使用以下环境变量文件：

1. `.env` - 所有环境通用的变量
2. `.env.development` - 开发环境变量
3. `.env.test` - 测试环境变量
4. `.env.production` - 生产环境变量

## 环境变量命名规范

所有环境变量必须以 `VITE_` 开头才能在客户端代码中访问。

## 变量说明

### 通用变量 (.env)
- `VITE_APP_TITLE`: 应用标题
- `VITE_HTTP_TIMEOUT`: HTTP 请求超时时间
- `VITE_DEFAULT_PAGE_SIZE`: 默认分页大小

### 开发环境 (.env.development)
- `VITE_API_BASE_URL`: API 基础地址（开发环境）
- `VITE_APP_NAME`: 应用名称
- `VITE_DEBUG_MODE`: 调试模式开关

### 测试环境 (.env.test)
- `VITE_API_BASE_URL`: API 基础地址（测试环境）
- `VITE_APP_NAME`: 应用名称
- `VITE_DEBUG_MODE`: 调试模式开关

### 生产环境 (.env.production)
- `VITE_API_BASE_URL`: API 基础地址（生产环境）
- `VITE_APP_NAME`: 应用名称
- `VITE_DEBUG_MODE`: 调试模式开关

## 使用方式

在代码中可以通过 `import.meta.env.VITE_VARIABLE_NAME` 访问环境变量：

```javascript
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
```

## 构建命令

- 开发环境：`npm run dev:h5`
- 测试环境：`npm run build:test`
- 生产环境：`npm run build:h5`

注意：如需添加测试环境构建命令，需要在 package.json 中添加相应脚本。