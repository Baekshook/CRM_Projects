import { useState, useEffect } from "react";

interface AddressSearchProps {
  onAddressSelect: (address: {
    postcode: string;
    address: string;
    detailAddress: string;
  }) => void;
  label?: string;
  required?: boolean;
  initialAddress?: {
    postcode: string;
    address: string;
    detailAddress: string;
  };
}

declare global {
  interface Window {
    daum: any;
  }
}

export default function AddressSearch({
  onAddressSelect,
  label = "주소",
  required = false,
  initialAddress,
}: AddressSearchProps) {
  const [address, setAddress] = useState({
    postcode: initialAddress?.postcode || "",
    address: initialAddress?.address || "",
    detailAddress: initialAddress?.detailAddress || "",
  });

  useEffect(() => {
    // 다음 주소 API 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleSearch = () => {
    if (!window.daum) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let addr = "";
        if (data.userSelectedType === "R") {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        setAddress({
          ...address,
          postcode: data.zonecode,
          address: addr,
        });

        onAddressSelect({
          postcode: data.zonecode,
          address: addr,
          detailAddress: address.detailAddress,
        });
      },
    }).open();
  };

  const handleDetailAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddress = {
      ...address,
      detailAddress: e.target.value,
    };
    setAddress(newAddress);
    onAddressSelect(newAddress);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={address.postcode}
            placeholder="우편번호"
            readOnly
            className="w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium bg-gray-50"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            주소 검색
          </button>
        </div>
        <input
          type="text"
          value={address.address}
          placeholder="도로명/지번 주소"
          readOnly
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium bg-gray-50"
        />
        <input
          type="text"
          value={address.detailAddress}
          onChange={handleDetailAddressChange}
          placeholder="상세 주소"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
        />
      </div>
    </div>
  );
}
