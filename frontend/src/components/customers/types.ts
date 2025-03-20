import {
  Customer as DummyCustomer,
  Singer as DummySinger,
} from "../../utils/dummyData";

export type EntityType = "customer" | "singer";

// 공통 필드 정의
export interface BaseEntity {
  id: string;
  type: "customer" | "singer";
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  status: "active" | "inactive";
  grade: 1 | 2 | 3 | 4 | 5;
  role: string;
  statusMessage: string;
  memo: string;
  createdAt: string;
  lastRequestDate: string;
  contractCount: number;
  reviewCount: number;
  registrationDate: string;
  updatedAt: string;
  address: string;
}

// 고객 전용 필드
export interface CustomerEntity extends BaseEntity {
  type: "customer";
  company: string;
  department: string;
  requestCount: number;
}

// 가수 전용 필드
export interface SingerEntity extends BaseEntity {
  type: "singer";
  agency: string;
  genre: string;
  genres: string[];
  experience: number;
  price: number;
}

export type Entity = CustomerEntity | SingerEntity;

// 정렬 가능한 필드 타입
export type SortableField = keyof BaseEntity;

// 뷰 모드 타입
export type ViewMode = "table" | "card";

export type CustomerStatus = "active" | "inactive";
export type CustomerGrade = 1 | 2 | 3 | 4 | 5;
export type CustomerRole = "customer" | "singer";

export interface CustomerActionProps {
  selectedCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: (type: EntityType) => void;
  onBulkDelete: () => void;
  onBulkStatus: (status: "active" | "inactive") => void;
  type: EntityType;
}

export interface CustomerFilterProps {
  onFilterChange: (filters: CustomerFilters) => void;
  type: EntityType;
}

export interface CustomerTableProps {
  entities: Entity[];
  selectedEntities: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectEntity: (id: string) => void;
  onEdit: (entity: Entity) => void;
  onDelete: (id: string) => void;
  type: EntityType;
}

export interface CustomerCardProps {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete: (id: string) => void;
  type: EntityType;
}

export interface CustomerFilters {
  search: string;
  status: "all" | "active" | "inactive";
  grade: "all" | 1 | 2 | 3 | 4 | 5;
  role: "all" | "customer" | "singer";
  sortBy: keyof BaseEntity;
  sortOrder: "asc" | "desc";
}

export interface CustomerResponse {
  entities: Entity[];
  total: number;
  page: number;
  limit: number;
}
