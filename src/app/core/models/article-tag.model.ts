import { BaseEntity, Status } from './base.model';

export interface ArticleTag extends BaseEntity {
  name: string;
  slug: string;
  status: Status;
}

export interface ArticleTagCreateRequest {
  name: string;
  status: Status;
}

export interface ArticleTagUpdateRequest {
  id: number;
  name: string;
  status: Status;
}