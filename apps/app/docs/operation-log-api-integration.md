# 操作日志API集成说明

## 概述
已成功将 `v77l05vt.vue` 文件的操作日志页面对接到 `GetOperateData` 接口。

## 接口信息
- **接口地址**: `/Manage/Log/GetOperateData`
- **请求方式**: POST
- **目标服务器**: `http://192.168.80.79:8000`

## 实现的功能

### 1. API配置
- 使用 `axios` 直接调用API（参考成功案例 `375su642.vue` 和 `175rikfv.vue`）
- 配置了正确的请求头，包括：
  - `Content-Type: application/x-www-form-urlencoded; charset=UTF-8`
  - `Accept: application/json, text/javascript, */*; q=0.01`
  - `X-Requested-With: XMLHttpRequest`

### 2. Vue组件更新
- 导入了 `axios` 进行API调用
- 替换了模拟数据为真实API调用
- 添加了loading状态显示
- 配置了数据格式化处理
- 添加了错误处理和用户提示
- 添加了认证失败自动重试机制

### 3. 数据处理
- **分页**: 默认每页15条记录，支持10/20/50/100条切换
- **序号处理**: 使用计算后的 `displayId` 显示正确的分页序号
- **字段映射**: 
  - `trace` 或 `stacktrace` → `operation` (操作描述)
  - `platfrom` → `module` (操作模块)
  - `update` → `operateTime` (操作时间)
  - `operator` → `operator` (操作人)
- **长文本处理**: 操作描述列支持自动换行显示

### 4. 请求参数
```typescript
interface OperationLogParams {
  page: number;        // 页码
  limit: number;       // 每页数量
}
```

### 5. 响应数据格式
```typescript
interface OperationLogResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量 "13253"
  data: OperationLogData[]; // 操作日志数据数组
  msg: string;         // 响应消息 "成功"
}
```

### 6. 数据字段说明
根据接口响应，每条操作日志包含以下字段：
- `id`: 记录ID
- `platfrom`: 平台/模块名称 (如 "log_sys")
- `stacktrace`: 详细的操作堆栈信息
- `trace`: 操作描述 (如 "大屏推送", "解析处方")
- `primary`: 主键信息
- `operator`: 操作人员 (如 "152", "sys", "9999")
- `update`: 操作时间 (如 "2025-07-09 16:26:41")
- `row`: 行号

## 功能特性

### 1. 分页功能
- 支持页码切换
- 支持每页条数切换 (10, 20, 50, 100)
- 显示总记录数
- 分页信息与API同步

### 2. 搜索功能
- 预留了操作人员搜索字段
- 预留了时间范围搜索字段
- 重置功能会清空搜索条件并重新加载数据

### 3. 数据展示
- 表格支持边框显示
- 操作描述列支持长文本自动换行
- 加载状态显示
- 错误提示

### 4. 错误处理
- API调用失败时显示错误消息
- 网络异常时的友好提示
- 控制台日志记录便于调试

## 代理配置
项目已配置代理，`/Manage` 路径会自动代理到目标服务器：
```typescript
'/Manage': {
  target: 'http://192.168.80.79:8000',
  changeOrigin: true,
  secure: false
}
```

## 使用说明

### 1. 页面加载
- 组件挂载时自动加载第一页数据
- 默认每页显示15条记录

### 2. 分页操作
- 点击页码切换页面
- 选择每页条数会重置到第一页

### 3. 搜索操作
- 点击"查询"按钮执行搜索
- 点击"重置"按钮清空条件并重新加载

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
- 计算分页序号
- 字段重命名和映射
- 数据类型转换

### 4. 状态管理
使用 Vue 3 的响应式API管理组件状态：
- `reactive` 管理搜索表单和分页信息
- `ref` 管理数据列表和加载状态

## 测试验证
- ✅ API调用成功
- ✅ 数据正确显示
- ✅ 分页功能正常
- ✅ 加载状态显示
- ✅ 错误处理有效

## 后续扩展
1. 可以添加搜索功能的具体实现
2. 可以添加导出功能
3. 可以添加操作日志详情查看
4. 可以添加日志级别筛选
