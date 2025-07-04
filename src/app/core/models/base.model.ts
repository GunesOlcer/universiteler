export interface BaseEntity {
  id: number;
  createdDate: Date;
  createdBy?: number;
  updatedDate?: Date;
  updatedBy?: number;
  isDeleted: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

export interface PagedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  status?: Status;
}

export enum Status {
  Passive = 0,
  Active = 1,
  Pending = 2,
  Deleted = 3
}

export function getStatusName(status: Status): string {
  switch (status) {
    case Status.Active: return 'Aktif';
    case Status.Passive: return 'Pasif';
    case Status.Pending: return 'Beklemede';
    case Status.Deleted: return 'Silinmiş';
    default: return 'Bilinmiyor';
  }
}