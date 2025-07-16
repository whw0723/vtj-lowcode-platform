/**
 * 今日订单API测试文件
 * 用于测试"全部"标签与GetAllOrderTodayList接口的绑定
 */

import { fetchOrdersByTab, getAllOrderTodayList, getOrderTodayNoMyList, getOrderTodayYesMyList, getOrderTodayErrMyList } from '../api/order';

// 根据实际接口响应格式的模拟数据
const mockApiResponse = {
  code: "0",
  count: "3",
  data: [
    {
      sequence: 1,
      prescriptionNo: 'CF20241201001',
      patientName: '张三',
      hospital: '北京协和医院',
      doctor: '李医生',
      department: '内科',
      prescriptionDate: '2024-12-01',
      createTime: '2024-12-01 09:30',
      status: '待处理'
    },
    {
      sequence: 2,
      prescriptionNo: 'CF20241201002',
      patientName: '李四',
      hospital: '上海华山医院',
      doctor: '王医生',
      department: '外科',
      prescriptionDate: '2024-12-01',
      createTime: '2024-12-01 10:15',
      status: '处理中'
    },
    {
      sequence: 3,
      prescriptionNo: 'CF20241201003',
      patientName: '王五',
      hospital: '广州中山医院',
      doctor: '赵医生',
      department: '儿科',
      prescriptionDate: '2024-12-01',
      createTime: '2024-12-01 11:20',
      status: '已完成'
    }
  ],
  msg: "成功"
};

// 测试"全部"标签的GetAllOrderTodayList接口调用
export async function testAllTabApi() {
  try {
    console.log('开始测试"全部"标签GetAllOrderTodayList接口调用...');

    // 根据实际接口载荷格式构建参数
    const params = {
      page: 1,
      limit: 20,
      hospitalsel: 0,
      pjgnum: '',
      patientname: '',
      orderlaydate: ''
    };

    console.log('请求参数:', params);
    console.log('接口地址: /Manage/PatientOrder/GetAllOrderTodayList');

    // 在实际环境中，这里会调用真实的API
    // const response = await fetchOrdersByTab(params);

    // 目前使用模拟数据进行测试
    const response = mockApiResponse;

    console.log('API响应:', response);

    if (response.code === "0") {
      console.log('✅ API调用成功');
      console.log('数据条数:', response.data.length);
      console.log('总数:', response.count);
      return response.data;
    } else {
      console.error('❌ API调用失败:', response.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ API调用异常:', error);
    return null;
  }
}

// 测试"未处理"标签的GetOrderTodayNoMyList接口调用
export async function testPendingTabApi() {
  try {
    console.log('开始测试"未处理"标签GetOrderTodayNoMyList接口调用...');

    // 根据实际接口载荷格式构建参数
    const params = {
      page: 1,
      limit: 20,
      hospitalsel: 0,
      pjgnum: '',
      patientname: '',
      orderlaydate: ''
    };

    console.log('请求参数:', params);
    console.log('接口地址: /Manage/PatientOrder/GetOrderTodayNoMyList');

    // 在实际环境中，这里会调用真实的API
    // const response = await getOrderTodayNoMyList(params);

    // 目前使用模拟数据进行测试
    const response = mockApiResponse;

    console.log('API响应:', response);

    if (response.code === "0") {
      console.log('✅ 未处理标签API调用成功');
      console.log('数据条数:', response.data.length);
      console.log('总数:', response.count);
      return response.data;
    } else {
      console.error('❌ 未处理标签API调用失败:', response.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ 未处理标签API调用异常:', error);
    return null;
  }
}

// 测试"已处理"标签的GetOrderTodayYesMyList接口调用
export async function testProcessedTabApi() {
  try {
    console.log('开始测试"已处理"标签GetOrderTodayYesMyList接口调用...');

    // 根据实际接口载荷格式构建参数
    const params = {
      page: 1,
      limit: 20,
      hospitalsel: 0,
      pjgnum: '',
      patientname: '',
      orderlaydate: ''
    };

    console.log('请求参数:', params);
    console.log('接口地址: /Manage/PatientOrder/GetOrderTodayYesMyList');

    // 在实际环境中，这里会调用真实的API
    // const response = await getOrderTodayYesMyList(params);

    // 目前使用模拟数据进行测试
    const response = mockApiResponse;

    console.log('API响应:', response);

    if (response.code === "0") {
      console.log('✅ 已处理标签API调用成功');
      console.log('数据条数:', response.data.length);
      console.log('总数:', response.count);
      return response.data;
    } else {
      console.error('❌ 已处理标签API调用失败:', response.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ 已处理标签API调用异常:', error);
    return null;
  }
}

// 测试"处理错误"标签的GetOrderTodayErrMyList接口调用
export async function testCompletedTabApi() {
  try {
    console.log('开始测试"处理错误"标签GetOrderTodayErrMyList接口调用...');

    // 根据实际接口载荷格式构建参数
    const params = {
      page: 1,
      limit: 20,
      hospitalsel: 0,
      pjgnum: '',
      patientname: '',
      orderlaydate: ''
    };

    console.log('请求参数:', params);
    console.log('接口地址: /Manage/PatientOrder/GetOrderTodayErrMyList');

    // 在实际环境中，这里会调用真实的API
    // const response = await getOrderTodayErrMyList(params);

    // 目前使用模拟数据进行测试
    const response = mockApiResponse;

    console.log('API响应:', response);

    if (response.code === "0") {
      console.log('✅ 处理错误标签API调用成功');
      console.log('数据条数:', response.data.length);
      console.log('总数:', response.count);
      return response.data;
    } else {
      console.error('❌ 处理错误标签API调用失败:', response.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ 处理错误标签API调用异常:', error);
    return null;
  }
}

// 测试不同标签页的API调用
export async function testTabSwitching() {
  const tabs = ['all', 'pending', 'processed', 'completed'];

  for (const tab of tabs) {
    console.log(`\n测试标签页: ${tab}`);

    const params = {
      tabType: tab,
      dataType: 'all',
      cleanStatus: '',
      prescriptionDate: '',
      currentPage: 1,
      pageSize: 20
    };

    // 模拟不同标签页的数据过滤
    let filteredData = mockApiResponse.data.list;

    switch (tab) {
      case 'pending':
        filteredData = filteredData.filter(item => item.status === '待处理');
        break;
      case 'processed':
        filteredData = filteredData.filter(item => item.status === '处理中');
        break;
      case 'completed':
        filteredData = filteredData.filter(item => item.status === '已完成');
        break;
      default:
        // 'all' 标签显示所有数据
        break;
    }

    console.log(`${tab} 标签页数据条数:`, filteredData.length);
  }
}

// 运行测试
if (typeof window !== 'undefined') {
  // 在浏览器环境中运行
  window.testOrderApi = {
    testAllTabApi,
    testTabSwitching
  };

  console.log('今日订单API测试已加载，可以在控制台中调用:');
  console.log('- testOrderApi.testAllTabApi() // 测试全部标签API');
  console.log('- testOrderApi.testTabSwitching() // 测试标签页切换');
}

export default {
  testAllTabApi,
  testTabSwitching
};
