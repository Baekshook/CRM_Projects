"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../modules/customers/entities/customer.entity");
const singer_entity_1 = require("../modules/singers/entities/singer.entity");
const request_entity_1 = require("../modules/requests/entities/request.entity");
const match_entity_1 = require("../modules/matches/entities/match.entity");
const schedule_entity_1 = require("../modules/schedules/entities/schedule.entity");
const contract_entity_1 = require("../modules/contracts/entities/contract.entity");
const negotiation_log_entity_1 = require("../modules/negotiations/entities/negotiation-log.entity");
const payment_entity_1 = require("../modules/payments/entities/payment.entity");
const review_entity_1 = require("../modules/reviews/entities/review.entity");
const customers = [
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
const singers = [
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
async function seed() {
    try {
        const connection = await (0, typeorm_1.createConnection)({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: process.env.USER || "postgres",
            password: "",
            database: "crm_db",
            entities: [
                customer_entity_1.Customer,
                singer_entity_1.Singer,
                request_entity_1.Request,
                match_entity_1.Match,
                schedule_entity_1.Schedule,
                contract_entity_1.Contract,
                negotiation_log_entity_1.NegotiationLog,
                payment_entity_1.Payment,
                review_entity_1.Review,
            ],
            synchronize: true,
        });
        console.log("데이터베이스에 연결되었습니다.");
        await connection.getRepository(review_entity_1.Review).delete({});
        await connection.getRepository(payment_entity_1.Payment).delete({});
        await connection.getRepository(negotiation_log_entity_1.NegotiationLog).delete({});
        await connection.getRepository(contract_entity_1.Contract).delete({});
        await connection.getRepository(schedule_entity_1.Schedule).delete({});
        await connection.getRepository(match_entity_1.Match).delete({});
        await connection.getRepository(request_entity_1.Request).delete({});
        await connection.getRepository(singer_entity_1.Singer).delete({});
        await connection.getRepository(customer_entity_1.Customer).delete({});
        console.log("기존 데이터가 삭제되었습니다.");
        const customerRepository = connection.getRepository(customer_entity_1.Customer);
        for (const customer of customers) {
            await customerRepository.save(customer);
        }
        console.log(`${customers.length}명의 고객이 추가되었습니다.`);
        const singerRepository = connection.getRepository(singer_entity_1.Singer);
        for (const singer of singers) {
            await singerRepository.save(singer);
        }
        console.log(`${singers.length}명의 가수가 추가되었습니다.`);
        await connection.close();
        console.log("데이터베이스 연결이 종료되었습니다.");
    }
    catch (error) {
        console.error("시드 데이터 추가 중 오류가 발생했습니다:", error);
    }
}
seed();
//# sourceMappingURL=seed.js.map