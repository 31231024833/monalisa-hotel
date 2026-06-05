import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, BellRing, Briefcase, FileText, Users, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  userRole: 'khach_hang' | 'nhan_vien' | 'quan_ly';
}

export default function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-warmDark text-white flex flex-col h-full shadow-2xl z-20 shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-600 cursor-pointer" onClick={() => navigate('/')}>
        <h1 className="text-2xl font-bold tracking-widest text-warmPrimary font-serif">MONALISA</h1>
      </div>

      {/* Menu Điều hướng */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
          <BarChart3 className="w-4 h-4" /> Tổng quan
        </Link>
        <Link to="/admin/bookings" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin/bookings' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
          <BellRing className="w-4 h-4" /> Đơn đặt phòng
        </Link>
        <Link to="/admin/rooms" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin/rooms' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
          <Briefcase className="w-4 h-4" /> Quản lý Phòng
        </Link>
        <Link to="/admin/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin/invoices' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
          <FileText className="w-4 h-4" /> Hóa đơn
        </Link>

        {/* ========================================================================= */}
        {/* PHÂN QUYỀN (CONDITIONAL RENDERING): CHỈ HIỂN THỊ KHI USER LÀ QUẢN LÝ (quan_ly) */}
        {/* ========================================================================= */}
        {userRole === 'quan_ly' && (
          <>
            <div className="pt-4 mt-4 border-t border-stone-700">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Đặc quyền Quản lý</p>
              
              <Link to="/admin/employees" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin/employees' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
                <Users className="w-4 h-4" /> 11. Quản lý Nhân sự
              </Link>
              <Link to="/admin/reports" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === '/admin/reports' ? 'bg-white bg-opacity-10 text-warmPrimary font-bold' : 'text-gray-300 hover:bg-white hover:bg-opacity-10'}`}>
                <BarChart3 className="w-4 h-4" /> 12. Quản lý Báo cáo
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* UC 3: Quản lý tài khoản cá nhân - Đặt nút Cài đặt tài khoản ở góc dưới Sidebar */}
      <div className="p-4 border-t border-stone-700">
        <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white transition mb-2">
          <div className="w-8 h-8 rounded-full bg-warmPrimary text-warmDark flex items-center justify-center font-bold">Q</div>
          <div className="text-xs">
            <p className="font-bold">Huỳnh Nhật Quang</p>
            <p className="text-gray-400">Xem Hồ sơ cá nhân</p>
          </div>
        </Link>
        <Link to="/" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-bold text-xs">
          <LogOut className="w-4 h-4" /> Đăng xuất
        </Link>
      </div>
    </aside>
  );
}