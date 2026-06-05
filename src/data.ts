/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type{ Room, Guest, Service, Booking, Invoice, SequenceDiagramData, Lifeline } from './types';

// Initial mock data for the application
export const INITIAL_ROOMS: Room[] = [
  {
    id: 'R-101',
    number: '101',
    name: 'Phòng Standard Garden View', // Bổ sung tên phòng mẫu
    type: 'Đơn',
    floor: 1,
    price: 350000,
    capacity: 1,
    status: 'Trống',
    description: 'Phòng đơn tiêu chuẩn, giường 1.4m x 2.0m, nội thất gỗ ấm cúng, cửa sổ hướng vườn.',
  },
  {
    id: 'R-102',
    number: '102',
    name: 'Phòng Twin Cozy Standard', // Bổ sung tên phòng mẫu
    type: 'Đôi',
    floor: 1,
    price: 550000,
    capacity: 2,
    status: 'Trống',
    description: 'Phòng đôi tiêu chuẩn, 2 giường đơn 1.2m, trang bị TV truyền hình cáp, điều hòa mát mẻ.',
  },
  {
    id: 'R-201',
    number: '201',
    name: 'Phòng Deluxe City View', // Bổ sung tên phòng mẫu
    type: 'Đơn',
    floor: 2,
    price: 380000,
    capacity: 1,
    status: 'Đang sử dụng',
    description: 'Phòng đơn lầu cao, tầm nhìn đẹp, thoáng mát, đầy đủ tiện nghi làm việc cho khách công tác.',
  },
  {
    id: 'R-202',
    number: '202',
    name: 'Phòng Deluxe Balcony Street', // Bổ sung tên phòng mẫu
    type: 'Đôi',
    floor: 2,
    price: 600000,
    capacity: 2,
    status: 'Đang sử dụng',
    description: 'Phòng đôi lớn tiện nghi, 1 giường lớn cỡ Queen-size, ban công ngắm phố thị nhộn nhịp.',
  },
  {
    id: 'R-301',
    number: '301',
    name: 'Phòng Suite President Panorama', // Bổ sung tên phòng mẫu
    type: 'VIP',
    floor: 3,
    price: 1200000,
    capacity: 2,
    status: 'Đang sử dụng',
    description: 'Phòng Tổng Thống VIP thượng hạng, bồn tắm nằm massage, phòng khách riêng, ngắm toàn cảnh thành phố từ tầng cao nhất.',
  },
  {
    id: 'R-302',
    number: '302',
    name: 'Phòng Suite President VIP', // Bổ sung tên phòng mẫu
    type: 'VIP',
    floor: 3,
    price: 1200000,
    capacity: 2,
    status: 'Bảo trì',
    description: 'Phòng VIP đang bảo trì nâng cấp bồn nước nóng và thay thế thảm sàn cao cấp.',
  },
  {
    id: 'R-203',
    number: '203',
    name: 'Phòng Standard Quiet Retreat', // Bổ sung tên phòng mẫu
    type: 'Đơn',
    floor: 2,
    price: 350000,
    capacity: 1,
    status: 'Trống',
    description: 'Phòng đơn yên tĩnh, biệt lập phía hành lang trong, yên tĩnh cho quý khách cần nghỉ ngơi tĩnh tâm.',
  }
];

export const INITIAL_GUESTS: Guest[] = [
  {
    id: 'G-001',
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    email: 'vanan.nguyen@gmail.com',
    identityNo: '030198001234',
  },
  {
    id: 'G-002',
    fullName: 'Trần Thị Bình',
    phone: '0987654321',
    email: 'binhtran95@yahoo.com',
    identityNo: '025095005432',
  },
  {
    id: 'G-003',
    fullName: 'Lê Hoàng Minh',
    phone: '0905181920',
    email: 'hoangminh.le@hotmail.com',
    identityNo: '048201009876',
  },
  {
    id: 'G-004',
    fullName: 'Phạm Minh Đức',
    phone: '0963258147',
    email: 'ducpham.architect@gmail.com',
    identityNo: '079203004321',
  }
];

