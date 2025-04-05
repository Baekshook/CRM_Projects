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
import { Review } from "../../reviews/entities/review.entity";
import { Feedback } from "../../feedbacks/entities/feedback.entity";

@Entity("singers")
export class Singer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  agency: string;

  @Column()
  genre: string;

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

  @Column({ type: "int", enum: [1, 2, 3, 4, 5], default: 3 })
  grade: number;

  @Column({ type: "float", default: 0 })
  rating: number;

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive";

  @Column({ default: 0 })
  contractCount: number;

  @Column({ nullable: true })
  lastRequestDate: string;

  @Column({ default: 0 })
  reviewCount: number;

  @Column()
  registrationDate: string;

  @Column({ default: "가수" })
  role: string;

  @Column("simple-array")
  genres: string[];

  @Column({ type: "int", default: 0 })
  experience: number;

  @Column({ type: "int", default: 0 })
  price: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // 관계 정의
  @OneToMany(() => Request, (request) => request.singer)
  requests: Request[];

  @OneToMany(() => Match, (match) => match.singer)
  matches: Match[];

  @OneToMany(() => Schedule, (schedule) => schedule.singer)
  schedules: Schedule[];

  @OneToMany(() => Contract, (contract) => contract.singer)
  contracts: Contract[];

  @OneToMany(() => Review, (review) => review.singer)
  reviews: Review[];

  @OneToMany(() => Feedback, (feedback) => feedback.singer)
  feedbacks: Feedback[];
}
