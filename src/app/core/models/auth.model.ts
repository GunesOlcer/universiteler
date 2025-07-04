export interface LoginRequest {
  userName: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
  birthDate?: Date;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  userName: string;
  fullName: string;
  roles: string[];
}

export interface CurrentUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  birthDate?: Date;
  profileImagePath?: string;
  createdDate: Date;
  lastLoginDate?: Date;
  status: number;
}

export interface AdminUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  profileImagePath?: string;
  createdDate: Date;
  createdBy?: number;
  createdByName?: string;
  lastLoginDate?: Date;
  status: number;
  permissions: AdminPermissionResponse[];
  roles: string[];
}

export interface AdminPermissionResponse {
  id: number;
  module: number;
  moduleName: string;
  type: number;
  typeName: string;
  userId?: number;
  userName?: string;
  roleId?: number;
  roleName?: string;
  createdDate: Date;
  createdBy?: number;
  createdByName?: string;
}

export interface LoginCommandRequest {
  userName: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginCommandResponse {
  success: boolean;
  message: string;
  data: TokenResponse;
}

export interface RegisterCommandRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
  birthDate?: Date;
}

export interface RegisterCommandResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface GetCurrentUserQueryResponse {
  success: boolean;
  message: string;
  data: CurrentUserResponse;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: CurrentUserResponse | AdminUserResponse | null;
  token: string | null;
  refreshToken: string | null;
}