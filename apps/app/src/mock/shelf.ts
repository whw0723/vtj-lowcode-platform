// 简化的Mock实现，直接使用全局Mock对象
declare global {
  interface Window {
    Mock: any;
  }
}

// 模拟货架数据
let shelfData = [
  {
    id: 1,
    shelfNumber: 'S001',
    shelfCode: 'HJ001',
    shelfName: 'A区1号货架',
    remark: '存放常用药品',
    operator: '张三',
    operationTime: '2025-01-15 10:30:00'
  },
  {
    id: 2,
    shelfNumber: 'S002',
    shelfCode: 'HJ002',
    shelfName: 'A区2号货架',
    remark: '存放中药材',
    operator: '李四',
    operationTime: '2025-01-15 11:20:00'
  },
  {
    id: 3,
    shelfNumber: 'S003',
    shelfCode: 'HJ003',
    shelfName: 'B区1号货架',
    remark: '存放贵重药品',
    operator: '王五',
    operationTime: '2025-01-15 14:15:00'
  }
];

// 等待Mock对象可用
const setupShelfMock = () => {
  if (typeof window === 'undefined' || !window.Mock) {
    setTimeout(setupShelfMock, 100);
    return;
  }

  const Mock = window.Mock;

// 货架列表查询
Mock.mock(/\/api\/shelf\/list/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}');
  const { currentPage = 1, pageSize = 20, shelfName = '' } = body;
  
  // 根据货架名称过滤
  let filteredData = shelfData;
  if (shelfName) {
    filteredData = shelfData.filter(item => 
      item.shelfName.includes(shelfName) || item.shelfCode.includes(shelfName)
    );
  }
  
  // 分页处理
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredData.slice(start, end);
  
  return {
    code: 0,
    message: '查询成功',
    data: {
      list,
      total: filteredData.length,
      currentPage,
      pageSize
    }
  };
});

// 新增货架
Mock.mock(/\/api\/shelf\/add/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}');
  const { shelfCode, shelfName, remark = '' } = body;
  
  // 检查货架编码是否已存在
  const exists = shelfData.some(item => item.shelfCode === shelfCode);
  if (exists) {
    return {
      code: 1,
      message: '货架编码已存在'
    };
  }
  
  // 生成新的货架
  const newShelf = {
    id: Date.now(),
    shelfNumber: `S${String(shelfData.length + 1).padStart(3, '0')}`,
    shelfCode,
    shelfName,
    remark,
    operator: '当前用户',
    operationTime: new Date().toLocaleString()
  };
  
  shelfData.push(newShelf);
  
  return {
    code: 0,
    message: '新增成功',
    data: newShelf
  };
});

// 编辑货架
Mock.mock(/\/api\/shelf\/update/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}');
  const { id, shelfCode, shelfName, remark = '' } = body;
  
  const index = shelfData.findIndex(item => item.id == id);
  if (index === -1) {
    return {
      code: 1,
      message: '货架不存在'
    };
  }
  
  // 检查货架编码是否与其他货架重复
  const exists = shelfData.some(item => item.id != id && item.shelfCode === shelfCode);
  if (exists) {
    return {
      code: 1,
      message: '货架编码已存在'
    };
  }
  
  // 更新货架信息
  shelfData[index] = {
    ...shelfData[index],
    shelfCode,
    shelfName,
    remark,
    operator: '当前用户',
    operationTime: new Date().toLocaleString()
  };
  
  return {
    code: 0,
    message: '编辑成功',
    data: shelfData[index]
  };
});

// 删除货架
Mock.mock(/\/api\/shelf\/delete/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}');
  const { id } = body;
  
  const index = shelfData.findIndex(item => item.id == id);
  if (index === -1) {
    return {
      code: 1,
      message: '货架不存在'
    };
  }
  
  shelfData.splice(index, 1);
  
  return {
    code: 0,
    message: '删除成功'
  };
});

// 获取货架详情
Mock.mock(/\/api\/shelf\/detail/, 'post', (options: any) => {
  const body = JSON.parse(options.body || '{}');
  const { id } = body;
  
  const shelf = shelfData.find(item => item.id == id);
  if (!shelf) {
    return {
      code: 1,
      message: '货架不存在'
    };
  }
  
  return {
    code: 0,
    message: '查询成功',
    data: shelf
  };
});

};

// 启动Mock设置
setupShelfMock();

export default shelfData;
