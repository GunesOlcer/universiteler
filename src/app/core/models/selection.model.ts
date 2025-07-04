import { RegionType } from './city.model';
import { UniversityType } from './university.model';
import { ScholarshipType, EducationType, ScoreType } from './program.model';

export interface SelectionFilter {
  scoreType: ScoreType;
  score: number;
  ranking?: number;
  regions?: RegionType[];
  cityIds?: number[];
  universityTypes?: UniversityType[];
  scholarshipTypes?: ScholarshipType[];
  educationTypes?: EducationType[];
  universityIds?: number[];
  facultyIds?: number[];
  programName?: string;
  year: number;
  minQuota?: number;
  maxQuota?: number;
  minFilledRate?: number;
  maxFilledRate?: number;
  minRanking?: number;
  maxRanking?: number;
  minScore?: number;
  maxScore?: number;
}

export interface SelectionResult {
  programId: number;
  programCode: string;
  programName: string;
  departmentName: string;
  facultyName: string;
  universityName: string;
  cityName: string;
  languageCode: string;
  educationType: EducationType;
  educationTypeName: string;
  scoreType: ScoreType;
  scoreTypeName: string;
  scholarshipType: ScholarshipType;
  scholarshipTypeName: string;
  quota: number;
  enrolled?: number;
  filledRate?: number;
  minScore?: number;
  maxScore?: number;
  minRanking?: number;
  maxRanking?: number;
  year: number;
  trend?: string;
  isPossiblePlacement: boolean;
}

export interface SaveSelectionResultRequest {
  selectionResult: SelectionResult;
  userId?: number;
}

export interface SelectionFilterRequest {
  scoreType: ScoreType;
  score: number;
  ranking?: number;
  regions?: RegionType[];
  cityIds?: number[];
  universityTypes?: UniversityType[];
  scholarshipTypes?: ScholarshipType[];
  educationTypes?: EducationType[];
  universityIds?: number[];
  facultyIds?: number[];
  programName?: string;
  year: number;
  minQuota?: number;
  maxQuota?: number;
  minFilledRate?: number;
  maxFilledRate?: number;
  minRanking?: number;
  maxRanking?: number;
  minScore?: number;
  maxScore?: number;
}