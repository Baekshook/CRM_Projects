import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Request } from '../../requests/entities/request.entity';
import { CustomerNote } from './customer-note.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: string;

  @Column({ type: 'enum', enum: ['신규', '일반'], default: '신규' })
  grade: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => Request, (request) => request.customer)
  requests: Request[];

  @OneToMany(() => CustomerNote, (note) => note.customer, { cascade: true })
  notes: CustomerNote[];

  @CreateDateColumn()
  registrationDate: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
