"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

// 동적으로 불러오기
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((mod) => mod.ResponsiveBar),
  { ssr: false }
);
const ResponsivePie = dynamic(
  () => import("@nivo/pie").then((mod) => mod.ResponsivePie),
  { ssr: false }
);

import {
  Contract,
  ChartData,
  QuarterlyData,
  getContracts,
  getMonthlyStats,
  getCategoryStats,
  getTypeStats,
  getQuarterlyStats,
  getTopCustomers,
  getTopSingers,
} from "@/services/contractsApi";

// 통화 포맷팅 함수
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ContractAnalysisPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("last12Months");
  const [dashboardData, setDashboardData] = useState({
    totalContractsCount: 0,
    totalAmount: 0,
    averageAmount: 0,
    completedContractsCount: 0,
    pendingContractsCount: 0,
    canceledContractsCount: 0,
  });
  const [monthlyData, setMonthlyData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [categoryData, setCategoryData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [typeData, setTypeData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);
  const [topCustomers, setTopCustomers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);
  const [topSingers, setTopSingers] = useState<
    { name: string; totalAmount: number; contractCount: number }[]
  >([]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // 필터링된 계약 목록 가져오기 (필요한 경우 날짜 필터 추가)
      const contractsData = await getContracts();
      setContracts(contractsData);

      // 각종 통계 데이터 가져오기
      try {
        // 월별 데이터 가져오기
        const monthlyStats = await getMonthlyStats();
        setMonthlyData(monthlyStats);
      } catch (error) {
        console.error("월별 통계 데이터 로드 오류:", error);
        // API가 아직 구현되지 않은 경우를 대비해 더미 데이터 생성
        setMonthlyData(calculateMonthlyData(contractsData));
      }

      try {
        // 카테고리별 데이터 가져오기
        const categoryStats = await getCategoryStats();
        setCategoryData(categoryStats);
      } catch (error) {
        console.error("카테고리별 통계 데이터 로드 오류:", error);
        setCategoryData(calculateCategoryData(contractsData));
      }

      try {
        // 계약 유형별 데이터 가져오기
        const typeStats = await getTypeStats();
        setTypeData(typeStats);
      } catch (error) {
        console.error("유형별 통계 데이터 로드 오류:", error);
        setTypeData(calculateTypeData(contractsData));
      }

      try {
        // 분기별 데이터 가져오기
        const quarterlyStats = await getQuarterlyStats();
        setQuarterlyData(quarterlyStats);
      } catch (error) {
        console.error("분기별 통계 데이터 로드 오류:", error);
        setQuarterlyData(calculateQuarterlyData(contractsData));
      }

      try {
        // 최다 계약 고객 데이터 가져오기
        const topCustomersData = await getTopCustomers(5);
        setTopCustomers(topCustomersData);
      } catch (error) {
        console.error("최다 계약 고객 데이터 로드 오류:", error);
        setTopCustomers(calculateTopCustomers(contractsData));
      }

      try {
        // 최다 계약 가수 데이터 가져오기
        const topSingersData = await getTopSingers(5);
        setTopSingers(topSingersData);
      } catch (error) {
        console.error("최다 계약 가수 데이터 로드 오류:", error);
        setTopSingers(calculateTopSingers(contractsData));
      }

      // 대시보드 요약 데이터 계산
      const totalAmount = contractsData.reduce(
        (sum, contract) => sum + contract.amount,
        0
      );
      const completedContracts = contractsData.filter(
        (c) => c.status === "completed"
      );
      const pendingContracts = contractsData.filter(
        (c) => c.status === "pending"
      );
      const canceledContracts = contractsData.filter(
        (c) => c.status === "canceled"
      );

      setDashboardData({
        totalContractsCount: contractsData.length,
        totalAmount,
        averageAmount:
          contractsData.length > 0 ? totalAmount / contractsData.length : 0,
        completedContractsCount: completedContracts.length,
        pendingContractsCount: pendingContracts.length,
        canceledContractsCount: canceledContracts.length,
      });
    } catch (error) {
      console.error("분석 데이터 로드 오류:", error);
      toast.error("계약 분석 데이터를 불러오는데 실패했습니다.");

      // API가 완전히 실패한 경우 로컬 계산으로 폴백
      const dummyContracts = generateDummyContracts();
      setContracts(dummyContracts);
      setMonthlyData(calculateMonthlyData(dummyContracts));
      setCategoryData(calculateCategoryData(dummyContracts));
      setTypeData(calculateTypeData(dummyContracts));
      setQuarterlyData(calculateQuarterlyData(dummyContracts));
      setTopCustomers(calculateTopCustomers(dummyContracts));
      setTopSingers(calculateTopSingers(dummyContracts));

      const totalAmount = dummyContracts.reduce(
        (sum, contract) => sum + contract.amount,
        0
      );
      setDashboardData({
        totalContractsCount: dummyContracts.length,
        totalAmount,
        averageAmount:
          dummyContracts.length > 0 ? totalAmount / dummyContracts.length : 0,
        completedContractsCount: dummyContracts.filter(
          (c) => c.status === "completed"
        ).length,
        pendingContractsCount: dummyContracts.filter(
          (c) => c.status === "pending"
        ).length,
        canceledContractsCount: dummyContracts.filter(
          (c) => c.status === "canceled"
        ).length,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 더미 계약 데이터 생성 (API 실패 시 폴백용)
  const generateDummyContracts = (): Contract[] => {
    const contractTypes = ["공연", "행사", "축제", "프로모션", "기업행사"];
    const categories = ["대형", "중형", "소형"];
    const contracts: Contract[] = [];

    const customers = [
      { id: "cust-1", name: "김민수" },
      { id: "cust-2", name: "이지영" },
      { id: "cust-3", name: "박준호" },
    ];

    const singers = [
      { id: "singer-1", name: "김태희" },
      { id: "singer-2", name: "이준호" },
      { id: "singer-3", name: "박서연" },
    ];

    // 현재 연도와 월 구하기
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // 지난 12개월 동안의 계약 생성
    for (let i = 0; i < 150; i++) {
      const randomCustomer =
        customers[Math.floor(Math.random() * customers.length)];
      const randomSinger = singers[Math.floor(Math.random() * singers.length)];
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

  // 월별 데이터 계산 헬퍼 함수
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

  // 카테고리별 데이터 계산 헬퍼 함수
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

  // 계약 유형별 데이터 계산 헬퍼 함수
  const calculateTypeData = (contracts: Contract[]): ChartData => {
    const types = Array.from(
      new Set(contracts.map((contract) => contract.type))
    );
    const counts: number[] = [];

    types.forEach((type) => {
      counts.push(
        contracts.filter((contract) => contract.type === type).length
      );
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

  // 분기별 데이터 계산 헬퍼 함수
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
          const contractDate = new Date(contract.date);
          return (
            contractDate.getFullYear() === q.year &&
            contractDate.getMonth() >= q.startMonth &&
            contractDate.getMonth() <= q.endMonth
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
        totalAmount,
        averageAmount:
          q.contracts.length > 0 ? totalAmount / q.contracts.length : 0,
      };
    });
  };

  // 최다 계약 고객 계산 헬퍼 함수
  const calculateTopCustomers = (
    contracts: Contract[],
    limit = 5
  ): { name: string; totalAmount: number; contractCount: number }[] => {
    const customers: Record<
      string,
      { name: string; totalAmount: number; contractCount: number }
    > = {};

    // 고객별 계약 집계
    contracts.forEach((contract) => {
      if (!customers[contract.customerId]) {
        customers[contract.customerId] = {
          name: contract.customerName || contract.customerId,
          totalAmount: 0,
          contractCount: 0,
        };
      }

      customers[contract.customerId].totalAmount += contract.amount;
      customers[contract.customerId].contractCount += 1;
    });

    // 계약 금액 기준으로 정렬
    return Object.values(customers)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  };

  // 최다 계약 가수 계산 헬퍼 함수
  const calculateTopSingers = (
    contracts: Contract[],
    limit = 5
  ): { name: string; totalAmount: number; contractCount: number }[] => {
    const singers: Record<
      string,
      { name: string; totalAmount: number; contractCount: number }
    > = {};

    // 가수별 계약 집계
    contracts.forEach((contract) => {
      if (!singers[contract.singerId]) {
        singers[contract.singerId] = {
          name: contract.singerName || contract.singerId,
          totalAmount: 0,
          contractCount: 0,
        };
      }

      singers[contract.singerId].totalAmount += contract.amount;
      singers[contract.singerId].contractCount += 1;
    });

    // 계약 금액 기준으로 정렬
    return Object.values(singers)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  };

  // 실제 UI 렌더링
  return (
    <div className="p-4 md:p-8">
      <PageHeader title="계약 분석" />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-gray-500">데이터 로딩 중...</div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 시간 범위 선택 */}
          <div className="flex justify-end mb-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="last12Months">최근 12개월</option>
              <option value="thisYear">올해</option>
              <option value="lastYear">작년</option>
              <option value="allTime">전체 기간</option>
            </select>
          </div>

          {/* 주요 통계 카드 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                계약 현황
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">총 계약 수</p>
                  <p className="text-3xl font-bold">
                    {dashboardData.totalContractsCount}건
                  </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">완료</p>
                    <p className="text-xl font-semibold text-green-600">
                      {dashboardData.completedContractsCount}건
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">대기 중</p>
                    <p className="text-xl font-semibold text-blue-600">
                      {dashboardData.pendingContractsCount}건
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">취소</p>
                    <p className="text-xl font-semibold text-red-600">
                      {dashboardData.canceledContractsCount}건
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                계약 금액
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">총 계약 금액</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(dashboardData.totalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">평균 계약 금액</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(dashboardData.averageAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                분기별 동향
              </h3>
              <div className="space-y-2">
                {quarterlyData.map((quarter) => (
                  <div key={quarter.quarter} className="flex justify-between">
                    <p className="text-sm font-medium">{quarter.quarter}</p>
                    <p className="text-sm font-semibold">
                      {quarter.contractCount}건 (
                      {formatCurrency(quarter.totalAmount)})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 월별 계약 추이 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              월별 계약 추이
            </h3>
            <div className="h-96">
              {monthlyData.labels.length > 0 && (
                <ResponsiveBar
                  data={monthlyData.labels.map((label, index) => ({
                    month: label,
                    "계약 수": monthlyData.datasets[0].data[index],
                    "계약 금액": monthlyData.datasets[1].data[index],
                  }))}
                  keys={["계약 수", "계약 금액"]}
                  indexBy="month"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: "linear" }}
                  colors={{ scheme: "nivo" }}
                  borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: "월",
                    legendPosition: "middle",
                    legendOffset: 40,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "수량 / 금액(백만원)",
                    legendPosition: "middle",
                    legendOffset: -40,
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{
                    from: "color",
                    modifiers: [["darker", 1.6]],
                  }}
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
                    },
                  ]}
                  animate={true}
                />
              )}
            </div>
          </div>

          {/* 카테고리별 및 유형별 계약 분포 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                카테고리별 계약 금액 분포
              </h3>
              <div className="h-80">
                {categoryData.labels.length > 0 && (
                  <ResponsivePie
                    data={categoryData.labels.map((label, index) => ({
                      id: label,
                      label,
                      value: categoryData.datasets[0].data[index],
                    }))}
                    margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: "nivo" }}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    animate={true}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#999",
                        symbolSize: 18,
                        symbolShape: "circle",
                      },
                    ]}
                  />
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                계약 유형별 분포
              </h3>
              <div className="h-80">
                {typeData.labels.length > 0 && (
                  <ResponsivePie
                    data={typeData.labels.map((label, index) => ({
                      id: label,
                      label,
                      value: typeData.datasets[0].data[index],
                    }))}
                    margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    colors={{ scheme: "category10" }}
                    borderWidth={1}
                    borderColor={{
                      from: "color",
                      modifiers: [["darker", 0.2]],
                    }}
                    animate={true}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: "#999",
                        symbolSize: 18,
                        symbolShape: "circle",
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>

          {/* 최다 계약 고객 및 가수 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                최다 계약 고객 TOP 5
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        고객명
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        계약 수
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        총 계약 금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.contractCount}건
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(customer.totalAmount)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                최다 계약 가수 TOP 5
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        가수명
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        계약 수
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        총 계약 금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topSingers.map((singer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {singer.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {singer.contractCount}건
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(singer.totalAmount)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
