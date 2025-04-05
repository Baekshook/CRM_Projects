import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Customer } from "../customers/entities/customer.entity";

@Entity("interactions")
export class Interaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: "text", nullable: true })
  content: string;

  @Column({ length: 50 })
  type: string; // 'call', 'email', 'meeting', 'note', etc.

  @Column({ nullable: true })
  customerId: string;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ type: "timestamp", nullable: true })
  interactionDate: Date;

  @Column({ default: "pending" })
  status: string; // 'pending', 'completed', 'follow-up'

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
