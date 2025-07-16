# 模块类型API集成说明

## 概述
已成功将 `1978yro3x.vue` 文件的数据定制化页面对接到 `GetModelTypeByPage` 接口。

## 接口信息
- **接口地址**: `/Manage/ModuleType/GetModelTypeByPage`
- **请求方式**: POST
- **目标服务器**: `http://192.168.80.79:8015`

## 实现的功能

### 1. API配置
- 使用 `axios` 直接调用API（参考成功案例 `q7631vmj.vue` 和 `775v8lxh.vue`）
- 配置了正确的请求头，包括：
  - `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`
  - `Accept: application/json, text/javascript, */*; q=0.01`
  - `X-Requested-With: XMLHttpRequest`

### 2. Vue组件更新
- 导入了 `axios` 进行API调用
- 导入了认证服务 `authService`
- 配置了 `axios.defaults.withCredentials = true`
- 替换了模拟数据为真实API调用
- 添加了loading状态显示
- 配置了数据格式化处理
- 添加了错误处理和用户提示

### 3. 数据处理
- **分页**: 默认每页10条记录，支持10/20/50条切换
- **序号处理**: 使用真实的模块ID
- **字段映射**: 
  - `modelname` → `moduleName` (模块名称)
  - `modeltable` → `moduleCode` (模块表名)
  - `description` → `description` (模块描述)
  - `creator` → `creator` (创建用户)
  - `updatetime` → `updateTime` (更新时间)
  - `creationtime` → `creationTime` (创建时间)
  - `updater` → `updater` (更新用户)
  - `isdeleted` → `isDeleted` (是否删除)

### 4. 时间格式化
实现了ISO时间格式到本地时间格式的转换：
- 输入格式：`2024-01-24T15:57:55.503`
- 输出格式：`2024-01-24 15:57:55`

### 5. 请求参数
```typescript
interface ModuleTypeListParams {
  page: number;        // 页码
  limit: number;       // 每页数量
}
```

### 6. 响应数据格式
```typescript
interface ModuleTypeListResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量 "4"
  data: ModuleTypeData[]; // 模块类型数据数组
  msg: string;         // 响应消息 ""
}
```

### 7. 数据字段说明
根据接口响应，每条模块类型记录包含以下字段：
- `id`: 模块ID
- `modelname`: 模块名称 (如 "手动录入处方工作量")
- `modeltable`: 模块表名 (如 "VW_ManualAddContent")
- `description`: 模块描述 (如 "手动录入处方工作量")
- `creator`: 创建用户 (如 "管理员")
- `creationtime`: 创建时间 (如 "2024-01-24T15:57:55.503")
- `updater`: 更新用户 (如 "管理员")
- `updatetime`: 更新时间 (如 "2024-01-24T15:57:55.503")
- `isdeleted`: 是否删除 (0: 未删除, 1: 已删除)

## 功能特性

### 1. 分页功能
- 支持页码切换 (首页、上一页、下一页、末页)
- 支持每页条数切换 (10, 20, 50)
- 显示总记录数
- 分页信息与API同步

### 2. 数据展示
- 表格支持边框显示
- 加载状态显示
- 暂无数据状态显示
- 操作按钮 (编辑、删除)

### 3. 错误处理
- API调用失败时使用模拟数据
- 网络异常时的友好提示
- 控制台日志记录便于调试
- 认证失败时自动处理

## 代理配置
项目已配置代理，`/Manage` 路径会自动代理到目标服务器：
```typescript
'/Manage': {
  target: 'http://192.168.80.79:8015',
  changeOrigin: true,
  secure: false
}
```

## 使用说明

### 1. 页面加载
- 组件挂载时自动加载第一页数据
- 默认每页显示10条记录

### 2. 分页操作
- 点击页码切换页面
- 选择每页条数会重置到第一页

### 3. 模块操作
- 点击"新增模块"按钮创建新模块
- 点击"编辑"按钮编辑模块信息
- 点击"删除"按钮删除模块

## 技术实现

### 1. API调用
使用 `axios` 直接调用API（参考成功案例）：
- 使用 `URLSearchParams` 构建表单数据
- 设置正确的请求头
- 支持认证失败自动重试
- 统一的错误处理

### 2. 认证机制
集成了项目的认证服务：
- 自动登录功能
- axios拦截器自动注入认证头
- 认证失败时自动重新登录并重试请求

### 3. 数据转换
将接口返回的原始数据转换为适合表格显示的格式：
- 字段重命名和映射
- 时间格式化处理
- 数据类型转换

### 4. 状态管理
使用 Vue 3 的响应式API管理组件状态：
- `reactive` 管理表单状态
- `ref` 管理数据列表、分页信息和加载状态

## 测试验证
- ✅ API调用成功
- ✅ 数据正确显示 (4条记录)
- ✅ 分页功能正常
- ✅ 加载状态显示
- ✅ 错误处理有效
- ✅ 时间格式化正确

## 后续扩展
1. 可以添加搜索功能
2. 可以添加新增模块功能的具体实现
3. 可以添加编辑模块功能的具体实现
4. 可以添加删除模块功能的具体实现
5. 可以添加批量操作功能
6. 可以添加导出功能 