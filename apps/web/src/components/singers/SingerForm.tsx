import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Form, Select, Textarea } from "@/components/ui";
import { toast } from "react-hot-toast";
import Image from "next/image";
import * as singerApi from "@/lib/api/singerApi";

// 프로필 이미지 업로드 핸들러
const handleProfileImageUpload = async (file: File) => {
  if (!file) return;

  // 파일 크기 제한 10MB
  if (file.size > 10 * 1024 * 1024) {
    toast.error("파일 크기는 10MB를 초과할 수 없습니다.");
    return;
  }

  // 이미지 파일만 허용
  if (!file.type.startsWith("image/")) {
    toast.error("이미지 파일만 업로드할 수 있습니다.");
    return;
  }

  try {
    setIsUploading(true);
    toast.loading("이미지 업로드 중...");

    // 이미 저장된 가수인 경우
    if (formData.id) {
      const uploadResponse = await singerApi.uploadSingerProfileImage(
        file,
        formData.id
      );

      console.log("이미지 업로드 응답:", uploadResponse);

      // 폼 데이터 업데이트
      setFormData({
        ...formData,
        profileImage: uploadResponse.id,
        profileImageUrl: uploadResponse.fileUrl,
      });

      toast.dismiss();
      toast.success("이미지가 업로드되었습니다.");
    } else {
      // 새 가수인 경우 (임시 미리보기만 설정)
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage({
          file,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      toast.dismiss();
      toast.success(
        "이미지가 임시 저장되었습니다. 가수 저장 시 함께 업로드됩니다."
      );
    }
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error);
    toast.dismiss();
    toast.error("이미지 업로드 중 오류가 발생했습니다.");
  } finally {
    setIsUploading(false);
  }
};
