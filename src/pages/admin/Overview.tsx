import { 
  Building2, 
  Receipt, 
  ArrowRight, 
  HeartPulse, 
  Key, 
  Calendar, 
  Check, 
  X, 
  Eye, 
  TrendingUp
} from 'lucide-react';
import type { Room, Invoice, Booking } from '../../types';

interface OverviewProps {
  rooms: Room[];
  invoices: Invoice[];
  bookings: Booking[];
  setActiveTab: (tab: string) => void;
  setSyncSelectedDiagramId: (id: string | null) => void;
}

export default function Overview({ 
  rooms, 
  invoices, 
  bookings, 
  setActiveTab,
  setSyncSelectedDiagramId
}: OverviewProps) {
  
  // --- TÍNH TOÁN DỮ LIỆU CHUẨN THEO ĐÚNG KIỂU DỮ LIỆU TRONG TYPES.TS ---
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === 'Đang sử dụng').length;
  const vacantRooms = rooms.filter(r => r.status === 'Trống').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'Bảo trì').length;
  
  // Đếm số đơn đang lưu trú
  const activeBookingsCount = bookings.filter(b => b.status === 'Đang lưu trú').length;
  
  // Tính doanh thu từ hóa đơn đã thanh toán
  const paidInvoices = invoices.filter(i => i.status === 'Đã thanh toán');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  
  // Tỷ lệ lấp đầy phòng (%)
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Định dạng tiền tệ VND
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. HEADER CỦA ADMIN (Từ file dashboard.html) */}
      <header className="bg-white shadow-sm rounded-2xl flex items-center justify-between p-6 z-10 border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 font-serif">Bảng điều khiển (Dashboard)</h2>
          <p className="text-xs text-gray-500 mt-1">Chào mừng quay trở lại hệ thống quản trị Monalisa</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800">Lễ tân Ca đêm</p>
            <span className="text-xs px-2.5 py-0.5 bg-warmLight text-warmDark font-semibold rounded-full">Nhân viên</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-warmPrimary flex items-center justify-center text-warmDark font-bold text-lg border-2 border-warmDark shadow-sm">
            LT
          </div>
        </div>
      </header>

      {/* 2. HERO WELCOME PANEL */}
      <div className="relative bg-gradient-to-r from-warmDark via-stone-800 to-warmDark rounded-3xl overflow-hidden p-6 md:p-8 shadow-lg border border-stone-700/30">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 bg-warmPrimary/20 border border-warmPrimary/30 text-warmPrimary font-mono text-[11px] font-bold tracking-wider px-3 py-1 rounded-full uppercase">
            Hệ Thống Phục Vụ Khách Sạn & Trực Quan Sequence
          </span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-white tracking-wide">
            Antigravity Hospitality Platform
          </h1>
          <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Tổ hợp quản lý phòng nghỉ, dịch vụ phòng và ghi sổ toán hóa đơn thanh toán của Khách sạn Monalisa. 
            Tích hợp live-sync sequence diagram hữu ích cho việc thiết kế và theo dõi nghiệp vụ chuẩn: 
            <span className="text-warmPrimary font-medium"> Actor &rarr; Boundary &rarr; Control &rarr; Entity</span>.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-warmPrimary/10 to-transparent pointer-events-none select-none" />
      </div>

      {/* 3. THỐNG KÊ NHANH (Widget kết hợp) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Số phòng trống */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Phòng trống hôm nay</span>
            <p className="text-3xl font-black font-mono text-gray-800">{vacantRooms}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Sẵn sàng đón tiếp khách mới</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Key className="w-6 h-6" />
          </div>
        </div>

        {/* Đơn đặt phòng đang hoạt động */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Khách đang lưu trú</span>
            <p className="text-3xl font-black font-mono text-blue-600">{activeBookingsCount}</p>
            <p className="text-[11px] text-blue-500 font-medium">Đang sử dụng dịch vụ tại chỗ</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Tỷ lệ lấp đầy phòng */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Tỷ lệ lấp đầy</span>
            <p className="text-3xl font-black font-mono text-indigo-700">{occupancyRate}%</p>
            <p className="text-[11px] text-gray-500 font-medium">
              {occupiedRooms} đang thuê / {totalRooms} phòng
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Doanh thu thực tế */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Doanh thu thực tế</span>
            <p className="text-lg md:text-xl font-black font-mono text-emerald-700">{formatVND(totalRevenue)}</p>
            <p className="text-[11px] text-gray-400 font-medium">
              Từ {paidInvoices.length} hóa đơn đã đối soát
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 4. PHÒNG ĐANG BẢO TRÌ (Sử dụng biến maintenanceRooms để không bị lỗi cảnh báo) */}
      {maintenanceRooms > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center justify-between text-sm">
          <span className="font-medium">⚠️ Đang có {maintenanceRooms} phòng trong trạng thái bảo trì cần kiểm tra thiết bị!</span>
          <button onClick={() => setActiveTab('phong')} className="font-bold underline hover:text-rose-950">Quản lý phòng</button>
        </div>
      )}

      {/* 5. DANH SÁCH ĐƠN ĐẶT PHÒNG THỰC TẾ (Sử dụng ép kiểu an toàn) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-lg text-gray-800 font-serif">Đơn đặt phòng đang xử lý</h3>
            <p className="text-xs text-gray-500 mt-0.5">Danh sách các đơn hàng hiện có trên hệ thống</p>
          </div>
          <button 
            onClick={() => setActiveTab('datphong')}
            className="text-xs bg-warmPrimary text-warmDark px-3 py-1.5 font-bold hover:bg-warmDark hover:text-white transition rounded-md shadow-sm"
          >
            Xem tất cả đơn
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Chưa có đơn đặt phòng nào được ghi nhận.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-4 font-bold">Mã Đơn</th>
                  <th className="py-3.5 px-4 font-bold">Khách Hàng</th>
                  <th className="py-3.5 px-4 font-bold">Ngày Nhận - Trả</th>
                  <th className="py-3.5 px-4 font-bold">Trạng Thái</th>
                  <th className="py-3.5 px-4 font-bold text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                {bookings.slice(0, 5).map((booking, index) => {
                  // Ép kiểu 'any' an toàn để tránh xung đột thuộc tính thiếu trong types.ts
                  const b = booking as any;
                  const guestName = b.guestName || b.customerName || "Khách ẩn danh";
                  const phone = b.phone || b.customerPhone || "Không có SĐT";
                  const checkInDate = b.checkIn || b.startDate || "N/A";
                  const checkOutDate = b.checkOut || b.endDate || "N/A";

                  return (
                    <tr key={booking.id || index} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4 font-mono font-bold text-warmDark">#{booking.id || `DP0${140 + index}`}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-gray-800 leading-tight">{guestName}</p>
                        <p className="text-xs text-gray-500 mt-1">{phone}</p>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        <p className="font-medium text-gray-700">{checkInDate} đến</p>
                        <p className="text-gray-500 mt-0.5">{checkOutDate}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-1.5">
                          <button 
                            onClick={() => { setActiveTab('datphong'); }} 
                            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition" 
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert('Phê duyệt trạng thái thành công')}
                            className="p-1.5 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition" 
                            title="Xác nhận"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert('Đã hủy trạng thái')}
                            className="p-1.5 bg-rose-50 text-rose-600 rounded hover:bg-rose-100 transition" 
                            title="Từ chối"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 6. CÁC QUY TRÌNH NGHIỆP VỤ & SƠ ĐỒ SEQUENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Bản hướng dẫn Sequence */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-warmPrimary" /> Quy trình kiểm thử Nghiệp vụ & Sơ đồ Sequence liên quan
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Hệ thống hỗ trợ tự động đồng hành trực quan hóa các sơ đồ tuần tự (Sequence Diagram) theo chuẩn lý thuyết môn học. Chọn nhanh một tác vụ bên dưới để hiển thị luồng vẽ:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Feature 9 */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/30 transition-all space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">FEATURE 9: QUẢN LÝ PHÒNG DỊCH VỤ</span>
              
              <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                <li>
                  <button 
                    onClick={() => { setActiveTab('phong'); setSyncSelectedDiagramId('SD9.1'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD9.1 - Tìm phòng lọc danh sách
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('phong'); setSyncSelectedDiagramId('SD9.2'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD9.2 - Nhập liệu và Thêm phòng mới
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('phong'); setSyncSelectedDiagramId('SD9.3'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD9.3 - Xem chi tiết thông số phòng nghỉ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('phong'); setSyncSelectedDiagramId('SD9.4'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD9.4 - Chỉnh sửa thông số cơ sở dữ liệu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('phong'); setSyncSelectedDiagramId('SD9.5'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD9.5 - Xóa phòng ràng buộc DB
                  </button>
                </li>
              </ul>
            </div>

            {/* Feature 10 */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/30 transition-all space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block">FEATURE 10: QUẢN LÝ HÓA ĐƠN KHÁCH SẠN</span>
              
              <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                <li>
                  <button 
                    onClick={() => { setActiveTab('hoadon'); setSyncSelectedDiagramId('SD10.1'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD10.1 - Tạo hóa đơn checkout tính phí
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('hoadon'); setSyncSelectedDiagramId('SD10.2'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD10.2 - Tra cứu Chi tiết hóa đơn
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('hoadon'); setSyncSelectedDiagramId('SD10.3'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD10.3 - Sửa hóa đơn phụ thu giảm giá
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('hoadon'); setSyncSelectedDiagramId('SD10.4'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD10.4 - Hủy hóa đơn, lưu lý do hủy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('hoadon'); setSyncSelectedDiagramId('SD10.5'); }}
                    className="hover:text-warmPrimary flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-400" /> SD10.5 - Xuất PDF / In chứng từ lưu hoán
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cột thông tin Triết lý 3 lớp */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <h3 className="font-serif font-bold text-gray-800 text-base flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-warmPrimary animate-pulse" /> Triết lý kiến trúc 3 lớp (B-C-E)
          </h3>
          
          <p className="text-xs text-gray-500 leading-normal">
            Ghi nhớ thứ tự di chuyển và thao tác dữ liệu tuần tự chuẩn mực trong phân tích thiết kế hệ thống thông tin:
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 font-mono shrink-0">B</span>
              <div>
                <h4 className="font-semibold text-gray-800">Boundary (Lớp Biên)</h4>
                <p className="text-[11px] text-gray-500 leading-normal">Giao diện mà Nhân viên (Actor) thao tác trên các Form tìm kiếm hoặc thêm mới phòng.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center font-bold text-xs text-amber-700 font-mono shrink-0">C</span>
              <div>
                <h4 className="font-semibold text-gray-800">Control (Lớp Điều khiển)</h4>
                <p className="text-[11px] text-gray-500 leading-normal">Lớp nghiệp vụ xử lý thuật toán tính tiền, kiểm tra trạng thái phòng trùng lặp trước khi ghi nhận.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-xs text-rose-700 font-mono shrink-0">E</span>
              <div>
                <h4 className="font-semibold text-gray-800">Entity (Lớp Thực thể)</h4>
                <p className="text-[11px] text-gray-500 leading-normal">Ràng buộc và cập nhật trực tiếp dữ liệu xuống các trường cơ sở dữ liệu (`Room`, `Invoice`).</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}