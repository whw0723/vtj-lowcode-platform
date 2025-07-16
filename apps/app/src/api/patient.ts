import { createApi } from '@vtj/utils';

/**
 * 患者管理相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取患者列表 - 对应"查询"按钮
export const fetchPatientList = createApi({
  url: '/Manage/PatientManagement/PatientList',
  method: 'post',
  settings: {
    type: 'form',
    loading: false,
    failMessage: false,
    validSuccess: false,
    originResponse: false,
    injectHeaders: true
  }
});

// 新增患者 - 对应"新增患者"按钮
export const createPatient = createApi({
  url: '/Manage/PatientManagement/AddPatient',
  method: 'post',
  settings: {
    type: 'form',
    loading: false,
    failMessage: false,
    validSuccess: false,
    originResponse: false,
    injectHeaders: true
  }
});

/**
 * 患者数据类型定义 - 根据实际接口响应格式
 */
export interface PatientData {
  id: number;
  name: string;
  phone: string;
  address: string;
  createtime: string;
  updatetime: string;
}

// 根据实际接口载荷格式定义参数
export interface PatientListParams {
  page: number;        // 页码
  limit: number;       // 每页数量
  name?: string;       // 患者姓名（可选）
}

// 新增患者参数类型定义
export interface AddPatientParams {
  name: string;        // 患者姓名
  phone: string;       // 联系电话
  address: string;     // 家庭地址
}

/**
 * API响应格式
 */
export interface PatientListResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量
  data: PatientData[]; // 患者数据数组
  msg: string;         // 响应消息
}


