import {
  AccountParams,
  DeptListItem,
  // MenuParams,
  RoleParams,
  RolePageParams,
  // MenuListGetResultModel,
  DeptListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel,
  UserListGetResultModel,
  CatalogueListGetResultModel,
  MenuListGetResultModel,
  ConfigListGetResultModel,
  DataListGetResultModel
} from './model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AccountList = '/system/getAccountList',
  IsAccountExist = '/system/accountExist',
  DeptList = '/system/getDeptList',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/system/getAllRoleList',
  //用户管理
  UserList = '/user/list',
  UserDetail = '/user/detail',
  UserRegister = '/user/register',
  UserUpdate = '/user/update',
  UserUpdpass = '/user/updpass',
  UserHidden = '/user/hidden',
  //目录管理
  CatalogueList = '/catalogue/list',
  CatalogueCreate = '/catalogue/create',
  CatalogueUpdate = '/catalogue/update',
  CatalogueHidden = '/catalogue/hidden',
  //菜单管理
  MenusList = '/menu/list',
  MenuCreate = '/menu/create',
  MenuUpdate = '/menu/update',
  MenuHidden = '/menu/hidden',
  //通用配置
  GeneralConfigList = '/generalconfig/list',
  GeneralConfigCreate = '/generalconfig/create',
  GeneralConfigUpdate = '/generalconfig/update',
  GeneralConfigHidden = '/generalconfig/hidden',
  GeneralConfigTranslate = '/generalconfig/translate',
  //通用配置分类
  ConfigclassifyList = '/configclassify/list',
  ConfigclassifyCreate = '/configclassify/create',
  ConfigclassifyUpdate = '/configclassify/update',
  ConfigclassifyHidden = '/configclassify/hidden',
  //通用数据
  GeneralDataList = '/generaldata/list',
  GeneralDataCreate = '/generaldata/create',
  GeneralDataUpdate = '/generaldata/update',
  GeneralDataHidden = '/generaldata/hidden',
  GeneralDataHiddens = '/generaldata/hiddens',
}

export const getAccountList = (params: AccountParams) =>
  defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params });

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const getMenuList = (params?: MenuParams) => 
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const getRoleListByPage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params });

export const getAllRoleList = (params?: RoleParams) =>
  defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params });

export const setRoleStatus = (id: number, status: string) =>
  defHttp.post({ url: Api.setRoleStatus, params: { id, status } });

export const isAccountExist = (account: string) =>
  defHttp.post({ url: Api.IsAccountExist, params: { account } }, { errorMessageMode: 'none' });

//用户接口
export const getUserList = (params?: UserListGetResultModel) =>
  defHttp.get({ url: Api.UserList + "?include=tree", params });

export const getUserDetail = (params?: UserListGetResultModel) =>
  defHttp.get({ url: [Api.UserDetail, params?.['id']].join('/'), params });

export const addUser = (params?: UserListGetResultModel) =>
  defHttp.post({ url: Api.UserRegister, params });

export const editUser = (params?: UserListGetResultModel) =>
  defHttp.put({ url: [Api.UserUpdate, params?.['id']].join('/'), params });

export const editPass = (params?: UserListGetResultModel) =>
  defHttp.put({ url: Api.UserUpdpass, params });

export const delUser = (params?: UserListGetResultModel) =>
  defHttp.delete({ url: [Api.UserHidden, params?.['id']].join('/') + '?is_del=1', params });

//目录接口
export const getCatalogueList = (params?: CatalogueListGetResultModel) =>
  defHttp.get({ url: Api.CatalogueList + "?include=tree", params });

export const addCatalogue = (params?: CatalogueListGetResultModel) =>
  defHttp.post({ url: Api.CatalogueCreate, params });

export const editCatalogue = (params?: CatalogueListGetResultModel) =>
  defHttp.put({ url: [Api.CatalogueUpdate, params?.['id']].join('/'), params });

export const delCatalogue = (params?: CatalogueListGetResultModel) =>
  defHttp.delete({ url: [Api.CatalogueHidden, params?.['id']].join('/') + '?is_del=1', params });

//菜单接口
export const getMenusList = (params?: MenuListGetResultModel) =>
  defHttp.get({ url: Api.MenusList, params });

export const addMenu = (params?: MenuListGetResultModel) =>
  defHttp.post({ url: Api.MenuCreate, params });

export const editMenu = (params?: MenuListGetResultModel) =>
  defHttp.put({ url: [Api.MenuUpdate, params?.['id']].join('/'), params });

export const delMenu = (params?: MenuListGetResultModel) =>
  defHttp.delete({ url: [Api.MenuHidden, params?.['id']].join('/') + '?is_del=1', params });

//通用配置
export const getGeneralConfigList = (params?: ConfigListGetResultModel) =>
  defHttp.get({ url: Api.GeneralConfigList, params });

export const addGeneralConfig = (params?: ConfigListGetResultModel) =>
  defHttp.post({ url: Api.GeneralConfigCreate, params });

export const editGeneralConfig = (params?: ConfigListGetResultModel) =>
  defHttp.put({ url: [Api.GeneralConfigUpdate, params?.['id']].join('/'), params });

export const delGeneralConfig = (params?: ConfigListGetResultModel) =>
  defHttp.delete({ url: [Api.GeneralConfigHidden, params?.['id']].join('/') + '?is_del=1', params });

export const getGeneralConfigTranslate = (params?: ConfigListGetResultModel) =>
  defHttp.get({ url: Api.GeneralConfigTranslate, params });
  
//通用配置分类
export const getConfigclassifyList = (params?: ConfigListGetResultModel) =>
  defHttp.get({ url: Api.ConfigclassifyList, params });

export const addConfigclassify = (params?: ConfigListGetResultModel) =>
  defHttp.post({ url: Api.ConfigclassifyCreate, params });

export const editConfigclassify = (params?: ConfigListGetResultModel) =>
  defHttp.put({ url: [Api.ConfigclassifyUpdate, params?.['id']].join('/'), params });

export const delConfigclassify = (params?: ConfigListGetResultModel) =>
  defHttp.delete({ url: [Api.ConfigclassifyHidden, params?.['id']].join('/') + '?is_del=1', params });
  
//通用数据
export const getGeneralDataList = (params?: DataListGetResultModel) =>
  defHttp.get({ url: Api.GeneralDataList, params });

export const addGeneralData = (params?: DataListGetResultModel) =>
  defHttp.post({ url: Api.GeneralDataCreate, params });

export const editGeneralData = (params?: DataListGetResultModel) =>
  defHttp.put({ url: [Api.GeneralDataUpdate, params?.['id']].join('/'), params });

export const delGeneralData = (params?: DataListGetResultModel) =>
  defHttp.delete({ url: [Api.GeneralDataHidden, params?.['id']].join('/') + '?is_del=1', params });

export const delsGeneralData = (params?: DataListGetResultModel) =>
  defHttp.delete({ url: Api.GeneralDataHiddens, params });

  