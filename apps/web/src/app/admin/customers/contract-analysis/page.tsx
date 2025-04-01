"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";
import {
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";
import { Entity } from "@/components/customers/types";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

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
  const [period, setPeriod] = useState<"month" | "quarter">("month");
  const [chartData, setChartData] = useState<{
    monthly: ChartData;
    category: ChartData;
    type: ChartData;
    quarterly: QuarterlyData[];
  }>({
    monthly: { labels: [], datasets: [] },
    category: { labels: [], datasets: [] },
    type: { labels: [], datasets: [] },
    quarterly: [],
  });
  const [topCustomers, setTopCustomers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);
  const [topSingers, setTopSingers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);

  // 계약 데이터 로드
  useEffect(() => {
    try {
      setIsLoading(true);
      // API 호출 대신 더미 데이터 사용
      const dummyContracts = generateDummyContracts();
      setContracts(dummyContracts);

      // 차트 데이터 계산
      const monthlyData = calculateMonthlyData(dummyContracts);
      const categoryData = calculateCategoryData(dummyContracts);
      const typeData = calculateTypeData(dummyContracts);
      const quarterlyData = calculateQuarterlyData(dummyContracts);

      setChartData({
        monthly: monthlyData,
        category: categoryData,
        type: typeData,
        quarterly: quarterlyData,
      });

      // Top 고객 및 가수 계산
      setTopCustomers(calculateTopCustomers(dummyContracts));
      setTopSingers(calculateTopSingers(dummyContracts));
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      toast.error("계약 분석 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="계약 분석" />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">
          계약 현황 및 추세 분석
        </h2>
        <p className="text-black mt-1">
          계약 데이터를 시각화하여 트렌드와 인사이트를 확인합니다.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-orange-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-black">로딩 중...</p>
        </div>
      ) : (
        <>
          {/* 기간별 계약 추이 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-black">기간별 계약 추이</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPeriod("month")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    period === "month"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  월별
                </button>
                <button
                  onClick={() => setPeriod("quarter")}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    period === "quarter"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  분기별
                </button>
              </div>
            </div>

            {period === "month" && (
              <div className="h-80">
                <ResponsiveBar
                  data={chartData.monthly.labels.map((label, i) => ({
                    month: label,
                    count: chartData.monthly.datasets[0].data[i],
                    amount: chartData.monthly.datasets[1].data[i],
                  }))}
                  keys={["count", "amount"]}
                  indexBy="month"
                  margin={{ top: 10, right: 130, bottom: 70, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  indexScale={{ type: "band", round: true }}
                  colors={["#FB923C", "#38BDF8"]}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 45,
                    legend: "월",
                    legendPosition: "middle",
                    legendOffset: 60,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "계약수 / 금액 (백만원)",
                    legendPosition: "middle",
                    legendOffset: -50,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: "left-to-right",
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemOpacity: 1,
                          },
                        },
                      ],
                      data: [
                        {
                          id: "count",
                          label: "계약 수",
                        },
                        {
                          id: "amount",
                          label: "계약 금액",
                        },
                      ],
                    },
                  ]}
                  role="application"
                  ariaLabel="계약 추이 차트"
                />
              </div>
            )}

            {period === "quarter" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        분기
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        계약 수
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        총 계약 금액
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        평균 계약 금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chartData.quarterly.map((quarter, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {quarter.quarter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {quarter.contractCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatCurrency(quarter.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatCurrency(quarter.averageAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 카테고리별 계약 분포 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-black">
                카테고리별 계약 분포
              </h3>
              <div className="h-72">
                <ResponsivePie
                  data={chartData.category.labels.map((label, i) => ({
                    id: label,
                    label,
                    value: chartData.category.datasets[0].data[i],
                  }))}
                  margin={{ top: 30, right: 80, bottom: 80, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ scheme: "category10" }}
                  borderWidth={1}
                  borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{
                    from: "color",
                    modifiers: [["darker", 2]],
                  }}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: "#999",
                      itemDirection: "left-to-right",
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: "circle",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>

            {/* 계약 유형별 분포 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-black">
                계약 유형별 분포
              </h3>
              <div className="h-72">
                <ResponsiveBar
                  data={chartData.type.labels.map((label, i) => ({
                    type: label,
                    count: chartData.type.datasets[0].data[i],
                  }))}
                  keys={["count"]}
                  indexBy="type"
                  margin={{ top: 20, right: 10, bottom: 50, left: 60 }}
                  padding={0.3}
                  colors={{ scheme: "category10" }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "유형",
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "계약 수",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
                  role="application"
                  ariaLabel="유형별 계약 수"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* 상위 고객 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-black">
                상위 고객 (계약 금액)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        고객명
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                      >
                        계약 수
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                      >
                        총 계약 금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topCustomers.map((customer, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {customer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-black">
                          {customer.contractCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-black">
                          {formatCurrency(customer.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 상위 가수 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 text-black">
                상위 가수 (계약 금액)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                      >
                        가수명
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                      >
                        계약 수
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                      >
                        총 계약 금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSingers.map((singer, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {singer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-black">
                          {singer.contractCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-black">
                          {formatCurrency(singer.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
