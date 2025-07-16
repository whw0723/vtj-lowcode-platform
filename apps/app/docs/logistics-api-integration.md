# 物流信息API集成说明

## 概述
已成功修复 `178lo5vh.vue` 文件的物流信息管理页面接口对接问题，现在可以正确对接三个核心接口。

## 修复内容

### 问题诊断
原始文件存在以下问题：
1. 使用了 `createApi` 方式而不是直接 `axios` 调用
2. 缺少认证服务导入和配置
3. 没有设置 `axios.defaults.withCredentials = true`
4. 请求参数格式不正确
5. 缺少登录状态检查逻辑

### 修复方案
参考成功案例（如 `q7631vmj.vue`），采用以下修复措施：

1. **导入认证服务**：
   ```typescript
   import { authService } from '../../src/services/auth';
   ```

2. **配置axios**：
   ```typescript
   axios.defaults.withCredentials = true;
   ```

3. **使用URLSearchParams构建参数**：
   ```typescript
   const params = new URLSearchParams();
   params.append('page', pagination.currentPage.toString());
   params.append('limit', pagination.pageSize.toString());
   // ... 其他参数
   ```

4. **设置正确的请求头**：
   ```typescript
   headers: {
     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
     'Accept': 'application/json, text/javascript, */*; q=0.01',
     'X-Requested-With': 'XMLHttpRequest'
   }
   ```

5. **添加登录状态检查**：
   ```typescript
   if (response.data && response.data.code === "1001") {
     console.log('⚠️ 需要重新登录，认证服务会自动处理');
     return;
   }
   ```

## 接口信息
- **接口地址**: `/Manage/Logistics/GetLogisticsToday`
- **请求方式**: POST
- **目标服务器**: `http://192.168.80.79:8000`

## 实现的功能

### 1. API配置
- 使用 `axios` 直接调用API（参考成功案例）
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
- **分页**: 默认每页20条记录，支持10/20/50/100条切换
- **序号处理**: 使用计算后的序号显示正确的分页序号
- **字段映射**: 
  - `pspnum` → `orderNumber` (订单号/处方号)
  - `patientname` → `customerName` (客户名称/患者姓名)
  - `expressaddress` → `address` (配送地址)
  - `dose` → `quantity` (数量/剂量)
  - `expresscompany` → `driver` (配送员/快递公司)
  - `expressphone` → `phone` (联系电话)
  - `dotime` → `deliveryTime` (配送时间/下单时间)
  - `hname` → `hospitalName` (医院名称)

### 4. 智能状态判断
实现了根据快递单号和快递类型智能判断配送状态：
- **待配送**: 无快递单号
- **配送中**: 有快递单号且非厂内配送
- **已完成**: 厂内配送类型

### 5. 请求参数
```typescript
interface LogisticsParams {
  page: number;           // 页码
  limit: number;          // 每页数量
  hospital: number;       // 医院ID，0表示全部
  logisticsselect: string; // 物流选择
  searchcontent: string;  // 搜索内容
  logisticsptype: string; // 物流类型
  quertime: string;       // 查询时间
  logistictime: string;   // 物流时间
  decmothed: number;      // 煎煮方法，-1表示全部
}
```

### 6. 响应数据格式
```typescript
interface LogisticsResponse {
  code: string;           // "0" 表示成功
  count: string;          // 总数量 "2207"
  data: LogisticsData[];  // 物流数据数组
  msg: string;            // 响应消息 "成功"
}
```

### 7. 数据字段说明
根据接口响应，每条物流记录包含以下字段：
- `id`: 记录ID
- `pid`: 患者ID
- `pspnum`: 处方号 (如 "20250708001")
- `patientname`: 患者姓名 (如 "史怡静")
- `sex`: 性别 (如 "女")
- `hid`: 医院ID
- `dose`: 剂量 (如 7.0)
- `decmothed`: 煎煮方法 (1, 2 或 -1)
- `inpatientarea`: 住院区域 (如 "心内科病区")
- `sickbed`: 病床号
- `phone`: 联系电话
- `hname`: 医院名称 (如 "凤阳县中医院")
- `dotime`: 下单时间 (如 "2025-07-09T16:26:39.817")
- `expresstype`: 快递类型 (如 "厂内配送", "EMS", "顺丰医寄通")
- `expresscompany`: 快递公司 (如 "东华原")
- `expressphone`: 快递电话
- `expressaddress`: 快递地址
- `expressnumber`: 快递单号

## 功能特性

### 1. 分页功能
- 支持页码切换
- 支持每页条数切换 (10, 20, 50, 100)
- 显示总记录数
- 分页信息与API同步

### 2. 搜索功能
- 预留了订单号搜索字段
- 预留了配送状态筛选字段
- 预留了日期范围搜索字段
- 重置功能会清空搜索条件并重新加载数据

### 3. 数据展示
- 表格支持边框和斑马纹显示
- 配送状态使用不同颜色的标签显示
- 支持查看详情功能
- 加载状态显示
- 错误提示

### 4. 配送状态映射
- **待配送**: 黄色标签 (无快递单号)
- **配送中**: 蓝色标签 (有快递单号且非厂内配送)
- **已完成**: 绿色标签 (厂内配送)
- **已取消**: 红色标签 (预留)

### 5. 快递类型支持
- **厂内配送**: 内部配送，自动标记为已完成
- **EMS**: 邮政快递
- **顺丰医寄通**: 顺丰医疗专线

### 6. 详情查看
- 点击"查看"按钮显示详细信息
- 包含患者信息、医院信息、配送信息等
- 使用消息框展示完整信息

### 7. 时间格式化
- 自动格式化ISO时间为本地时间格式
- 显示年-月-日 时:分格式

### 8. 错误处理
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
- 默认每页显示20条记录

### 2. 分页操作
- 点击页码切换页面
- 选择每页条数会重置到第一页

### 3. 搜索操作
- 点击"搜索"按钮执行搜索
- 点击"重置"按钮清空条件并重新加载

### 4. 详情查看
- 点击表格中的"查看"按钮
- 弹出消息框显示完整物流信息

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
- 时间格式化
- 状态智能判断
- 重量估算（基于剂量）

### 4. 状态管理
使用 Vue 3 的响应式API管理组件状态：
- `reactive` 管理搜索表单和分页信息
- `ref` 管理数据列表、加载状态

## 测试验证
- ✅ API调用成功
- ✅ 数据正确显示
- ✅ 分页功能正常
- ✅ 加载状态显示
- ✅ 错误处理有效
- ✅ 详情查看功能正常
- ✅ 配送状态智能判断正确

## 后续扩展
1. 可以添加搜索功能的具体实现
2. 可以添加导出功能
3. 可以添加物流跟踪功能
4. 可以添加配送状态更新功能
5. 可以添加物流统计图表
6. 可以添加快递单号查询功能
