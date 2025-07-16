import { createApi } from '@vtj/utils';

/**
 * 登录日志管理相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取登录日志列表
export const fetchLoginLogs = createApi({
  url: '/Manage/Log/GetSignData',
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
 * 登录日志数据类型定义 - 根据实际接口响应格式
 */
export interface LoginLogData {
  id: number;
  platform: string;
  sign: number;
  signname: string;
  ip: string;
  result: string;
  update: string;
  row: number;
}

/**
 * API响应格式
 */
export interface LoginLogResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量
  data: LoginLogData[]; // 登录日志数据数组
  msg: string;         // 响应消息
}

/**
 * 请求参数类型定义
 */
export interface LoginLogParams {
  page: number;        // 页码
  limit: number;       // 每页数量
}

/**
 * 处理后的显示数据类型
 */
export interface ProcessedLoginLogData extends LoginLogData {
  username: string;     // 用户名
  userId: string;       // 用户ID
  userType: string;     // 用户类型
  loginIp: string;      // 登录IP
  loginLocation: string; // 登录地点
  loginTime: string;    // 登录时间
  status: string;       // 状态
}
