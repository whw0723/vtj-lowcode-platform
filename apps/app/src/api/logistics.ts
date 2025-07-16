import { createApi } from '@vtj/utils';

/**
 * 物流管理相关API
 * 基于后端接口 http://192.168.80.79:8000
 */

// 获取今日物流列表
export const fetchLogisticsToday = createApi({
  url: '/Manage/Logistics/GetLogisticsToday',
  method: 'post',
  settings: {
    type: 'form',
    loading: false,
    failMessage: false,
    validSuccess: false,
    originResponse: true,  // 返回原始响应格式
    injectHeaders: true
  }
});

// 获取快递类型数据（缓存）
export const fetchExpressTypeData = createApi({
  url: '/Manage/PreScription/GetExpressTypeDataByCache',
  method: 'post',
  settings: {
    type: 'form',
    loading: false,
    failMessage: false,
    validSuccess: false,
    originResponse: true,  // 返回原始响应格式
    injectHeaders: true
  }
});

// 获取医院数据（缓存）
export const fetchHospitalData = createApi({
  url: '/Manage/Hospital/GetCacheHospitalData',
  method: 'post',
  settings: {
    type: 'form',
    loading: false,
    failMessage: false,
    validSuccess: false,
    originResponse: true,  // 返回原始响应格式
    injectHeaders: true
  }
});

/**
 * 物流数据类型定义 - 根据实际接口响应格式
 */
export interface LogisticsData {
  id: number;
  pid: number;
  pspnum: string;
  patientname: string;
  sex: string;
  hid: number;
  dose: number;
  decmothed?: number;
  inpatientarea?: string;
  sickbed?: string;
  remark?: string;
  daijian?: number;
  phone?: string;
  hname: string;
  dotime: string;
  expresstype: string;
  expresscompany: string;
  expressphone: string;
  expressaddress: string;
  expressnumber: string;
}

/**
 * API响应格式
 */
export interface LogisticsResponse {
  code: string;           // "0" 表示成功
  count: string;          // 总数量
  data: LogisticsData[];  // 物流数据数组
  msg: string;            // 响应消息
}

/**
 * 请求参数类型定义
 */
export interface LogisticsParams {
  page: number;           // 页码
  limit: number;          // 每页数量
  hospital?: number;      // 医院ID，0表示全部
  logisticsselect?: string; // 物流选择
  searchcontent?: string; // 搜索内容
  logisticsptype?: string; // 物流类型
  quertime?: string;      // 查询时间
  logistictime?: string;  // 物流时间
  decmothed?: number;     // 煎煮方法，-1表示全部
}

/**
 * 处理后的显示数据类型
 */
export interface ProcessedLogisticsData extends LogisticsData {
  orderNumber: string;    // 订单号
  customerName: string;   // 客户名称
  address: string;        // 配送地址
  items: string;          // 物品名称
  quantity: number;       // 数量
  weight: string;         // 重量
  status: string;         // 配送状态
  deliveryTime: string;   // 配送时间
  driver: string;         // 配送员
  hospitalName: string;   // 医院名称
  expressType: string;    // 快递类型
  expressNumber: string;  // 快递单号
  inpatientArea?: string; // 住院区域
  sickBed?: string;       // 病床
  decMethod?: number;     // 煎煮方法
}

/**
 * 配送状态枚举
 */
export enum DeliveryStatus {
  PENDING = '待配送',
  DELIVERING = '配送中',
  COMPLETED = '已完成',
  CANCELLED = '已取消'
}

/**
 * 快递类型枚举
 */
export enum ExpressType {
  INTERNAL = '厂内配送',
  EMS = 'EMS',
  SF_MEDICAL = '顺丰医寄通'
}

/**
 * 煎煮方法枚举
 */
export enum DecoctionMethod {
  ALL = -1,           // 全部
  METHOD_1 = 1,       // 方法1
  METHOD_2 = 2        // 方法2
}

/**
 * 快递类型数据类型定义
 */
export interface ExpressTypeData {
  KID: number;        // 快递类型ID
  ParentID: number;   // 父级ID
  KType: number;      // 类型
  KName: string;      // 快递类型名称
  Kvalue: string;     // 快递类型值
  IsCheck: number;    // 是否选中 (0/1)
}

/**
 * 快递类型API响应格式
 */
export interface ExpressTypeResponse {
  code: string;              // "0" 表示成功
  msg: string;               // 响应消息
  data: ExpressTypeData[];   // 快递类型数据数组
}

/**
 * 医院数据类型定义
 */
export interface HospitalData {
  HID: number;              // 医院ID
  Hnum: string;             // 医院编号
  Hname: string;            // 医院名称
  ShortName: string;        // 简称
  Contacter: string;        // 联系人
  Phone: string;            // 电话
  Mnemonic: string;         // 助记符
  Address: string;          // 地址
  StoreID: number;          // 门店ID
  IsDeleted: number;        // 是否删除
  CreatorID: number;        // 创建者ID
  CreateTime: string;       // 创建时间
  UpdateID: number;         // 更新者ID
  UpdateTime: string;       // 更新时间
  Remark: string;           // 备注
  PostBackAdress: string;   // 回调地址
  TemplateSign: string;     // 模板签名
  smsstepsname: string;     // 短信步骤名称
  smstemplate: string;      // 短信模板
  hisurl: string;           // HIS系统URL
  histype: string;          // HIS系统类型
  hisuserid: string;        // HIS用户ID
  hisuserpassword: string;  // HIS用户密码
  hisbusinesscode: string;  // HIS业务代码
  hisjgdm: string;          // HIS机构代码
  hissecret: string;        // HIS密钥
  type?: number;            // 类型（可选）
  hosType?: number;         // 医院类型（可选）
  stepsname?: string;       // 步骤名称（可选）
}

/**
 * 医院数据API响应格式
 */
export interface HospitalResponse {
  code: string;           // "0" 表示成功
  msg: string;            // 响应消息
  data: {
    itemname: string;     // 项目名称
    itemlist: HospitalData[]; // 医院数据数组
  };
}
