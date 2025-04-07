"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import {
  HiOutlineCalendar,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import { FaRegHandshake } from "react-icons/fa";
import {
  interactionApi,
  Interaction,
  CreateInteractionDTO,
} from "@/services/interactionApi";
import customerApi from "@/services/customerApi";
import singerApi from "@/services/singerApi";

interface EntityWithName {
  id: string;
  name: string;
}

interface InteractionFilters {
  customerId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// 상호작용 유형 정의
const interactionTypes = [
  {
    value: "call",
    label: "전화",
    icon: <HiOutlinePhone className="h-5 w-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    value: "email",
    label: "이메일",
    icon: <HiOutlineMail className="h-5 w-5" />,
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    value: "meeting",
    label: "미팅",
    icon: <FaRegHandshake className="h-5 w-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    value: "schedule",
    label: "일정",
    icon: <HiOutlineCalendar className="h-5 w-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
];

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [customers, setCustomers] = useState<EntityWithName[]>([]);
  const [filters, setFilters] = useState<InteractionFilters>({});

  // 상호작용 폼 상태
  const [formData, setFormData] = useState<CreateInteractionDTO>({
    title: "",
    content: "",
    type: "call",
    customerId: "",
    interactionDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // 필터 변경 시 상호작용 데이터 다시 불러오기
  useEffect(() => {
    loadInteractions();
  }, [filters]);

  // 고객과 상호작용 데이터 로드
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 고객 데이터 로드
      const customers = await customerApi.getAll();
      const singers = await singerApi.getAll();

      // 고객과 가수 데이터 합치기 (두 엔티티 모두 상호작용 대상)
      const entities: EntityWithName[] = [
        ...customers.map((c: any) => ({ id: c.id, name: c.name })),
        ...singers.map((s: any) => ({ id: s.id, name: s.name })),
      ];

      setCustomers(entities);

      // 상호작용 데이터 로드
      await loadInteractions();
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      toast.error("고객 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 상호작용 데이터만 로드
  const loadInteractions = async () => {
    try {
      // 커스텀 ID 필터가 있으면 해당 고객의 상호작용만 로드
      const data = filters.customerId
        ? await interactionApi.getAll(filters.customerId)
        : await interactionApi.getAll();

      setInteractions(data);
    } catch (error) {
      console.error("상호작용 데이터 로드 실패:", error);
      toast.error("상호작용 목록을 불러오는데 실패했습니다.");
    }
  };

  // 폼 입력 변경 처리
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // 체크박스 처리
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 상호작용 추가 처리
  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();

    // 고객 선택 유효성 검사
    if (!formData.customerId) {
      toast.error("고객/가수를 선택해주세요");
      return;
    }

    // 제목 유효성 검사
    if (!formData.title?.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    try {
      // 상호작용 생성 API 호출
      await interactionApi.create({
        ...formData,
        interactionDate:
          formData.interactionDate || new Date().toISOString().split("T")[0],
      });

      toast.success("상호작용이 추가되었습니다");

      // 폼 초기화 및 닫기
      setFormData({
        title: "",
        content: "",
        type: "call",
        customerId: "",
        interactionDate: new Date().toISOString().split("T")[0],
        status: "pending",
      });
      setIsFormVisible(false);

      // 상호작용 목록 갱신
      loadInteractions();
    } catch (error) {
      console.error("상호작용 추가 실패:", error);
      toast.error("상호작용 추가에 실패했습니다");
    }
  };

  // 상호작용 삭제 처리
  const handleDeleteInteraction = async (id: string) => {
    if (window.confirm("이 상호작용을 삭제하시겠습니까?")) {
      try {
        await interactionApi.delete(id);
        toast.success("상호작용이 삭제되었습니다");

        // 상호작용 목록 갱신
        setInteractions(
          interactions.filter((interaction) => interaction.id !== id)
        );
      } catch (error) {
        console.error("상호작용 삭제 실패:", error);
        toast.error("상호작용 삭제에 실패했습니다");
      }
    }
  };

  // 필터 변경 처리
  const handleFilterChange = (
    name: keyof InteractionFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 고객 이름 가져오기
  const getCustomerName = (id: string): string => {
    const customer = customers.find((c) => c.id === id);
    return customer ? customer.name : "알 수 없음";
  };

  // 상호작용 유형 정보 가져오기
  const getInteractionTypeInfo = (type: string) => {
    return (
      interactionTypes.find((t) => t.value === type) || {
        label: type,
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        icon: null,
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="고객 상호작용"
        description="고객과의 모든 상호작용을 기록하고 관리합니다."
      />

      {/* 필터 및 액션 버튼 영역 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={filters.customerId || ""}
            onChange={(e) => handleFilterChange("customerId", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">모든 고객</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">모든 유형</option>
            {interactionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="">모든 상태</option>
            <option value="pending">대기 중</option>
            <option value="completed">완료됨</option>
            <option value="follow-up">후속 조치 필요</option>
          </select>

          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="시작일"
          />

          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="종료일"
          />
        </div>

        <button
          onClick={() => setIsFormVisible(true)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
        >
          + 상호작용 추가
        </button>
      </div>

      {/* 상호작용 목록 */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">상호작용 기록이 없습니다.</p>
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            첫 상호작용 추가하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            {interactions.map((interaction) => {
              const typeInfo = getInteractionTypeInfo(interaction.type);
              return (
                <div
                  key={interaction.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-lg">{interaction.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteInteraction(interaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2">
                    <span
                      className={`${typeInfo.bgColor} ${typeInfo.color} text-xs px-2 py-1 rounded-full flex items-center`}
                    >
                      {typeInfo.icon && (
                        <span className="mr-1">{typeInfo.icon}</span>
                      )}
                      {typeInfo.label}
                    </span>

                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      고객: {getCustomerName(interaction.customerId || "")}
                    </span>

                    {interaction.interactionDate && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                        <HiOutlineCalendar className="mr-1" />
                        {formatDate(interaction.interactionDate)}
                      </span>
                    )}

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        interaction.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : interaction.status === "follow-up"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {interaction.status === "completed"
                        ? "완료됨"
                        : interaction.status === "follow-up"
                        ? "후속 조치 필요"
                        : "대기 중"}
                    </span>
                  </div>

                  {interaction.content && (
                    <p className="text-gray-600 text-sm mt-2">
                      {interaction.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 상호작용 추가 모달 */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">새 상호작용 추가</h2>
              <button
                onClick={() => setIsFormVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddInteraction} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    고객/가수 선택
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">선택하세요</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상호작용 유형
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {interactionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상호작용 일자
                  </label>
                  <input
                    type="date"
                    name="interactionDate"
                    value={formData.interactionDate}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상태
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="pending">대기 중</option>
                    <option value="completed">완료됨</option>
                    <option value="follow-up">후속 조치 필요</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
