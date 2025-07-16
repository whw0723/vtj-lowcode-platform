import { createApi } from '@vtj/utils';

/**
 * 模块类型选择列表相关API
 * 基于后端接口 http://192.168.80.79:8015
 */

// 获取模块类型选择列表
export const fetchModuleTypeSelectList = createApi({
  url: '/Manage/ModuleType/GetModuleTypeSelectList',
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
export interface ModuleTypeSelectData {
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

// 模块类型选择列表响应接口定义
export type ModuleTypeSelectListResponse = ModuleTypeSelectData[];

// 模块类型选项接口定义
export interface ModuleTypeOption {
  value: string;
  label: string;
  description: string;
  id: number;
} 