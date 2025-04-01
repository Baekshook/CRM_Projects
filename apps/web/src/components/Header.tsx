import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  titleColor?: string;
}

const Header = ({
  showBackButton = false,
  title,
  titleColor = "text-gray-900",
}: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex justify-between items-center px-4 z-50 border-b">
      <div className="flex items-center">
        {showBackButton ? (
          <button onClick={() => router.back()} className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        ) : (
          <Image
            src="https://via.placeholder.com/40x40?text=CRM"
            alt="로고"
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
        )}
      </div>
      {title && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className={`text-lg font-semibold text-black ${titleColor}`}>
            {title}
          </h1>
        </div>
      )}
      <div className="flex items-center">
        <button className="relative p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
