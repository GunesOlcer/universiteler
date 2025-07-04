import { BaseEntity, Status } from './base.model';

export enum RegionType {
  Marmara = 1,
  Aegean = 2,
  Mediterranean = 3,
  CentralAnatolia = 4,
  BlackSea = 5,
  EasternAnatolia = 6,
  SoutheasternAnatolia = 7
}

export function getRegionName(region: RegionType): string {
  switch (region) {
    case RegionType.Marmara: return 'Marmara';
    case RegionType.Aegean: return 'Ege';
    case RegionType.Mediterranean: return 'Akdeniz';
    case RegionType.CentralAnatolia: return 'İç Anadolu';
    case RegionType.BlackSea: return 'Karadeniz';
    case RegionType.EasternAnatolia: return 'Doğu Anadolu';
    case RegionType.SoutheasternAnatolia: return 'Güneydoğu Anadolu';
    default: return 'Bilinmiyor';
  }
}

export interface City extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  imagePath?: string;
  imageUrl?: string;
  region?: RegionType;
  regionName?: string;
  population?: number;
  studentPopulation?: number;
  hasAirport: boolean;
  hasTrainStation: boolean;
  hasHighSpeedTrain: boolean;
  countryId: number;
  countryName: string;
  universityCount: number;
  status: Status;
}

export interface CityCreateRequest {
  name: string;
  description?: string;
  image?: File;
  region?: RegionType;
  population?: number;
  studentPopulation?: number;
  hasAirport: boolean;
  hasTrainStation: boolean;
  hasHighSpeedTrain: boolean;
  countryId: number;
  status: Status;
}

export interface CityUpdateRequest {
  id: number;
  name: string;
  description?: string;
  image?: File;
  existingImagePath?: string;
  region?: RegionType;
  population?: number;
  studentPopulation?: number;
  hasAirport: boolean;
  hasTrainStation: boolean;
  hasHighSpeedTrain: boolean;
  countryId: number;
  status: Status;
}

export interface CityFilterParams {
  searchTerm?: string;
  status?: Status;
  countryId?: number;
  region?: RegionType;
  pageNumber?: number;
  pageSize?: number;
}