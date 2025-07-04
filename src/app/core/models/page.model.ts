import { BaseEntity, Status } from './base.model';

export interface Page extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  imagePath?: string;
  isInMenu: boolean;
  menuName?: string;
  menuOrder?: number;
  status: Status;
}

export interface PageCreateRequest {
  title: string;
  content: string;
  image?: File;
  isInMenu: boolean;
  menuName?: string;
  menuOrder?: number;
  status: Status;
}

export interface PageUpdateRequest {
  id: number;
  title: string;
  content: string;
  image?: File;
  existingImagePath?: string;
  isInMenu: boolean;
  menuName?: string;
  menuOrder?: number;
  status: Status;
}