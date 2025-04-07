import { NextResponse } from "next/server";

export async function GET() {
  // 고객 상호작용 데이터 더미
  const data = {
    interactions: [
      {
        id: "1",
        customerId: "1",
        customerName: "삼성전자",
        type: "email",
        description: "견적서 요청",
        date: "2023-01-15T09:23:15Z",
        status: "completed",
      },
      {
        id: "2",
        customerId: "2",
        customerName: "현대그룹",
        type: "call",
        description: "행사 일정 조율",
        date: "2023-01-18T14:30:00Z",
        status: "completed",
      },
      {
        id: "3",
        customerId: "3",
        customerName: "SK그룹",
        type: "meeting",
        description: "계약 조건 논의",
        date: "2023-01-20T10:00:00Z",
        status: "scheduled",
      },
    ],
    total: 3,
  };

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 새 상호작용 데이터 생성 로직 (실제로는 DB에 저장)
    const newInteraction = {
      id: Date.now().toString(),
      ...body,
      date: new Date().toISOString(),
      status: "scheduled",
    };

    return NextResponse.json(newInteraction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "상호작용 데이터 생성 실패" },
      { status: 400 }
    );
  }
}

export const dynamic = "force-dynamic";
