import { BaseEntity, Status } from './base.model';

export interface FeatureCategory extends BaseEntity {
  name: string;
  icon?: string;
  displayOrder: number;
  status: Status;
}

export interface FeatureCategoryCreateRequest {
  name: string;
  icon?: string;
  displayOrder: number;
  status: Status;
}

export interface FeatureCategoryUpdateRequest {
  id: number;
  name: string;
  icon?: string;
  displayOrder: number;
  status: Status;
}