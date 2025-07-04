export * from './base.model';
export * from './auth.model';
export * from './user.model';
export * from './admin-permission.model';
export * from './country.model';
export * from './city.model';
export * from './university.model';
export * from './faculty.model';
export * from './department.model';
export * from './program.model';
export * from './program-quota.model';
export * from './program-ranking.model';
export * from './dormitory-feature.model';
export * from './feature-category.model';
export * from './dormitory.model';
export * from './article-tag.model';
export * from './article.model';
export * from './news.model';
export * from './page.model';
export * from './help-topic.model';
export * from './site-setting.model';
export * from './selection.model';

// Export menu models separately to avoid conflicts
export { 
  MenuBase,
  CityMenu, 
  CityMenuCreateRequest, 
  CityMenuUpdateRequest,
  UniversityMenu,
  UniversityMenuCreateRequest,
  UniversityMenuUpdateRequest,
  DormitoryMenu,
  DormitoryMenuCreateRequest,
  DormitoryMenuUpdateRequest,
  ProgramMenu,
  ProgramMenuCreateRequest,
  ProgramMenuUpdateRequest
} from './menu.model';