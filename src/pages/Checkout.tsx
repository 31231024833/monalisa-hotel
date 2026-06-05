import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Gift, ShieldCheck, Ticket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Checkout() {
  const navigate = useNavigate();
  
  // Trạng thái các dịch vụ đi kèm
  const [buffet, setBuffet] = useState(false);
  const [spa, setSpa] = useState(false);
  const [pickup, setPickup] = useState(false);
  
  const [payMethod, setPayMethod] = useState<'later' | 'now'>('later');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const basePrice = 3000000; // Giá phòng mặc định cho 2 đêm
  const buffetPrice = 500000;
  const spaPrice = 850000;
  const pickupPrice = 300000;

  // Tính tổng gộp tiền
  const serviceTotal = (buffet ? buffetPrice : 0) + (spa ? spaPrice : 0) + (pickup ? pickupPrice : 0);
  const grandTotal = basePrice + serviceTotal - discount;

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === 'MONALISA10') {
      setDiscount(300000); // Giảm thẳng 300k
      alert('Áp dụng mã thành công! Bạn được giảm 300.000₫');
    } else {
      alert('Mã giảm giá không chính xác.');
    }
  };

  const handleConfirmBooking = () => {
    alert('Đặt phòng thành công! Monalisa đã gửi thông tin xác nhận qua Email của bạn.');
    navigate('/');
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bgSoft">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-32 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cột trái: Form điền thông tin */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Thông tin khách hàng */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-100">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-warmDark mb-6 flex items-center">
                <span className="w-7 h-7 rounded-full bg-warmPrimary text-warmDark flex items-center justify-center text-xs font-bold mr-3">1</span> 
                Thông tin khách hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Họ và tên *</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-warmPrimary outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Số điện thoại *</label>
                  <input type="tel" placeholder="0909 123 456" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-warmPrimary outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Email nhận mã đơn *</label>
                  <input type="email" placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-warmPrimary outline-none" required />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Số CCCD / Passport *</label>
                  <input type="text" placeholder="Nhập số CCCD" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-warmPrimary outline-none" required />
                </div>
              </div>
            </section>

            {/* 2. Dịch vụ đi kèm */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-100">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-warmDark mb-6 flex items-center">
                <span className="w-7 h-7 rounded-full bg-warmPrimary text-warmDark flex items-center justify-center text-xs font-bold mr-3">2</span> 
                Dịch vụ kèm theo (Tùy chọn)
              </h2>
              <div className="space-y-3 text-xs md:text-sm">
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${buffet ? 'border-warmPrimary bg-warmLight/10' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <input type="checkbox" checked={buffet} onChange={(e) => setBuffet(e.target.checked)} className="w-4.5 h-4.5 accent-warmPrimary" />
                    <span className="ml-3 font-semibold">Buffet sáng cao cấp (Cho 2 người)</span>
                  </div>
                  <span className="font-bold text-warmDark">+{formatVND(buffetPrice)}</span>
                </label>
                
                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${spa ? 'border-warmPrimary bg-warmLight/10' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <input type="checkbox" checked={spa} onChange={(e) => setSpa(e.target.checked)} className="w-4.5 h-4.5 accent-warmPrimary" />
                    <span className="ml-3 font-semibold">Dịch vụ Spa & Massage (60 phút)</span>
                  </div>
                  <span className="font-bold text-warmDark">+{formatVND(spaPrice)}</span>
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${pickup ? 'border-warmPrimary bg-warmLight/10' : 'border-gray-200'}`}>
                  <div className="flex items-center">
                    <input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} className="w-4.5 h-4.5 accent-warmPrimary" />
                    <span className="ml-3 font-semibold">Xe đưa đón Sân bay</span>
                  </div>
                  <span className="font-bold text-warmDark">+{formatVND(pickupPrice)}</span>
                </label>
              </div>
            </section>

            {/* 3. Phương thức thanh toán */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-xs border border-gray-100">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-warmDark mb-6 flex items-center">
                <span className="w-7 h-7 rounded-full bg-warmPrimary text-warmDark flex items-center justify-center text-xs font-bold mr-3">3</span> 
                Phương thức thanh toán
              </h2>
              <div className="space-y-3 text-xs md:text-sm">
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${payMethod === 'later' ? 'border-warmPrimary bg-warmLight/15' : 'border-gray-200'}`}>
                  <input type="radio" checked={payMethod === 'later'} onChange={() => setPayMethod('later')} className="w-4.5 h-4.5 accent-warmPrimary" />
                  <span className="ml-3 font-semibold text-warmDark">Thanh toán sau (Nhận phòng rồi thanh toán)</span>
                </label>
                
                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${payMethod === 'now' ? 'border-warmPrimary bg-warmLight/15' : 'border-gray-200'}`}>
                  <input type="radio" checked={payMethod === 'now'} onChange={() => setPayMethod('now')} className="w-4.5 h-4.5 accent-warmPrimary" />
                  <span className="ml-3 font-semibold text-gray-700">Thanh toán trực tuyến (Chuyển khoản / Thẻ)</span>
                </label>
              </div>
            </section>

          </div>

          {/* Cột phải: Tóm tắt Đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-warmPrimary sticky top-24">
              <h3 className="text-lg font-serif font-bold text-warmDark mb-6 border-b pb-4">Chi tiết đặt phòng</h3>
              
              <div className="flex gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&w=150&q=80" alt="Phòng" className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Phòng Deluxe Ban Công</h4>
                  <p className="text-xs text-gray-500">2 Người lớn • 1 Giường đôi</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 flex justify-between text-xs">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Nhận phòng</p>
                  <p className="font-bold text-warmDark font-mono">15/06/2026</p>
                </div>
                <div className="border-r border-gray-300"></div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">Trả phòng</p>
                  <p className="font-bold text-warmDark font-mono">17/06/2026</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Mã giảm giá (Thử: MONALISA10)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã ưu đãi..." 
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none uppercase font-mono" 
                  />
                  <button type="button" onClick={handleApplyCoupon} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-warmDark transition">Áp dụng</button>
                </div>
              </div>

              <div className="space-y-3 text-xs border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá phòng (2 đêm)</span>
                  <span className="font-semibold font-mono">{formatVND(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dịch vụ phụ trợ</span>
                  <span className="font-semibold font-mono">{formatVND(serviceTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Mã ưu đãi chiết khấu</span>
                    <span className="font-semibold font-mono">-{formatVND(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-warmDark">Tổng tiền</span>
                <span className="text-xl md:text-2xl font-black text-red-600 font-mono">{formatVND(grandTotal)}</span>
              </div>

              <button 
                onClick={handleConfirmBooking}
                className="w-full py-4 bg-warmPrimary text-warmDark font-bold rounded-xl hover:bg-warmDark hover:text-white transition shadow-md"
              >
                Xác nhận đặt phòng
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}