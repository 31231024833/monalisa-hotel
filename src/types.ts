/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Types for Hotel Room and Invoice Management System

export type RoomType = 'Đơn' | 'Đôi' | 'VIP';
export type RoomStatus = 'Trống' | 'Đang sử dụng' | 'Bảo trì';

// Tương ứng bảng: Phong
export interface Room {
  id: string;         // MaPhong (PK)
  number: string;   
  name: string;  // TenPhong (Số phòng)
  type: RoomType;     // LoaiPhong
  floor: number;      
  price: number;      // GiaPhong
  capacity: number;   
  status: RoomStatus; // TrangThaiPhong
  description: string;
}

// Tương ứng bảng: KhachHang
export interface Guest {
  id: string;         // MaKhachHang (PK)
  fullName: string;   // HoTen_KH
  phone: string;      // SDT_KH
  email: string;      // Email_KH
  identityNo: string; // CCCD_KH
}

// Tương ứng bảng: DichVu
export interface Service {
  id: string;         // MaDichVu (PK)
  name: string;       // TenDichVu
  price: number;      // DonGia_DV
  category: 'Minibar' | 'Ăn uống' | 'Giặt ủi' | 'Giải trí';
  unit: string;
}

// Tương ứng bảng: ChiTietDonDatDichVu
export interface BookingServiceUsage {
  serviceId: string;  // MaDichVu (FK)
  quantity: number;   // Số lượng
  dateRef: string;    // NgayLap_CTDDV
}

// Tương ứng bảng: DonDatPhong + ChiTietDonDatPhong (Gộp ở Frontend để dễ render)
export interface Booking {
  id: string;           // MaDatPhong (PK)
  code: string;         
  roomId: string;       // MaPhong (FK từ bảng ChiTiet)
  guestId: string;      // MaKhachHang (FK)
  checkInDate: string;  // NgayNhanPhong
  checkOutDate: string; // NgayTraPhong
  status: 'Đang lưu trú' | 'Đã thanh toán' | 'Đã hủy'; // TrangThaiDon
  
  // NOTE: Ở CSDL thực tế, mảng này sẽ tách ra bảng DonDatDichVu. 
  // Frontend gộp tạm vào đây để state quản lý mượt hơn.
  servicesUsed: BookingServiceUsage[]; 
}

export type PaymentMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ';
export type InvoiceStatus = 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';

// Tương ứng bảng: HoaDon
export interface Invoice {
  id: string;           // MaHoaDon (PK)
  code: string;         
  bookingId: string;    // MaDonDatPhong (FK)
  createdDate: string;  // NgayLap
  createdBy: string;    // MaNhanVien (FK)
  roomCharge: number;   
  servicesCharge: number; 
  surcharge: number;    
  discount: number;     
  totalAmount: number;  // TongTien
  paymentMethod: PaymentMethod; 
  status: InvoiceStatus;// TrangThai_HD
  cancelReason?: string;
  note?: string;        
}

// Tương ứng bảng: PhieuThanhToan (Mới bổ sung theo ERD)
export interface PaymentReceipt {
  id: string;             // MaPhieuThanhToan (PK)
  invoiceId: string;      // Tham chiếu đến HoaDon
  method: PaymentMethod;  // PhuongThuc
  amount: number;         // SoTien
  paymentDate: string;    // NgayGioThanhToan
  status: string;         // TrangThaiThanhToan
}


/* ========================================================= */
/* Dữ liệu phục vụ vẽ Sơ đồ Sequence (Không liên quan Database) */
/* ========================================================= */
export type LifelineType = 'actor' | 'boundary' | 'control' | 'entity';

export interface Lifeline {
  id: string;
  name: string;
  type: LifelineType;
  description: string;
}

export interface SequenceStepMessage {
  id: number;
  from: string; 
  to: string; 
  label: string; 
  isReturn?: boolean; 
  note?: string; 
}

export type UseCaseID = 'SD9.1' | 'SD9.2' | 'SD9.3' | 'SD9.4' | 'SD9.5' | 'SD10.1' | 'SD10.2' | 'SD10.3' | 'SD10.4' | 'SD10.5';

export interface SequenceDiagramData {
  id: UseCaseID;
  title: string;
  description: string;
  lifelines: Lifeline[];
  steps: SequenceStepMessage[];
}