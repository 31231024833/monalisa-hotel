import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-warmDark text-warmLight py-16 px-6 md:px-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="text-3xl font-serif font-bold tracking-widest text-warmPrimary mb-6">MONALISA</div>
          <p className="text-sm opacity-80 leading-relaxed font-sans mb-6">
            Nơi dừng chân lý tưởng giữa lòng thành phố, mang đến trải nghiệm nghỉ dưỡng sang trọng, ấm áp cùng dịch vụ chu đáo nhất.
          </p>
        </div>
        <div>
          <h4 className="text-xl font-serif font-bold mb-6 text-white">Khám phá</h4>
          <ul className="space-y-3 font-sans text-sm opacity-80">
            <li><Link to="/about" className="hover:text-warmPrimary transition">Về chúng tôi</Link></li>
            <li><Link to="/rooms" className="hover:text-warmPrimary transition">Tất cả hạng phòng</Link></li>
            <li><Link to="/services" className="hover:text-warmPrimary transition">Dịch vụ đặc biệt</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-serif font-bold mb-6 text-white">Chính sách</h4>
          <ul className="space-y-3 font-sans text-sm opacity-80">
            <li><a href="#" className="hover:text-warmPrimary transition">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-warmPrimary transition">Chính sách bảo mật</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-serif font-bold mb-6 text-white">Liên hệ</h4>
          <ul className="space-y-4 font-sans text-sm opacity-80">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-warmPrimary shrink-0 mt-0.5" />
              <span>59C Nguyễn Đình Chiểu, Phường 6, Quận 3, TP.HCM</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-warmPrimary shrink-0" />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-warmPrimary shrink-0" />
              <span>booking@monalisa.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-600 text-center text-sm font-sans opacity-60">
        &copy; 2026 Khách sạn Monalisa. Thiết kế bởi Sinh viên Thương mại điện tử.
      </div>
    </footer>
  );
}