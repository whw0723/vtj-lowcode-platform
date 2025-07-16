import { createApi } from '@vtj/utils';

/**
 * 今日订单相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取全部今日订单列表 - 对应"全部"标签
export const getAllOrderTodayList = createApi({
  url: '/Manage/PatientOrder/GetAllOrderTodayList',
  method: 'post'
});

// 获取今日未处理订单列表 - 对应"未处理"标签
export const getOrderTodayNoMyList = createApi({
  url: '/Manage/PatientOrder/GetOrderTodayNoMyList',
  method: 'post'
});

// 获取今日已处理订单列表 - 对应"已处理"标签
export const getOrderTodayYesMyList = createApi({
  url: '/Manage/PatientOrder/GetOrderTodayYesMyList',
  method: 'post'
});

// 获取今日处理错误订单列表 - 对应"处理错误"标签
export const getOrderTodayErrMyList = createApi({
  url: '/Manage/PatientOrder/GetOrderTodayErrMyList',
  method: 'post'
});

/**
 * 订单数据类型定义 - 根据实际接口响应格式
 */
export interface OrderData {
  sequence: number;
  prescriptionNo: string;
  patientName: string;
  hospital: string;
  doctor: string;
  department: string;
  prescriptionDate: string;
  createTime: string;
  status: string;
}

// 根据实际接口载荷格式定义参数
export interface OrderListParams {
  page: number;        // 页码
  limit: number;       // 每页数量
  hospitalsel: number; // 医院选择 (0表示全部)
  pjgnum: string;      // 处方号
  patientname: string; // 患者姓名
  orderlaydate: string; // 订单日期
}

// 根据实际接口响应格式定义
export interface OrderListResponse {
  code: string;   // "0" 表示成功
  count: string;  // 总数量
  data: any[];    // 数据列表
  msg: string;    // 消息
}

// 主要的API调用函数 - 根据标签类型调用不同接口
export const fetchOrdersByTab = (params: OrderListParams, tabType: string = 'all') => {
  if (tabType === 'pending') {
    return getOrderTodayNoMyList(params);
  } else if (tabType === 'processed') {
    return getOrderTodayYesMyList(params);
  } else if (tabType === 'completed') {
    return getOrderTodayErrMyList(params);
  } else {
    return getAllOrderTodayList(params);
  }
};

// 其他可能需要的接口（暂时保留，可根据需要调整）
export const importPrescriptionData = createApi({
  url: '/Manage/PatientOrder/ImportData',
  method: 'post'
});

export const importOnce = createApi({
  url: '/Manage/PatientOrder/ImportOnce',
  method: 'post'
});

export const importTwice = createApi({
  url: '/Manage/PatientOrder/ImportTwice',
  method: 'post'
});
