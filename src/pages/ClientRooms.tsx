import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ShieldCheck, X, Sparkles, MapPin, 
  Tv, Wind, Coffee, Lock, Bath, CheckCircle2, AlertCircle 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { Room } from '../types';

export default function ClientRooms() {
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Nạp danh sách phòng từ Backend thực tế
  useEffect(() => {
    fetch('https://monalisa-hotel.onrender.com/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRoomsList(data);
      })
      .catch(err => {
        console.error('Lỗi tải danh sách phòng phía khách:', err);
      });
  }, []);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Xác định ảnh phù hợp theo hạng phòng
  const getRoomImage = (type: string) => {
    if (type === 'VIP') return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80';
    if (type === 'Đôi') return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80';
    return 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80';
  };

  return (
    <div className="min-h-screen flex flex-col bg-bgSoft">
      <Navbar />

      {/* Banner tiêu đề */}
      <div className="bg-warmLight py-12 pt-32 text-center border-b border-gray-200">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-warmDark mb-4">Các Hạng Phòng Tại Monalisa</h1>
        <p className="text-gray-600 max-w-2xl mx-auto px-4 text-xs md:text-sm leading-relaxed">
          Tận hưởng không gian nghỉ dưỡng đỉnh cao, nơi phong cách thiết kế đương đại kết hợp cùng dịch vụ chăm sóc khách hàng tận tâm chuẩn 5 sao.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 flex-grow w-full">
        
        {/* Bộ lọc bên trái */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sticky top-24 text-xs md:text-sm">
            <h3 className="font-bold text-base text-warmDark mb-4 border-b pb-2 font-serif">Lọc Tìm Kiếm</h3>
            
            <div className="mb-6">
              <p className="font-semibold text-gray-700 mb-3">Hạng phòng nghỉ</p>
              <div className="flex flex-col gap-2 text-gray-600">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Phòng đơn yên tĩnh</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Phòng đôi tiện nghi</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-warmPrimary w-4 h-4" /> Suite VIP Thượng hạng</label>
              </div>
            </div>

            <button className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition">Áp Dụng Bộ Lọc</button>
          </div>
        </aside>

        {/* Danh sách phòng bên phải nạp động từ Database */}
        <section className="flex-1">
          {roomsList.length === 0 ? (
            <div className="text-center py-12 text-gray-400 italic">
              Đang kết nối cơ sở dữ liệu để tải danh sách phòng...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {roomsList.map((room) => (
                <div key={room.id} className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg transition relative">
                  {room.type === 'VIP' && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 shadow-xs uppercase tracking-wider">
                      Premium Suite
                    </div>
                  )}
                  <div className="overflow-hidden h-56 shrink-0">
                    <img 
                      src={getRoomImage(room.type)} 
                      alt={room.name} 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <p className="text-warmPrimary font-mono text-[10px] font-bold tracking-widest uppercase mb-1">
                      HẠNG {room.type === 'VIP' ? 'THƯỢNG HẠNG' : room.type}
                    </p>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-warmDark mb-2 leading-tight">
                      {room.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed">{room.description}</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-lg md:text-xl font-bold text-red-600 font-mono">
                        {formatVND(room.price)}
                        <span className="text-xs text-gray-500 font-normal"> /đêm</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => { setSelectedRoom(room); setShowDetailModal(true); }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-xs"
                        >
                          Chi tiết
                        </button>
                        <Link to="/checkout" className="px-4 py-2.5 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-warmDark hover:text-white transition text-xs">
                          Đặt ngay
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ========================================================================= */}
      {/* MODAL XEM CHI TIẾT PHÒNG SIÊU SANG TRỌNG (Giao diện chuẩn Agoda/Booking)  */}
      {/* ========================================================================= */}
      {showDetailModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
            
            {/* Cột trái: Ảnh phòng kích thước lớn */}
            <div className="w-full lg:w-1/2 h-64 lg:h-auto relative shrink-0">
              <img src={getRoomImage(selectedRoom.type)} alt={selectedRoom.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 lg:hidden">
                <h3 className="text-2xl font-serif font-bold text-white leading-tight">{selectedRoom.name}</h3>
              </div>
            </div>

            {/* Cột phải: Chi tiết bento grid thông số */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] lg:max-h-none">
              <div className="space-y-5 text-xs md:text-sm">
                
                {/* Header Tiêu đề */}
                <div className="hidden lg:block border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-warmPrimary font-mono text-[10px] font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> DỊCH VỤ ĐẲNG CẤP 5 SAO
                      </p>
                      <h3 className="text-2xl font-serif font-bold text-warmDark leading-snug">{selectedRoom.name}</h3>
                    </div>
                    <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-red-500 transition"><X className="w-6 h-6" /></button>
                  </div>
                </div>

                {/* Nút đóng cho giao diện Mobile */}
                <div className="lg:hidden flex justify-end">
                  <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-red-500 transition"><X className="w-6 h-6" /></button>
                </div>

                {/* Bento Grid: Thông số kỹ thuật phòng */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block font-mono">DIỆN TÍCH</span>
                    <strong className="text-warmDark mt-0.5 inline-block text-xs md:text-sm">
                      {selectedRoom.type === 'VIP' ? '65 m²' : selectedRoom.type === 'Đôi' ? '38 m²' : '25 m²'}
                    </strong>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block font-mono">LOẠI GIƯỜNG</span>
                    <strong className="text-warmDark mt-0.5 inline-block text-xs md:text-sm truncate w-full">
                      {selectedRoom.type === 'VIP' ? 'King Size' : selectedRoom.type === 'Đôi' ? '2 Giường Đơn' : 'Giường Đôi'}
                    </strong>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    <span className="text-gray-400 text-[10px] block font-mono">VỊ TRÍ</span>
                    <strong className="text-warmDark mt-0.5 inline-block text-xs md:text-sm font-mono">Tầng {selectedRoom.floor}</strong>
                  </div>
                </div>

                {/* Mô tả chi tiết */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1.5 font-serif">Mô tả không gian nghỉ dưỡng</h4>
                  <p className="text-gray-600 leading-relaxed text-justify text-xs md:text-sm bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {selectedRoom.description}
                  </p>
                </div>

                {/* Grid: Trang thiết bị & Tiện nghi phòng */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2.5 font-serif">Tiện nghi phòng nghỉ cao cấp</h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-700">
                    <div className="flex items-center gap-2"><Tv className="w-4 h-4 text-warmPrimary shrink-0" /> Smart TV truyền hình cáp</div>
                    <div className="flex items-center gap-2"><Wind className="w-4 h-4 text-warmPrimary shrink-0" /> Điều hòa nhiệt độ trung tâm</div>
                    <div className="flex items-center gap-2"><Coffee className="w-4 h-4 text-warmPrimary shrink-0" /> Quầy Minibar & Trà miễn phí</div>
                    <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-warmPrimary shrink-0" /> Két sắt bảo mật an toàn</div>
                    <div className="flex items-center gap-2"><Bath className="w-4 h-4 text-warmPrimary shrink-0" /> Phòng tắm vòi sen & Bồn tắm nằm</div>
                    <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-warmPrimary shrink-0" /> Dịch vụ buồng phòng dọn dẹp 24/7</div>
                  </div>
                </div>

                {/* Chính sách hoàn trả & quy định */}
                <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/50 flex gap-2.5 text-xs text-rose-800 leading-normal">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold">Quy định nhận phòng & Hoàn hủy:</span>
                    <p className="text-[11px] text-rose-700 mt-0.5">Nhận phòng từ 14:00, Trả phòng trước 12:00. Miễn phí hủy phòng trước thời điểm nhận phòng 24 tiếng.</p>
                  </div>
                </div>

              </div>

          

            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}