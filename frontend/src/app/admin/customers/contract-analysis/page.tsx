"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";
import {
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";
import { Entity } from "@/components/customers/types";

// 차트 데이터 타입 정의
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
}

// 더미 계약 데이터
interface Contract {
  id: string;
  customerId: string;
  singerId: string;
  customerName: string;
  singerName: string;
  date: string;
  amount: number;
  status: "pending" | "completed" | "canceled";
  type: string;
  category: string;
}

// 분기별 데이터
interface QuarterlyData {
  quarter: string;
  contractCount: number;
  totalAmount: number;
  averageAmount: number;
}

// 더미 계약 데이터 생성
const generateDummyContracts = (): Contract[] => {
  const contractTypes = ["공연", "행사", "축제", "프로모션", "기업행사"];
  const categories = ["대형", "중형", "소형"];
  const contracts: Contract[] = [];

  // 현재 연도와 월 구하기
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // 지난 12개월 동안의 계약 생성
  for (let i = 0; i < 150; i++) {
    const randomCustomer =
      dummyCustomers[Math.floor(Math.random() * dummyCustomers.length)];
    const randomSinger =
      dummySingers[Math.floor(Math.random() * dummySingers.length)];
    const randomMonthsAgo = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1;

    const contractDate = new Date(
      currentYear,
      currentMonth - randomMonthsAgo,
      randomDay
    );
    const amount = Math.floor(Math.random() * 9000000) + 1000000; // 1백만원 ~ 1천만원

    contracts.push({
      id: `contract-${i}`,
      customerId: randomCustomer.id,
      singerId: randomSinger.id,
      customerName: randomCustomer.name,
      singerName: randomSinger.name,
      date: contractDate.toISOString(),
      amount: amount,
      status:
        Math.random() > 0.2
          ? Math.random() > 0.3
            ? "completed"
            : "pending"
          : "canceled",
      type: contractTypes[Math.floor(Math.random() * contractTypes.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }

  return contracts;
};

// 월별 데이터 계산
const calculateMonthlyData = (contracts: Contract[]): ChartData => {
  const last12Months: string[] = [];
  const contractCounts: number[] = [];
  const totalAmounts: number[] = [];

  // 지난 12개월의 레이블 생성
  const currentDate = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const monthLabel = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    last12Months.push(monthLabel);

    const monthlyContracts = contracts.filter((contract) => {
      const contractDate = new Date(contract.date);
      return (
        contractDate.getFullYear() === date.getFullYear() &&
        contractDate.getMonth() === date.getMonth()
      );
    });

    contractCounts.push(monthlyContracts.length);
    totalAmounts.push(
      monthlyContracts.reduce((sum, contract) => sum + contract.amount, 0) /
        1000000
    ); // 단위: 백만원
  }

  return {
    labels: last12Months,
    datasets: [
      {
        label: "계약 수",
        data: contractCounts,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "계약 금액 (백만원)",
        data: totalAmounts,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };
};

// 카테고리별 데이터 계산
const calculateCategoryData = (contracts: Contract[]): ChartData => {
  const categories = Array.from(
    new Set(contracts.map((contract) => contract.category))
  );
  const amounts: number[] = [];
  const counts: number[] = [];

  categories.forEach((category) => {
    const categoryContracts = contracts.filter(
      (contract) => contract.category === category
    );
    counts.push(categoryContracts.length);
    amounts.push(
      categoryContracts.reduce((sum, contract) => sum + contract.amount, 0) /
        1000000
    ); // 단위: 백만원
  });

  return {
    labels: categories,
    datasets: [
      {
        label: "계약 금액 (백만원)",
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };
};

// 계약 유형별 데이터 계산
const calculateTypeData = (contracts: Contract[]): ChartData => {
  const types = Array.from(new Set(contracts.map((contract) => contract.type)));
  const counts: number[] = [];

  types.forEach((type) => {
    counts.push(contracts.filter((contract) => contract.type === type).length);
  });

  return {
    labels: types,
    datasets: [
      {
        label: "계약 수",
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
      },
    ],
  };
};

// 분기별 데이터 계산
const calculateQuarterlyData = (contracts: Contract[]): QuarterlyData[] => {
  const quarters: Record<string, { contracts: Contract[]; quarter: string }> =
    {};
  const currentYear = new Date().getFullYear();

  // 지난 4분기 정의
  const lastQuarters = [
    {
      quarter: `${currentYear}년 1분기`,
      year: currentYear,
      startMonth: 0,
      endMonth: 2,
    },
    {
      quarter: `${currentYear}년 2분기`,
      year: currentYear,
      startMonth: 3,
      endMonth: 5,
    },
    {
      quarter: `${currentYear}년 3분기`,
      year: currentYear,
      startMonth: 6,
      endMonth: 8,
    },
    {
      quarter: `${currentYear}년 4분기`,
      year: currentYear,
      startMonth: 9,
      endMonth: 11,
    },
  ];

  // 각 분기에 해당하는 계약 필터링
  lastQuarters.forEach((q) => {
    quarters[q.quarter] = {
      quarter: q.quarter,
      contracts: contracts.filter((contract) => {
        const date = new Date(contract.date);
        return (
          date.getFullYear() === q.year &&
          date.getMonth() >= q.startMonth &&
          date.getMonth() <= q.endMonth
        );
      }),
    };
  });

  // 분기별 데이터 계산
  return Object.values(quarters).map((q) => {
    const totalAmount = q.contracts.reduce(
      (sum, contract) => sum + contract.amount,
      0
    );
    return {
      quarter: q.quarter,
      contractCount: q.contracts.length,
      totalAmount: totalAmount,
      averageAmount:
        q.contracts.length > 0 ? totalAmount / q.contracts.length : 0,
    };
  });
};

// 상위 고객 계산
const calculateTopCustomers = (
  contracts: Contract[],
  limit = 5
): { name: string; totalAmount: number; contractCount: number }[] => {
  const customerMap: Record<
    string,
    { name: string; totalAmount: number; contractCount: number }
  > = {};

  contracts.forEach((contract) => {
    if (!customerMap[contract.customerId]) {
      customerMap[contract.customerId] = {
        name: contract.customerName,
        totalAmount: 0,
        contractCount: 0,
      };
    }

    customerMap[contract.customerId].totalAmount += contract.amount;
    customerMap[contract.customerId].contractCount += 1;
  });

  return Object.values(customerMap)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, limit);
};

// 상위 가수 계산
const calculateTopSingers = (
  contracts: Contract[],
  limit = 5
): { name: string; totalAmount: number; contractCount: number }[] => {
  const singerMap: Record<
    string,
    { name: string; totalAmount: number; contractCount: number }
  > = {};

  contracts.forEach((contract) => {
    if (!singerMap[contract.singerId]) {
      singerMap[contract.singerId] = {
        name: contract.singerName,
        totalAmount: 0,
        contractCount: 0,
      };
    }

    singerMap[contract.singerId].totalAmount += contract.amount;
    singerMap[contract.singerId].contractCount += 1;
  });

  return Object.values(singerMap)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, limit);
};

// 금액 포맷 함수
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

export default function ContractAnalysisPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<ChartData | null>(null);
  const [categoryData, setCategoryData] = useState<ChartData | null>(null);
  const [typeData, setTypeData] = useState<ChartData | null>(null);
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);
  const [topCustomers, setTopCustomers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);
  const [topSingers, setTopSingers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);
  const [timeRange, setTimeRange] = useState<
    "all" | "6months" | "3months" | "1month"
  >("all");

  // 계약 데이터 로드
  useEffect(() => {
    try {
      setIsLoading(true);
      // API 호출 대신 더미 데이터 생성
      const dummyContracts = generateDummyContracts();
      setContracts(dummyContracts);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      toast.error("계약 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 차트 데이터 계산
  useEffect(() => {
    if (contracts.length === 0) return;

    // 시간 범위에 따라 필터링
    let filteredContracts = [...contracts];
    const now = new Date();

    if (timeRange === "6months") {
      const sixMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        now.getDate()
      );
      filteredContracts = contracts.filter(
        (c) => new Date(c.date) >= sixMonthsAgo
      );
    } else if (timeRange === "3months") {
      const threeMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 3,
        now.getDate()
      );
      filteredContracts = contracts.filter(
        (c) => new Date(c.date) >= threeMonthsAgo
      );
    } else if (timeRange === "1month") {
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      filteredContracts = contracts.filter(
        (c) => new Date(c.date) >= oneMonthAgo
      );
    }

    setMonthlyData(calculateMonthlyData(filteredContracts));
    setCategoryData(calculateCategoryData(filteredContracts));
    setTypeData(calculateTypeData(filteredContracts));
    setQuarterlyData(calculateQuarterlyData(filteredContracts));
    setTopCustomers(calculateTopCustomers(filteredContracts));
    setTopSingers(calculateTopSingers(filteredContracts));
  }, [contracts, timeRange]);

  // 총 계약 금액 및 평균 계산
  const totalContractAmount = contracts.reduce(
    (sum, contract) => sum + contract.amount,
    0
  );
  const averageContractAmount =
    contracts.length > 0 ? totalContractAmount / contracts.length : 0;
  const completedContractCount = contracts.filter(
    (c) => c.status === "completed"
  ).length;
  const pendingContractCount = contracts.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="계약 분석"
        description="고객 및 가수와의 계약 현황을 분석하고 통계를 확인합니다."
        actions={
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">기간:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm"
            >
              <option value="all">전체 기간</option>
              <option value="6months">최근 6개월</option>
              <option value="3months">최근 3개월</option>
              <option value="1month">최근 1개월</option>
            </select>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 개요 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    총 계약 수
                  </p>
                  <p className="text-2xl font-semibold">{contracts.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    총 계약 금액
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(totalContractAmount)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    완료된 계약
                  </p>
                  <p className="text-2xl font-semibold">
                    {completedContractCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    진행 중인 계약
                  </p>
                  <p className="text-2xl font-semibold">
                    {pendingContractCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 월별 추이 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">월별 계약 추이</h2>
            <div className="h-64">
              {/* 실제 환경에서는 차트 라이브러리(예: Chart.js, Recharts) 사용 */}
              <div className="flex h-full items-end space-x-1">
                {monthlyData &&
                  monthlyData.datasets[0].data.map((count, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-orange-500 hover:bg-orange-600 transition-colors rounded-t"
                        style={{
                          height: `${Math.max(
                            5,
                            (count /
                              Math.max(...monthlyData.datasets[0].data)) *
                              100
                          )}%`,
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-600 transform -rotate-45 origin-top-left">
                        {monthlyData.labels[index]}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* 분기별 통계 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">분기별 계약 통계</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      분기
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      계약 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      총 계약 금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평균 계약 금액
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quarterlyData.map((quarter, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {quarter.quarter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quarter.contractCount}건
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(quarter.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(quarter.averageAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 차트 및 통계 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 계약 유형 분포 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">계약 유형 분포</h2>
              <div className="h-64 flex justify-center items-center">
                {/* 실제 환경에서는 Pie 차트로 표현 */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  {typeData &&
                    typeData.labels.map((type, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor: Array.isArray(
                              typeData.datasets[0].backgroundColor
                            )
                              ? typeData.datasets[0].backgroundColor[index]
                              : typeData.datasets[0].backgroundColor,
                          }}
                        ></div>
                        <div className="text-sm">
                          {type}: {typeData.datasets[0].data[index]}건
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* 계약 카테고리별 금액 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                카테고리별 계약 금액
              </h2>
              <div className="h-64">
                {/* 실제 환경에서는 Bar 차트로 표현 */}
                <div className="flex flex-col h-full justify-end">
                  {categoryData &&
                    categoryData.labels.map((category, index) => (
                      <div key={index} className="flex items-center my-2">
                        <div className="w-24 text-sm text-gray-600">
                          {category}
                        </div>
                        <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                (categoryData.datasets[0].data[index] /
                                  Math.max(...categoryData.datasets[0].data)) *
                                  100
                              )}%`,
                              backgroundColor: Array.isArray(
                                categoryData.datasets[0].backgroundColor
                              )
                                ? categoryData.datasets[0].backgroundColor[
                                    index
                                  ]
                                : categoryData.datasets[0].backgroundColor,
                            }}
                          ></div>
                        </div>
                        <div className="w-24 text-right text-sm">
                          {formatCurrency(
                            categoryData.datasets[0].data[index] * 1000000
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* 상위 고객 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">상위 고객</h2>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{customer.name}</div>
                      <div className="text-xs text-gray-500">
                        계약 {customer.contractCount}건
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(customer.totalAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 상위 가수 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">상위 가수</h2>
              <div className="space-y-4">
                {topSingers.map((singer, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                      <span className="text-sm font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{singer.name}</div>
                      <div className="text-xs text-gray-500">
                        계약 {singer.contractCount}건
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(singer.totalAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
