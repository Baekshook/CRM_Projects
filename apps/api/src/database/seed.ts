import { createConnection } from "typeorm";
import { Customer } from "../modules/customers/entities/customer.entity";
import { Singer } from "../modules/singers/entities/singer.entity";
import { Request } from "../modules/requests/entities/request.entity";
import { Match } from "../modules/matches/entities/match.entity";
import { Schedule } from "../modules/schedules/entities/schedule.entity";
import { Contract } from "../modules/contracts/entities/contract.entity";
import { NegotiationLog } from "../modules/negotiations/entities/negotiation-log.entity";
import { Payment } from "../modules/payments/entities/payment.entity";
import { Review } from "../modules/reviews/entities/review.entity";

// 더미 데이터
const customers: Partial<Customer>[] = [
  {
    type: "customer",
    name: "김민수",
    company: "(주)이벤트 플래닝",
    email: "minsu.kim@eventplanning.com",
    phone: "010-1234-5678",
    profileImage: "/images/customers/customer1.jpg",
    statusMessage: "웨딩 및 기업 행사 전문",
    address: "서울시 강남구 테헤란로 123",
    department: "기획팀",
    grade: 3,
    memo: "웨딩 행사를 주로 담당하며 VIP 고객",
    assignedTo: "이영희 매니저",
    status: "active",
    requestCount: 5,
    lastRequestDate: "2025-02-15",
    contractCount: 3,
    reviewCount: 2,
    registrationDate: "2024-05-15",
    role: "고객",
  },
  {
    type: "customer",
    name: "이지영",
    company: "웨딩 홀 A",
    email: "jiyoung.lee@weddinghall.com",
    phone: "010-2345-6789",
    statusMessage: "월 2-3회 웨딩 행사",
    address: "서울시 서초구 반포대로 45",
    department: "웨딩사업부",
    grade: 3,
    memo: "매달 정기적으로 가수 섭외 요청",
    assignedTo: "김철수 매니저",
    status: "active",
    requestCount: 3,
    lastRequestDate: "2025-03-10",
    contractCount: 1,
    reviewCount: 1,
    registrationDate: "2024-07-10",
    role: "고객",
  },
  {
    type: "customer",
    name: "박준호",
    company: "대학 축제 위원회",
    email: "junho.park@university.edu",
    phone: "010-3456-7890",
    statusMessage: "대학 축제 위원회",
    address: "서울시 서초구 반포대로 45",
    department: "축제 위원회",
    grade: 5,
    memo: "대학 축제 위원회",
    assignedTo: "축제 위원회",
    status: "active",
    requestCount: 1,
    lastRequestDate: "2025-04-10",
    contractCount: 0,
    reviewCount: 0,
    registrationDate: "2024-08-15",
    role: "고객",
  },
];

const singers: Partial<Singer>[] = [
  {
    name: "김태희",
    agency: "스타 엔터테인먼트",
    genre: "발라드",
    email: "taehee.kim@singers.com",
    phone: "010-9876-5432",
    profileImage: "/images/singers/singer1.jpg",
    statusMessage: "웨딩 축가 전문",
    address: "서울시 마포구 월드컵북로 50",
    grade: 4,
    rating: 4.8,
    status: "active",
    contractCount: 6,
    lastRequestDate: "2024-03-15",
    reviewCount: 5,
    registrationDate: "2023-10-01",
    role: "가수",
    genres: ["발라드", "팝"],
    experience: 5,
    price: 2000000,
  },
  {
    name: "이준호",
    agency: "뮤직 프로덕션",
    genre: "팝",
    email: "junho.lee@singers.com",
    phone: "010-8765-4321",
    profileImage: "/images/singers/singer2.jpg",
    statusMessage: "기업 행사 및 축제 전문",
    address: "서울시 용산구 이태원로 30",
    grade: 2,
    rating: 4.5,
    status: "active",
    contractCount: 2,
    lastRequestDate: "2024-03-10",
    reviewCount: 2,
    registrationDate: "2024-01-15",
    role: "가수",
    genres: ["힙합", "R&B"],
    experience: 3,
    price: 1500000,
  },
];

// 시드 함수
async function seed() {
  try {
    const connection = await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: process.env.USER || "postgres",
      password: "",
      database: "crm_db",
      entities: [
        Customer,
        Singer,
        Request,
        Match,
        Schedule,
        Contract,
        NegotiationLog,
        Payment,
        Review,
      ],
      synchronize: true,
    });

    console.log("데이터베이스에 연결되었습니다.");

    // 기존 데이터 삭제
    await connection.getRepository(Review).delete({});
    await connection.getRepository(Payment).delete({});
    await connection.getRepository(NegotiationLog).delete({});
    await connection.getRepository(Contract).delete({});
    await connection.getRepository(Schedule).delete({});
    await connection.getRepository(Match).delete({});
    await connection.getRepository(Request).delete({});
    await connection.getRepository(Singer).delete({});
    await connection.getRepository(Customer).delete({});

    console.log("기존 데이터가 삭제되었습니다.");

    // 고객 데이터 추가
    const customerRepository = connection.getRepository(Customer);
    for (const customer of customers) {
      await customerRepository.save(customer);
    }
    console.log(`${customers.length}명의 고객이 추가되었습니다.`);

    // 가수 데이터 추가
    const singerRepository = connection.getRepository(Singer);
    for (const singer of singers) {
      await singerRepository.save(singer);
    }
    console.log(`${singers.length}명의 가수가 추가되었습니다.`);

    await connection.close();
    console.log("데이터베이스 연결이 종료되었습니다.");
  } catch (error) {
    console.error("시드 데이터 추가 중 오류가 발생했습니다:", error);
  }
}

seed();
