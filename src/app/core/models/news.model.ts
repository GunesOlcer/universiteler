import { BaseEntity, Status } from './base.model';

export interface News extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  content: string;
  imagePath?: string;
  author: string;
  publishDate: Date;
  importanceLevel: number;
  status: Status;
}

export interface NewsCreateRequest {
  title: string;
  summary: string;
  content: string;
  image?: File;
  author: string;
  publishDate: Date;
  importanceLevel: number;
  status: Status;
}

export interface NewsUpdateRequest {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: File;
  existingImagePath?: string;
  author: string;
  publishDate: Date;
  importanceLevel: number;
  status: Status;
}