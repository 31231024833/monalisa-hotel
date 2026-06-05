import { useState } from 'react';
import { 
  BarChart3, Plus, Search, Calendar, TrendingUp, Download, X, Eye 
} from 'lucide-react';

export default function Reports() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Giả lập tiến trình xuất báo cáo
  const handleExportReport = () => {
    alert('Đang tổng hợp dữ liệu hóa đơn thời gian thực...');
    setTimeout(() => {
      alert('Đã kết xuất và tải thành công Báo cáo thống kê (Định dạng Excel) về thiết bị của bạn!');
      setShowDetailModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">Báo cáo doanh số</h2>
          <p className="text-gray-500 text-sm mt-1">Lập, kiểm tra và xuất báo cáo vận hành doanh thu của khách sạn</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-yellow-600 transition shadow-sm flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" /> Lập báo cáo mới
        </button>
      </div>

      {/* Tra cứu và danh sách báo cáo */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            placeholder="Tìm kiếm mã báo cáo, tên người lập..." 
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-warmPrimary"
          />
          <select className="border border-gray-300 rounded-lg p-2 text-sm outline-none">
            <option>Loại báo cáo: Tất cả</option>
            <option>Báo cáo Doanh thu phòng</option>
            <option>Công suất thuê phòng</option>
            <option>Hiệu quả nhân sự</option>
          </select>
          <button className="px-5 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition text-sm">Truy xuất</button>
        </div>

        {/* Danh sách Bảng báo cáo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6 font-bold">Mã BC</th>
                <th className="py-4 px-6 font-bold">Tên Báo Cáo</th>
                <th className="py-4 px-6 font-bold">Phân Loại</th>
                <th className="py-4 px-6 font-bold">Kỳ báo cáo</th>
                <th className="py-4 px-6 font-bold">Ngày kết xuất</th>
                <th className="py-4 px-6 font-bold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-mono font-bold text-warmDark">BC-DT-0526</td>
                <td className="py-4 px-6 font-bold text-gray-800">Doanh thu tổng hợp tháng 5/2026</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Doanh thu</span>
                </td>
                <td className="py-4 px-6 text-xs text-slate-500 font-mono">01/05 - 31/05</td>
                <td className="py-4 px-6 text-xs text-slate-500 font-mono">05/06/2026</td>
                <td className="py-4 px-6 flex justify-center">
                  <button 
                    onClick={() => setShowDetailModal(true)}
                    className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CÁC MODAL THAO TÁC BÁO CÁO --- */}

      {/* 1. Modal Lập báo cáo mới */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-warmDark px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Lập Báo Cáo Mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Loại hình báo cáo *</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-warmPrimary bg-transparent">
                  <option>Báo cáo Doanh thu tài chính</option>
                  <option>Báo cáo Tần suất lấp đầy phòng</option>
                  <option>Báo cáo Chấm công nhân sự</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Kỳ hạn thu thập (Từ ngày - Đến ngày) *</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-warmPrimary" />
                  <input type="date" defaultValue="2026-06-05" className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-warmPrimary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Đặt tên tiêu đề báo cáo</label>
                <input type="text" placeholder="Hệ thống tự động đặt tên theo bộ lọc nếu trống..." className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-warmPrimary" />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2 text-xs font-semibold">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
              <button onClick={() => { alert('Đã khởi tạo báo cáo thành công!'); setShowCreateModal(false); }} className="px-4 py-2 bg-warmPrimary text-warmDark rounded-lg hover:bg-yellow-600">Khởi tạo</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Xem chi tiết báo cáo và xuất */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-scale-up">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Bản xem chi tiết báo cáo</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 bg-gray-50 overflow-y-auto max-h-[60vh] text-xs md:text-sm">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
                <h4 className="text-center font-bold text-xl text-warmDark uppercase mb-6 font-serif">Báo Cáo Doanh Thu Tháng 5/2026</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Tổng Số Đơn</p>
                    <p className="text-lg font-bold text-blue-700 font-mono">145</p>
                  </div>
                  <div className="p-3 bg-green-50/50 rounded-lg border border-green-100">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Đã Hoàn Tất</p>
                    <p className="text-lg font-bold text-green-700 font-mono">138</p>
                  </div>
                  <div className="p-3 bg-red-50/50 rounded-lg border border-red-100">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Đã Hủy đơn</p>
                    <p className="text-lg font-bold text-red-700 font-mono">7</p>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-gray-400 font-bold mb-1">Tổng Doanh Thu</p>
                    <p className="text-lg font-bold text-amber-700 font-mono">452.500.000đ</p>
                  </div>
                </div>
                
                {/* Giả lập biểu đồ */}
                <div className="h-40 bg-gray-100/50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-bold text-xs select-none">
                  [Biểu đồ thống kê tăng trưởng doanh số thực tế]
                </div>
              </div>
              <p className="text-right text-[10px] text-gray-400 italic">Người lập báo cáo: Nguyễn Lễ Tân &bull; Ngày xuất: 05/06/2026</p>
            </div>

            <div className="px-6 py-4 bg-white border-t flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Đóng</button>
              <button 
                onClick={handleExportReport}
                className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Xuất tập tin (Excel / PDF)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}