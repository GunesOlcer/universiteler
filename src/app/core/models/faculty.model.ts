import { BaseEntity, Status } from './base.model';

export enum FacultyType {
  Faculty = 1,
  Institute = 2,
  School = 3,
  VocationalSchool = 4
}

export interface Faculty extends BaseEntity {
  name: string;
  description?: string;
  type: FacultyType;
  typeName: string;
  universityId: number;
  universityName: string;
  status: Status;
}

export interface FacultyCreateRequest {
  name: string;
  description?: string;
  type: FacultyType;
  universityId: number;
  status: Status;
}

export interface FacultyUpdateRequest {
  id: number;
  name: string;
  description?: string;
  type: FacultyType;
  universityId: number;
  status: Status;
}