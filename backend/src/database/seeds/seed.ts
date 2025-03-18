import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Request } from '../../requests/entities/request.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // 사용자 추가
  const userRepository = getRepository(User);

  // 관리자 사용자 생성
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = userRepository.create({
    email: 'admin@example.com',
    name: '관리자',
    password: adminPassword,
    role: 'admin',
    isActive: true,
    phone: '010-1234-5678',
  });
  await userRepository.save(admin);

  // 매니저 사용자 생성
  const managerPassword = await bcrypt.hash('manager1234', 10);
  const manager = userRepository.create({
    email: 'manager@example.com',
    name: '매니저',
    password: managerPassword,
    role: 'manager',
    isActive: true,
    phone: '010-2345-6789',
  });
  await userRepository.save(manager);

  // 일반 직원 사용자 생성
  const staffPassword = await bcrypt.hash('staff1234', 10);
  const staff = userRepository.create({
    email: 'staff@example.com',
    name: '직원',
    password: staffPassword,
    role: 'staff',
    isActive: true,
    phone: '010-3456-7890',
  });
  await userRepository.save(staff);

  // 고객 추가
  const customerRepository = getRepository(Customer);

  // VVIP 고객 샘플
  const vvipCustomer = customerRepository.create({
    name: '김대표',
    email: 'vvip@example.com',
    company: '대형 기업',
    phone: '010-1111-2222',
    status: 'active',
    grade: 'VVIP',
  });
  await customerRepository.save(vvipCustomer);

  // VIP 고객 샘플
  const vipCustomer = customerRepository.create({
    name: '이사장',
    email: 'vip@example.com',
    company: '중형 기업',
    phone: '010-2222-3333',
    status: 'active',
    grade: 'VIP',
  });
  await customerRepository.save(vipCustomer);

  // 일반 고객 샘플
  const regularCustomer = customerRepository.create({
    name: '박과장',
    email: 'regular@example.com',
    company: '소형 기업',
    phone: '010-3333-4444',
    status: 'active',
    grade: '일반',
  });
  await customerRepository.save(regularCustomer);

  // 비활성 고객 샘플
  const inactiveCustomer = customerRepository.create({
    name: '최대리',
    email: 'inactive@example.com',
    company: '개인사업자',
    phone: '010-4444-5555',
    status: 'inactive',
    grade: '일반',
  });
  await customerRepository.save(inactiveCustomer);

  // 고객 요청 추가
  const requestRepository = getRepository(Request);

  // 첫 번째 요청
  const request1 = requestRepository.create({
    title: '제품 문의',
    content: '새로운 제품에 대한 정보를 요청합니다.',
    status: 'open',
    priority: 'high',
    customer: vvipCustomer,
    assignedTo: manager,
  });
  await requestRepository.save(request1);

  // 두 번째 요청
  const request2 = requestRepository.create({
    title: '서비스 장애 문의',
    content: '서비스 이용 중 문제가 발생했습니다.',
    status: 'in_progress',
    priority: 'medium',
    customer: vipCustomer,
    assignedTo: staff,
  });
  await requestRepository.save(request2);

  // 세 번째 요청
  const request3 = requestRepository.create({
    title: '결제 문의',
    content: '결제가 제대로 이루어지지 않았습니다.',
    status: 'resolved',
    priority: 'low',
    customer: regularCustomer,
    assignedTo: staff,
  });
  await requestRepository.save(request3);

  console.log('데이터베이스 시드가 완료되었습니다!');

  await app.close();
}

seed().catch((err) => {
  console.error('시드 생성 중 오류가 발생했습니다:', err);
  process.exit(1);
});
