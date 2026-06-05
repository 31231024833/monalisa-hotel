import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-warmLight py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs md:text-sm">
        <div>
          <div className="text-xl font-serif font-bold tracking-widest text-warmPrimary mb-4">MONALISA</div>
          <p className="opacity-80 leading-relaxed">Trải nghiệm nghỉ dưỡng sang trọng, ấm áp tại trung tâm thành phố.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white uppercase">Khám phá</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link to="/" className="hover:text-warmPrimary">Trang chủ</Link></li>
            <li><Link to="/rooms" className="hover:text-warmPrimary">Tất cả hạng phòng</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white uppercase">Chính sách</h4>
          <ul className="space-y-2 opacity-80">
            <li><a href="#" className="hover:text-warmPrimary">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:text-warmPrimary">Bảo mật thông tin</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-white uppercase">Liên hệ</h4>
          <p className="opacity-80">📍 59C Nguyễn Đình Chiểu, Quận 3, TP.HCM</p>
        </div>
      </div>
      <div className="text-center text-xs opacity-50 mt-12 pt-6 border-t border-neutral-800">
        &copy; 2026 Khách sạn Monalisa. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  );
}