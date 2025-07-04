import { BaseEntity, Status } from './base.model';

export interface Country extends BaseEntity {
  name: string;
  code: string;
  status: Status;
}

export interface CountryCreateRequest {
  name: string;
  code: string;
  status: Status;
}

export interface CountryUpdateRequest {
  id: number;
  name: string;
  code: string;
  status: Status;
}

export interface CountryFilterParams {
  searchTerm?: string;
  status?: Status;
  pageNumber?: number;
  pageSize?: number;
}

export interface Country extends BaseEntity {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: Status;
  createdDate: Date;
  updatedDate?: Date;
  
  // ✅ Yeni alanlar
  cityCount?: number;
  universityCount?: number;
}