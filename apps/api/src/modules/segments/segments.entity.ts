import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("segments")
export class Segment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: "customer" })
  entityType: string; // 'customer' 또는 'singer'

  @Column({ type: "jsonb", nullable: true })
  criteria: Record<string, any>;

  @Column({ type: "int", default: 0 })
  memberCount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
