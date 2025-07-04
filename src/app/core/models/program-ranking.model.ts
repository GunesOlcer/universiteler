import { BaseEntity } from './base.model';

export interface ProgramRanking extends BaseEntity {
  year: number;
  minRanking?: number;
  maxRanking?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
  programName: string;
}

export interface ProgramRankingCreateRequest {
  year: number;
  minRanking?: number;
  maxRanking?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
}

export interface ProgramRankingUpdateRequest {
  id: number;
  year: number;
  minRanking?: number;
  maxRanking?: number;
  minScore?: number;
  maxScore?: number;
  programId: number;
}