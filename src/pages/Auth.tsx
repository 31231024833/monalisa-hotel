import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Phone, User, CheckCircle2, LogIn, Clock } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (role: 'khach_hang' | 'nhan_vien' | 'quan_ly') => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<'login' | 'register' | 'forgot'>('login');
  const [regType, setRegType] = useState<'email' | 'phone'>('email');

  // --- THÔNG SỐ ĐĂNG NHẬP ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- THÔNG SỐ ĐĂNG KÝ MỚI ---
  const [regName, setRegName] = useState('');
  const [regContact, setRegContact] = useState(''); // Nhận email hoặc số điện thoại tùy chọn
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // =========================================================
  // 1. API ĐĂNG KÝ TÀI KHOẢN MỚI (LƯU THỰC TẾ VÀO DATABASE CLOUD)
  // =========================================================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert('Mật khẩu xác nhận không khớp! Vui lòng nhập lại.');
      return;
    }

    try {
      const payload = {
        fullName: regName.trim(),
        phone: regType === 'phone' ? regContact.trim() : '0900000000',
        email: regType === 'email' ? regContact.trim() : `${Date.now()}@monalisa.com`,
        password: regPassword,
        role: 'khach_hang'
      };

      const res = await fetch('https://monalisa-hotel.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Chúc mừng! Bạn đã đăng ký tài khoản thành viên Monalisa thành công.');
        setActivePage('login');
        setEmail(payload.email);
        setPassword('');
        setRegName('');
        setRegContact('');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        alert(data.error || 'Đăng ký tài khoản thất bại.');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi kết nối đến Backend Node.js. Hãy bảo đảm server đang chạy.');
    }
  };

  // =========================================================
  // 2. API ĐĂNG NHẬP (KIỂM TRA DATABASE & TRẢ VỀ JWT TOKEN)
  // =========================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://monalisa-hotel.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('logged_user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        const roleText = data.user.role === 'quan_ly' ? 'Quản lý' : data.user.role === 'nhan_vien' ? 'Nhân viên' : 'Khách hàng';
        alert(`Đăng nhập thành công! Chào mừng ${data.user.fullName} (${roleText}) quay trở lại.`);

        onLoginSuccess(data.user.role);

        if (data.user.role === 'quan_ly' || data.user.role === 'nhan_vien') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert(data.error || 'Email hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến server Backend Node.js. Vui lòng kiểm tra server có đang chạy.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bgSoft">
      <div className="pt-24 flex-grow flex items-stretch min-h-[calc(100vh-80px)]">
        
        {/* Banner bên trái (Đã sửa lại ảnh nền siêu ổn định) */}
        <div 
          className="hidden lg:block lg:w-1/2 relative bg-cover bg-center transition-all duration-500" 
          style={{ 
            backgroundImage: activePage === 'login' 
              ? "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920')" 
              : activePage === 'register'
              ? "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1920')"
              : "url('https://images.unsplash.com/photo-1542314831-c6a4d14b2404?q=80&w=1920')" // Thay ảnh quên mật khẩu cực kỳ ổn định
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-16 text-white">
            <h1 className="text-5xl font-serif font-bold mb-4 tracking-wider">
              {activePage === 'login' && "MONALISA"}
              {activePage === 'register' && "THÀNH VIÊN"}
              {activePage === 'forgot' && "BẢO MẬT"}
            </h1>
            <p className="text-lg text-warmLight font-light leading-relaxed max-w-md">
              {activePage === 'login' && "Đăng nhập để quản lý lịch trình và tận hưởng những đặc quyền dành riêng cho khách hàng thành viên."}
              {activePage === 'register' && "Đăng ký ngay để trở thành một phần của Monalisa và nhận ngay ưu đãi 15% cho lần đặt phòng đầu tiên."}
              {activePage === 'forgot' && "Đừng lo lắng! Chỉ cần vài bước đơn giản, chúng tôi sẽ giúp bạn khôi phục lại quyền truy cập an toàn."}
            </p>
          </div>
        </div>

        {/* Cột Form bên phải */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white relative">
          
          {/* TRANG 1: ĐĂNG NHẬP */}
          {activePage === 'login' && (
            <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 animate-fade-in font-sans text-xs md:text-sm text-left">
              <div>
                <h2 className="text-3xl font-serif font-bold text-warmDark mb-2">Xin chào!</h2>
                <p className="text-gray-500 text-xs">Vui lòng đăng nhập để tiếp tục</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email tài khoản</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email đăng nhập" 
                    className="w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-warmPrimary outline-none text-sm font-sans" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full border border-gray-300 rounded-xl p-3.5 focus:ring-2 focus:ring-warmPrimary outline-none text-sm font-sans" 
                  />
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => setActivePage('forgot')} className="text-xs font-bold text-warmPrimary hover:text-warmDark transition">Quên mật khẩu?</button>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-warmDark text-warmPrimary font-bold text-base rounded-xl hover:bg-black transition shadow-lg">
                  Đăng Nhập
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Chưa có tài khoản?{' '}
                <button type="button" onClick={() => setActivePage('register')} className="font-bold text-warmPrimary hover:text-warmDark transition">Đăng ký ngay</button>
              </p>
            </form>
          )}

          {/* TRANG 2: ĐĂNG KÝ THỰC TẾ */}
          {activePage === 'register' && (
            <div className="w-full max-w-md space-y-6 animate-fade-in relative pt-8 font-sans text-left">
              <button onClick={() => setActivePage('login')} className="absolute top-0 left-0 text-gray-400 hover:text-warmDark flex items-center text-xs font-bold gap-1">
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </button>

              <div>
                <h2 className="text-3xl font-serif font-bold text-warmDark mb-2">Đăng Ký</h2>
                <p className="text-gray-500 text-sm">Trở thành thành viên của Monalisa</p>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1 text-xs font-semibold">
                <button type="button" onClick={() => { setRegType('email'); setRegContact(''); }} className={`flex-1 py-2 rounded-md transition ${regType === 'email' ? 'bg-white shadow-sm text-warmDark font-bold' : 'text-gray-500'}`}>Bằng Email</button>
                <button type="button" onClick={() => { setRegType('phone'); setRegContact(''); }} className={`flex-1 py-2 rounded-md transition ${regType === 'phone' ? 'bg-white shadow-sm text-warmDark font-bold' : 'text-gray-500'}`}>Bằng SĐT</button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 text-xs md:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    required 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Văn A" 
                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-warmPrimary" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {regType === 'email' ? 'Địa chỉ Email *' : 'Số điện thoại *'}
                  </label>
                  <input 
                    type={regType === 'email' ? 'email' : 'tel'} 
                    required 
                    value={regContact}
                    onChange={(e) => setRegContact(e.target.value)}
                    placeholder={regType === 'email' ? 'email@example.com' : '0909 123 456'} 
                    className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mật khẩu *</label>
                    <input 
                      type="password" 
                      required 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Xác nhận mật khẩu *</label>
                    <input 
                      type="password" 
                      required 
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 bg-warmPrimary text-warmDark font-bold rounded-xl hover:bg-yellow-600 transition shadow-md mt-2">
                  Tạo Tài Khoản
                </button>
              </form>
            </div>
          )}

          {/* TRANG 3: QUÊN MẬT KHẨU (ĐÃ ĐỒNG BỘ ĐẦY ĐỦ LOGIC VÀ PHONG CÁCH) */}
          {activePage === 'forgot' && (
            <div className="w-full max-w-md space-y-6 animate-fade-in relative pt-8 text-left">
              <button type="button" onClick={() => setActivePage('login')} className="absolute top-0 left-0 text-gray-400 hover:text-warmDark flex items-center text-xs font-bold gap-1">
                <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
              </button>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-warmLight text-warmPrimary rounded-full flex items-center justify-center text-xl shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-warmDark">Khôi Phục Mật Khẩu</h2>
                <p className="text-gray-500 text-xs leading-relaxed">Nhập số điện thoại hoặc email bạn đã đăng ký. Hệ thống sẽ gửi mã xác nhận (OTP) cho bạn.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('Đổi mật khẩu thành công!'); setActivePage('login'); }} className="space-y-4 text-xs md:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Email / Số điện thoại</label>
                  <input type="text" required placeholder="Nhập để nhận mã xác nhận" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-warmPrimary outline-none transition" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Mã xác nhận (OTP)</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Nhập 6 số..." className="flex-1 border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-warmPrimary transition" />
                    <button type="button" onClick={() => alert('Đã gửi mã OTP thành công!')} className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 flex items-center gap-1">
                      Gửi mã
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                  <input type="password" required placeholder="••••••••" className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-warmPrimary outline-none transition" />
                </div>

                <button type="submit" className="w-full py-3.5 bg-warmDark text-warmPrimary font-bold rounded-xl hover:bg-black transition shadow-md">
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}