import { BaseEntity } from './base.model';

export enum QuotaType {
  General = 1,
  SchoolFirst = 2,
  DisasterVictim = 3,
  Other = 4
}

export interface ProgramQuota extends BaseEntity {
  year: number;
  quotaType: QuotaType;
  quotaTypeName: string;
  quota: number;
  enrolled?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
  programName: string;
}

export interface ProgramQuotaCreateRequest {
  year: number;
  quotaType: QuotaType;
  quota: number;
  enrolled?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
}

export interface ProgramQuotaUpdateRequest {
  id: number;
  year: number;
  quotaType: QuotaType;
  quota: number;
  enrolled?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
}