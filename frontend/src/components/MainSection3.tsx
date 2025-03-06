import Image from "next/image";

const MainSection3 = () => {
  const services = [
    { title: "맞춤 추천", image: "/recommend.jpg" },
    { title: "실시간 상담", image: "/consult.jpg" },
    { title: "후기 확인", image: "/review.jpg" },
  ];

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold text-center mb-6">
        무엇을 도와드릴까요?
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-2">
              <div className="relative w-full h-full">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-black text-sm">{service.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainSection3;
