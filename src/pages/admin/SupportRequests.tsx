import { useState } from 'react';
import { 
  Search, Eye, X, MessageSquare, ArrowUpRight, CheckCircle, Ban 
} from 'lucide-react';

export default function SupportRequests() {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">Yêu cầu & Khiếu nại</h2>
          <p className="text-gray-500 text-sm mt-1">Tiếp nhận và xử lý hỗ trợ thời gian thực từ khách hàng</p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 border-red-500">
            <p className="text-[10px] text-gray-400 font-bold">Chờ xử lý</p>
            <p className="text-lg font-bold text-red-600">3</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 border-blue-500">
            <p className="text-[10px] text-gray-400 font-bold">Đang giải quyết</p>
            <p className="text-lg font-bold text-blue-600">5</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc & Bảng tìm kiếm */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            placeholder="Tìm mã YC, tên khách, số phòng..." 
            className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-warmPrimary"
          />
          <select className="border border-gray-300 rounded-lg p-2 text-sm outline-none">
            <option>Phân loại: Tất cả</option>
            <option>Dịch vụ buồng phòng</option>
            <option>Kỹ thuật / Bảo trì</option>
            <option>Khiếu nại thái độ</option>
          </select>
          <button className="px-5 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition text-sm">Tìm kiếm</button>
        </div>

        {/* Danh sách Yêu cầu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-4 px-6 font-bold">Mã YC</th>
                <th className="py-4 px-6 font-bold">Khách Hàng (Phòng)</th>
                <th className="py-4 px-6 font-bold">Nội dung tóm tắt</th>
                <th className="py-4 px-6 font-bold">Thời gian nhận</th>
                <th className="py-4 px-6 font-bold">Trạng Thái</th>
                <th className="py-4 px-6 font-bold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              <tr className="bg-rose-50/10 hover:bg-gray-50 transition">
                <td className="py-4 px-6 font-mono font-bold text-warmDark">#YC5012</td>
                <td className="py-4 px-6">
                  <p className="font-bold text-gray-800 leading-tight">Trần Thị B</p>
                  <p className="text-xs text-gray-400 mt-1">Phòng 501</p>
                </td>
                <td className="py-4 px-6 truncate max-w-xs">Điều hòa trong phòng không mát, kêu rất to...</td>
                <td className="py-4 px-6 text-xs text-slate-500 font-mono">10 phút trước</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Mới</span>
                </td>
                <td className="py-4 px-6 flex justify-center">
                  <button 
                    onClick={() => setShowDetailModal(true)}
                    className="px-3.5 py-1.5 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CÁC POPUP (MODAL) XỬ LÝ QUY TRÌNH --- */}

      {/* 1. Modal Xem chi tiết yêu cầu hỗ trợ */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-up">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Chi Tiết Yêu Cầu: #YC5012</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 text-xs md:text-sm space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">Khách hàng yêu cầu</p>
                  <p className="font-bold text-gray-800 text-base mt-1 font-serif">Trần Thị B (P.501)</p>
                  <p className="text-xs text-gray-500 mt-1">SĐT liên hệ: 0988 765 432</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase font-bold">Trạng thái hiện tại</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Mới tiếp nhận</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Nội dung báo hỏng / dịch vụ</p>
                <div className="bg-gray-50 p-4 rounded-lg text-slate-700 leading-relaxed border border-gray-100">
                  "Chào lễ tân, điều hòa trong phòng tôi hình như bị hỏng. Nó không mát chút nào mà lại còn kêu rất to, phiền các bạn cho người lên kiểm tra giúp tôi với ạ."
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Nhật ký hệ thống (Audit Log)</p>
                <ul className="text-xs text-gray-500 space-y-2 border-l-2 border-gray-200 pl-4 ml-2">
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-indigo-500"></span>
                    <strong className="text-slate-700">12:30 05/06/2026:</strong> Hệ thống tiếp nhận yêu cầu từ Mobile App Khách hàng.
                  </li>
                </ul>
              </div>
            </div>

            {/* Các nút mở rộng */}
            <div className="px-6 py-4 bg-gray-50 border-t flex flex-wrap justify-end gap-2 text-xs font-semibold">
              <button 
                onClick={() => { setShowDetailModal(false); setShowReplyModal(true); }}
                className="px-4 py-2 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-yellow-600 transition flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" /> Trả lời Khách
              </button>
              
              <button 
                onClick={() => { setShowDetailModal(false); setShowForwardModal(true); }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
              >
                <ArrowUpRight className="w-4 h-4" /> Chuyển Bộ phận
              </button>

              <button 
                onClick={() => { setShowDetailModal(false); setShowStatusModal(true); }}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition flex items-center gap-1"
              >
                Đổi Trạng thái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Phản hồi cho khách */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-warmPrimary px-6 py-4 flex justify-between items-center text-warmDark">
              <h3 className="text-lg font-bold font-serif">Phản hồi Khách hàng</h3>
              <button onClick={() => setShowReplyModal(false)} className="text-warmDark"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-xs md:text-sm">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Nội dung phản hồi (SMS/Push Notification):</label>
              <textarea placeholder="Dạ, Lễ tân đã ghi nhận. Xin lỗi quý khách vì sự bất tiện này..." className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-warmPrimary resize-none" rows={4}></textarea>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2 text-xs font-semibold">
              <button onClick={() => setShowReplyModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
              <button onClick={() => { alert('Đã phản hồi tới điện thoại khách!'); setShowReplyModal(false); }} className="px-4 py-2 bg-warmPrimary text-warmDark rounded-lg hover:bg-yellow-600">Gửi Phản Hồi</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Chuyển tiếp bộ phận khác */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Chuyển tiếp Yêu cầu</h3>
              <button onClick={() => setShowForwardModal(false)} className="text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Chọn phòng ban xử lý</label>
                <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 bg-transparent">
                  <option>Phòng Kỹ thuật / Bảo trì thiết bị</option>
                  <option>Bộ phận Buồng phòng dọn rửa</option>
                  <option>Nhà hàng / Phục vụ ẩm thực</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Lý do chuyển tiếp bổ sung</label>
                <textarea placeholder="Nhờ kỹ thuật lên kiểm tra điều hòa gấp cho khách..." className="w-full border border-gray-300 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3}></textarea>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2 text-xs font-semibold">
              <button onClick={() => setShowForwardModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
              <button onClick={() => { alert('Đã chuyển giao vụ việc thành công!'); setShowForwardModal(false); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Chuyển Tiếp</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Đổi trạng thái trực tiếp */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-base font-bold font-serif">Cập Nhật Trạng Thái</h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-xs md:text-sm">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Trạng thái vận hành mới</label>
              <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-gray-800 bg-transparent mb-4">
                <option>Đang xử lý</option>
                <option>Đã giải quyết thành công</option>
                <option>Đóng yêu cầu</option>
              </select>
              <button 
                onClick={() => { alert('Cập nhật trạng thái thành công!'); setShowStatusModal(false); }} 
                className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-4 h-4" /> Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}