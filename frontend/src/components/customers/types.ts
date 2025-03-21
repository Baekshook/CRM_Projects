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
