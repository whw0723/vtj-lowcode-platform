import { createApi } from '@vtj/utils';

/**
 * 错误日志管理相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取错误日志列表
export const fetchErrorLogs = createApi({
  url: '/Manage/Log/GetErrorLog',
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
 * 错误日志数据类型定义 - 根据实际接口响应格式
 */
export interface ErrorLogData {
  id: number;
  platform: string;
  url: string;
  stacktrace: string;
  type: string;
  leve1: number;
  msg: string;
  status: number;
  update: string;
  row: number;
}

/**
 * API响应格式
 */
export interface ErrorLogResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量
  data: ErrorLogData[]; // 错误日志数据数组
  msg: string;         // 响应消息
}

/**
 * 请求参数类型定义
 */
export interface ErrorLogParams {
  page: number;        // 页码
  limit: number;       // 每页数量
}

/**
 * 处理后的显示数据类型
 */
export interface ProcessedErrorLogData extends ErrorLogData {
  systemName: string;   // 系统名称
  errorType: string;    // 错误类型
  errorMessage: string; // 错误信息
  errorLevel: number;   // 错误等级
  occurTime: string;    // 发生时间
  stackTrace: string;   // 堆栈跟踪
}

/**
 * 错误等级枚举
 */
export enum ErrorLevel {
  INFO = 1,      // 信息
  DEBUG = 2,     // 调试
  WARNING = 3,   // 警告
  ERROR = 4,     // 错误
  CRITICAL = 5   // 严重
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
  LOGIN_ERROR = '登录错误',
  SYSTEM_ERROR = '系统错误',
  EXCEPTION_ERROR = '异常错误',
  PARSE_ERROR = '解析错误',
  OPERATION_ERROR = '操作错误',
  NETWORK_ERROR = '网络错误'
}
