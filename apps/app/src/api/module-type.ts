import { createApi } from '@vtj/utils';

/**
 * 模块类型管理相关API
 * 基于后端接口 http://192.168.80.79:8015
 */

// 获取模块类型列表（分页）
export const fetchModuleTypeList = createApi({
  url: '/Manage/ModuleType/GetModelTypeByPage',
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

// 根据ID获取模块类型详情
export const fetchModuleTypeById = createApi({
  url: '/Manage/ModuleType/GetModuleTypeById',
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

// 新增模块类型
export const addModuleType = createApi({
  url: '/Manage/ModuleType/AddModelType',
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

// 更新模块类型
export const updateModuleType = createApi({
  url: '/Manage/ModuleType/UpdateModuleType',
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

// 模块类型数据接口定义
export interface ModuleTypeData {
  id: number;
  modelname: string;
  modeltable: string;
  description: string;
  creator: string;
  creationtime: string;
  updater: string;
  updatetime: string;
  isdeleted: number;
}

// 模块类型列表响应接口定义
export interface ModuleTypeListResponse {
  code: string;
  count: string;
  data: ModuleTypeData[];
  msg: string;
}

// 模块类型详情响应接口定义
export interface ModuleTypeDetailResponse {
  code: string;
  data: ModuleTypeData;
  msg: string;
}

// 模块类型列表请求参数接口定义
export interface ModuleTypeListParams {
  page: number;
  limit: number;
}

// 获取模块类型详情请求参数接口定义
export interface ModuleTypeByIdParams {
  mid: string | number;
}

// 新增模块类型请求参数接口定义
export interface AddModuleTypeParams {
  user?: string;
  id?: number;
  modelname: string;
  modeltable: string;
  description: string;
}

// 更新模块类型请求参数接口定义
export interface UpdateModuleTypeParams {
  id: number;
  modelname: string;
  modeltable: string;
  description: string;
} 