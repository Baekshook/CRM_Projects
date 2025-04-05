export class CreateResourceDto {
  name: string;
  description?: string;
  entityId: string;
  entityType: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  type?: "image" | "audio" | "video" | "document" | "other";
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  isStoredInDb?: boolean;
  data?: Buffer;
}
