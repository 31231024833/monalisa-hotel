import { useState } from 'react';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'roles'>('profile');

  return (
    <div className="w-full bg-bgSoft">
      {/* ĐÃ XÓA KHAI BÁO <Navbar /> TOÀN CỤC Ở ĐÂY ĐỂ ĐỒNG BỘ LAYOUT */}

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 flex-grow flex flex-col md:flex-row gap-8 w-full">
        
        {/* Cột trái: Tab điều hướng */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 sticky top-24 text-sm font-medium text-gray-700">
            <div className="text-center border-b pb-6 mb-6">
              <div className="w-16 h-16 bg-warmPrimary rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-warmDark font-bold">Q</div>
              <h3 className="font-bold text-base text-gray-800">Huỳnh Nhật Quang</h3>
              <p className="text-xs text-emerald-600 font-bold mt-1">● Hoạt động</p>
            </div>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'profile' ? 'bg-warmPrimary text-warmDark font-bold shadow-xs' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                👤 Thông tin cá nhân
              </button>
              <button 
                onClick={() => setActiveTab('password')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'password' ? 'bg-warmPrimary text-warmDark font-bold shadow-xs' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                🔒 Đổi mật khẩu
              </button>
              <button 
                onClick={() => setActiveTab('roles')}
                className={`w-full text-left px-4 py-3 rounded-lg transition border-t-2 border-dashed border-gray-200 mt-2 ${activeTab === 'roles' ? 'bg-warmPrimary text-warmDark font-bold shadow-xs' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                🛡️ Phân quyền {/* ĐÃ XÓA CHỮ (ADMIN) GÂY THỪA THÃI */}
              </button>
            </nav>
          </div>
        </aside>

        {/* Cột phải: Nội dung chi tiết các tab */}
        <section className="flex-1 text-xs md:text-sm">
          
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold text-warmDark mb-6 border-b pb-4 font-serif">Hồ sơ của tôi</h2>
              <div className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">Họ và tên</label>
                    <input type="text" defaultValue="Huỳnh Nhật Quang" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary" />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">Ngày sinh</label>
                    <input type="date" defaultValue="2005-05-10" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary text-gray-700" />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">Số điện thoại</label>
                    <input type="text" defaultValue="0988 765 432" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-semibold mb-2">Email</label>
                    <input type="email" value="quang.hn@student.ueh.edu.vn" disabled className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3 outline-none text-gray-400 cursor-not-allowed font-sans" />
                    <p className="text-[10px] text-gray-400 mt-1">Email tài khoản không thể thay đổi</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 font-semibold mb-2">Địa chỉ cư trú</label>
                    <input type="text" defaultValue="Phường Bình Phú, Quận 6, TP.HCM" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={() => alert('Cập nhật thông tin tài khoản thành công!')} className="px-8 py-3 bg-warmDark text-warmPrimary font-bold rounded-lg hover:bg-black transition shadow-xs text-xs">
                    Lưu Thay Đổi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 animate-fade-in">
              <h2 className="text-xl md:text-2xl font-bold text-warmDark mb-6 border-b pb-4 font-serif">Đổi Mật Khẩu</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Mật khẩu hiện tại</label>
                  <input type="password" placeholder="Nhập mật khẩu cũ..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Mật khẩu mới</label>
                  <input type="password" placeholder="Tối thiểu 8 ký tự..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" placeholder="Nhập lại mật khẩu mới..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-warmPrimary font-sans" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button onClick={() => alert('Cập nhật mật khẩu thành công!')} className="px-8 py-3 bg-warmPrimary text-warmDark font-bold rounded-lg hover:bg-yellow-600 transition shadow-xs text-xs">
                    Cập Nhật Mật Khẩu
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHÂN QUYỀN TRUY CẬP */}
          {activeTab === 'roles' && (
            <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-8 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-warmDark font-serif">Phân Quyền Truy Cập</h2>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">Khu vực Quản trị</span>
              </div>
              
              <div className="flex gap-3 mb-6">
                <input type="text" placeholder="Tìm tài khoản cần phân quyền..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-warmPrimary" />
                <button className="px-5 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition text-xs">Truy xuất</button>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200 text-xs">
                      <th className="py-3 px-4">Tên Tài Khoản</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Vai trò hiện tại</th>
                      <th className="py-3 px-4">Thiết lập quyền mới</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition">
                      <td className="py-4 px-4 font-bold text-gray-800">Trần Lễ Tân</td>
                      <td className="py-4 px-4 font-mono text-xs">letan@monalisa.com</td>
                      <td className="py-4 px-4"><span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">Nhân Viên</span></td>
                      <td className="py-4 px-4 flex gap-2 items-center">
                        <select className="border border-gray-300 rounded p-1.5 outline-none focus:ring-1 focus:ring-warmPrimary text-xs bg-transparent">
                          <option>Khách hàng</option>
                          <option selected>Nhân Viên</option>
                          <option>Quản Lý</option>
                        </select>
                        <button onClick={() => alert('Đã cập nhật phân quyền tài khoản thành công!')} className="px-3.5 py-1.5 bg-gray-800 text-white font-bold rounded hover:bg-black transition text-xs">Lưu</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* ĐÃ XÓA KHAI BÁO <Footer /> TOÀN CỤC Ở ĐÂY ĐỂ ĐỒNG BỘ LAYOUT */}
    </div>
  );
}