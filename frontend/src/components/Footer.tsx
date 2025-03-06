const Footer = () => {
  return (
    <footer className="bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <button className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold mb-4">
          로그인
        </button>
        <div className="text-sm text-gray-600 space-y-2">
          <p>회사 소개</p>
          <p>이용약관</p>
          <p>개인정보처리방침</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 