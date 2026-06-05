import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Import Types (Đã bỏ toàn bộ import INITIAL_ROOMS, INITIAL_BOOKINGS, INITIAL_INVOICES thừa)
import type { Room, Booking, Invoice } from './types';

// Import các phần giao diện dùng chung
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Import các trang chính phía Khách hàng
import HomePage from './pages/HomePage';
import ClientRooms from './pages/ClientRooms';
import ClientServices from './pages/ClientServices';
import Checkout from './pages/Checkout';
import CustomerProfile from './pages/CustomerProfile';
import Auth from './pages/Auth';
import AccountSettings from './pages/AccountSettings';

// Import các trang chính phía Quản trị (Admin)
import Overview from './pages/admin/Overview';
import RoomManagement from './pages/admin/RoomManagement';
import BookingManagement from './pages/admin/BookingManagement';
import InvoiceManagement from './pages/admin/InvoiceManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import SupportRequests from './pages/admin/SupportRequests';
import Reports from './pages/admin/Reports';

/* ============================================================== */
/* 1. LAYOUT KHÁCH HÀNG                                           */
/* ============================================================== */
function CustomerLayout() {
  return (
    <div className="bg-bgSoft font-sans text-gray-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

/* ============================================================== */
/* 2. LAYOUT ADMIN                                                */
/* ============================================================== */
interface AdminLayoutProps {
  userRole: 'khach_hang' | 'nhan_vien' | 'quan_ly';
}

function AdminLayout({ userRole }: AdminLayoutProps) {
  return (
    <div className="bg-bgAdmin font-sans flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

/* ============================================================== */
/* 3. APP ROUTER & STATE MANAGEMENT                               */
/* ============================================================== */
export default function App() {
  // Đồng bộ phiên đăng nhập từ localStorage
  const [userRole, setUserRole] = useState<'khach_hang' | 'nhan_vien' | 'quan_ly'>(() => {
    const savedUser = localStorage.getItem('logged_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.role;
    }
    return 'khach_hang';
  });

  // KHAI BÁO CÁC BIẾN STATE CHẠY TRỰC TIẾP TỪ DATABASE
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [syncSelectedDiagramId, setSyncSelectedDiagramId] = useState<string | null>(null);

  // =========================================================================
  // GỌI API THỰC TẾ ĐỂ NẠP DANH SÁCH PHÒNG TỪ DATABASE CLOUD
  // =========================================================================
  useEffect(() => {
    fetch('http://localhost:8080/api/rooms')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
      })
      .catch(err => {
        console.error('Lỗi nạp danh sách phòng từ server:', err);
      });
  }, []);

  // =========================================================================
  // GỌI API THỰC TẾ ĐỂ NẠP DANH SÁCH ĐƠN ĐẶT PHÒNG TỪ DATABASE CLOUD
  // =========================================================================
  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
      })
      .catch(err => {
        console.error('Lỗi nạp danh sách đơn đặt phòng từ server:', err);
      });
  }, []);

  // =========================================================================
  // GỌI API THỰC TẾ ĐỂ NẠP DANH SÁCH HÓA ĐƠN TỪ DATABASE CLOUD
  // =========================================================================
  useEffect(() => {
    fetch('http://localhost:8080/api/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data);
      })
      .catch(err => {
        console.error('Lỗi nạp danh sách hóa đơn từ server:', err);
      });
  }, []);

  const handleTriggerSequenceDiagram = (diagramId: string) => {
    setSyncSelectedDiagramId(diagramId);
  };

  return (
    <Router>
      <Routes>
        
        {/* === PHÂN HỆ KHÁCH HÀNG (CLIENT ROUTES) === */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rooms" element={<ClientRooms />} />
          <Route path="services" element={<ClientServices />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="auth" element={<Auth onLoginSuccess={(role) => setUserRole(role)} />} />
          <Route path="settings" element={<AccountSettings />} /> 
        </Route>

        {/* === PHÂN HỆ QUẢN TRỊ (ADMIN ROUTES) === */}
        <Route path="/admin" element={<AdminLayout userRole={userRole} />}>
          <Route index element={
            <Overview 
              rooms={rooms} 
              invoices={invoices} 
              bookings={bookings} 
              setActiveTab={() => {}} 
              setSyncSelectedDiagramId={setSyncSelectedDiagramId} 
            />
          } />
          
          <Route path="bookings" element={
            <BookingManagement 
              bookings={bookings} 
              setBookings={setBookings} 
              rooms={rooms} 
              setRooms={setRooms} 
            />
          } />

          <Route path="rooms" element={
            <RoomManagement 
              rooms={rooms} 
              setRooms={setRooms} 
              onTriggerSequence={handleTriggerSequenceDiagram} 
              syncSelectedDiagramId={syncSelectedDiagramId} 
            />
          } />

          <Route path="invoices" element={
            <InvoiceManagement 
              invoices={invoices} 
              setInvoices={setInvoices} 
              rooms={rooms} 
              setRooms={setRooms} 
              bookings={bookings} 
              setBookings={setBookings} 
              onTriggerSequence={handleTriggerSequenceDiagram} 
              syncSelectedDiagramId={syncSelectedDiagramId} 
            />
          } />

          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="support" element={<SupportRequests />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AccountSettings />} /> 
        </Route>

      </Routes>
    </Router>
  );
}