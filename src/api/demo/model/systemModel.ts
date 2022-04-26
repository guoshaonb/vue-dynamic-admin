import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AccountParams = BasicPageParams & {
  account?: string;
  nickname?: string;
};

export type RoleParams = {
  roleName?: string;
  status?: string;
};

export type RolePageParams = BasicPageParams & RoleParams;

export type DeptParams = {
  deptName?: string;
  status?: string;
};

export type MenuParams = {
  menuName?: string;
  status?: string;
};

export interface AccountListItem {
  id: string;
  account: string;
  email: string;
  nickname: string;
  role: number;
  createTime: string;
  remark: string;
  status: number;
}

export interface DeptListItem {
  id: string;
  orderNo: string;
  createTime: string;
  remark: string;
  status: number;
}

// export interface MenuListItem {
//   id: string;
//   orderNo: string;
//   createTime: string;
//   status: number;
//   icon: string;
//   component: string;
//   permission: string;
// }

export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
  status: number;
  orderNo: string;
  createTime: string;
}

export interface UserListItem {
  id: string;
}

export interface CatalogueListItem {
  id: string;
  name: string;
  icon: string;
  parent_id: number;
}

export interface MenuListItem {
  id: string;
  name: string;
  categoryId: number;
}

export interface ConfigListItem {
  user_id: string;
  page_id: string;
}

export interface DataListItem {
  user_id: string;
  page_id: string;
}

/**
 * @description: Request list return value
 */
export type AccountListGetResultModel = BasicFetchResult<AccountListItem>;

export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;

// export type MenuListGetResultModel = BasicFetchResult<MenuListItem>;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;

export type RoleListGetResultModel = RoleListItem[];

export type UserListGetResultModel = UserListItem[];

export type CatalogueListGetResultModel = CatalogueListItem[];

export type MenuListGetResultModel = MenuListItem[];

export type ConfigListGetResultModel = ConfigListItem[];

export type DataListGetResultModel = DataListItem[];


