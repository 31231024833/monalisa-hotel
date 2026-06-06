import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  // Tự động kiểm tra trạng thái đăng nhập từ localStorage mỗi khi chuyển trang
  useEffect(() => {
    const saved = localStorage.getItem('logged_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('logged_user');
    localStorage.removeItem('token');
    setUser(null);
    alert('Đăng xuất tài khoản thành công!');
    window.location.href = '/'; // Tải lại trang chủ để áp dụng trạng thái mới
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
      
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            {/* Chỉ hiện nút Vào Quản Trị nếu tài khoản có quyền Quản lý hoặc Nhân viên */}
            {(user.role === 'quan_ly' || user.role === 'nhan_vien') && (
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 px-4 py-2 bg-warmPrimary text-warmDark font-bold rounded-full hover:bg-white hover:text-warmDark transition-all duration-300 shadow-lg text-xs md:text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Vào Quản Trị
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg text-xs md:text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
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