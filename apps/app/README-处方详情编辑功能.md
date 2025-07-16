# 处方详情编辑功能实现

## 功能概述

此功能为处方管理页面(`16xl0ped.vue`)的编辑按钮添加了处方详情API调用，实现了点击编辑时先获取完整处方数据，然后打开编辑页面的功能。

## 实现的功能

### 1. 处方详情API集成
- **接口路径**: `/Manage/PreScription/GetPatientDataByPid`
- **请求方法**: POST
- **参数**: `pid` (处方ID)
- **功能**: 获取指定处方的完整详情数据

### 2. 增强的编辑功能
- 点击编辑按钮时先调用API获取处方详情
- 显示加载提示信息
- 获取成功后打开编辑页面
- 将详情数据存储到localStorage供编辑页面使用
- 监听编辑窗口关闭事件自动刷新数据

## API响应数据结构

```json
{
  "code": "0",
  "msg": "成功",
  "data": {
    "prescription": {
      "pspnum": "处方号",
      "hospitalname": "医院名称",
      "patientname": "患者姓名",
      "sex": 2,
      "age": "年龄",
      "phone": "电话",
      "address": "地址",
      "doctor": "医生",
      "dose": 7.0,
      "takenum": 2.0,
      "money": "金额"
    },
    "drug": [
      {
        "sequence": "1",
        "drugname": "药物名称",
        "singledose": 5.000,
        "drugweight": 35.000,
        "unit": "g"
      }
    ],
    "hospital": [
      {
        "HID": 2,
        "Hname": "医院名称",
        "Hnum": "医院编号"
      }
    ],
    "processtype": [
      {
        "value": 1,
        "itemname": "汤药",
        "ischeck": 1
      }
    ],
    "takemethod": [...],
    "decscheme": [...],
    "dtbtype": [...],
    "package": [...],
    "drugstatistics": [...]
  }
}
```

## 核心代码实现

### 1. 处方详情获取函数

```typescript
const getPrescriptionDetail = async (pid: number) => {
  try {
    console.log('获取处方详情，PID:', pid);

    const formData = new FormData();
    formData.append('pid', pid.toString());

    const response = await axios.post('/Manage/PreScription/GetPatientDataByPid', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (response.data && response.data.code === "0") {
      return response.data.data;
    } else {
      console.error('获取处方详情失败:', response.data);
      return null;
    }
  } catch (error) {
    console.error('获取处方详情异常:', error);
    return null;
  }
};
```

### 2. 增强的编辑处理函数

```typescript
const handleEdit = async (row: any) => {
  console.log('编辑处方:', row);
  
  // 先获取处方详情数据
  ElMessage.info('正在获取处方详情...');
  const prescriptionDetail = await getPrescriptionDetail(row.pid);
  
  if (!prescriptionDetail) {
    ElMessage.error('无法获取处方详情，编辑操作已取消');
    return;
  }

  // 打印获取到的详情数据（用于调试）
  console.log('处方详情数据:', prescriptionDetail);

  // 在新窗口中打开编辑页面
  const editUrl = `/AdminUI/dist/views/prescription/patient/edit.html?v=1.2.0175213375442&parentid=${row.pid}`;
  const editWindow = window.open(editUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');
  
  // 将处方详情数据存储到localStorage
  localStorage.setItem(`prescription_detail_${row.pid}`, JSON.stringify(prescriptionDetail));
  
  ElMessage.success(`已获取处方 ${row.txtpspnum} 的详细信息，正在打开编辑页面`);
};
```

## 使用方法

### 1. 基本使用
1. 在处方管理页面找到需要编辑的处方记录
2. 点击操作列中的"编辑"按钮
3. 系统会自动获取处方详情并打开编辑页面

### 2. 数据获取流程
1. 点击编辑按钮 → 显示"正在获取处方详情..."
2. 调用API获取详情 → 打印详情数据到控制台
3. 打开编辑窗口 → 显示成功提示信息
4. 存储数据到localStorage → 供编辑页面使用

### 3. 错误处理
- API调用失败：显示具体错误信息
- 登录状态过期：提示重新登录
- 网络错误：显示网络错误提示

## 测试工具

提供了专门的测试页面 `test-prescription-detail-api.html`，可以用于：
- 测试处方详情API的调用
- 查看返回的数据结构
- 验证API参数和响应格式
- 调试网络连接问题

### 测试页面使用方法
1. 打开 `test-prescription-detail-api.html`
2. 输入有效的处方ID（默认2260）
3. 点击"获取处方详情"按钮
4. 查看详细的API响应数据

## 技术特点

### 1. VTJ平台标准
- 使用代理路径 `/Manage/...`
- 导入 `authService` 认证服务
- 配置 `axios.defaults.withCredentials = true`
- 标准的请求头配置

### 2. 错误处理机制
- 完整的异常捕获
- 友好的用户提示
- 详细的控制台日志
- 自动处理登录状态

### 3. 数据管理
- 将详情数据存储到localStorage
- 供编辑页面访问使用
- 监听窗口关闭事件
- 自动刷新列表数据

## 注意事项

1. **权限要求**: 需要有访问处方详情API的权限
2. **登录状态**: 必须在已登录状态下使用
3. **网络配置**: 确保代理配置正确（端口8000）
4. **浏览器设置**: 允许弹窗以打开编辑窗口

## 调试信息

编辑功能会在控制台输出详细的调试信息：
- 处方详情API请求和响应
- 处方基本信息
- 药物列表
- 可选医院
- 加工类型选项
- 服用方法选项

可以通过浏览器开发者工具查看这些信息进行调试。

## 更新历史

- **2025-01-11**: 实现处方详情API集成
- **2025-01-11**: 增强编辑按钮功能
- **2025-01-11**: 添加测试工具页面
- **2025-01-11**: 完善错误处理和用户提示 