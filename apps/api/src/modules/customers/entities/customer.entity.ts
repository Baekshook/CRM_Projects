import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Request } from "../../requests/entities/request.entity";
import { Match } from "../../matches/entities/match.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Contract } from "../../contracts/entities/contract.entity";
import { Payment } from "../../payments/entities/payment.entity";
import { Review } from "../../reviews/entities/review.entity";
import { Feedback } from "../../feedbacks/entities/feedback.entity";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ["customer", "singer"], default: "customer" })
  type: "customer" | "singer";

  @Column()
  name: string;

  @Column()
  company: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  profileImageId: string;

  @Column({ nullable: true })
  statusMessage: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  agency: string;

  @Column({ type: "int", enum: [1, 2, 3, 4, 5], default: 3 })
  grade: number;

  @Column({ nullable: true })
  memo: string;

  @Column({ nullable: true })
  assignedTo: string;

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive";

  @Column({ default: 0 })
  requestCount: number;

  @Column({ nullable: true })
  lastRequestDate: string;

  @Column({ default: 0 })
  contractCount: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column()
  registrationDate: string;

  @Column({ default: "고객" })
  role: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // 관계 정의
  @OneToMany(() => Request, (request) => request.customer)
  requests: Request[];

  @OneToMany(() => Match, (match) => match.customer)
  matches: Match[];

  @OneToMany(() => Schedule, (schedule) => schedule.customer)
  schedules: Schedule[];

  @OneToMany(() => Contract, (contract) => contract.customer)
  contracts: Contract[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];

  @OneToMany(() => Feedback, (feedback) => feedback.customer)
  feedbacks: Feedback[];
}
