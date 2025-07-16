import { createApi } from '@vtj/utils';

/**
 * 货架管理相关API
 */

// 查询货架列表
export const getShelfList = createApi({
  url: '/api/shelf/list',
  method: 'post'
});

// 新增货架
export const addShelf = createApi({
  url: '/api/shelf/add',
  method: 'post'
});

// 编辑货架
export const updateShelf = createApi({
  url: '/api/shelf/update',
  method: 'post'
});

// 删除货架
export const deleteShelf = createApi({
  url: '/api/shelf/delete',
  method: 'post'
});

// 获取货架详情
export const getShelfDetail = createApi({
  url: '/api/shelf/detail',
  method: 'post'
});

/**
 * 货架数据类型定义
 */
export interface ShelfData {
  id?: number;
  shelfNumber?: string;
  shelfCode: string;
  shelfName: string;
  remark?: string;
  operator?: string;
  operationTime?: string;
}

export interface ShelfListParams {
  currentPage: number;
  pageSize: number;
  shelfName?: string;
  shelfCode?: string;
}

export interface ShelfListResponse {
  code: number;
  message?: string;
  data: {
    list: ShelfData[];
    total: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface ShelfOperationResponse {
  code: number;
  message?: string;
  data?: any;
}
