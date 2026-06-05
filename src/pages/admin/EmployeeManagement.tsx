import { useState } from 'react';
import { 
  Users, Calendar, Plus, Search, Eye, Edit3, X, CheckCircle, Clock 
} from 'lucide-react';

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState<'profiles' | 'schedules'>('profiles');
  
  // Trạng thái đóng/mở Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-serif">Quản lý Nhân Sự</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý hồ sơ và phân ca trực cho nhân viên</p>
        </div>
        
        {/* Điều hướng Tab */}
        <div className="flex bg-gray-200 p-1 rounded-lg text-xs md:text-sm">
          <button 
            onClick={() => setActiveTab('profiles')}
            className={`px-5 py-2 rounded-md font-bold transition ${activeTab === 'profiles' ? 'bg-white shadow-sm text-warmDark' : 'text-gray-600 hover:text-warmDark'}`}
          >
            Hồ sơ Nhân viên
          </button>
          <button 
            onClick={() => setActiveTab('schedules')}
            className={`px-5 py-2 rounded-md font-bold transition ${activeTab === 'schedules' ? 'bg-white shadow-sm text-warmDark' : 'text-gray-600 hover:text-warmDark'}`}
          >
            Lịch làm việc
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: QUẢN LÝ HỒ SƠ NHÂN VIÊN                            */}
      {/* ========================================================= */}
      {activeTab === 'profiles' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-fade-in">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3 flex-1 max-w-xl">
              <input 
                type="text" 
                placeholder="Tra cứu theo mã NV, Tên, SĐT..." 
                className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-warmPrimary"
              />
              <select className="border border-gray-300 rounded-lg p-2 text-sm outline-none">
                <option>Tất cả bộ phận</option>
                <option>Lễ tân</option>
                <option>Buồng phòng</option>
                <option>Kỹ thuật</option>
              </select>
              <button className="px-5 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition text-sm">Tìm</button>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-yellow-600 transition shadow-sm flex items-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" /> Thêm Nhân Viên
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-4 px-6 font-bold">Mã NV</th>
                  <th className="py-4 px-6 font-bold">Họ và Tên</th>
                  <th className="py-4 px-6 font-bold">Bộ phận</th>
                  <th className="py-4 px-6 font-bold">Ca làm việc chính</th>
                  <th className="py-4 px-6 font-bold">Trạng thái</th>
                  <th className="py-4 px-6 font-bold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-bold text-warmDark">NV001</td>
                  <td className="py-4 px-6 font-bold text-gray-800">Nguyễn Lễ Tân</td>
                  <td className="py-4 px-6">Lễ tân (Front Office)</td>
                  <td className="py-4 px-6">Ca Sáng (06:00 - 14:00)</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Đang làm việc</span>
                  </td>
                  <td className="py-4 px-6 flex justify-center">
                    <button 
                      onClick={() => setShowDetailModal(true)}
                      className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: QUẢN LÝ LỊCH LÀM VIỆC                              */}
      {/* ========================================================= */}
      {activeTab === 'schedules' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-6 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Lịch Trực Tuần: 01/06/2026 - 07/06/2026</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold">&lt; Tuần trước</button>
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-bold">Tuần sau &gt;</button>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg border-gray-200">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4 font-bold border-r">Ca Trực</th>
                  <th className="py-3 px-4 font-bold border-r text-center">Thứ 2 (01/06)</th>
                  <th className="py-3 px-4 font-bold border-r text-center">Thứ 3 (02/06)</th>
                  <th className="py-3 px-4 font-bold text-center text-warmPrimary">Hôm nay (05/06)</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4 font-bold text-gray-800 border-r bg-gray-50">
                    Ca Sáng<br /><span className="text-[10px] font-normal text-gray-500">06:00 - 14:00</span>
                  </td>
                  <td className="py-4 px-4 border-r align-top hover:bg-gray-50 cursor-pointer" onClick={() => setShowScheduleModal(true)}>
                    <div className="bg-blue-50 text-blue-700 p-2 rounded mb-1 border border-blue-100 font-medium">NV001 - Nguyễn Lễ Tân</div>
                    <div className="bg-blue-50 text-blue-700 p-2 rounded border border-blue-100 font-medium">NV003 - Trần Bảo Vệ</div>
                  </td>
                  <td className="py-4 px-4 border-r align-top hover:bg-gray-50 cursor-pointer" onClick={() => setShowScheduleModal(true)}>
                    <div className="bg-blue-50 text-blue-700 p-2 rounded border border-blue-100 font-medium">NV001 - Nguyễn Lễ Tân</div>
                  </td>
                  <td className="py-4 px-4 align-top hover:bg-gray-50 cursor-pointer bg-warmLight/20" onClick={() => setShowScheduleModal(true)}>
                    <div className="text-center text-gray-400 italic mt-2">+ Bấm để xếp ca</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CÁC MODAL ĐIỀU KHIỂN TRẠNG THÁI --- */}

      {/* 1. Modal Thêm nhân sự mới */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-warmDark px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Thêm Hồ Sơ Nhân Viên Mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-300 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Mã NV (Hệ thống tự động)</label>
                  <input type="text" value="NV015" disabled className="w-full border border-gray-200 bg-gray-100 rounded-lg p-2 outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Họ và tên *</label>
                  <input type="text" placeholder="Nhập tên..." className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-warmPrimary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Số điện thoại *</label>
                  <input type="text" placeholder="Nhập SĐT..." className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-warmPrimary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Bộ phận *</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-warmPrimary bg-transparent">
                    <option>Lễ tân</option>
                    <option>Kỹ thuật</option>
                    <option>Buồng phòng</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-2 text-xs font-semibold">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Hủy</button>
              <button onClick={() => { alert('Tạo hồ sơ thành công!'); setShowCreateModal(false); }} className="px-4 py-2 bg-warmPrimary text-warmDark rounded-lg hover:bg-yellow-600">Tạo Hồ Sơ</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Chi tiết nhân viên */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold font-serif">Chi Tiết Nhân Viên: NV001</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-xs md:text-sm">
              <div className="flex items-center gap-4 border-b pb-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold font-serif">👤</div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 font-serif">Nguyễn Lễ Tân</h4>
                  <p className="text-xs text-gray-500">Bộ phận: Lễ tân | Ca: Sáng</p>
                </div>
              </div>
              <div className="space-y-3 text-slate-700">
                <p><span className="font-bold w-28 inline-block">Số điện thoại:</span> 0912 345 678</p>
                <p><span className="font-bold w-28 inline-block">Email:</span> letan@monalisa.com</p>
                <p><span className="font-bold w-28 inline-block">Ngày vào làm:</span> 15/05/2025</p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Đóng</button>
              <button onClick={() => { setShowDetailModal(false); setShowUpdateModal(true); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 flex items-center gap-1">
                <Edit3 className="w-4 h-4" /> Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Cập nhật hồ sơ */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="bg-yellow-500 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-base font-bold font-serif">Chỉnh Sửa Hồ Sơ: NV001</h3>
              <button onClick={() => setShowUpdateModal(false)} className="text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-xs md:text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Số điện thoại</label>
                <input type="text" defaultValue="0912 345 678" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-yellow-500 font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Trạng thái làm việc</label>
                <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-yellow-500 bg-transparent">
                  <option selected>Đang làm việc</option>
                  <option>Đã nghỉ việc</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-2 text-xs font-semibold">
              <button onClick={() => setShowUpdateModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">Hủy</button>
              <button onClick={() => { alert('Đã lưu thay đổi hồ sơ!'); setShowUpdateModal(false); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Phân ca trực */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-up">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-base font-bold font-serif">Xếp Ca Trực Tuần</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-xs md:text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 flex items-center justify-between text-xs">
                <span className="text-gray-500">Ngày: <strong className="text-slate-800">05/06/2026</strong></span>
                <span className="text-gray-500">Ca trực: <strong className="text-slate-800">Sáng</strong></span>
              </div>
              
              <label className="block text-xs font-semibold text-gray-700 mb-2">Thêm nhân viên vào ca trực này:</label>
              <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-gray-800 bg-transparent mb-4">
                <option>Chọn nhân viên...</option>
                <option>NV001 - Nguyễn Lễ Tân</option>
                <option>NV002 - Trần Thu Ngân</option>
              </select>
              
              <button 
                onClick={() => { alert('Xếp lịch làm việc thành công!'); setShowScheduleModal(false); }} 
                className="w-full py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition flex items-center justify-center gap-1"
              >
                <Clock className="w-4 h-4" /> Xác Nhận Lưu Lịch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}