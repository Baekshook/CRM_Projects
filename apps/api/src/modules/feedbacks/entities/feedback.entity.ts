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

@Entity("feedbacks")
export class Feedback {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  customerId: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  singerId: string;

  @Column({ nullable: true })
  singerName: string;

  @Column()
  rating: number;

  @Column("text")
  content: string;

  @Column({
    type: "enum",
    enum: ["quality", "service", "communication", "price", "other"],
    default: "quality",
  })
  category: "quality" | "service" | "communication" | "price" | "other";

  @Column({
    type: "enum",
    enum: ["new", "inProgress", "resolved", "closed"],
    default: "new",
  })
  status: "new" | "inProgress" | "resolved" | "closed";

  @Column({ nullable: true, type: "text" })
  response: string;

  @Column({ nullable: true })
  responseAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 관계 정의
  @ManyToOne(() => Customer, (customer) => customer.feedbacks)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.feedbacks, { nullable: true })
  @JoinColumn({ name: "singerId" })
  singer: Singer;
}
