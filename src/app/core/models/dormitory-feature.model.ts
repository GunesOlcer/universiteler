import { BaseEntity, Status } from './base.model';

export interface DormitoryFeature extends BaseEntity {
  name: string;
  icon?: string;
  categoryId: number;
  categoryName: string;
  status: Status;
}

export interface DormitoryFeatureCreateRequest {
  name: string;
  icon?: string;
  categoryId: number;
  status: Status;
}

export interface DormitoryFeatureUpdateRequest {
  id: number;
  name: string;
  icon?: string;
  categoryId: number;
  status: Status;
}