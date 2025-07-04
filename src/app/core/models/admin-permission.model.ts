import { BaseEntity } from './base.model';

export enum PermissionModule {
  Users = 1,
  Universities = 2,
  Faculties = 3,
  Departments = 4,
  Programs = 5,
  Countries = 6,
  Cities = 7,
  Dormitories = 8,
  Articles = 9,
  News = 10,
  Pages = 11,
  Settings = 12,
  Permissions = 13,
  Roles = 14,
  AdminUsers = 15,
  Reports = 16,
  Analytics = 17,
  HelpTopics = 18
}

export enum PermissionType {
  View = 1,
  Create = 2,
  Edit = 3,
  Delete = 4,
  Approve = 5,
  Publish = 6,
  Export = 7,
  Import = 8,
  Manage = 9,
  FullAccess = 10
}

export interface AdminPermission extends BaseEntity {
  module: PermissionModule;
  moduleName: string;
  type: PermissionType;
  typeName: string;
  userId?: number;
  userName?: string;
  roleId?: number;
  roleName?: string;
  createdByName?: string;
}

export interface AdminPermissionCreateRequest {
  module: PermissionModule;
  type: PermissionType;
  userId?: number;
  roleId?: number;
}

export interface AdminPermissionUpdateRequest {
  id: number;
  module: PermissionModule;
  type: PermissionType;
  userId?: number;
  roleId?: number;
}

export interface AssignPermissionRequest {
  module: PermissionModule;
  type: PermissionType;
}

export interface UserPermissions {
  userId: number;
  userName: string;
  fullName: string;
  directPermissions: AdminPermission[];
  rolePermissions: AdminPermission[];
  roles: string[];
}

export interface RolePermissions {
  roleId: number;
  roleName: string;
  description: string;
  permissions: AdminPermission[];
}

export interface PermissionModuleInfo {
  module: PermissionModule;
  moduleName: string;
  description: string;
  availablePermissions: PermissionTypeInfo[];
}

export interface PermissionTypeInfo {
  type: PermissionType;
  typeName: string;
  description: string;
  isGranted: boolean;
}