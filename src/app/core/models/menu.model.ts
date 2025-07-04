import { BaseEntity, Status } from './base.model';

export interface MenuBase extends BaseEntity {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  parentTitle?: string;
  isVisible: boolean;
  status: Status;
}

export interface CityMenu extends MenuBase {
  cityId: number;
  cityName: string;
}

export interface CityMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  cityId: number;
}

export interface CityMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  cityId: number;
}

export interface UniversityMenu extends MenuBase {
  universityId: number;
  universityName: string;
}

export interface UniversityMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  universityId: number;
}

export interface UniversityMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  universityId: number;
}

export interface DormitoryMenu extends MenuBase {
  dormitoryId: number;
  dormitoryName: string;
}

export interface DormitoryMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  dormitoryId: number;
}

export interface DormitoryMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  dormitoryId: number;
}

export interface ProgramMenu extends MenuBase {
  programId: number;
  programName: string;
}

export interface ProgramMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  programId: number;
}

export interface ProgramMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  programId: number;
}

export interface CountryMenu extends MenuBase {
  countryId: number;
  countryName: string;
}

export interface CountryMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  countryId: number;
}

export interface CountryMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  countryId: number;
}