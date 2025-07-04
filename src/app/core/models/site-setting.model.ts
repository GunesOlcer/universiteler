import { BaseEntity, Status } from './base.model';

export interface SiteSetting extends BaseEntity {
  key: string;
  value: string;
  description?: string;
  status: Status;
}

export interface SiteSettingCreateRequest {
  key: string;
  value: string;
  description?: string;
  status: Status;
}

export interface SiteSettingUpdateRequest {
  id: number;
  key: string;
  value: string;
  description?: string;
  status: Status;
}