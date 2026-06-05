import { useState } from 'react';
import { Ban, Calendar, Eye, Star, User, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerProfile() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Quản lý Modal
  const [showDetail, setShowDetail] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(5);

  const handleCancelBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đặt phòng.');
      return;
    }
    alert('Hủy phòng thành công! Trạng thái đơn #DP0995 đã được chuyển thành "Đã hủy". Tiền cọc sẽ được hoàn lại theo chính sách.');
    setShowCancel(false);
    setCancelReason('');
  };

  const handleSendReview = () => {
    alert(`Cảm ơn bạn đã đánh giá ${rating} sao cho Monalisa! Đánh giá đã được ghi nhận.`);
    setShowReview(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bgSoft">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-32 flex-grow flex flex-col md:flex-row gap-8 w-full">
        
        {/* Sidebar hồ sơ */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sticky top-24 text-sm">
            <div className="text-center border-b pb-6 mb-6">
              <div className="w-16 h-16 bg-warmPrimary rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-warmDark font-bold">Q</div>
              <h3 className="font-bold text-base text-gray-800">Huỳnh Nhật Quang</h3>
              <p className="text-xs text-gray-500 mt-0.5">Thành viên Hạng Vàng</p>
            </div>
            <nav className="space-y-2 font-medium">
              <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition">👤 Thông tin cá nhân</button>
              <button className="w-full text-left px-4 py-3 bg-warmPrimary text-warmDark font-bold rounded-lg shadow-xs transition">📅 Lịch sử đặt phòng</button>
              <button className="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition">🔒 Đổi mật khẩu</button>
            </nav>
          </div>
        </aside>

        {/* Nội dung chính bên phải */}
        <section className="flex-1 space-y-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-warmDark">Lịch Sử Đặt Phòng</h2>

          {/* Bộ lọc đơn phòng */}
          <div className="flex gap-2 text-xs md:text-sm">
            <button 
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full font-bold transition ${filter === 'all' ? 'bg-warmDark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-warmPrimary'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-5 py-2 rounded-full font-bold transition ${filter === 'pending' ? 'bg-warmDark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-warmPrimary'}`}
            >
              Sắp tới
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-5 py-2 rounded-full font-bold transition ${filter === 'completed' ? 'bg-warmDark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-warmPrimary'}`}
            >
              Đã hoàn tất
            </button>
          </div>

          {/* Danh sách đơn hàng */}
          <div className="space-y-6 text-sm">
            
            {/* ĐƠN SẮP TỚI */}
            {(filter === 'all' || filter === 'pending') && (
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-gray-500 font-semibold">Mã đơn: <span className="font-mono font-bold text-slate-800">#DP0995</span></p>
                    <p className="text-yellow-600 font-bold mt-1">● Sắp tới (Chờ nhận phòng)</p>
                  </div>
                  <p className="font-bold text-base md:text-lg text-warmDark font-mono">3.000.000₫</p>
                </div>
                <div className="p-6 md:flex justify-between items-center gap-6">
                  <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=150&q=80" alt="Room" className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">Deluxe Room (1 Giường đôi)</h4>
                      <p className="text-xs text-gray-500 mt-1">15/06/2026 - 17/06/2026 (2 đêm)</p>
                      <p className="text-xs text-gray-500">Khách thuê: 2 Người lớn</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0">
                    <button onClick={() => setShowDetail(true)} className="px-5 py-2 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-yellow-600 transition text-xs">Xem chi tiết</button>
                    <button onClick={() => setShowCancel(true)} className="px-5 py-2 bg-white border border-red-500 text-red-600 font-bold rounded-lg hover:bg-red-50 transition text-xs">Hủy đặt phòng</button>
                  </div>
                </div>
              </div>
            )}

            {/* ĐƠN ĐÃ HOÀN TẤT */}
            {(filter === 'all' || filter === 'completed') && (
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden opacity-90">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-gray-500 font-semibold">Mã đơn: <span className="font-mono font-bold text-slate-800">#DP0820</span></p>
                    <p className="text-green-600 font-bold mt-1">● Đã hoàn tất</p>
                  </div>
                  <p className="font-bold text-base md:text-lg text-warmDark font-mono">4.200.000₫</p>
                </div>
                <div className="p-6 md:flex justify-between items-center gap-6">
                  <div className="flex gap-4">
                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=150&q=80" alt="Room" className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="font-bold text-gray-800 text-base">Suite VIP (Hướng Biển)</h4>
                      <p className="text-xs text-gray-500 mt-1">01/05/2026 - 03/05/2026 (2 đêm)</p>
                      <p className="text-xs text-gray-500">Khách thuê: 2 Người lớn</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0">
                    <button onClick={() => alert('Xem lại biên lai cũ')} className="px-5 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition text-xs">Xem lại đơn</button>
                    <button onClick={() => setShowReview(true)} className="px-5 py-2 bg-warmDark text-warmPrimary font-bold rounded-lg hover:bg-black transition text-xs flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-warmPrimary text-warmPrimary" /> Viết Đánh Giá
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      {/* --- CÁC MODAL THAO TÁC CỦA KHÁCH HÀNG --- */}

      {/* 1. Modal Chi tiết đơn phòng */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up text-xs md:text-sm">
            <div className="bg-warmDark px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-base font-bold font-serif">Chi Tiết Đơn: #DP0995</h3>
              <button onClick={() => setShowDetail(false)} className="text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Người đặt:</span>
                <span className="font-bold text-gray-800">Huỳnh Nhật Quang</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Ngày nhận phòng:</span>
                <span className="font-bold text-gray-800">14:00 - 15/06/2026</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Ngày trả phòng:</span>
                <span className="font-bold text-gray-800">12:00 - 17/06/2026</span>
              </div>
              <div className="flex justify-between text-base font-bold mt-4">
                <span className="text-gray-800">Tổng thanh toán:</span>
                <span className="text-red-600 font-mono">3.000.000₫</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2 font-semibold text-xs">
              <button onClick={() => setShowDetail(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Đóng</button>
              <button onClick={() => { setShowDetail(false); setShowCancel(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hủy Đặt Phòng</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Hủy đặt phòng */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up text-xs md:text-sm">
            <form onSubmit={handleCancelBooking}>
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto">⚠️</div>
                <h3 className="text-base font-bold text-gray-800">Xác nhận hủy đặt phòng?</h3>
                <p className="text-gray-500 text-xs leading-normal">Mã đơn <span className="font-bold text-warmDark">#DP0995</span>. Lưu ý: Tiền cọc sẽ được hoàn trả dựa theo chính sách lưu giữ của khách sạn.</p>
                <textarea 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Cho Monalisa biết lý do bạn hủy phòng nhé..." 
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:ring-1 focus:ring-red-500 resize-none" 
                  rows={3}
                  required
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-center gap-2 border-t font-semibold text-xs">
                <button type="button" onClick={() => setShowCancel(false)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg">Quay lại</button>
                <button type="submit" className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Xác nhận Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Viết đánh giá trải nghiệm */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up text-xs md:text-sm">
            <div className="bg-warmPrimary px-6 py-4 flex justify-between items-center text-warmDark">
              <h3 className="text-base font-bold font-serif">Đánh Giá Trải Nghiệm</h3>
              <button onClick={() => setShowReview(false)} className="text-warmDark"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className="text-gray-500 text-xs">Bạn cảm thấy thế nào về dịch vụ tại Monalisa ở đơn đặt phòng #DP0820 này?</p>
              
              {/* Điểm sao */}
              <div className="flex justify-center gap-1.5 text-2xl text-gray-300 cursor-pointer">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => setRating(s)}
                    className="focus:outline-none transition-transform active:scale-95"
                  >
                    <Star className={`w-7 h-7 ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>

              <textarea placeholder="Chia sẻ thêm cảm nhận của bạn để Monalisa nâng cấp dịch vụ..." className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-warmPrimary resize-none" rows={3}></textarea>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2 font-semibold text-xs">
              <button onClick={() => setShowReview(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Đóng</button>
              <button onClick={handleSendReview} className="px-4 py-2 bg-warmDark text-warmPrimary rounded-lg hover:bg-black">Gửi Đánh Giá</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}