import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { Request } from '../../requests/entities/request.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // 사용자 생성
    const userRepository = dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'admin@example.com',
        name: '관리자',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        phone: '010-1234-5678',
      },
      {
        email: 'manager@example.com',
        name: '매니저',
        password: hashedPassword,
        role: 'manager',
        isActive: true,
        phone: '010-2345-6789',
      },
      {
        email: 'staff@example.com',
        name: '스태프',
        password: hashedPassword,
        role: 'staff',
        isActive: true,
        phone: '010-3456-7890',
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      if (!existingUser) {
        await userRepository.save(userData);
      }
    }

    // 고객 생성
    const customerRepository = dataSource.getRepository(Customer);
    const customers = [
      {
        name: '김고객',
        email: 'kim@example.com',
        company: '김회사',
        phone: '010-1111-2222',
        status: 'active',
        grade: 'VVIP',
      },
      {
        name: '이고객',
        email: 'lee@example.com',
        company: '이회사',
        phone: '010-3333-4444',
        status: 'active',
        grade: 'VIP',
      },
      {
        name: '박고객',
        email: 'park@example.com',
        company: '박회사',
        phone: '010-5555-6666',
        status: 'active',
        grade: '일반',
      },
      {
        name: '최고객',
        email: 'choi@example.com',
        company: '최회사',
        phone: '010-7777-8888',
        status: 'inactive',
        grade: '일반',
      },
    ];

    for (const customerData of customers) {
      try {
        const existingCustomer = await customerRepository
          .createQueryBuilder('customer')
          .where('customer.email = :email', { email: customerData.email })
          .getOne();

        if (!existingCustomer) {
          await customerRepository.save(customerData);
        }
      } catch (error) {
        console.error(`고객 ${customerData.email} 저장 중 오류 발생:`, error);
      }
    }

    // 요청 생성
    const requestRepository = dataSource.getRepository(Request);
    const staffUser = await userRepository.findOne({
      where: { email: 'staff@example.com' },
    });
    const vipCustomer = await customerRepository
      .createQueryBuilder('customer')
      .where('customer.email = :email', { email: 'lee@example.com' })
      .getOne();

    if (staffUser && vipCustomer) {
      const requests = [
        {
          title: '서비스 문의',
          content: '서비스 이용 방법에 대해 문의드립니다.',
          status: 'open',
          priority: 'medium',
          customer: vipCustomer,
          assignedTo: staffUser,
        },
        {
          title: '기술 지원 요청',
          content: '시스템 오류가 발생했습니다.',
          status: 'in_progress',
          priority: 'high',
          customer: vipCustomer,
          assignedTo: staffUser,
        },
        {
          title: '계약 문의',
          content: '새로운 계약에 대해 논의하고 싶습니다.',
          status: 'open',
          priority: 'low',
          customer: vipCustomer,
          assignedTo: staffUser,
        },
      ];

      for (const requestData of requests) {
        try {
          const existingRequest = await requestRepository
            .createQueryBuilder('request')
            .where('request.title = :title', { title: requestData.title })
            .andWhere('request.customer_id = :customerId', {
              customerId: vipCustomer.id,
            })
            .getOne();

          if (!existingRequest) {
            await requestRepository.save(requestData);
          }
        } catch (error) {
          console.error(`요청 ${requestData.title} 저장 중 오류 발생:`, error);
        }
      }
    }

    console.log('시드 데이터가 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('시드 생성 중 오류가 발생했습니다:', error);
  } finally {
    await app.close();
  }
}

seed();
