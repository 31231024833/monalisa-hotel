import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ClientServices() {
  const servicesList = [
    {
      category: 'Ẩm Thực',
      title: 'Nhà hàng Tinh Hoa (The Essence)',
      desc: 'Thưởng thức tinh hoa ẩm thực Á - Âu dưới bàn tay tài hoa của các đầu bếp chuẩn Michelin. Không gian nhà hàng lãng mạn, phù hợp cho các buổi tối hẹn hò hoặc gặp gỡ đối tác.',
      time: '06:00 - 22:30',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      actionLabel: 'Đặt Bàn Ngay'
    },
    {
      category: 'Thư Giãn',
      title: 'Zen Spa & Massage',
      desc: 'Đánh thức mọi giác quan và xua tan mệt mỏi với các liệu trình massage thảo dược truyền thống. Không gian yên tĩnh tuyệt đối kết hợp cùng hương tinh dầu thiên nhiên thơm dịu.',
      time: '09:00 - 21:00',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      actionLabel: 'Xem Bảng Giá Spa'
    },
    {
      category: 'Vận Động',
      title: 'Hồ Bơi Vô Cực Trên Tầng Thượng',
      desc: 'Đắm mình trong làn nước mát lạnh tại hồ bơi vô cực cao nhất thành phố. Quầy bar bên hồ luôn sẵn sàng phục vụ cocktail thượng hạng và các món ăn nhẹ.',
      time: '05:30 - 20:00 (Miễn phí cho khách lưu trú)',
      img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80',
      actionLabel: null
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bgSoft">
      <Navbar />

      {/* Banner trên cùng */}
      <div className="relative h-64 bg-cover bg-center flex items-center justify-center pt-24" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-warmDark bg-opacity-65"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">Dịch Vụ Đẳng Cấp</h1>
          <p className="text-sm md:text-base font-light opacity-90">Nâng tầm trải nghiệm nghỉ dưỡng của bạn tại Monalisa</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12 flex-grow">
        {servicesList.map((service, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col md:flex-row gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-xs border border-gray-100 ${
              idx % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full md:w-1/2 h-80 shrink-0">
              <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:px-12">
              <p className="text-warmPrimary font-bold tracking-widest uppercase text-xs mb-2">{service.category}</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-warmDark mb-4">{service.title}</h2>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-6">{service.desc}</p>
              <p className="text-xs text-gray-500 font-bold mb-6 font-mono">🕒 Giờ mở cửa: {service.time}</p>
              {service.actionLabel && (
                <button 
                  onClick={() => alert('Yêu cầu đặt bàn/lịch dịch vụ đang được xử lý...')}
                  className="px-6 py-3 border-2 border-warmDark text-warmDark font-bold rounded-lg hover:bg-warmDark hover:text-white transition text-xs"
                >
                  {service.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}