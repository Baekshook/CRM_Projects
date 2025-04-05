import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
import { NegotiationLog } from "./negotiation-log.entity";
import { Quote } from "./quote.entity";

@Entity("negotiations")
export class Negotiation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customerId: string;

  @Column()
  singerId: string;

  @Column({
    type: "enum",
    enum: ["pending", "in-progress", "final-quote", "cancelled", "completed"],
    default: "pending",
  })
  status: "pending" | "in-progress" | "final-quote" | "cancelled" | "completed";

  @Column({ nullable: true })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  initialAmount: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  finalAmount: number;

  @Column({ nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  eventLocation: string;

  @Column({ nullable: true })
  eventType: string;

  @Column({ nullable: true })
  eventDuration: number;

  @Column({ default: false })
  isUrgent: boolean;

  @Column({ nullable: true })
  deadline: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "text", nullable: true })
  requirements: string;

  @Column({ nullable: true })
  assignedTo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 관계 정의
  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer)
  @JoinColumn({ name: "singerId" })
  singer: Singer;

  @OneToMany(() => NegotiationLog, (log) => log.negotiation)
  logs: NegotiationLog[];

  @OneToMany(() => Quote, (quote) => quote.negotiation)
  quotes: Quote[];
}
