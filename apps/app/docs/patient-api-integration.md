# 患者列表API集成说明

## 概述
已成功将 `27760vtz.vue` 文件的"查询"按钮绑定到 `PatientList` 接口。

## 接口信息
- **接口地址**: `/Manage/PatientManagement/PatientList`
- **请求方式**: POST
- **目标服务器**: `http://192.168.80.79:8000`

## 实现的功能

### 1. API配置
- 创建了 `apps/app/src/api/patient.ts` 文件
- 定义了 `PatientData` 和 `PatientListParams` 类型
- 配置了 `fetchPatientList` 函数

### 2. Vue组件更新
- 导入了患者API相关类型和函数
- 替换了模拟数据生成逻辑为真实API调用
- 添加了loading状态显示
- 配置了数据格式化处理

### 3. 数据处理
- **分页**: 默认每页20条记录，支持10/20/50/100条切换
- **搜索**: 支持按患者姓名搜索
- **ID处理**: 使用前端生成的序号ID，按页面顺序排列
- **时间格式化**: 将ISO时间格式转换为 `YYYY-MM-DD HH:mm` 格式
- **状态**: 所有患者默认显示"启用"状态

### 4. 请求参数
```typescript
interface PatientListParams {
  page: number;        // 页码
  limit: number;       // 每页数量
  name?: string;       // 患者姓名（可选）
}
```

### 5. 响应格式
```typescript
interface PatientListResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量
  data: PatientData[]; // 患者数据数组
  msg: string;         // 响应消息
}
```

## 用户交互流程

1. **页面加载**: 自动调用API获取第一页数据
2. **搜索功能**: 在搜索框输入患者姓名，点击"查询"按钮或按回车键
3. **分页操作**: 点击分页组件进行翻页或调整每页显示数量
4. **数据刷新**: 所有操作都会重新调用API获取最新数据

## 错误处理

- **网络错误**: 显示"网络错误，请稍后重试"
- **接口错误**: 显示接口返回的错误消息
- **数据为空**: 表格显示空状态

## 代理配置

项目已配置代理转发：
```typescript
'/Manage': {
  target: 'http://192.168.80.79:8000',
  changeOrigin: true,
  secure: false
}
```

## 测试

创建了测试文件 `apps/app/src/test/patient-api-test.js`，可在浏览器控制台运行 `testPatientListAPI()` 进行API测试。

## 注意事项

1. 确保后端服务 `http://192.168.80.79:8000` 正常运行
2. 检查网络连接和跨域配置
3. 根据用户偏好，已移除不必要的成功提示消息
4. 表格数据按ID升序排列，使用前端生成的序号
