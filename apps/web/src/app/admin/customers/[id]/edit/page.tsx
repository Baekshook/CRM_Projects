"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import customerApi from "@/lib/api/customerApi";
import singerApi from "@/lib/api/singerApi";
import { toast } from "react-hot-toast";
import CustomerForm from "@/components/customers/CustomerForm";
import PageHeader from "@/components/common/PageHeader";

export default function CustomerEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const customerId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityType, setEntityType] = useState<"customer" | "singer">(
    "customer"
  );
  const [initialData, setInitialData] = useState<any>(null);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Customer ID:", customerId, "Type:", typeof customerId);

        // ID가 유효하지 않은 경우 처리
        if (!customerId) {
          setError(`유효하지 않은 ID 형식입니다: ${customerId}`);
          return;
        }

        // 고객 데이터 조회 시도
        try {
          const data = await customerApi.getById(customerId);
          console.log("Customer data fetched:", data);
          setInitialData({
            ...data,
            customerType: "customer",
            grade: data.grade?.toString() || "1",
          });
          setEntityType("customer");
          return;
        } catch (err) {
          // 고객 데이터가 없으면 가수 데이터 조회
          console.log("Failed to fetch customer, trying singer:", err);
        }

        // 가수 데이터 조회
        try {
          const data = await singerApi.getSingerById(customerId);
          console.log("Singer data fetched:", data);
          setInitialData({
            ...data,
            customerType: "singer",
          });
          setEntityType("singer");
        } catch (err) {
          console.log("Failed to fetch singer:", err);
          setError("해당 ID의 고객 또는 가수를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("데이터 조회 중 오류 발생:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  // 폼 제출 처리
  const handleSubmit = async (formData: any, files: FormData) => {
    try {
      console.log(`Saving ${entityType} with ID: ${customerId}`);

      if (entityType === "customer") {
        // 필수 필드만 포함
        const updatedFields: Record<string, any> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          statusMessage: formData.statusMessage || "",
          company: formData.company || "정보 없음",
          address: formData.address || "정보 없음",
          grade: Number(formData.grade),
        };

        console.log("고객 정보 업데이트:", updatedFields);
        await customerApi.update(customerId, updatedFields);

        // 프로필 이미지 업로드 (있는 경우)
        if (formData.profileImageFile) {
          try {
            console.log("고객 프로필 이미지 업로드 시작:", customerId);

            const formDataObj = new FormData();
            formDataObj.append("file", formData.profileImageFile);
            formDataObj.append("category", "profileImage");

            await customerApi.uploadProfileImage(
              formData.profileImageFile,
              customerId
            );
            console.log("고객 프로필 이미지 업로드 완료");
          } catch (fileError) {
            console.error("고객 프로필 이미지 업로드 중 오류 발생:", fileError);
            toast.error(
              "프로필 이미지 업로드 중 오류가 발생했지만, 고객 정보는 저장되었습니다."
            );
          }
        }
      } else {
        // 가수 정보 업데이트
        const updatedFields: Record<string, any> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          statusMessage: formData.statusMessage || "",
          agency: formData.agency || "정보 없음",
          genre: formData.genre || "정보 없음",
          address: formData.address || "정보 없음",
          price: Number(formData.price) || 0,
          experience: Number(formData.experience) || 0,
          rating: Number(formData.rating) || 1,
        };

        console.log("가수 정보 업데이트:", updatedFields);
        await singerApi.updateSinger(customerId, updatedFields);

        // 파일이 포함된 경우 업로드
        if (
          files.has("profileImage") ||
          files.has("highResPhoto") ||
          files.has("songList") ||
          files.has("mrFile") ||
          files.has("otherFiles")
        ) {
          try {
            console.log("가수 파일 업로드 시작");
            await singerApi.uploadSingerProfileImage(customerId, files);
            console.log("가수 파일 업로드 완료");
          } catch (fileError) {
            console.error("가수 파일 업로드 중 오류 발생:", fileError);
            toast.error(
              "파일 업로드 중 오류가 발생했지만, 가수 정보는 저장되었습니다."
            );
          }
        }
      }

      toast.success("정보가 성공적으로 업데이트되었습니다.");
      router.push(`/admin/customers/${customerId}`);
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      toast.error("저장 중 오류가 발생했습니다.");
      throw error; // CustomerForm에서 에러 처리 가능하도록 전파
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={entityType === "customer" ? "고객 정보 수정" : "가수 정보 수정"}
        description="고객 정보를 수정합니다."
        backUrl={`/admin/customers`}
      />

      <div className="bg-white rounded-lg shadow p-6">
        {initialData && (
          <CustomerForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
}
