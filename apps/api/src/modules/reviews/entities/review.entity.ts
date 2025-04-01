import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Contract } from "../../contracts/entities/contract.entity";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  contractId: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  singerId: string;

  @Column()
  singerName: string;

  @Column({ type: "int" })
  rating: number;

  @Column("text")
  content: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column({
    type: "enum",
    enum: ["published", "hidden"],
    default: "published",
  })
  status: "published" | "hidden";

  // 관계 정의
  @ManyToOne(() => Contract, (contract) => contract.reviews)
  @JoinColumn({ name: "contractId" })
  contract: Contract;

  @ManyToOne(() => Customer, (customer) => customer.reviews)
  @JoinColumn({ name: "customerId" })
  customer: Customer;

  @ManyToOne(() => Singer, (singer) => singer.reviews)
  @JoinColumn({ name: "singerId" })
  singer: Singer;
}
