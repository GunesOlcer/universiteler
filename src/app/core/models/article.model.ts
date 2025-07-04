import { BaseEntity, Status } from './base.model';

export enum ArticleCategory {
  UniversityLife = 1,
  PreferenceGuide = 2,
  Scholarships = 3,
  Career = 4,
  StudentExperience = 5
}

export interface Article extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  content: string;
  imagePath?: string;
  author: string;
  publishDate: Date;
  readingTime: number;
  category: ArticleCategory;
  categoryName: string;
  status: Status;
  tags: string[];
}

export interface ArticleCreateRequest {
  title: string;
  summary: string;
  content: string;
  image?: File;
  author: string;
  publishDate: Date;
  readingTime: number;
  category: ArticleCategory;
  status: Status;
  tags: string[];
}

export interface ArticleUpdateRequest {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: File;
  existingImagePath?: string;
  author: string;
  publishDate: Date;
  readingTime: number;
  category: ArticleCategory;
  status: Status;
  tags: string[];
}

export interface ArticleListRequest {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  status?: Status;
  category?: ArticleCategory;
}

export function getCategoryName(category: ArticleCategory): string {
  switch (category) {
    case ArticleCategory.UniversityLife:
      return 'Üniversite Yaşamı';
    case ArticleCategory.PreferenceGuide:
      return 'Tercih Rehberi';
    case ArticleCategory.Scholarships:
      return 'Burslar';
    case ArticleCategory.Career:
      return 'Kariyer';
    case ArticleCategory.StudentExperience:
      return 'Öğrenci Deneyimi';
    default:
      return 'Bilinmiyor';
  }
}

export function getCategoryKey(category: ArticleCategory): string {
  switch (category) {
    case ArticleCategory.UniversityLife:
      return 'university-life';
    case ArticleCategory.PreferenceGuide:
      return 'preference-guide';
    case ArticleCategory.Scholarships:
      return 'scholarships';
    case ArticleCategory.Career:
      return 'career';
    case ArticleCategory.StudentExperience:
      return 'student-experience';
    default:
      return 'unknown';
  }
}

export function getCategoryFromKey(key: string): ArticleCategory | null {
  switch (key) {
    case 'university-life':
      return ArticleCategory.UniversityLife;
    case 'preference-guide':
      return ArticleCategory.PreferenceGuide;
    case 'scholarships':
      return ArticleCategory.Scholarships;
    case 'career':
      return ArticleCategory.Career;
    case 'student-experience':
      return ArticleCategory.StudentExperience;
    default:
      return null;
  }
}