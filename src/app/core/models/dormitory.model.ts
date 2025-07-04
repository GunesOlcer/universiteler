import { BaseEntity, Status } from './base.model';
import { DormitoryFeature } from './dormitory-feature.model'; // Import from dedicated file

export enum DormitoryType {
  State = 1,
  Private = 2,
  University = 3
}

export enum GenderType {
  Male = 1,
  Female = 2,
  Mixed = 3
}

export function getDormitoryTypeName(type: DormitoryType): string {
  switch (type) {
    case DormitoryType.State: return 'Devlet';
    case DormitoryType.Private: return 'Özel';
    case DormitoryType.University: return 'Üniversite';
    default: return 'Bilinmiyor';
  }
}

export function getGenderTypeName(gender: GenderType): string {
  switch (gender) {
    case GenderType.Male: return 'Erkek';
    case GenderType.Female: return 'Kız';
    case GenderType.Mixed: return 'Karma';
    default: return 'Bilinmiyor';
  }
}

export interface Dormitory extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
  type: DormitoryType;
  typeName: string;
  gender: GenderType;
  genderName: string;
  capacity?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  roomTypes?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  distanceToCenter?: number;
  cityId: number;
  cityName: string;
  countryName: string;
  status: Status;
  features: DormitoryFeature[];
}

export interface DormitoryCreateRequest {
  name: string;
  description?: string;
  image?: File;
  type: DormitoryType;
  gender: GenderType;
  capacity?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  roomTypes?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  distanceToCenter?: number;
  cityId: number;
  status: Status;
  featureIds: number[];
}

export interface DormitoryUpdateRequest {
  id: number;
  name: string;
  description?: string;
  image?: File;
  existingImagePath?: string;
  type: DormitoryType;
  gender: GenderType;
  capacity?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  roomTypes?: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
  distanceToCenter?: number;
  cityId: number;
  status: Status;
  featureIds: number[];
}