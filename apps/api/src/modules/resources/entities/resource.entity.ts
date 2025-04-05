import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";

@Entity("resources")
export class Resource {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  entityId: string;

  @Column()
  entityType: string; // 'customer' 또는 'singer'

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column({ nullable: true })
  mimeType: string;

  @Column({
    type: "enum",
    enum: ["image", "audio", "video", "document", "other"],
    default: "other",
  })
  type: "image" | "audio" | "video" | "document" | "other";

  @Column({ nullable: true })
  category: string;

  @Column("simple-array", { nullable: true })
  tags: string[];

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isPublic: boolean;

  // 이 필드는 파일 데이터가 DB에 직접 저장되는지 여부를 나타냅니다
  @Column({ default: false })
  isStoredInDb: boolean;

  // 파일 데이터가 DB에 저장되는 경우 사용됩니다
  @Column({ type: "bytea", nullable: true })
  data: Buffer;

  // 관계 정의 - 각 관계에 대해 다른 이름의 외래 키와 참조 컬럼을 사용
  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerEntityId", referencedColumnName: "id" })
  customer: Customer;

  @ManyToOne(() => Singer, { nullable: true })
  @JoinColumn({ name: "singerEntityId", referencedColumnName: "id" })
  singer: Singer;
}
