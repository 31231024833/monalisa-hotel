import { 
  Building2, 
  Receipt, 
  Key, 
  Calendar, 
  Check, 
  X, 
  Eye
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
  setActiveTab
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
      
      {/* 1. HEADER CỦA ADMIN */}
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
            Hệ Thống Phục Vụ Khách Sạn Monalisa
          </span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl text-white tracking-wide">
            Antigravity Hospitality Platform
          </h1>
          <p className="text-xs md:text-sm text-stone-300 leading-relaxed max-w-2xl">
            Tổ hợp quản lý phòng nghỉ, dịch vụ phòng và ghi sổ toán hóa đơn thanh toán của Khách sạn Monalisa. 
            Hệ thống quản trị thời gian thực đồng bộ trực tiếp tới cơ sở dữ liệu đám mây Neon.
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

      {/* 4. PHÒNG ĐANG BẢO TRÌ */}
      {maintenanceRooms > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center justify-between text-sm">
          <span className="font-medium">⚠️ Đang có {maintenanceRooms} phòng trong trạng thái bảo trì cần kiểm tra thiết bị!</span>
          <button onClick={() => setActiveTab('phong')} className="font-bold underline hover:text-rose-950">Quản lý phòng</button>
        </div>
      )}

      {/* 5. DANH SÁCH ĐƠN ĐẶT PHÒNG THỰC TẾ */}
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
                  const b = booking as any;
                  const guestName = b.guestName || b.customerName || "Khách ẩn danh";
                  const phone = b.phone || b.customerPhone || "Không có SĐT";
                 const formatToVN = (dateStr: string) => {
  if (!dateStr || dateStr === "N/A") return "N/A";
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Chuyển đổi định dạng thành DD/MM/YYYY
  }
  return dateStr;
};

const checkInDate = formatToVN(b.checkIn || b.startDate || "N/A");
const checkOutDate = formatToVN(b.checkOut || b.endDate || "N/A");

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

    </div>
  );
}