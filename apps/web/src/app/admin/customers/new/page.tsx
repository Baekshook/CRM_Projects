"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import customerApi from "@/lib/api/customerApi";
import singerApi from "@/lib/api/singerApi";
import { toast } from "react-hot-toast";
import CustomerForm from "@/components/customers/CustomerForm";
import PageHeader from "@/components/common/PageHeader";
import axios from "axios";
import { Customer } from "@/types/customer";
import { uploadCustomerProfileImage } from "@/lib/api/customerApi";
import { uploadSingerProfileImage } from "@/lib/api/singerApi";

export default function NewCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 처리
  const handleSubmit = async (formData: any, files: any) => {
    setIsSubmitting(true);

    try {
      let response;

      if (formData.customerType === "customer") {
        // 고객 생성
        const customerPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || "정보 없음", // 빈 값인 경우 기본값 설정
          address: formData.address || "정보 없음", // 빈 값인 경우 기본값 설정
          role: "customer",
          grade: Number(formData.grade), // 숫자로 변환
          type: "customer",
          statusMessage: formData.statusMessage || "",
          department: formData.department || "",
          assignedTo: formData.assignedTo || "",
          status: formData.status || "active",
          memo: formData.memo || "",
          registrationDate: new Date().toISOString().split("T")[0], // 현재 날짜를 YYYY-MM-DD 형식으로 추가
        };

        try {
          // 고객 기본 정보 저장
          response = await customerApi.create(customerPayload);

          // 프로필 이미지 업로드 (있는 경우)
          if (response?.id && formData.profileImageFile) {
            try {
              console.log("고객 프로필 이미지 업로드 시작");
              const uploadResult = await uploadCustomerProfileImage(
                formData.profileImageFile,
                response.id
              );
              console.log("고객 프로필 이미지 업로드 완료:", uploadResult);
            } catch (error: any) {
              console.error("고객 프로필 이미지 업로드 실패:", error);
              toast.error(
                "프로필 이미지 업로드에 실패했습니다. 나중에 다시 시도해주세요."
              );
            }
          }
        } catch (error: any) {
          // 이메일 중복 오류 처리
          if (
            error.response &&
            error.response.data &&
            error.response.data.message &&
            error.response.data.message.includes("duplicate key")
          ) {
            toast.error(
              "이미 등록된 이메일입니다. 다른 이메일을 사용해주세요."
            );
          } else {
            throw error; // 다른 오류는 다시 throw
          }
          return;
        }
      } else {
        // 가수 생성
        const singerPayload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          agency: formData.agency || "정보 없음",
          genre: formData.genre || "정보 없음",
          genres: [formData.genre || "기타"],
          address: formData.address || "정보 없음",
          statusMessage: formData.statusMessage || "",
          price: Number(formData.price) || 0,
          experience: Number(formData.experience) || 0,
          rating: Number(formData.rating) || 1,
          grade: 3,
          type: "singer",
          role: "singer",
          status: formData.status || "active",
          memo: formData.memo || "",
          registrationDate: new Date().toISOString().split("T")[0], // 현재 날짜를 YYYY-MM-DD 형식으로 추가
        };

        try {
          // 가수 기본 정보 저장
          response = await singerApi.createSinger(singerPayload);

          // 프로필 이미지 업로드 (있는 경우)
          if (response?.id && formData.profileImageFile) {
            try {
              console.log("가수 프로필 이미지 업로드 시작");
              const uploadResult = await uploadSingerProfileImage(
                formData.profileImageFile,
                response.id
              );
              console.log("가수 프로필 이미지 업로드 완료:", uploadResult);
            } catch (error: any) {
              console.error("가수 프로필 이미지 업로드 실패:", error);
              toast.error(
                "가수 프로필 이미지 업로드에 실패했습니다. 나중에 다시 시도해주세요."
              );
            }
          }

          // 추가 파일 업로드
          if (response?.id) {
            const filesFormData = new FormData();
            let hasAdditionalFiles = false;

            // 고해상도 사진
            if (formData.highResPhoto) {
              filesFormData.append("highResPhoto", formData.highResPhoto);
              hasAdditionalFiles = true;
            }

            // 곡 목록
            if (formData.songList) {
              filesFormData.append("songList", formData.songList);
              hasAdditionalFiles = true;
            }

            // MR 파일
            if (formData.mrFile) {
              filesFormData.append("mrFile", formData.mrFile);
              hasAdditionalFiles = true;
            }

            // 기타 파일들
            if (formData.otherFiles && formData.otherFiles.length > 0) {
              for (const file of formData.otherFiles) {
                filesFormData.append("otherFiles", file);
              }
              hasAdditionalFiles = true;
            }

            if (hasAdditionalFiles) {
              try {
                console.log(
                  `가수 ID ${response.id}에 대한 추가 파일 업로드 시작`
                );
                await singerApi.uploadSingerProfileImage(
                  response.id,
                  filesFormData
                );
                console.log("가수 추가 파일 업로드 완료");
              } catch (fileError: any) {
                console.error("가수 추가 파일 업로드 중 오류 발생:", fileError);
                if (fileError.response) {
                  console.error("오류 응답:", fileError.response.data);
                }
                toast.error(
                  "일부 파일 업로드 중 오류가 발생했지만, 가수 정보는 저장되었습니다."
                );
              }
            }
          }
        } catch (error: any) {
          // 이메일 중복 오류 처리
          if (
            error.response &&
            error.response.data &&
            error.response.data.message &&
            error.response.data.message.includes("duplicate key")
          ) {
            toast.error(
              "이미 등록된 이메일입니다. 다른 이메일을 사용해주세요."
            );
          } else {
            throw error; // 다른 오류는 다시 throw
          }
          return;
        }
      }

      toast.success(
        `${
          formData.customerType === "customer" ? "고객" : "가수"
        }이 등록되었습니다.`
      );
      router.push("/admin/customers");
    } catch (error: any) {
      console.error("등록 중 오류 발생:", error);
      if (error.response) {
        console.error(
          "서버 응답 오류:",
          error.response.status,
          error.response.data
        );
      }
      toast.error("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* 페이지 헤더 */}
      <PageHeader
        title="신규 등록"
        description="새로운 고객 또는 가수 정보를 등록하세요."
      />

      {/* 등록 폼 */}
      <div className="bg-white rounded-lg shadow p-8">
        <CustomerForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