export const INITIAL_SERVICES: Service[] = [
  { id: 'S-01', name: 'Nước suối Aquafina', price: 15000, category: 'Minibar', unit: 'Chai' },
  { id: 'S-02', name: 'Lon Coca-Cola 320ml', price: 20000, category: 'Minibar', unit: 'Lon' },
  { id: 'S-03', name: 'Mì ly ăn liền Hảo Hảo', price: 25000, category: 'Minibar', unit: 'Ly' },
  { id: 'S-04', name: 'Cơm chiên Hải sản đĩa lớn', price: 120000, category: 'Ăn uống', unit: 'Đĩa' },
  { id: 'S-05', name: 'Sinh tố bơ sáp đặc biệt', price: 45000, category: 'Ăn uống', unit: 'Ly' },
  { id: 'S-06', name: 'Giặt sấy và ủi phẳng áo sơ mi', price: 35000, category: 'Giặt ủi', unit: 'Áo' },
  { id: 'S-07', name: 'Giặt sấy quần Jeans dạ hội', price: 45000, category: 'Giặt ủi', unit: 'Cái' },
  { id: 'S-08', name: 'Xe đưa đón sân bay Tân Sơn Nhất', price: 350000, category: 'Giải trí', unit: 'Chuyến' },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'B-1001',
    code: 'BK-02194',
    roomId: 'R-201', // Đang sử dụng
    guestId: 'G-001', // Nguyễn Văn An
    checkInDate: '2026-06-03',
    checkOutDate: '2026-06-06',
    status: 'Đang lưu trú',
    servicesUsed: [
      { serviceId: 'S-01', quantity: 3, dateRef: '2026-06-04' },
      { serviceId: 'S-02', quantity: 2, dateRef: '2026-06-04' },
      { serviceId: 'S-04', quantity: 1, dateRef: '2026-06-04' },
      { serviceId: 'S-06', quantity: 2, dateRef: '2026-06-05' },
    ]
  },
  {
    id: 'B-1002',
    code: 'BK-03158',
    roomId: 'R-202', // Đang sử dụng
    guestId: 'G-002', // Trần Thị Bình
    checkInDate: '2026-06-04',
    checkOutDate: '2026-06-07',
    status: 'Đang lưu trú',
    servicesUsed: [
      { serviceId: 'S-01', quantity: 2, dateRef: '2026-06-04' },
      { serviceId: 'S-03', quantity: 2, dateRef: '2026-06-05' },
    ]
  },
  {
    id: 'B-1003',
    code: 'BK-09412',
    roomId: 'R-301', // Đang sử dụng (VIP)
    guestId: 'G-003', // Lê Hoàng Minh
    checkInDate: '2026-06-01',
    checkOutDate: '2026-06-05', // Trả hôm nay! Sẵn sàng thanh toán tạo hóa đơn
    status: 'Đang lưu trú',
    servicesUsed: [
      { serviceId: 'S-01', quantity: 4, dateRef: '2026-06-02' },
      { serviceId: 'S-02', quantity: 4, dateRef: '2026-06-02' },
      { serviceId: 'S-04', quantity: 2, dateRef: '2026-06-03' },
      { serviceId: 'S-05', quantity: 2, dateRef: '2026-06-03' },
      { serviceId: 'S-08', quantity: 1, dateRef: '2026-06-01' },
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-101',
    code: 'HD-00101',
    bookingId: 'B-Past-1', // Lịch sử cũ
    createdDate: '2026-05-20T08:30:11Z',
    createdBy: 'Trần Nguyễn Khánh Duy',
    roomCharge: 700000, // 2 đêm * 350.000 (R-101)
    servicesCharge: 55000, // Coca + Aquafina
    surcharge: 0,
    discount: 50000,
    totalAmount: 705000,
    paymentMethod: 'Tiền mặt',
    status: 'Đã thanh toán',
    note: 'Khách hàng thân thiết VIP Bạc, chiết khấu 50.000đ.',
  },
  {
    id: 'INV-102',
    code: 'HD-00102',
    bookingId: 'B-Past-2',
    createdDate: '2026-05-28T14:45:00Z',
    createdBy: 'Lê Thị Thu Thảo',
    roomCharge: 1100000, // 2 đêm * 550.000 (R-102)
    servicesCharge: 155000, // Cơm chiên + Pepsi
    surcharge: 50000, // Phụ thu nhận phòng sớm
    discount: 0,
    totalAmount: 1305000,
    paymentMethod: 'Chuyển khoản',
    status: 'Đã thanh toán',
    note: 'Nhận phòng sớm lúc 10h sáng.',
  },
  {
    id: 'INV-103',
    code: 'HD-00103',
    bookingId: 'B-Past-3',
    createdDate: '2026-06-01T11:15:33Z',
    createdBy: 'Trần Nguyễn Khánh Duy',
    roomCharge: 350000, // 1 đêm * 350.000
    servicesCharge: 0,
    surcharge: 0,
    discount: 100000, // Coupon giảm giá khai hè
    totalAmount: 250000,
    paymentMethod: 'Thẻ',
    status: 'Đã hủy',
    cancelReason: 'Khách hàng yêu cầu đổi sang hóa đơn doanh nghiệp gộp dịch vụ.',
    note: 'Đã lập lại hóa đơn mới dưới dạng hóa đơn thuế VAT gộp công ty.',
  },
];

// Past Booking references (for initial paid invoices to maintain references)
export const PAST_BOOKINGS_AND_ROOMS_REFS = [
  { id: 'B-Past-1', guestName: 'Nguyễn Hồng Đào', phone: '0979432109', roomNum: '101' },
  { id: 'B-Past-2', guestName: 'Vương Đình Huân', phone: '0932115121', roomNum: '102' },
  { id: 'B-Past-3', guestName: 'Phan Văn Phước', phone: '0901234900', roomNum: '101' },
];

