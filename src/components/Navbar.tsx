import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-10 px-8 py-4 flex justify-between items-center text-white bg-black bg-opacity-30">
      <Link to="/" className="text-3xl font-serif font-bold tracking-widest text-warmPrimary">MONALISA</Link>
      <div className="hidden md:flex space-x-8 text-lg font-medium">
        <Link to="/" className="hover:text-warmPrimary transition">Trang chủ</Link>
        <Link to="/rooms" className="hover:text-warmPrimary transition">Phòng & Đặt phòng</Link>
      </div>
      <Link to="/admin" className="px-6 py-2 bg-warmPrimary text-warmDark font-bold rounded-full hover:bg-white transition shadow-lg text-sm">
        Vào Quản Trị
      </Link>
    </nav>
  );
}