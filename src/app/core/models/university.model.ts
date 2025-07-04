import { BaseEntity, Status } from './base.model';

export enum UniversityType {
  State = 1,
  Foundation = 2,
  Private = 3,
  KKTC = 4
}

// Re-export Status so existing imports don't break
export { Status };

export interface University extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  logoPath?: string;
  logoUrl?: string;
  coverImagePath?: string;
  thumbnailPath?: string;
  type: UniversityType;
  typeName: string;
  ranking?: number;
  foundationYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  studentCount?: number;
  facultyCount?: number;
  hasLibrary: boolean;
  hasSportsFacility: boolean;
  hasDormitory: boolean;
  hasInternationalPrograms: boolean;
  hasScholarship: boolean;
  cityId: number;
  cityName: string;
  countryName: string;
  country?: string;
  status: Status;
}

export interface UniversityCreateRequest {
  name: string;
  description?: string;
  logo?: File;
  coverImage?: File;
  thumbnail?: File;
  type: UniversityType;
  ranking?: number;
  foundationYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  studentCount?: number;
  facultyCount?: number;
  hasLibrary: boolean;
  hasSportsFacility: boolean;
  hasDormitory: boolean;
  hasInternationalPrograms: boolean;
  hasScholarship: boolean;
  cityId: number;
  status: Status;
}

export interface UniversityUpdateRequest {
  id: number;
  name: string;
  description?: string;
  logo?: File;
  existingLogoPath?: string;
  coverImage?: File;
  existingCoverImagePath?: string;
  thumbnail?: File;
  existingThumbnailPath?: string;
  type: UniversityType;
  ranking?: number;
  foundationYear?: number;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  studentCount?: number;
  facultyCount?: number;
  hasLibrary: boolean;
  hasSportsFacility: boolean;
  hasDormitory: boolean;
  hasInternationalPrograms: boolean;
  hasScholarship: boolean;
  cityId: number;
  status: Status;
}

export interface UniversityFilterRequest {
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
  searchTerm?: string;
  type?: UniversityType;
  status?: Status;
  cityId?: number;
}

export function getUniversityTypeName(type: UniversityType): string {
  switch (type) {
    case UniversityType.State: return 'Devlet';
    case UniversityType.Foundation: return 'Vakıf';
    case UniversityType.Private: return 'Özel';
    case UniversityType.KKTC: return 'KKTC';
    default: return 'Diğer';
  }
}