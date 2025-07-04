import { BaseEntity, Status } from './base.model';

export enum EducationType {
  FormalEducation = 1,
  EveningEducation = 2,
  DistanceEducation = 3
}

export enum ScoreType {
  SAY = 1,
  SOZ = 2,
  EA = 3,
  DIL = 4,
  TYT = 5
}

export enum ScholarshipType {
  None = 0,
  Full = 1,
  Percent75 = 2,
  Percent50 = 3,
  Percent25 = 4
}

export interface Program extends BaseEntity {
  name: string;
  languageCode: string;
  educationType: EducationType;
  educationTypeName: string;
  scoreType: ScoreType;
  scoreTypeName: string;
  scholarshipType: ScholarshipType;
  scholarshipTypeName: string;
  programCode: string;
  duration?: number;
  description?: string;
  departmentId: number;
  departmentName: string;
  facultyId: number;
  facultyName: string;
  universityId: number;
  universityName: string;
  status: Status;
}

export interface ProgramCreateRequest {
  name: string;
  languageCode: string;
  educationType: EducationType;
  scoreType: ScoreType;
  scholarshipType: ScholarshipType;
  programCode: string;
  duration?: number;
  description?: string;
  departmentId: number;
  status: Status;
}

export interface ProgramUpdateRequest {
  id: number;
  name: string;
  languageCode: string;
  educationType: EducationType;
  scoreType: ScoreType;
  scholarshipType: ScholarshipType;
  programCode: string;
  duration?: number;
  description?: string;
  departmentId: number;
  status: Status;
}

export function getEducationTypeName(type: EducationType): string {
  switch (type) {
    case EducationType.FormalEducation: return 'Örgün Öğretim';
    case EducationType.EveningEducation: return 'İkinci Öğretim';
    case EducationType.DistanceEducation: return 'Uzaktan Öğretim';
    default: return 'Bilinmiyor';
  }
}

export function getScoreTypeName(type: ScoreType): string {
  switch (type) {
    case ScoreType.SAY: return 'SAY';
    case ScoreType.SOZ: return 'SÖZ';
    case ScoreType.EA: return 'EA';
    case ScoreType.DIL: return 'DİL';
    case ScoreType.TYT: return 'TYT';
    default: return 'Bilinmiyor';
  }
}

export function getScholarshipTypeName(type: ScholarshipType): string {
  switch (type) {
    case ScholarshipType.None: return 'Ücretli';
    case ScholarshipType.Full: return 'Burslu';
    case ScholarshipType.Percent75: return '%75 İndirimli';
    case ScholarshipType.Percent50: return '%50 İndirimli';
    case ScholarshipType.Percent25: return '%25 İndirimli';
    default: return 'Bilinmiyor';
  }
}