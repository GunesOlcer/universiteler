import { BaseEntity, Status } from './base.model';

export interface HelpTopic extends BaseEntity {
  question: string;
  answer: string;
  order: number;
  categoryId: number;
  categoryName: string;
  status: Status;
}

export interface HelpTopicCreateRequest {
  question: string;
  answer: string;
  order: number;
  categoryId: number;
  status: Status;
}

export interface HelpTopicUpdateRequest {
  id: number;
  question: string;
  answer: string;
  order: number;
  categoryId: number;
  status: Status;
}