export const INITIAL_LIFELINES: Record<string, Lifeline> = {
  employee: { id: 'nhan_vien', name: 'Nhân viên', type: 'actor', description: 'Người thao tác chính trên hệ thống' },
  
  // Room Lifelines
  formTimPhong: { id: 'form_tim_phong', name: 'formTimPhong', type: 'boundary', description: 'Giao diện tìm kiếm và danh sách phòng' },
  formThemPhong: { id: 'form_them_phong', name: 'formThemPhong', type: 'boundary', description: 'Form điền thông tin thêm phòng mới' },
  formChiTietPhong: { id: 'form_chi_tiet_phong', name: 'formChiTietPhong', type: 'boundary', description: 'Màn hình hiển thị chi tiết thông tin phòng' },
  formSuaPhong: { id: 'form_sua_phong', name: 'formSuaPhong', type: 'boundary', description: 'Form cập nhật, chỉnh sửa thông tin phòng' },
  hopThoaiXacNhanXoaPhong: { id: 'hop_thoai_xoa_phong', name: 'hopThoaiXacNhanXoaPhong', type: 'boundary', description: 'Hộp thoại cảnh báo xác nhận xóa phòng' },
  phongControl: { id: 'phong_control', name: 'PhongControl', type: 'control', description: 'Lớp điều khiển, xử lý logic nghiệp vụ phòng' },
  phongEntity: { id: 'phong_entity', name: 'Phong', type: 'entity', description: 'Bảng/Đối tượng dữ liệu lưu trữ thông tin phòng trong Database' },

  // Invoice Lifelines
  formTaoHoaDon: { id: 'form_tao_hoa_don', name: 'formTaoHoaDon', type: 'boundary', description: 'Form thiết lập và tính toán hóa đơn' },
  formChiTietHoaDon: { id: 'form_chi_tiet_hoa_don', name: 'formChiTietHoaDon', type: 'boundary', description: 'Trang hiển thị đầy đủ thông tin hóa đơn hoàn chỉnh' },
  formSuaHoaDon: { id: 'form_sua_hoa_don', name: 'formSuaHoaDon', type: 'boundary', description: 'Màn hình chỉnh sửa giá trị hóa đơn (phụ thu, KM)' },
  hopThoaiXacNhanHuyHoaDon: { id: 'hop_thoai_huy_hoa_don', name: 'hopThoaiXacNhanHuyHoaDon', type: 'boundary', description: 'Hộp thoại yêu cầu nhập lý do và xác nhận hủy hóa đơn' },
  manHinhXuatHoaDon: { id: 'man_hinh_xuat_hoa_don', name: 'manHinhXuatHoaDon', type: 'boundary', description: 'Khung hiển thị PDF draft và nút in' },
  hoaDonControl: { id: 'hoa_don_control', name: 'HoaDonControl', type: 'control', description: 'Bộ xử lý trung tâm nghiệp vụ hóa đơn, liên kết các thực thể' },
  xuatHoaDonControl: { id: 'xuat_hoa_don_control', name: 'XuatHoaDonControl', type: 'control', description: 'Lớp chuyên biệt chuyển đổi xuất bản dữ liệu dạng file PDF stream' },
  
  // Invoice Entity Lifelines
  hoaDonEntity: { id: 'hoa_don_entity', name: 'HoaDon', type: 'entity', description: 'Thực thể lưu trữ thông tin thanh toán cuối cùng' },
  datPhongEntity: { id: 'dat_phong_entity', name: 'DatPhong', type: 'entity', description: 'Thực thể lưu thông tin Đặt phòng, số ngày lưu trú' },
  khachHangEntity: { id: 'khach_hang_entity', name: 'KhachHang', type: 'entity', description: 'Thực thể quản lý hồ sơ thông tin khách hàng' },
  dichVuEntity: { id: 'dich_vu_entity', name: 'DichVu', type: 'entity', description: 'Thực thể lưu trữ dịch vụ chi tiết và bảng giá' },
};

