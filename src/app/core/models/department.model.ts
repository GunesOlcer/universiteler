import { BaseEntity, Status } from './base.model';

export interface Department extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
  jobOpportunities?: string;
  averageSalary?: number;
  averageEducationYears?: number;
  hasEnglishProgram: boolean;
  facultyId: number;
  facultyName: string;
  universityId: number;
  universityName: string;
  status: Status;
}

export interface DepartmentCreateRequest {
  name: string;
  description?: string;
  image?: File;
  jobOpportunities?: string;
  averageSalary?: number;
  averageEducationYears?: number;
  hasEnglishProgram: boolean;
  facultyId: number;
  status: Status;
}

export interface DepartmentUpdateRequest {
  id: number;
  name: string;
  description?: string;
  image?: File;
  existingImagePath?: string;
  jobOpportunities?: string;
  averageSalary?: number;
  averageEducationYears?: number;
  hasEnglishProgram: boolean;
  facultyId: number;
  status: Status;
}

export interface DepartmentMenu extends BaseEntity {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  parentTitle?: string;
  isVisible: boolean;
  status: Status;
  departmentId: number;
  departmentName: string;
}

export interface DepartmentMenuCreateRequest {
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  departmentId: number;
}

export interface DepartmentMenuUpdateRequest {
  id: number;
  title: string;
  content: string;
  order: number;
  parentId?: number;
  isVisible: boolean;
  status: Status;
  departmentId: number;
}