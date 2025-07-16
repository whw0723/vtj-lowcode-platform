import { createApi } from '@vtj/utils';

/**
 * 操作日志管理相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取操作日志列表
export const fetchOperationLogs = createApi({
  url: '/Manage/Log/GetOperateData',
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
 * 操作日志数据类型定义 - 根据实际接口响应格式
 */
export interface OperationLogData {
  id: number;
  platfrom: string;
  stacktrace: string;
  trace: string;
  primary: string;
  operator: string;
  update: string;
  row: number;
}

/**
 * API响应格式
 */
export interface OperationLogResponse {
  code: string;        // "0" 表示成功
  count: string;       // 总数量
  data: OperationLogData[]; // 操作日志数据数组
  msg: string;         // 响应消息
}

/**
 * 请求参数类型定义
 */
export interface OperationLogParams {
  page: number;        // 页码
  limit: number;       // 每页数量
}

/**
 * 处理后的显示数据类型
 */
export interface ProcessedOperationLogData extends OperationLogData {
  displayId: number;   // 显示用的序号
  operation: string;   // 操作描述
  module: string;      // 操作模块
  operateTime: string; // 操作时间
}
