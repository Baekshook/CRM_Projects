import {
  Customer as DummyCustomer,
  Singer as DummySinger,
} from "../../utils/dummyData";

export type EntityType = "customer" | "singer";

// 자료 타입 정의
export type ResourceType = "image" | "document" | "audio" | "video" | "other";

// 자료 항목 인터페이스
export interface ResourceItem {
  id: string;
  entityId: string; // 고객 또는 가수 ID
  entityType: string; // 고객 또는 가수 타입
  name: string;
  type: ResourceType;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  description?: string;
  category?: string;
  tags?: string[];
}

// 가수별 자료 카테고리
export type SingerResourceCategory = "photo" | "songList" | "mrTrack" | "other";

// 공통 필드 정의
export interface BaseEntity {
  id: string;
  type: "customer" | "singer";
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  status: CustomerStatus;
  grade: CustomerGrade;
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
  resources?: ResourceItem[]; // 연결된 자료 목록
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
  highResPhotos?: ResourceItem[]; // 고화질 사진
  songLists?: ResourceItem[]; // 자기선곡리스트
  mrTracks?: ResourceItem[]; // MR자료
  otherResources?: ResourceItem[]; // 기타 자료
}

export type Entity = CustomerEntity | SingerEntity;

// 자료 필터 인터페이스
export interface ResourceFilters {
  search: string;
  type?: ResourceType;
  category?: string;
  entityId?: string;
  sortBy: "name" | "uploadedAt" | "fileSize";
  sortOrder: "asc" | "desc";
}

// 정렬 가능한 필드 타입
export type SortableField = keyof BaseEntity;

// 뷰 모드 타입
export type ViewMode = "table" | "card";

export type CustomerStatus = "active" | "inactive" | "pending";
export type CustomerGrade = "1" | "2" | "3" | "4" | "5";
export type CustomerRole = "customer" | "singer";

export interface CustomerActionProps {
  selectedCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: () => void;
  onBulkDelete: () => void;
  onBulkStatus: (status: CustomerStatus) => void;
  type: EntityType;
}

export interface CustomerFilterProps {
  onFilterChange: (filters: Filter) => void;
  type: EntityType;
}

export interface CustomerTableProps {
  entities: Entity[];
  selectedEntities: Set<string>;
  onSelectAll: (selected: boolean) => void;
  onSelectEntity: (id: string, selected: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: EntityType;
}

export interface CustomerCardProps {
  entity: Entity;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: EntityType;
}

export interface CustomerGridProps {
  entities: Entity[];
  selectedEntityIds?: number[];
  onSelectEntity?: (id: number, selected: boolean) => void;
  onView?: (id: number) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  type: EntityType;
}

export interface CustomerFilters {
  search: string;
  status: "all" | "active" | "inactive";
  grade: "all" | CustomerGrade;
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

export type SortOrder = "asc" | "desc";
export type SortBy = "name" | "registrationDate" | "contractCount" | "grade";

export interface Filter {
  searchTerm: string;
  status: CustomerStatus | "";
  grade: CustomerGrade | "";
  sortBy: SortBy;
  order: SortOrder;
  [key: string]: any; // 추가 필터 필드
}
