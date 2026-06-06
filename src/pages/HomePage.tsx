import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Wifi, 
  Coffee, 
  Waves, 
  Car, 
  Star, 
  Check, 
  X,
  LogIn
} from 'lucide-react';

export default function HomePage() {
  // Quản lý trạng thái đóng/mở Modal chi tiết phòng
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Quản lý thông tin tìm kiếm phòng
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1 Người');

  // Cuộn mượt xuống danh sách phòng khi tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const element = document.getElementById('rooms-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-warmLight text-gray-800 min-h-screen font-sans">
      
      

      {/* 1. HERO SECTION (Ảnh bìa lớn & Tiêu đề) */}
      <header 
        className="relative h-screen bg-cover bg-center bg-fixed flex items-center justify-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d14b2404?q=80&w=1920')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 animate-fade-in max-w-4xl">
          <p className="text-warmPrimary tracking-[0.3em] uppercase text-xs md:text-sm mb-4 font-bold">Trải nghiệm đẳng cấp 5 sao</p>
          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 drop-shadow-lg leading-tight">
            Khách sạn Monalisa
          </h1>
          <p className="text-base md:text-xl font-light mb-10 max-w-2xl mx-auto opacity-90 leading-relaxed">
            Trải nghiệm sự sang trọng và ấm áp giữa lòng thành phố, nơi mỗi khoảnh khắc đều trở nên đáng nhớ.
          </p>
          <a 
            href="#rooms-section" 
            className="px-8 py-3.5 bg-warmPrimary text-warmDark font-bold hover:bg-white transition-all duration-300 tracking-wider text-xs md:text-sm shadow-xl"
          >
            KHÁM PHÁ PHÒNG NGHỈ
          </a>
        </div>
      </header>

      {/* 2. THANH TÌM KIẾM ĐẶT PHÒNG NHANH */}
      <div className="relative -mt-16 z-20 max-w-5xl mx-auto px-4">
        <form 
          onSubmit={handleSearch}
          className="bg-white shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-end border-t-4 border-warmPrimary rounded-lg"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày nhận phòng</label>
            <div className="flex items-center border-b border-gray-200 py-2">
              <Calendar className="w-5 h-5 text-warmPrimary mr-3" />
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full outline-none text-gray-700 font-sans bg-transparent" 
                required
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày trả phòng</label>
            <div className="flex items-center border-b border-gray-200 py-2">
              <Calendar className="w-5 h-5 text-warmPrimary mr-3" />
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full outline-none text-gray-700 font-sans bg-transparent" 
                required
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số khách</label>
            <div className="flex items-center border-b border-gray-200 py-2">
              <Users className="w-5 h-5 text-warmPrimary mr-3" />
              <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full outline-none text-gray-700 font-sans bg-transparent"
              >
                <option value="1 Người">1 Người</option>
                <option value="2 Người">2 Người</option>
                <option value="Gia đình">Gia đình (3-4 người)</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-warmDark hover:bg-black text-warmPrimary font-bold transition-all duration-300 shadow-md text-sm tracking-wider"
          >
            TÌM PHÒNG
          </button>
        </form>
      </div>

      {/* 3. VỀ CHÚNG TÔI (About Us) */}
      <section className="py-24 px-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <p className="text-warmPrimary font-bold tracking-widest text-sm uppercase">Câu chuyện Monalisa</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-warmDark leading-snug">
            Chào mừng bạn đến với thiên đường nghỉ dưỡng.
          </h2>
          <p className="text-gray-600 leading-relaxed font-sans text-justify">
            Tọa lạc tại trung tâm thành phố nhộn nhịp, Monalisa Hotel mang đến một không gian yên bình và tinh tế. Với thiết kế kết hợp giữa kiến trúc cổ điển và tiện nghi hiện đại, chúng tôi cam kết mang lại cho bạn những trải nghiệm lưu trú tinh tế và ấm cúng.
          </p>
          <div className="pt-4 flex items-center gap-4 text-warmDark font-bold font-serif">
            <MapPin className="text-warmPrimary w-8 h-8 flex-shrink-0" />
            <p className="text-sm md:text-base">59C Nguyễn Đình Chiểu, Phường 6, Quận 3, TP.HCM</p>
          </div>
        </div>
        <div className="flex-1 relative">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" 
            alt="Hotel Interior" 
            className="w-full h-[350px] md:h-[400px] object-cover shadow-2xl rounded-sm" 
          />
          <div 
            className="absolute -bottom-6 -left-6 border-[10px] border-warmLight w-40 h-40 bg-cover bg-center hidden md:block shadow-lg" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400')" }}
          ></div>
        </div>
      </section>

      {/* 4. SECTION PHÒNG & BỘ LỌC (Từ HTML gốc) */}
      <section id="rooms-section" className="py-24 bg-white px-4 md:px-10 scroll-mt-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          
          {/* Aside Bộ lọc */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-lg text-warmDark mb-4 border-b border-gray-300 pb-2 font-serif">
                Lọc Kết Quả
              </h3>
              
              <div className="mb-6">
                <p className="font-semibold text-sm text-gray-700 mb-3 font-serif">Khoảng giá (1 đêm)</p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Dưới 1,000,000₫
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" defaultChecked /> 1.000.000₫ - 3.000.000₫
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Trên 3,000,000₫
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-semibold text-sm text-gray-700 mb-3 font-serif">Hạng phòng</p>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" defaultChecked /> Standard
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" defaultChecked /> Deluxe
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Suite VIP
                  </label>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => alert('Bộ lọc đang được xử lý...')} 
                className="w-full py-2.5 bg-warmDark text-white font-bold rounded-lg hover:bg-black transition duration-300 text-sm"
              >
                Áp Dụng Lọc
              </button>
            </div>
          </aside>

          {/* Danh sách phòng */}
          <div className="flex-1">
            <div className="mb-10 border-b border-gray-100 pb-4">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-warmDark mb-2">Hạng Phòng Nổi Bật</h2>
              <p className="text-gray-600 text-sm md:text-base">Tận hưởng không gian nghỉ dưỡng đẳng cấp, mang lại sự thoải mái tuyệt đối.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card Phòng Tiêu Chuẩn */}
              <div className="bg-warmLight rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group flex flex-col h-full border border-gray-100">
                <div className="overflow-hidden h-64 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Phòng Tiêu Chuẩn" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-warmDark">Phòng Tiêu Chuẩn</h3>
                    <div className="flex items-center text-warmPrimary shrink-0 gap-1 text-sm">
                      <Star className="w-4 h-4 fill-warmPrimary" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    Không gian ấm cúng với đầy đủ tiện nghi cơ bản, cửa sổ kính lớn đón ánh sáng tự nhiên từ bên ngoài.
                  </p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-lg md:text-xl font-bold text-red-600">
                      850.000₫ <span className="text-xs text-gray-500 font-normal">/đêm</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-xs md:text-sm"
                      >
                        Chi tiết
                      </button>
                      <Link 
                        to="/checkout" 
                        className="px-4 py-2 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-warmDark hover:text-white transition shadow-md text-xs md:text-sm"
                      >
                        Đặt ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Phòng Deluxe */}
              <div className="bg-warmLight rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group relative flex flex-col h-full border border-gray-100">
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                  Bán chạy
                </div>
                <div className="overflow-hidden h-64 shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Phòng Deluxe" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-warmDark">Phòng Deluxe</h3>
                    <div className="flex items-center text-warmPrimary shrink-0 gap-1 text-sm">
                      <Star className="w-4 h-4 fill-warmPrimary" />
                      <span className="font-bold">4.9</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    Trải nghiệm tuyệt vời với ban công hướng phố, nội thất gỗ sang trọng và bồn tắm sứ nhập khẩu cao cấp.
                  </p>
                  
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-lg md:text-xl font-bold text-red-600">
                      1.500.000₫ <span className="text-xs text-gray-500 font-normal">/đêm</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-xs md:text-sm"
                      >
                        Chi tiết
                      </button>
                      <Link 
                        to="/checkout" 
                        className="px-4 py-2 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-warmDark hover:text-white transition shadow-md text-xs md:text-sm"
                      >
                        Đặt ngay
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. TIỆN ÍCH NỔI BẬT (Amenities) */}
      <section className="bg-warmDark text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <p className="text-warmPrimary font-bold tracking-widest text-sm uppercase mb-3">Dịch vụ đẳng cấp</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Tiện nghi của chúng tôi</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-6 border border-gray-700 hover:border-warmPrimary transition-all duration-300 group rounded-md">
            <Wifi className="w-10 h-10 text-warmPrimary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base md:text-lg font-serif">Wifi Tốc độ cao</h3>
            <p className="text-xs text-gray-400 mt-2">Miễn phí toàn bộ khu nghỉ dưỡng</p>
          </div>
          <div className="flex flex-col items-center p-6 border border-gray-700 hover:border-warmPrimary transition-all duration-300 group rounded-md">
            <Coffee className="w-10 h-10 text-warmPrimary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base md:text-lg font-serif">Nhà hàng & Bar</h3>
            <p className="text-xs text-gray-400 mt-2">Phục vụ thực đơn phong phú 24/7</p>
          </div>
          <div className="flex flex-col items-center p-6 border border-gray-700 hover:border-warmPrimary transition-all duration-300 group rounded-md">
            <Waves className="w-10 h-10 text-warmPrimary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base md:text-lg font-serif">Hồ bơi vô cực</h3>
            <p className="text-xs text-gray-400 mt-2">Tầm nhìn bao trọn cảnh thành phố</p>
          </div>
          <div className="flex flex-col items-center p-6 border border-gray-700 hover:border-warmPrimary transition-all duration-300 group rounded-md">
            <Car className="w-10 h-10 text-warmPrimary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base md:text-lg font-serif">Đưa đón sân bay</h3>
            <p className="text-xs text-gray-400 mt-2">Đội ngũ xe đưa đón đời mới an toàn</p>
          </div>
        </div>
      </section>

    

      {/* 7. POPUP CHI TIẾT PHÒNG (REACT MODAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Ảnh phòng trong Modal */}
            <div className="w-full md:w-1/2 h-52 md:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80" 
                alt="Deluxe Room Inside" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Chi tiết phòng trong Modal */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-warmDark">Phòng Deluxe Giường Đôi</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-red-500 transition duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Tận hưởng không gian nghỉ dưỡng tuyệt vời với phòng Deluxe rộng 35m². Thiết kế hiện đại pha lẫn nét cổ điển ấm cúng, cửa sổ lớn đón trọn ánh sáng tự nhiên và tầm nhìn thành phố.
                </p>

                <h4 className="font-bold text-gray-800 mb-3 border-b pb-2 text-sm font-serif">Tiện nghi nổi bật</h4>
                <ul className="grid grid-cols-2 gap-3 text-xs md:text-sm text-gray-700 mb-6">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Giường King size</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Smart TV 55"</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Máy pha cà phê</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Ban công riêng</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Két sắt an toàn</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-warmPrimary" /> Dịch vụ dọn 24/7</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center mt-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Giá chỉ từ</p>
                  <p className="text-lg md:text-xl font-bold text-red-600">1.500.000₫</p>
                </div>
                <Link 
                  to="/checkout"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 bg-warmPrimary text-warmDark font-bold rounded-xl hover:bg-warmDark hover:text-white transition shadow-md text-sm"
                >
                  Đặt Phòng
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}