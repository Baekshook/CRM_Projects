import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Negotiation } from "./negotiation.entity";

@Entity("quotes")
export class Quote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  negotiationId: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: ["draft", "sent", "accepted", "rejected", "revised", "final"],
    default: "draft",
  })
  status: "draft" | "sent" | "accepted" | "rejected" | "revised" | "final";

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  validUntil: Date;

  @Column({ type: "jsonb", nullable: true })
  items: QuoteItem[];

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ nullable: true })
  discountReason: string;

  @Column({ type: "text", nullable: true })
  terms: string;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  @Column({ default: false })
  isFinal: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 관계 정의
  @ManyToOne(() => Negotiation, (negotiation) => negotiation.quotes)
  @JoinColumn({ name: "negotiationId" })
  negotiation: Negotiation;
}

// 견적서 항목을 위한 인터페이스
export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
