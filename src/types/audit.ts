export interface IAiInsights {
  decarbonizationPriority: 'High' | 'Medium' | 'Low' | string;
  estimatedCostSavingsUsd: number;
  recommendedActions: string[];
}

export type FacilityType = 'Manufacturing' | 'Data Center' | 'Corporate Office' | 'Logistics Hub' | 'Retail Store';
export type ScopeCategory = 'Scope 1 (Direct)' | 'Scope 2 (Indirect Energy)' | 'Scope 3 (Value Chain)';
export type RiskRating = 'Low Carbon' | 'Moderate Impact' | 'High Emissions' | 'Critical Failure';

export interface IEsgAudit {
  _id: string;
  title: string;
  facilityName: string;
  facilityType: FacilityType;
  location: string;
  auditYear: number;
  scopeCategory: ScopeCategory;
  carbonScoreTons: number;
  energyUsageKwh: number;
  riskRating: RiskRating;
  shortDescription: string;
  fullOverview: string;
  imageUrl?: string;
  tags: string[];
  createdBy: string;
  aiInsights: IAiInsights;
  createdAt: string;
  updatedAt: string;
}

export interface AuditQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  facilityType?: string;
  riskRating?: string;
  auditYear?: number;
  scopeCategory?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
