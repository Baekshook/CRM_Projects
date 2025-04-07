import { NextResponse } from "next/server";

export async function GET() {
  // 고객 세그먼트 더미 데이터
  const data = {
    segments: [
      {
        id: "1",
        name: "VIP 고객",
        description: "연간 계약 규모가 5,000만원 이상인 고객",
        criteria: "contract_value >= 50000000",
        customerCount: 15,
        createdAt: "2022-11-10T08:15:30Z",
        updatedAt: "2023-01-05T14:22:18Z",
      },
      {
        id: "2",
        name: "신규 고객",
        description: "최근 6개월 내 첫 계약을 체결한 고객",
        criteria: "first_contract_date >= now() - interval 6 month",
        customerCount: 28,
        createdAt: "2022-12-15T10:30:45Z",
        updatedAt: "2023-01-10T09:45:22Z",
      },
      {
        id: "3",
        name: "휴면 고객",
        description: "1년 이상 계약이 없는 고객",
        criteria: "last_contract_date <= now() - interval 1 year",
        customerCount: 42,
        createdAt: "2022-10-20T11:25:33Z",
        updatedAt: "2022-12-28T16:40:15Z",
      },
    ],
    total: 3,
  };

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 새 세그먼트 생성 로직 (실제로는 DB에 저장)
    const newSegment = {
      id: Date.now().toString(),
      ...body,
      customerCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newSegment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "세그먼트 생성 실패" }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
