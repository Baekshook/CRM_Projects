import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
} from "typeorm";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column("bigint")
  size: number;

  @Column({ nullable: true })
  path: string;

  @Column()
  entityType: string; // 'customer' 또는 'singer'

  @Column()
  entityId: string;

  @Column({ default: "other" })
  category: string; // 'profileImage', 'highResPhoto', 'songList', 'mrFile', 'other'

  @Column({ type: "bytea", nullable: true })
  data: Buffer; // 실제 파일 데이터를 저장 (PostgreSQL BYTEA 타입)

  @Column({ default: false })
  isStoredInDb: boolean; // 데이터베이스에 직접 저장되었는지 여부

  @CreateDateColumn({ name: "uploaded_at" })
  uploadedAt: Date;

  @VersionColumn({ nullable: true, default: 1 })
  version: number;

  // URL 생성을 위한 메서드 추가
  getFileUrl(baseUrl: string = "http://localhost:4000/api"): string {
    return `${baseUrl}/files/${this.id}/data`;
  }
}
