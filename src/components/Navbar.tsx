import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard, User, Calendar, Settings } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tự động kiểm tra trạng thái đăng nhập từ localStorage mỗi khi chuyển trang
  useEffect(() => {
    const saved = localStorage.getItem('logged_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(null);
    }
    setIsDropdownOpen(false); // Đóng dropdown khi chuyển trang
  }, [location]);

  // Click ra ngoài để đóng Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('logged_user');
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    alert('Đã đăng xuất tài khoản thành công!');
    window.location.href = '/'; // Tải lại trang chủ
  };

  // Hàm tự động lấy chữ cái đầu tiên của Họ và Tên (Ví dụ: Huỳnh Nhật Quang -> HQ)
  const getInitials = (name: string) => {
    if (!name) return 'QH';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      // Lấy chữ cái đầu của Họ và chữ cái đầu của Tên
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <nav className="absolute top-0 w-full z-30 px-6 md:px-12 py-4 flex justify-between items-center text-white bg-black bg-opacity-30 backdrop-blur-sm">
      <Link to="/" className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-warmPrimary">
        MONALISA
      </Link>
      <div className="hidden md:flex space-x-8 text-sm md:text-base font-medium tracking-wide">
        <Link to="/" className="hover:text-warmPrimary transition duration-300">Trang chủ</Link>
        <Link to="/rooms" className="hover:text-warmPrimary transition duration-300">Phòng & Đặt phòng</Link>
        <Link to="/services" className="hover:text-warmPrimary transition duration-300">Dịch vụ</Link>
      </div>
      
      <div className="flex items-center gap-4" ref={dropdownRef}>
        {user ? (
          <div className="relative">
            {/* Vòng tròn Avatar viết tắt chữ cái đầu Họ & Tên */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 bg-warmPrimary text-warmDark font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg border-2 border-white/20 cursor-pointer flex items-center justify-center text-sm font-sans"
            >
              {getInitials(user.fullName)}
            </button>

            {/* Menu Dropdown điều hướng dùng chung cho cả Client & Admin */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2.5 text-gray-700 text-xs font-semibold font-sans animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-1">
                  <p className="text-gray-800 font-bold truncate">{user.fullName}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{user.email}</p>
                </div>
                
                <Link 
                  to="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition"
                >
                  <User className="w-4 h-4 text-warmPrimary" /> Hồ sơ cá nhân
                </Link>
                
                <Link 
                  to="/profile" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition"
                >
                  <Calendar className="w-4 h-4 text-warmPrimary" /> Lịch sử đặt phòng
                </Link>

                {/* Nếu tài khoản có quyền Quản lý/Nhân viên thì có thêm nút Vào Quản Trị */}
                {(user.role === 'quan_ly' || user.role === 'nhan_vien') && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-indigo-700 border-t border-dashed border-gray-100 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Vào Quản Trị
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition text-left cursor-pointer border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/auth" 
            className="flex items-center gap-2 px-5 py-2 bg-warmPrimary text-warmDark font-bold rounded-full hover:bg-white hover:text-warmDark transition-all duration-300 shadow-lg text-xs md:text-sm"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}