export const SEQUENCE_DIAGRAMS: SequenceDiagramData[] = [
  // ---------------- FEATURE 9: QUẢN LÝ PHÒNG ----------------
  {
    id: 'SD9.1',
    title: 'SD9.1 - Tìm phòng (Search Rooms)',
    description: 'Bản vẽ mô tả luồng kiểm tra nghiệp vụ và xử lý kết quả khi nhân viên lọc và tìm phòng.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formTimPhong,
      INITIAL_LIFELINES.phongControl,
      INITIAL_LIFELINES.phongEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_tim_phong', label: '1. Nhập tiêu chí tìm kiếm (số phòng, loại, trạng thái)', note: 'Nhân viên nhập thông tin lọc trên màn hình.' },
      { id: 2, from: 'nhan_vien', to: 'form_tim_phong', label: '2. Nhấn nút "Tìm kiếm"', note: 'Kích hoạt lệnh tìm kiếm trên giao diện.' },
      { id: 3, from: 'form_tim_phong', to: 'phong_control', label: '3. Gửi tiêu chí tìm kiếm', note: 'Boundary chuyển tham số lọc sang lớp điều khiển xử lý.' },
      { id: 4, from: 'phong_control', to: 'phong_entity', label: '4. Truy vấn danh sách phòng theo bộ lọc', note: 'PhongControl tạo câu lệnh DB query lọc bảng Phong.' },
      { id: 5, from: 'phong_entity', to: 'phong_control', label: '5. DB trả kết quả danh sách phòng [SQL Result]', isReturn: true, note: 'Database trả về mảng các dòng bản ghi thỏa mãn.' },
      { id: 6, from: 'phong_control', to: 'form_tim_phong', label: '6. Trả kết quả danh sách phòng (Render data)', isReturn: true, note: 'Control đóng gói dữ liệu và chuyển về giao diện.' },
      { id: 7, from: 'form_tim_phong', to: 'nhan_vien', label: '7. Render bảng hiển thị danh sách phòng', isReturn: true, note: 'Giao diện hiển thị danh sách trực quan cho nhân viên theo dõi.' }
    ]
  },
  {
    id: 'SD9.2',
    title: 'SD9.2 - Thêm phòng (Add Room)',
    description: 'Chức năng thêm phòng thực hiện độc lập từ trang Quản lý phòng. Bao gồm kiểm tra ràng buộc và trùng lặp Số phòng.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formThemPhong,
      INITIAL_LIFELINES.phongControl,
      INITIAL_LIFELINES.phongEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_them_phong', label: '1. Nhập thông tin phòng mới (Số phòng, loại, giá, cụ thể)', note: 'Nhân viên điền đầy đủ dữ liệu trong form Thêm phòng.' },
      { id: 2, from: 'nhan_vien', to: 'form_them_phong', label: '2. Nhấn nút "Lưu phòng"', note: 'Yêu cầu hệ thống lưu trữ.' },
      { id: 3, from: 'form_them_phong', to: 'phong_control', label: '3. Gửi thông tin phòng mới cần lưu', note: 'Boundary đẩy dữ liệu sang lớp nghiệp vụ.' },
      { id: 4, from: 'phong_control', to: 'phong_control', label: '4. Kiểm tra dữ liệu hợp lệ (giá >= 0, điền đủ)', note: 'Control tự validate định dạng dữ liệu phía server.' },
      { id: 5, from: 'phong_control', to: 'phong_entity', label: '5. Kiểm tra trùng lặp Số phòng (với số phòng nhập)', note: 'Truy cập DB xem số phòng này đã tồn tại hay chưa.' },
      { id: 6, from: 'phong_entity', to: 'phong_control', label: '6. Trả về kết quả: Không bị trùng', isReturn: true, note: 'DB trả kết quả không có phòng nào trùng số phòng này.' },
      { id: 7, from: 'phong_control', to: 'phong_entity', label: '7. Lưu thông tin phòng mới vào DB', note: 'Ghi bản ghi phòng mới vào bảng Phong.' },
      { id: 8, from: 'phong_entity', to: 'phong_control', label: '8. Xác nhận lưu thành công', isReturn: true, note: 'Database báo ghi thành công dữ liệu vật lý.' },
      { id: 9, from: 'phong_control', to: 'form_them_phong', label: '9. Trả về kết quả "Thêm thành công"', isReturn: true, note: 'Gửi kết quả báo thành công về UI.' },
      { id: 10, from: 'form_them_phong', to: 'nhan_vien', label: '10. Hiển thị Popup thông báo thành công', isReturn: true, note: 'Nhân viên nhận thông báo thành công và Quay lại danh sách.' }
    ]
  },
  {
    id: 'SD9.3',
    title: 'SD9.3 - Xem chi tiết phòng (Room Details)',
    description: 'Chức năng hiển thị đầy đủ thông tin phòng. Đây là mô hình <<extend>> phát sinh từ danh sách phòng lập sau khi tìm.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formTimPhong,
      INITIAL_LIFELINES.formChiTietPhong,
      INITIAL_LIFELINES.phongControl,
      INITIAL_LIFELINES.phongEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_tim_phong', label: '1. Chọn "Xem chi tiết" phòng mong muốn', note: 'Nhân viên chọn 1 dòng phòng từ danh sách kết quả tìm.' },
      { id: 2, from: 'form_tim_phong', to: 'phong_control', label: '2. Yêu cầu lấy thông tin chi tiết (lấy theo maPhong)', note: 'Màn hình chính gửi ID phòng sang Control.' },
      { id: 3, from: 'phong_control', to: 'phong_entity', label: '3. Query thông tin phòng chi tiết theo ID', note: 'Control thực hiện SELECT * FROM Phong WHERE id = maPhong.' },
      { id: 4, from: 'phong_entity', to: 'phong_control', label: '4. Trả về dữ liệu đối tượng khách phòng đầy đủ', isReturn: true, note: 'DB trả về bản ghi chi tiết dạng Object.' },
      { id: 5, from: 'phong_control', to: 'form_chi_tiet_phong', label: '5. Khởi tạo & nạp dữ liệu lên Form chi tiết', isReturn: true, note: 'Nạp thông tin chi tiết và chuyển hướng hiển thị.' },
      { id: 6, from: 'form_chi_tiet_phong', to: 'nhan_vien', label: '6. Hiển thị màn hình chi tiết phòng đầy đủ thông tin', isReturn: true, note: 'Biển đồ hiển thị nút Sửa, Xóa và các thông số cụ thể.' }
    ]
  },
  {
    id: 'SD9.4',
    title: 'SD9.4 - Sửa phòng (Edit Room)',
    description: 'Chức năng thay đổi thông tin phòng, được mở từ màn hình Xem chi tiết phòng. Có kiểm tra ràng buộc tránh trùng lặp số phòng mới.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietPhong,
      INITIAL_LIFELINES.formSuaPhong,
      INITIAL_LIFELINES.phongControl,
      INITIAL_LIFELINES.phongEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_phong', label: '1. Nhấn nút "Sửa phòng"', note: 'Mục tiêu chỉnh sửa thông tin bắt đầu từ giao diện chi tiết.' },
      { id: 2, from: 'form_chi_tiet_phong', to: 'form_sua_phong', label: '2. Chuyển hướng sang form sửa & Điền sẵn thông tin hiện tại', isReturn: true, note: 'FormSuaPhong hiển thị điền sẵn tất cả các box từ bản ghi.' },
      { id: 3, from: 'nhan_vien', to: 'form_sua_phong', label: '3. Thay đổi thông tin (ví dụ: Giá, loại) & Nhấn "Cập nhật"', note: 'Nhân viên thay đổi và lưu.' },
      { id: 4, from: 'form_sua_phong', to: 'phong_control', label: '4. Gửi yêu cầu cập nhật thông tin phòng mới', note: 'Đẩy dữ liệu đã sửa sang nghiệp vụ.' },
      { id: 5, from: 'phong_control', to: 'phong_control', label: '5. Validate dữ liệu đầu vào khách sạn', note: 'Kiểm tra giá hợp lệ, số tầng, khả năng chứa.' },
      { id: 6, from: 'phong_control', to: 'phong_entity', label: '6. Check trùng Số phòng với các phòng hiện có khác', note: 'Tránh trùng lặp số phòng khi nhân viên vô tình sửa số phòng thành số đã có.' },
      { id: 7, from: 'phong_entity', to: 'phong_control', label: '7. Trả kết quả check trùng: Không trùng', isReturn: true, note: 'Hợp lệ để ghi đè dữ liệu.' },
      { id: 8, from: 'phong_control', to: 'phong_entity', label: '8. Ghi dữ liệu cập nhật (UPDATE) vào Database', note: 'Gửi truy vấn SQL UPDATE để sửa thông tin phòng.' },
      { id: 9, from: 'phong_entity', to: 'phong_control', label: '9. Trả về kết quả Sửa thành công', isReturn: true, note: 'Báo hiệu sửa thành công ở tầng vật lý.' },
      { id: 10, from: 'phong_control', to: 'form_sua_phong', label: '10. Báo cập nhật thành công chuyển form', isReturn: true, note: 'Cập nhật giao diện.' },
      { id: 11, from: 'form_sua_phong', to: 'form_chi_tiet_phong', label: '11. Đóng form sửa & Kích hoạt tải lại chi tiết phòng', isReturn: true, note: 'Reset thông tin hiển thị tại chi tiết phòng.' },
      { id: 12, from: 'form_chi_tiet_phong', to: 'nhan_vien', label: '12. Hiển thị thông tin phòng đã sửa đổi mới nhất', isReturn: true, note: 'Thông báo thành công popup ẩn đi.' }
    ]
  },
  {
    id: 'SD9.5',
    title: 'SD9.5 - Xóa phòng (Delete Room)',
    description: 'Chức năng xóa phòng bắt đầu từ màn hình Xem chi tiết phòng, hiển thị dialog xác nhận và kiểm tra ràng buộc nghiệp vụ (không thể xóa phòng đang có đặt phòng tích cực).',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietPhong,
      INITIAL_LIFELINES.hopThoaiXacNhanXoaPhong,
      INITIAL_LIFELINES.phongControl,
      INITIAL_LIFELINES.phongEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_phong', label: '1. Nhấn nút "Xóa phòng"', note: 'Nhân viên yêu cầu xóa phòng.' },
      { id: 2, from: 'form_chi_tiet_phong', to: 'hop_thoai_xoa_phong', label: '2. Hiển thị Hộp thoại xác nhận yêu cầu xóa', isReturn: true, note: 'Hiển thị popup cảnh báo hành động không thể khôi phục.' },
      { id: 3, from: 'nhan_vien', to: 'hop_thoai_xoa_phong', label: '3. Nhấn "Đồng ý/Xác nhận xóa"', note: 'Khách hàng xác nhận quyết định xóa.' },
      { id: 4, from: 'hop_thoai_xoa_phong', to: 'phong_control', label: '4. Gửi yêu cầu xóa phòng (gửi ID phòng)', note: 'Chuyển thông tin xóa sang lớp logic.' },
      { id: 5, from: 'phong_control', to: 'phong_entity', label: '5. Kiểm tra ràng buộc thực thể (có giao dịch hay đặt phòng không?)', note: 'Xác minh xem phòng có Đặt phòng cũ chưa thanh toán, hoặc trạng thái đang thuê không.' },
      { id: 6, from: 'phong_entity', to: 'phong_control', label: '6. Trả kết quả kiểm tra ràng buộc: Sẵn sàng xóa (Không ràng buộc)', isReturn: true, note: 'Phòng trống, không có đặt phòng dang dở.' },
      { id: 7, from: 'phong_control', to: 'phong_entity', label: '7. Gửi truy vấn Xóa phòng vật lý (DELETE FROM Phong)', note: 'Thực thi câu lệnh xóa phòng khỏi hệ thống.' },
      { id: 8, from: 'phong_entity', to: 'phong_control', label: '8. Trả về kết quả xác nhận đã xóa dòng dữ liệu', isReturn: true, note: 'SQL thông báo 1 row affected.' },
      { id: 9, from: 'phong_control', to: 'hop_thoai_xoa_phong', label: '9. Trả kết quả xóa thành công dạng popup', isReturn: true, note: 'Báo thành công cho Boundary.' },
      { id: 10, from: 'hop_thoai_xoa_phong', to: 'form_chi_tiet_phong', label: '10. Đóng popup & yêu cầu nạp lại danh sách', isReturn: true, note: '' },
      { id: 11, from: 'form_chi_tiet_phong', to: 'nhan_vien', label: '11. Điều hướng tự động về Trang quản lý chính', isReturn: true, note: 'Nhân viên thấy danh sách phòng tải lại và phòng đã biến mất.' }
    ]
  },

  // ---------------- FEATURE 10: QUẢN LÝ HÓA ĐƠN ----------------
  {
    id: 'SD10.1',
    title: 'SD10.1 - Tạo hóa đơn (Lập hóa đơn)',
    description: 'Quy trình khởi tạo và thanh toán hóa đơn cho khách hàng check-out từ Booking, hỗ trợ Trợ lý thông minh đối soát, tự động đề xuất mã khuyến mại giảm giá và cập nhật trạng thái dọn phòng tự động.',
    lifelines: [
      { id: 'nhan_vien', name: 'Nhân viên', type: 'actor', description: 'Người thực hiện lập hóa đơn tác nghiệp' },
      { id: 'form_tao_hoa_don', name: ':formTaoHoaDon', type: 'boundary', description: 'Giao diện tạo lập hóa đơn thanh toán' },
      { id: 'control_tao_hoa_don', name: ':controlTaoHoaDon', type: 'control', description: 'Bộ xử lý logic thanh toán & áp khuyến mãi' },
      { id: 'phong_entity', name: ':Phong', type: 'entity', description: 'Thực thể lưu thông tin phòng, đơn giá và trạng thái' },
      { id: 'khuyen_mai_entity', name: ':KhuyenMai', type: 'entity', description: 'Thực thể kiểm soát thông tin các chương trình sự kiện ưu đãi giảm giá' },
      { id: 'hoa_don_entity', name: ':HoaDon', type: 'entity', description: 'Thực thể lưu trữ thông tin hóa đơn khi thanh quyết toán thành công' }
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_tao_hoa_don', label: '1. Yêu cầu chức năng Tạo hóa đơn', note: 'Nhân viên chọn khách hàng đang lưu trú và yêu cầu dọn phòng thanh toán.' },
      { id: 2, from: 'form_tao_hoa_don', to: 'control_tao_hoa_don', label: '2. Lấy thông tin phòng & tiền phòng (maDatPhong)', note: 'Gửi yêu cầu khởi tạo hóa đơn tạm tính cho đặt phòng được chọn.' },
      { id: 3, from: 'control_tao_hoa_don', to: 'phong_entity', label: '3. Truy vấn nạp chi tiết phòng & số đêm ở', note: 'Truy vấn thực thể phòng để lấy thông tin chi tiết phòng và thời gian thuê.' },
      { id: 4, from: 'phong_entity', to: 'control_tao_hoa_don', label: '4. Trả kết quả thông tin phòng & tiền phòng', isReturn: true, note: 'Trả về đơn giá phòng hiện hành, loại phòng và số ngày lưu trú.' },
      { id: 5, from: 'control_tao_hoa_don', to: 'khuyen_mai_entity', label: '5. Truy vấn các chương trình khuyến mãi hiện có', note: 'Tự động gọi dữ liệu bảng Khuyến mãi để kiểm định các thiết chế và mã ưu đãi còn hiệu lực.' },
      { id: 6, from: 'khuyen_mai_entity', to: 'control_tao_hoa_don', label: '6. Trả về danh sách Khuyến mãi & điều kiện áp dụng', isReturn: true, note: 'Phản hồi danh sách mã ưu đãi: SUMMER26, WEEKDAY10, LONGSTAY150,...' },
      { id: 7, from: 'control_tao_hoa_don', to: 'control_tao_hoa_don', label: '7. Tự động kiểm tra điều kiện & gợi ý mã khuyến mãi', note: 'Bộ điều khiển thực hiện đối soát tự động điều kiện lưu trú với quy chuẩn ưu đãi để tìm ra mã khuyến mại tối ưu và gửi gợi ý.' },
      { id: 8, from: 'control_tao_hoa_don', to: 'form_tao_hoa_don', label: '8. Trả kết quả hóa đơn tạm tính & mã gợi ý', isReturn: true, note: 'Đẩy dữ liệu tiền phòng nháp kèm đề xuất mã KM tương tế thích hợp về phía ranh giới (Boundary).' },
      { id: 9, from: 'form_tao_hoa_don', to: 'nhan_vien', label: '9. Hiển thị thông tin & mã gợi ý', isReturn: true, note: 'Giao diện hiển thị trực quan các mã giảm giá được khuyến nghị thích hợp nhất cho nhân viên thao tác áp dụng.' },
      { id: 10, from: 'nhan_vien', to: 'form_tao_hoa_don', label: '10. Nhập phụ thu, KM & ấn "Lập hóa đơn"', note: 'Mở rộng lựa chọn thanh toán, áp dụng mã KM, nhập ghi chú và nhấn Xác nhận.' },
      { id: 11, from: 'form_tao_hoa_don', to: 'control_tao_hoa_don', label: '11. Yêu cầu Lập hóa đơn thanh toán hoàn chỉnh', note: 'Boundary gửi thông tin tổng gộp cuối cùng đã chiết trừ khuyến mãi đầy đủ' },
      { id: 12, from: 'control_tao_hoa_don', to: 'hoa_don_entity', label: '12. Tạo và lưu bản ghi Hóa Đơn mới', note: 'Thực thi SQL lưu bản ghi vào bảng thực thể HoaDon chính thức.' },
      { id: 13, from: 'hoa_don_entity', to: 'control_tao_hoa_don', label: '13. Phản hồi kết quả lưu hóa đơn thành công', isReturn: true, note: 'Cơ sở dữ liệu xác nhận lưu dữ liệu thanh toán thành công.' },
      { id: 14, from: 'control_tao_hoa_don', to: 'phong_entity', label: '14. Cập nhật trạng thái phòng thành "Trống"', note: 'Tự động cập nhật thuộc tính trạng thái phòng từ "Đang thuê" thành "Trống" để dọn sẵn sàng cho lượt sau.' },
      { id: 15, from: 'control_tao_hoa_don', to: 'form_tao_hoa_don', label: '15. Trả thông báo thanh toán thành công', isReturn: true, note: 'Báo cho Form dọn dẹp các trường thông tin.' },
      { id: 16, from: 'form_tao_hoa_don', to: 'nhan_vien', label: '16. Hiển thị thông báo lập hóa đơn thành công', isReturn: true, note: 'Hệ thống hiện thông báo thành công và chuyển hướng nhanh sang xem hóa đơn.' }
    ]
  },
  {
    id: 'SD10.2',
    title: 'SD10.2 - Xem chi tiết hóa đơn (Invoice Details)',
    description: 'Chức năng tra cứu thông tin hóa đơn khi nhấn xem từ danh sách, nạp dữ liệu chi tiết tổng hợp bao gồm tiền phòng và tiền dịch vụ phục vụ nhân viên.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietHoaDon,
      INITIAL_LIFELINES.hoaDonControl,
      INITIAL_LIFELINES.hoaDonEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_hoa_don', label: '1. Chọn hóa đơn từ danh sách để xem chi tiết', note: 'Kích hoạt từ danh sách hóa đơn chính.' },
      { id: 2, from: 'form_chi_tiet_hoa_don', to: 'hoa_don_control', label: '2. Yêu cầu chi tiết hóa đơn (maHoaDon)', note: '' },
      { id: 3, from: 'hoa_don_control', to: 'hoa_don_entity', label: '3. Truy vấn dữ liệu hóa đơn chi tiết trong Database', note: 'SELECT * FROM HoaDon WHERE id = maHoaDon.' },
      { id: 4, from: 'hoa_don_entity', to: 'hoa_don_control', label: '4. Trả về thông tin hóa đơn (ngày tạo, giảm giá, tổng tiền, trạng thái)', isReturn: true, note: '' },
      { id: 5, from: 'hoa_don_control', to: 'form_chi_tiet_hoa_don', label: '5. Phản hồi đối tượng và render giao diện hiển thị', isReturn: true, note: 'Đẩy dữ liệu hiển thị.' },
      { id: 6, from: 'form_chi_tiet_hoa_don', to: 'nhan_vien', label: '6. Hiển thị trang chi tiết hóa đơn kèm các chức năng sửa/hủy/xuất', isReturn: true, note: 'Nhân viên có thể kiểm tra từng dòng giá trị.' }
    ]
  },
  {
    id: 'SD10.3',
    title: 'SD10.3 - Sửa hóa đơn (Edit Invoice)',
    description: 'Sửa hóa đơn mở từ giao diện Xem chi tiết. Cho phép cập nhật thông tin phụ thu, giảm giá, phương thức thanh toán, ghi chú và tự động tính lại tổng tiền thanh toán.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietHoaDon,
      INITIAL_LIFELINES.formSuaHoaDon,
      INITIAL_LIFELINES.hoaDonControl,
      INITIAL_LIFELINES.hoaDonEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_hoa_don', label: '1. Bấm nút "Sửa hóa đơn"', note: '' },
      { id: 2, from: 'form_chi_tiet_hoa_don', to: 'hoa_don_control', label: '2. Kiểm tra trạng thái hóa đơn (Đã hủy? Đã thanh toán?)', note: 'Validate quyền được chỉnh sửa.' },
      { id: 3, from: 'hoa_don_control', to: 'form_sua_hoa_don', label: '3. Cho phép mở FormSuaHoaDon điền sẵn dữ liệu cũ', isReturn: true, note: '' },
      { id: 4, from: 'nhan_vien', to: 'form_sua_hoa_don', label: '4. Thay đổi Phụ thu/Giảm giá/PTTT và bấm "Cập nhật"', note: '' },
      { id: 5, from: 'form_sua_hoa_don', to: 'hoa_don_control', label: '5. Gửi thông tin hóa đơn cập nhật', note: '' },
      { id: 6, from: 'hoa_don_control', to: 'hoa_don_control', label: '6. Tính lại tổng tiền: totalAmount = Tiền phòng + Dịch vụ + Phụ thu - Giảm giá', note: 'Sử dụng nghiệp vụ tính toán lại giá trị thanh toán.' },
      { id: 7, from: 'hoa_don_control', to: 'hoa_don_entity', label: '7. UPDATE thông tin hóa đơn vào CSDL', note: 'Cập nhật lại dòng bản ghi.' },
      { id: 8, from: 'hoa_don_entity', to: 'hoa_don_control', label: '8. Báo cập nhật DB thành công', isReturn: true, note: '' },
      { id: 9, from: 'hoa_don_control', to: 'form_sua_hoa_don', label: '9. Trả kết quả Sửa hóa đơn thành công', isReturn: true, note: '' },
      { id: 10, from: 'form_sua_hoa_don', to: 'form_chi_tiet_hoa_don', label: '10. Đóng form sửa & Kích hoạt tải lại giao diện chi tiết hóa đơn mới nhât', isReturn: true, note: '' },
      { id: 11, from: 'form_chi_tiet_hoa_don', to: 'nhan_vien', label: '11. Hiển thị thông tin hóa đơn sau khi sửa đổi', isReturn: true, note: 'Nhân viên nhìn thấy số tiền thanh toán mới.' }
    ]
  },
  {
    id: 'SD10.4',
    title: 'SD10.4 - Hủy hóa đơn (Cancel Invoice)',
    description: 'Hủy hóa đơn đổi trạng thái hóa đơn thành Đã hủy cùng lý do cụ thể để lưu trữ vết lịch sử, không xóa dữ liệu vật lý.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietHoaDon,
      INITIAL_LIFELINES.hopThoaiXacNhanHuyHoaDon,
      INITIAL_LIFELINES.hoaDonControl,
      INITIAL_LIFELINES.hoaDonEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_hoa_don', label: '1. Chọn nút "Hủy hóa đơn"', note: '' },
      { id: 2, from: 'form_chi_tiet_hoa_don', to: 'hop_thoai_huy_hoa_don', label: '2. Hiển thị popup nhập Lý do hủy hóa đơn', isReturn: true, note: '' },
      { id: 3, from: 'nhan_vien', to: 'hop_thoai_huy_hoa_don', label: '3. Nhập lý do hủy & xác nhận "Hủy hóa đơn"', note: '' },
      { id: 4, from: 'hop_thoai_huy_hoa_don', to: 'hoa_don_control', label: '4. Truyền tải lệnh hủy kèm lý do hủy (cancelReason)', note: '' },
      { id: 5, from: 'hoa_don_control', to: 'hoa_don_entity', label: '5. Kiểm tra tính hợp lệ trạng thái hóa đơn', note: 'Chỉ cho phép hủy hóa đơn chưa bị hủy trước đó.' },
      { id: 6, from: 'hoa_don_entity', to: 'hoa_don_control', label: '6. Xác nhận hợp lệ cho phép hủy', isReturn: true, note: '' },
      { id: 7, from: 'hoa_don_control', to: 'hoa_don_entity', label: '7. Ghi đè trạng thái = "Đã hủy" & lưu lý do vào DB', note: 'Update trạng thái hóa đơn.' },
      { id: 8, from: 'hoa_don_entity', to: 'hoa_don_control', label: '8. Xác nhận lưu thành công', isReturn: true, note: '' },
      { id: 9, from: 'hoa_don_control', to: 'form_chi_tiet_hoa_don', label: '9. Trả kết quả báo hủy thành công', isReturn: true, note: 'Reset trạng thái.' },
      { id: 10, from: 'form_chi_tiet_hoa_don', to: 'nhan_vien', label: '10. Cập nhật hiển thị Hóa đơn trạng thái mờ màu đỏ "ĐÃ HỦY"', isReturn: true, note: 'Có hiển thị lý do hủy rõ ràng.' }
    ]
  },
  {
    id: 'SD10.5',
    title: 'SD10.5 - Xuất hóa đơn PDF/In (Export/Print)',
    description: 'Chức năng in và xuất PDF từ hóa đơn, nạp dữ liệu lịch sử nạp lên Form in trực tuyến.',
    lifelines: [
      INITIAL_LIFELINES.employee,
      INITIAL_LIFELINES.formChiTietHoaDon,
      INITIAL_LIFELINES.hoaDonControl,
      INITIAL_LIFELINES.xuatHoaDonControl,
      INITIAL_LIFELINES.hoaDonEntity
    ],
    steps: [
      { id: 1, from: 'nhan_vien', to: 'form_chi_tiet_hoa_don', label: '1. Nhấn nút "Xuất PDF/In"', note: '' },
      { id: 2, from: 'form_chi_tiet_hoa_don', to: 'hoa_don_control', label: '2. Yêu cầu trích xuất dữ liệu hóa đơn in ấn', note: '' },
      { id: 3, from: 'hoa_don_control', to: 'hoa_don_entity', label: '3. Truy vấn đầy đủ thông tin hóa đơn & booking', note: '' },
      { id: 4, from: 'hoa_don_entity', to: 'hoa_don_control', label: '4. Trả về cấu trúc dữ liệu hóa đơn', isReturn: true, note: '' },
      { id: 5, from: 'hoa_don_control', to: 'xuat_hoa_don_control', label: '5. Chuyển dữ liệu cho bộ xuất bản PDF', note: '' },
      { id: 6, from: 'xuat_hoa_don_control', to: 'xuat_hoa_don_control', label: '6. Render HTML và biên soạn PDF stream dạng bảng chuẩn', note: 'Tính toán lề, định dạng trang.' },
      { id: 7, from: 'xuat_hoa_don_control', to: 'form_chi_tiet_hoa_don', label: '7. Trả link PDF blob hoặc bản vẽ Draft in ấn', isReturn: true, note: 'Chuẩn bị in.' },
      { id: 8, from: 'form_chi_tiet_hoa_don', to: 'nhan_vien', label: '8. Hiện popup xem trước bản in (Print Preview) & Mở hộp thoại In', isReturn: true, note: 'Cho nhân viên bấm CTRL+P để in ra máy in thực tế.' }
    ]
  }
];
