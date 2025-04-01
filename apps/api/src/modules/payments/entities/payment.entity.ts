import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Contract } from "../../contracts/entities/contract.entity";
import { Customer } from "../../customers/entities/customer.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  contractId: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  amount: string;

  @Column()
  paymentMethod: string;

  @Column()
  paymentDate: string;

  @Column({
    type: "enum",
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  })
  status: "pending" | "completed" | "failed" | "refunded";

  // 관계 정의
  @ManyToOne(() => Contract, (contract) => contract.payments)
  @JoinColumn({ name: "contractId" })
  contract: Contract;

  @ManyToOne(() => Customer, (customer) => customer.payments)
  @JoinColumn({ name: "customerId" })
  customer: Customer;
}
