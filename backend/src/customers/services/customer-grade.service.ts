import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';

interface CustomerActivity {
  requestCount: number;
}

@Injectable()
export class CustomerGradeService {
  /**
   * 고객의 요청 건수에 따라 적절한 등급을 결정합니다.
   * @param activity 고객의 활동 데이터 (요청 수)
   * @returns 새로운 고객 등급
   */
  calculateCustomerGrade(activity: CustomerActivity): string {
    // 요청 건수가 1건 이상이면 '일반' 등급
    if (activity.requestCount >= 1) {
      return '일반';
    }
    return '신규';
  }

  /**
   * 고객 정보와 활동 데이터를 받아서 등급을 업데이트합니다.
   * @param customer 고객 엔티티
   * @param activity 고객의 활동 데이터
   * @returns 업데이트된 고객 엔티티
   */
  updateCustomerGrade(
    customer: Customer,
    activity: CustomerActivity,
  ): Customer {
    const newGrade = this.calculateCustomerGrade(activity);

    // 등급이 변경된 경우에만 업데이트
    if (customer.grade !== newGrade) {
      customer.grade = newGrade;
    }

    return customer;
  }
}
