import { BaseEntity, Status } from './base.model';

export enum UserType {
  Regular = 1,
  Admin = 2
}

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  birthDate?: Date;
  profileImagePath?: string;
  lastLoginDate?: Date;
  status: Status;
  userType: UserType;
}

export interface UserCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  birthDate?: Date;
  profileImage?: File;
  status: Status;
}

export interface UserUpdateRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  password?: string;
  birthDate?: Date;
  profileImage?: File;
  existingProfileImagePath?: string;
  status: Status;
}

export function getUserTypeName(userType: UserType): string {
  switch (userType) {
    case UserType.Regular: return 'Kullanıcı';
    case UserType.Admin: return 'Yönetici';
    default: return 'Bilinmiyor';
  }
}