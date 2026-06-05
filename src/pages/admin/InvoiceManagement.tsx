/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Eye, Edit3, Trash2, X, Printer, Download, CheckCircle, 
  AlertTriangle, CreditCard, ChevronRight, FileText, Ban, Layers3, Users,
  Layers, Info, Calendar, DollarSign, ListFilter, ClipboardCheck
} from 'lucide-react';
import type{ Invoice, Booking, Room, Guest, Service, PaymentMethod, InvoiceStatus } from '../../types';
import { INITIAL_GUESTS, INITIAL_SERVICES, PAST_BOOKINGS_AND_ROOMS_REFS } from '../../data';
import SequenceVisualizer from './SequenceVisualizer';

interface InvoiceManagementProps {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onTriggerSequence: (id: string) => void;
  syncSelectedDiagramId: string | null;
}

export default function InvoiceManagement({
  invoices,
  setInvoices,
  rooms,
  setRooms,
  bookings,
  setBookings,
  onTriggerSequence,
  syncSelectedDiagramId
}: InvoiceManagementProps) {
  // Lists filters
  const [searchCode, setSearchCode] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(invoices);

  // Modals boundaries state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showPrintPreview, setShowPrintPreview] = useState<boolean>(false);

  // Active operating invoice
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Split-screen sequence support
  const [activeDiagId, setActiveDiagId] = useState<string>('SD10.2');
  const [showDiagPanel, setShowDiagPanel] = useState<boolean>(true);

  // Form Inputs for Creation (formTaoHoaDon)
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [formSurcharge, setFormSurcharge] = useState<number>(0);
  const [formDiscount, setFormDiscount] = useState<number>(0);
  const [formPayMethod, setFormPayMethod] = useState<PaymentMethod>('Tiền mặt');
  const [formNote, setFormNote] = useState<string>('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('');

  // Form Inputs for Sửa hóa đơn (formSuaHoaDon)
  const [editSurcharge, setEditSurcharge] = useState<number>(0);
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editPayMethod, setEditPayMethod] = useState<PaymentMethod>('Tiền mặt');
  const [editNote, setEditNote] = useState<string>('');

  // Cancellation (hopThoaiXacNhanHuyHoaDon)
  const [cancelReason, setCancelReason] = useState<string>('');

  // Alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    let result = invoices;
    if (searchCode.trim() !== '') {
      result = result.filter(inv => inv.code.toLowerCase().includes(searchCode.trim().toLowerCase()));
    }
    if (filterStatus !== '') {
      result = result.filter(inv => inv.status === filterStatus);
    }
    setFilteredInvoices(result);
  }, [invoices, searchCode, filterStatus]);

  const showTempAlert = (type: 'error' | 'success', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // Helper date parsing (calculating days stayed)
  const getDaysStayed = (start: string, end: string) => {
    const sDate = new Date(start);
    const eDate = new Date(end);
    const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // default to 1 day minimum
  };

  // Calculate temp totals for a specific booking
  const getBookingCalculatedCharges = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { roomCharge: 0, servicesCharge: 0, daysCount: 0, servicesUsedDetail: [] };

    const room = rooms.find(r => r.id === booking.roomId);
    const daysCount = getDaysStayed(booking.checkInDate, booking.checkOutDate);
    const roomCharge = daysCount * (room ? room.price : 350000);

    let servicesCharge = 0;
    const servicesUsedDetail = booking.servicesUsed.map(usage => {
      const sRef = INITIAL_SERVICES.find(s => s.id === usage.serviceId);
      const rowTotal = (sRef ? sRef.price : 0) * usage.quantity;
      servicesCharge += rowTotal;
      return {
        name: sRef ? sRef.name : 'Dịch vụ nâng cấp',
        unit: sRef ? sRef.unit : 'Lần',
        price: sRef ? sRef.price : 0,
        quantity: usage.quantity,
        total: rowTotal
      };
    });

    return { roomCharge, servicesCharge, daysCount, servicesUsedDetail };
  };

  // 10.1 Lọc & Mở form Tạo hóa đơn
  const openCreateInvoice = () => {
    // Pick the first available active booking if any
    const activeBookings = bookings.filter(b => b.status === 'Đang lưu trú');
    if (activeBookings.length > 0) {
      setSelectedBookingId(activeBookings[0].id);
    } else {
      setSelectedBookingId('');
    }
    setFormSurcharge(0);
    setFormDiscount(0);
    setFormPayMethod('Tiền mặt');
    setFormNote('');
    setAppliedCouponCode('');
    
    setShowCreateModal(true);
    onTriggerSequence('SD10.1');
    setActiveDiagId('SD10.1');
  };

  // Submit Tạo hóa đơn
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) {
      showTempAlert('error', 'Vui lòng chọn Đặt phòng để tạo thanh toán!');
      return;
    }

    const booking = bookings.find(b => b.id === selectedBookingId);
    if (!booking) return;

    // Retrieve computations
    const { roomCharge, servicesCharge } = getBookingCalculatedCharges(selectedBookingId);
    const finalAmount = roomCharge + servicesCharge + Number(formSurcharge) - Number(formDiscount);

    // Create Invoice object
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      code: `HD-00${invoices.length + 101}`,
      bookingId: booking.id,
      createdDate: new Date().toISOString(),
      createdBy: 'Trần Nguyễn Khánh Duy', // Mock logged-in staff
      roomCharge,
      servicesCharge,
      surcharge: Number(formSurcharge),
      discount: Number(formDiscount),
      totalAmount: finalAmount,
      paymentMethod: formPayMethod,
      status: 'Đã thanh toán', // Checked elements automatically marks as paid
      note: formNote.trim() || 'Thanh toán check-out hoàn tất.'
    };

    // Transaction modifications:
    // A. Add Invoice
    setInvoices(prev => [newInvoice, ...prev]);

    // B. Free up the room
    setRooms(prevRooms => prevRooms.map(r => r.id === booking.roomId ? { ...r, status: 'Trống' } : r));

    // C. Update booking check-out status
    setBookings(prevBookings => prevBookings.map(b => b.id === booking.id ? { ...b, status: 'Đã thanh toán' } : b));

    setShowCreateModal(false);
    showTempAlert('success', `Đã tạo và thanh quyết toán thành công hóa đơn ${newInvoice.code}!`);
    
    // Auto show details of newly created invoice
    setSelectedInvoice(newInvoice);
    setShowDetailsModal(true);
    onTriggerSequence('SD10.2');
    setActiveDiagId('SD10.2');
  };

  // 10.2 Xem chi tiết hóa đơn
  const handleViewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
    onTriggerSequence('SD10.2');
    setActiveDiagId('SD10.2');
  };

  // 10.3 Sửa hóa đơn (formSuaHoaDon)
  const openEditInvoice = (invoice: Invoice) => {
    if (invoice.status === 'Đã hủy') {
      showTempAlert('error', 'Hóa đơn đã HỦY thì không được phép chỉnh sửa biên tập!');
      return;
    }
    
    setSelectedInvoice(invoice);
    setEditSurcharge(invoice.surcharge);
    setEditDiscount(invoice.discount);
    setEditPayMethod(invoice.paymentMethod);
    setEditNote(invoice.note || '');

    setShowEditModal(true);
    onTriggerSequence('SD10.3');
    setActiveDiagId('SD10.3');
  };

  const handleEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const recalculatedTotal = selectedInvoice.roomCharge + selectedInvoice.servicesCharge + Number(editSurcharge) - Number(editDiscount);

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      surcharge: Number(editSurcharge),
      discount: Number(editDiscount),
      totalAmount: recalculatedTotal,
      paymentMethod: editPayMethod,
      note: editNote.trim()
    };

    setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
    setSelectedInvoice(updatedInvoice);
    setShowEditModal(false);
    showTempAlert('success', `Đã cập nhật số liệu hóa đơn ${updatedInvoice.code} thành công!`);
  };

  // 10.4 Hủy hóa đơn (hopThoaiXacNhanHuyHoaDon)
  const openCancelInvoiceDialog = (invoice: Invoice) => {
    if (invoice.status === 'Đã hủy') {
      showTempAlert('error', 'Hóa đơn này đã ở trạng thái hủy trước đó.');
      return;
    }
    setSelectedInvoice(invoice);
    setCancelReason('');
    setShowCancelModal(true);
    onTriggerSequence('SD10.4');
    setActiveDiagId('SD10.4');
  };

  const handleCancelInvoice = () => {
    if (!selectedInvoice) return;
    if (!cancelReason.trim()) {
      showTempAlert('error', 'Vui lòng điền lý do hủy hóa đơn bắt buộc!');
      return;
    }

    const updatedInvoice: Invoice = {
      ...selectedInvoice,
      status: 'Đã hủy',
      cancelReason: cancelReason.trim()
    };

    setInvoices(prev => prev.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
    
    // Optional business logic: restore room capacity status under circumstances, or keep as is.
    // Here we focus on cancelling invoice record
    setSelectedInvoice(updatedInvoice);
    setShowCancelModal(false);
    showTempAlert('success', `Đã hủy hóa đơn ${selectedInvoice.code} thành công.`);
  };

  // 10.5 Xuất PDF / In (formChiTietHoaDon triggering printable model)
  const handleOpenPrintPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintPreview(true);
    onTriggerSequence('SD10.5');
    setActiveDiagId('SD10.5');
  };

  const handleTriggerBrowserPrint = () => {
    // Visual alert feedback
    showTempAlert('success', 'Đang tải bản in hóa đơn thực tế...');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Utilities
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getGuestAndRoomLabelsForInvoice = (invoice: Invoice) => {
    // 1. Check if past invoice
    const pastRef = PAST_BOOKINGS_AND_ROOMS_REFS.find(p => p.id === invoice.bookingId);
    if (pastRef) {
      return {
        guestName: pastRef.guestName,
        phone: pastRef.phone,
        roomNum: pastRef.roomNum,
        datesLabel: 'Lưu trú lịch sử'
      };
    }

    // 2. Check active or updated booking
    const booking = bookings.find(b => b.id === invoice.bookingId);
    if (!booking) {
      return { guestName: 'Khách lẻ vãng lai', phone: '09xxxxxx', roomNum: 'VIP', datesLabel: 'N/A' };
    }

    const guest = INITIAL_GUESTS.find(g => g.id === booking.guestId);
    const room = rooms.find(r => r.id === booking.roomId);

    return {
      guestName: guest ? guest.fullName : 'Khách ẩn danh',
      phone: guest ? guest.phone : 'Chưa nhập',
      roomNum: room ? room.number : 'Chưa rõ',
      datesLabel: `${booking.checkInDate} đến ${booking.checkOutDate}`
    };
  };

  // Smart automated discount coupon suggestion handler
  const getCouponSuggestions = (): Array<{
    code: string;
    name: string;
    description: string;
    discountValue: number;
    isEligible: boolean;
    reason: string;
  }> => {
    if (!currentSelectedBookingObj || !activeBookingDetail) return [];

    const roomCharge = activeBookingDetail.roomCharge;
    const servicesCharge = activeBookingDetail.servicesCharge;
    const daysCount = activeBookingDetail.daysCount;

    // Evaluate checkout day of week
    const checkoutDate = new Date(currentSelectedBookingObj.checkOutDate);
    const checkoutDay = checkoutDate.getDay(); // 0 is Sunday, 1-5 is Mon-Fri
    const isWeekday = checkoutDay >= 1 && checkoutDay <= 5;

    return [
      {
        code: 'SUMMER26',
        name: 'Mã Khai Hè 2026',
        description: 'Giảm cố định 100.000đ khi thuê phòng VIP hoặc có tổng hóa đơn dịch vụ phụ trợ từ 100.000đ.',
        discountValue: 100000,
        isEligible: !!(currentSelectedRoom?.type === 'VIP' || servicesCharge >= 100000),
        reason: (currentSelectedRoom?.type === 'VIP' || servicesCharge >= 100000)
          ? 'Đủ điều kiện (Sử dụng phòng VIP hoặc dịch vụ >= 100.000đ)'
          : 'Yêu cầu phòng hạng VIP hoặc tổng tiền dịch vụ phát sinh đạt từ 100.000đ trở lên.'
      },
      {
        code: 'WEEKDAY10',
        name: 'Ngày Thường Thư Thái',
        description: 'Giảm 10% tiền thuê phòng nghỉ khi check-out trong tuần (Thứ 2 đến Thứ 6).',
        discountValue: Math.round(roomCharge * 0.1),
        isEligible: isWeekday,
        reason: isWeekday
          ? `Đủ điều kiện: Ngày trả phòng rơi vào Thứ ${checkoutDay === 0 ? 'Chủ Nhật' : checkoutDay + 1}`
          : 'Chỉ hỗ trợ khi khách làm thủ tục Check-out từ Thứ 2 đến Thứ 6.'
      },
      {
        code: 'LONGSTAY150',
        name: 'Đặt Lâu Giảm Sâu',
        description: 'Giảm cố định 150.000đ cho các hợp đồng lưu trú từ 3 đêm trở lên.',
        discountValue: 150000,
        isEligible: daysCount >= 3,
        reason: daysCount >= 3
          ? `Đủ điều kiện: Thời gian lưu trú đạt ${daysCount} đêm (đạt chuẩn >= 3 đêm)`
          : `Yêu cầu lưu trú từ 3 đêm trở lên (Khách hiện tại ở ${daysCount} đêm).`
      },
      {
        code: 'LOYALTY09',
        name: 'Tri Ân Đầu Số Đẹp',
        description: 'Giảm 15% tiền dịch vụ phát sinh (tối đa 60.000đ) dành cho khách hàng có SĐT bắt đầu bằng 09xx.',
        discountValue: currentSelectedGuest?.phone.startsWith('09')
          ? Math.min(60000, Math.round(servicesCharge * 0.15))
          : 0,
        isEligible: !!(currentSelectedGuest?.phone.startsWith('09') && servicesCharge > 0),
        reason: !(currentSelectedGuest?.phone.startsWith('09'))
          ? 'Chỉ áp dụng cho thuê bao di động sử dụng số điện thoại đầu số VIP 09xxx'
          : servicesCharge === 0
          ? 'Yêu cầu khách thỏa mãn SĐT đầu 09 và có phát sinh sử dụng dịch vụ phụ trợ ăn uống/giặt ủi.'
          : 'Đủ điều kiện: Khách có SĐT VIP đầu 09 và đã sử dụng dịch vụ!'
      },
      {
        code: 'E_PAYMENT',
        name: 'Thanh Toán Không Tiền Mặt',
        description: 'Trừ thẳng 30.000đ khi thực hiện thanh toán qua Chuyển Khoản hoặc Thẻ ngân hàng.',
        discountValue: 30000,
        isEligible: (formPayMethod === 'Chuyển khoản' || formPayMethod === 'Thẻ'),
        reason: (formPayMethod === 'Chuyển khoản' || formPayMethod === 'Thẻ')
          ? `Đủ điều kiện: Đang sử dụng phương thức không tiền mặt (${formPayMethod})`
          : 'Vui lòng đổi Phương thức thanh toán sang "Chuyển khoản" hoặc "Thẻ" để kích hoạt.'
      }
    ];
  };

  const applyCouponCodeToForm = (code: string, value: number) => {
    setFormDiscount(value);
    setAppliedCouponCode(code);
    
    const notePrefix = `[Áp dụng mã ${code}] `;
    if (!formNote.startsWith('[Áp dụng mã')) {
      setFormNote(prev => prev ? `${notePrefix}${prev}` : `${notePrefix}Ủu đãi check-out chiết khấu.`);
    } else {
      const cleanedNote = formNote.replace(/^\[Áp dụng mã [A-Z0-9_]+\]\s*/, '');
      setFormNote(`${notePrefix}${cleanedNote}`);
    }
    
    showTempAlert('success', `Đã tự động áp dụng mã ưu đãi ${code} (-${formatVND(value)})!`);
  };

  const removeAppliedCoupon = () => {
    setFormDiscount(0);
    setAppliedCouponCode('');
    setFormNote(prev => prev.replace(/^\[Áp dụng mã [A-Z0-9_]+\]\s*/, ''));
    showTempAlert('success', 'Đã hủy áp dụng mã giảm tiền.');
  };

  // Real-time recalculation of applied coupon eligibility on input changes
  useEffect(() => {
    if (!appliedCouponCode || !selectedBookingId || !activeBookingDetail) return;
    
    const suggestions = getCouponSuggestions();
    const currCoupon = suggestions.find(s => s.code === appliedCouponCode);
    
    if (currCoupon) {
      if (!currCoupon.isEligible) {
        setFormDiscount(0);
        setAppliedCouponCode('');
        setFormNote(prev => prev.replace(/^\[Áp dụng mã [A-Z0-9_]+\]\s*/, ''));
        showTempAlert('error', `Mã giảm giá ${appliedCouponCode} không còn hiệu lực do điều kiện đã thay đổi!`);
      } else if (currCoupon.discountValue !== formDiscount) {
        setFormDiscount(currCoupon.discountValue);
      }
    }
  }, [formPayMethod, selectedBookingId, formSurcharge]);

  const activeBookingDetail = selectedBookingId ? getBookingCalculatedCharges(selectedBookingId) : null;
  const currentSelectedBookingObj = selectedBookingId ? bookings.find(b => b.id === selectedBookingId) : null;
  const currentSelectedGuest = currentSelectedBookingObj ? INITIAL_GUESTS.find(g => g.id === currentSelectedBookingObj.guestId) : null;
  const currentSelectedRoom = currentSelectedBookingObj ? rooms.find(r => r.id === currentSelectedBookingObj.roomId) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">
      {/* Alert Popups */}
      {alertMsg && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-2.5 ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {alertMsg.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-rose-500" />}
            <span className="text-xs md:text-sm font-sans font-medium">{alertMsg.text}</span>
          </div>
        </div>
      )}

      {/* LEFT: Invoices controllers + Lists (split mode) */}
      <div className={`transition-all duration-300 ${showDiagPanel ? 'xl:col-span-7' : 'xl:col-span-12'} grid grid-cols-1 gap-6`}>
        
        {/* Search & Action bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <Layers3 className="w-4 h-4 text-emerald-500" /> Boundary: formTimHoaDon / trangQuanLyHoaDon
              </div>
              <h2 className="font-sans font-semibold text-lg text-slate-900 mt-1">
                10.0 Tra cứu & Quản lý hóa đơn biên lai
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowDiagPanel(!showDiagPanel)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  showDiagPanel 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> 
                {showDiagPanel ? 'Ẩn Sơ đồ' : 'Xem Sơ đồ'}
              </button>

              <button
                onClick={openCreateInvoice}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Lập hóa đơn checkout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Search filter */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Nhập mã hóa đơn... (Ví dụ: HD-00101)"
                className="pl-9 pr-3 py-2 w-full text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 font-sans transition-colors"
              />
            </div>

            {/* Filter status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-indigo-500 font-sans transition-colors"
            >
              <option value="">-- Tất cả trạng thái --</option>
              <option value="Đã thanh toán">Đã thanh toán (Thành công)</option>
              <option value="Chưa thanh toán">Chưa thanh toán</option>
              <option value="Đã hủy">Đã hủy bỏ</option>
            </select>

            <button
              onClick={() => {
                setSearchCode('');
                setFilterStatus('');
                setFilteredInvoices(invoices);
                onTriggerSequence('SD10.2');
                setActiveDiagId('SD10.2');
              }}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ListFilter className="w-3.5 h-3.5" /> Thiết lập lại bộ lọc
            </button>
          </div>
        </div>

        {/* Invoice table view */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
              <span>Hóa đơn khách sạn</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                {filteredInvoices.length} bản ghi
              </span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Control: HoaDonControl &bull; Entity: HoaDon</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Mã hóa đơn</th>
                  <th className="py-3 px-4">Khách hàng / Phòng</th>
                  <th className="py-3 px-4">Ngày lập hóa đơn</th>
                  <th className="py-3 px-4 text-right">Tổng thành tiền</th>
                  <th className="py-3 px-4">Phương thức</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Tác vụ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm text-slate-700 font-sans">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Không có hóa đơn thanh toán nào thỏa mãn bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const reqInfo = getGuestAndRoomLabelsForInvoice(inv);
                    return (
                      <tr key={inv.id} className={`hover:bg-slate-50/50 transition-colors ${inv.status === 'Đã hủy' ? 'bg-slate-50/30 text-slate-400' : ''}`}>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900">{inv.code}</span>
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <p className="font-semibold text-slate-800">{reqInfo.guestName}</p>
                          <p className="text-[10px] text-slate-400">Phòng {reqInfo.roomNum} &bull; {reqInfo.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                          {new Date(inv.createdDate).toLocaleDateString('vi-VN')} {new Date(inv.createdDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                          {formatVND(inv.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            <CreditCard className="w-3 h-3 text-slate-400" /> {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            inv.status === 'Đã thanh toán' ? 'bg-emerald-50 text-emerald-700' :
                            inv.status === 'Chưa thanh toán' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              inv.status === 'Đã thanh toán' ? 'bg-emerald-500' :
                              inv.status === 'Chưa thanh toán' ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewInvoiceDetails(inv)}
                              className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditInvoice(inv)}
                              className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors disabled:opacity-40"
                              disabled={inv.status === 'Đã hủy'}
                              title="Sửa hóa đơn"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openCancelInvoiceDialog(inv)}
                              className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors disabled:opacity-40"
                              disabled={inv.status === 'Đã hủy'}
                              title="Hủy hóa đơn"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT: Visualizer split view */}
      {showDiagPanel && (
        <div className="xl:col-span-5">
          <div className="sticky top-6">
            <SequenceVisualizer 
              activeDiagramId={syncSelectedDiagramId || activeDiagId} 
              titleSuffix="[HOTEL OPERATION]" 
            />
          </div>
        </div>
      )}

      {/* ----------------- MODALS ----------------- */}

      {/* 1. Lập hóa đơn checkout (formTaoHoaDon) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Boundary: formTaoHoaDon</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  10.1 Lập hóa đơn & Tính tiền Check-out
                </h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Select DatPhong option */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã đặt phòng cần Check-out *</label>
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-mono"
                  required
                >
                  <option value="">-- Chọn khách đặt phòng lưu trú tại quầy --</option>
                  {bookings.filter(b => b.status === 'Đang lưu trú').map(b => {
                    const guest = INITIAL_GUESTS.find(g => g.id === b.guestId);
                    const room = rooms.find(r => r.id === b.roomId);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.code} - {guest ? guest.fullName : 'Khách lẻ'} (Phòng {room ? room.number : 'K'}) từ {b.checkInDate}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedBookingId && currentSelectedBookingObj && activeBookingDetail ? (
                <div className="space-y-4 animate-fade-in font-sans text-xs">
                  
                  {/* Dynamic Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-slate-400 uppercase font-mono text-[9px] tracking-wider">Thông tin Khách hàng (Thực thể Khách hàng)</p>
                      <p className="font-bold text-slate-800 text-xs mt-1">{currentSelectedGuest?.fullName}</p>
                      <p className="text-slate-500 mt-0.5">SĐT: {currentSelectedGuest?.phone} &bull; CMND: {currentSelectedGuest?.identityNo}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 uppercase font-mono text-[9px] tracking-wider">Thông tin Phòng thuê (Thực thể Phòng)</p>
                      <p className="font-bold text-slate-800 text-xs mt-1">Phòng {currentSelectedRoom?.number} ({currentSelectedRoom?.type})</p>
                      <p className="text-slate-500 mt-0.5">
                        Ngày lưu lại: {activeBookingDetail.daysCount} đêm ({currentSelectedBookingObj.checkInDate} &rarr; {currentSelectedBookingObj.checkOutDate})
                      </p>
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="bg-slate-50/50 px-3 py-2 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                      <span>Bảng chi tiết tạm tính chi phí (Đối chiếu Thực thể)</span>
                      <span className="text-[10px] font-mono text-indigo-500 uppercase font-bold">Thực thể: DatPhong, Phong, DichVu</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                      {/* Room rate row */}
                      <div className="p-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">Tiền thuê phòng nghỉ</p>
                          <p className="text-[10px] text-slate-400">{activeBookingDetail.daysCount} đêm &times; {formatVND(currentSelectedRoom?.price || 0)}</p>
                        </div>
                        <span className="font-mono font-bold text-slate-800">{formatVND(activeBookingDetail.roomCharge)}</span>
                      </div>

                      {/* Services detail lists if any */}
                      {activeBookingDetail.servicesUsedDetail.length > 0 ? (
                        <div className="p-3 space-y-2">
                          <p className="font-semibold text-slate-800">Dịch vụ phụ trợ phát sinh:</p>
                          <div className="space-y-1.5 pl-2">
                            {activeBookingDetail.servicesUsedDetail.map((sv, idx) => (
                              <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                                <span>{sv.name} ({sv.quantity} &times; {formatVND(sv.price)})</span>
                                <span className="font-mono">{formatVND(sv.total)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 text-slate-400 italic">
                          Không phát sinh dịch vụ ăn uống, giặt ủi trong chu kỳ lưu trú.
                        </div>
                      )}

                      {/* Sum of standard items */}
                      <div className="p-3 bg-indigo-50/20 flex justify-between items-center text-xs font-semibold text-slate-700 border-t border-slate-100">
                        <span>Cộng gộp (Phòng + Dịch vụ):</span>
                        <span className="font-mono font-bold text-indigo-700">
                          {formatVND(activeBookingDetail.roomCharge + activeBookingDetail.servicesCharge)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Surcharge & Discount Inputs */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ thu phát sinh (VNĐ)</label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={formSurcharge}
                        onChange={(e) => setFormSurcharge(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans flex items-center gap-1">
                        <span>Chiết khấu / Giảm giá (VNĐ)</span>
                        {appliedCouponCode && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            Mã: {appliedCouponCode}
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={formDiscount}
                        onChange={(e) => {
                          setFormDiscount(Number(e.target.value));
                          // If they manually edit the discount value, check if it matches the applied coupon, else clear the coupon state
                          const suggestions = getCouponSuggestions();
                          const matched = suggestions.find(s => s.code === appliedCouponCode);
                          if (!matched || matched.discountValue !== Number(e.target.value)) {
                            setAppliedCouponCode('');
                          }
                        }}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Smart Automated Coupon Suggestions */}
                  <div className="bg-indigo-50/20 rounded-xl p-3.5 border border-indigo-100/60 shadow-xs font-sans">
                    <div className="flex items-center justify-between gap-2.5 mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold">
                        <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                        <span>Trợ lý gợi ý mã giảm giá tự động (Smart Promo Assistant)</span>
                      </div>
                      <span className="text-[9px] font-mono text-indigo-500/80 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Tự động khớp dữ liệu CSDL khách hàng
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {getCouponSuggestions().map((s) => {
                        const isCurrentlyApplied = appliedCouponCode === s.code;
                        return (
                          <div
                            key={s.code}
                            className={`p-2.5 rounded-lg border text-xs transition-all flex items-start justify-between gap-3 ${
                              isCurrentlyApplied
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs ring-1 ring-indigo-300/30'
                                : s.isEligible
                                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center flex-wrap gap-2">
                                <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide capitalize ${
                                  isCurrentlyApplied
                                    ? 'bg-indigo-600 text-white'
                                    : s.isEligible
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  {s.code}
                                </span>
                                <span className={`font-semibold ${isCurrentlyApplied ? 'text-indigo-900' : 'text-slate-800'}`}>
                                  {s.name}
                                </span>
                                {s.isEligible && (
                                  <span className="font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-sm text-[11px]">
                                    -{formatVND(s.discountValue)}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal">{s.description}</p>
                              <div className={`text-[9px] flex items-center gap-1 ${
                                s.isEligible ? 'text-slate-400' : 'text-rose-500 font-medium'
                              }`}>
                                <Info className="w-3 h-3 text-current shrink-0" />
                                <span>{s.reason}</span>
                              </div>
                            </div>

                            <div className="shrink-0 pt-0.5">
                              {isCurrentlyApplied ? (
                                <button
                                  type="button"
                                  onClick={removeAppliedCoupon}
                                  className="px-2.5 py-1 text-[10px] font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                                  title="Nhấn để hủy ưu đãi này"
                                >
                                  Bỏ dùng
                                </button>
                              ) : s.isEligible ? (
                                <button
                                  type="button"
                                  onClick={() => applyCouponCodeToForm(s.code, s.discountValue)}
                                  className="px-2.5 py-1 text-[10px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 rounded-md shadow-xs transition-colors cursor-pointer"
                                >
                                  Áp dụng
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-200/50 rounded-md border border-slate-200/20 cursor-not-allowed"
                                >
                                  Khóa mã
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Method & Notes */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phương thức thanh toán</label>
                      <select
                        value={formPayMethod}
                        onChange={(e) => setFormPayMethod(e.target.value as PaymentMethod)}
                        className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500"
                      >
                        <option value="Tiền mặt">Tiền mặt (Cash)</option>
                        <option value="Chuyên khoản">Chuyển khoản ngân hàng (Banking QR)</option>
                        <option value="Thẻ">Thẻ nội địa / Visa Master</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú hóa đơn</label>
                      <input
                        type="text"
                        value={formNote}
                        onChange={(e) => setFormNote(e.target.value)}
                        placeholder="Nốt nhận phòng sớm, chiết khấu thẻ vip..."
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Real-time total calculation box */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between font-sans">
                    <div>
                      <p className="text-emerald-800 font-bold text-xs">Tổng tiền phải trả thanh toán:</p>
                      <p className="text-[10px] text-emerald-600 mt-1 uppercase font-mono">Tính tự động: [Phòng] + [DV] + [Phụ thu] - [Giảm giá]</p>
                    </div>
                    <span className="font-mono text-xl font-black text-emerald-700">
                      {formatVND(activeBookingDetail.roomCharge + activeBookingDetail.servicesCharge + formSurcharge - formDiscount)}
                    </span>
                  </div>

                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 italic bg-slate-50 rounded-xl border border-slate-100">
                  Vui lòng chọn hợp đồng đặt phòng chưa thanh toán ở danh sách xổ xuống trên để nạp thông số tính tiền hoàn tất.
                </div>
              )}

              {/* Action operations button layout */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  disabled={!selectedBookingId}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm disabled:opacity-40 disabled:hover:bg-indigo-600"
                >
                  Xác nhận Tạo hóa đơn
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Chi tiết Hóa đơn (formChiTietHoaDon) */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Boundary: formChiTietHoaDon</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  10.2 Xem chi tiết hóa đơn: {selectedInvoice.code}
                </h3>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-sans text-xs md:text-sm text-slate-600">
              {/* Badge status alert */}
              {selectedInvoice.status === 'Đã hủy' && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-xl flex gap-2.5">
                  <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">HÓA ĐƠN ĐÃ BỊ HỦY BỎ VÔ HIỆU KHỎI LỊCH SỬ DOANH THU</h4>
                    <p className="mt-0.5 leading-normal">Lý do hủy: {selectedInvoice.cancelReason || 'Không có ghi chú thêm.'}</p>
                  </div>
                </div>
              )}

              {/* Staff and general details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Nhân viên lập biên nhận</span>
                  <span className="text-slate-800 font-bold mt-1 inline-block text-xs">{selectedInvoice.createdBy}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Thời gian thanh toán ghi sổ</span>
                  <span className="text-slate-800 font-mono text-xs mt-1 inline-block">
                    {new Date(selectedInvoice.createdDate).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Guest & Room mapping box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] uppercase tracking-wider mb-2">
                  <Users className="w-3.5 h-3.5" /> Chi tiết Khách hàng & Phòng lưu trú
                </div>
                {(() => {
                  const data = getGuestAndRoomLabelsForInvoice(selectedInvoice);
                  return (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tên khách hàng:</span>
                        <span className="font-bold text-slate-800 mt-0.5 inline-block">{data.guestName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Số phòng:</span>
                        <span className="font-bold font-mono text-slate-800 mt-0.5 inline-block">Phòng {data.roomNum}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Thời gian lưu trú:</span>
                        <span className="text-slate-700 mt-0.5 inline-block">{data.datesLabel}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Items tabular breakdown */}
              <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-700">
                  Chi tiết cơ cấu các nguồn thu (VNĐ)
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>1. Tiền phòng cơ bản:</span>
                    <span className="font-mono font-semibold">{formatVND(selectedInvoice.roomCharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Tiền dịch vụ ăn uống / giặt ủi phát sinh:</span>
                    <span className="font-mono font-semibold">{formatVND(selectedInvoice.servicesCharge)}</span>
                  </div>
                  <div className="flex justify-between text-indigo-600">
                    <span>3. Phụ thu bổ sung:</span>
                    <span className="font-mono font-semibold">+ {formatVND(selectedInvoice.surcharge)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>4. Khấu trừ giảm giá quà tặng:</span>
                    <span className="font-mono font-semibold">- {formatVND(selectedInvoice.discount)}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 flex justify-between items-center text-sm font-bold border-t border-slate-100">
                  <span className="text-slate-800">Tổng thanh toán sau cùng:</span>
                  <span className="font-mono text-emerald-800 text-base">{formatVND(selectedInvoice.totalAmount)}</span>
                </div>
              </div>

              {/* Interactive buttons for further extends */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-3 rounded-2xl shrink-0">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">Các nghiệp vụ mở rộng (Extend)</span>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>Trạng thái: <strong>{selectedInvoice.status}</strong></span>
                    <span>&bull;</span>
                    <span>PTTT: <strong>{selectedInvoice.paymentMethod}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditInvoice(selectedInvoice);
                    }}
                    disabled={selectedInvoice.status === 'Đã hủy'}
                    className="px-3 py-2 bg-white hover:bg-amber-50 border border-slate-200 rounded-xl hover:text-amber-700 font-semibold text-slate-700 cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Sửa
                  </button>

                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openCancelInvoiceDialog(selectedInvoice);
                    }}
                    disabled={selectedInvoice.status === 'Đã hủy'}
                    className="px-3 py-2 bg-white hover:bg-rose-50 border border-slate-200 rounded-xl hover:text-rose-700 font-semibold text-slate-700 cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" /> Hủy hóa đơn
                  </button>

                  <button
                    onClick={() => {
                      handleOpenPrintPreview(selectedInvoice);
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Xuất & In
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Sửa hóa đơn (formSuaHoaDon) */}
      {showEditModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Boundary: formSuaHoaDon</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  10.3 Điều chỉnh hóa đơn: {selectedInvoice.code}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditInvoice} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 text-xs text-slate-600 mb-2">
                <div className="font-semibold text-slate-700">Dữ liệu cố định từ CSDL:</div>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <p>Tiền thuê phòng: <strong>{formatVND(selectedInvoice.roomCharge)}</strong></p>
                  <p>Tiền dùng dịch vụ: <strong>{formatVND(selectedInvoice.servicesCharge)}</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mức Phụ thu (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editSurcharge}
                    onChange={(e) => setEditSurcharge(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Xét Chiết khấu Giảm giá (VNĐ)</label>
                  <input
                    type="number"
                    min={0}
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phương thức thanh toán mới</label>
                  <select
                    value={editPayMethod}
                    onChange={(e) => setEditPayMethod(e.target.value as PaymentMethod)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500"
                  >
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                    <option value="Thẻ">Thẻ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú điều chỉnh</label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-amber-800">Cấu hình cộng gộp tiền mới:</span>
                <span className="font-mono font-bold text-amber-900 text-sm">
                  {formatVND(selectedInvoice.roomCharge + selectedInvoice.servicesCharge + editSurcharge - editDiscount)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Đóng Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Xác nhận Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Hủy hóa đơn dialog (hopThoaiXacNhanHuyHoaDon) */}
      {showCancelModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              <div>
                <span className="text-[10px] font-mono text-rose-500 block uppercase">Boundary: hopThoaiXacNhanHuyHoaDon</span>
                <h3 className="font-sans font-bold text-slate-800 text-sm md:text-base mt-0.5">
                  Yêu cầu Hủy Hóa Đơn {selectedInvoice.code}
                </h3>
              </div>
            </div>

            <div className="p-5 font-sans space-y-4">
              <p className="text-xs text-slate-600 leading-normal">
                Hóa đơn sẽ bị khôi phục và chuyển sang trạng thái <strong>Đã hủy</strong>. Thống kê vật lý lịch sử phòng và hóa đơn vẫn bảo lưu dòng chứng từ này với vết ghi rõ lý do.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhập lý do hủy hóa đơn bắt buộc *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Ví dụ: Khách hàng đổi ý, thanh toán nhầm mã, gộp doanh nghiệp..."
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-rose-500 font-sans resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Thoát
                </button>
                <button
                  type="button"
                  onClick={handleCancelInvoice}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-40"
                >
                  Xác nhận hủy hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Printable PDF Preview Draft (manHinhXuatHoaDon) */}
      {showPrintPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full my-8 flex flex-col overflow-hidden">
            
            {/* Header controls inside printable modal */}
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700">Preview Bản in Hóa đơn (Chế độ Xuất bản)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerBrowserPrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> In hóa đơn thực tế (Ctrl+P)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showTempAlert('success', 'Tệp PDF hóa đơn đã được tải xuống thiết bị thành công (mô phỏng).');
                    setShowPrintPreview(false);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Tải PDF
                </button>

                <button 
                  onClick={() => setShowPrintPreview(false)}
                  className="p-1 px-2.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 text-xs font-semibold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Print canvas sheets */}
            <div className="p-8 bg-slate-100/50 overflow-y-auto flex-1 flex justify-center">
              <div 
                id="printable-hotel-invoice-sheet" 
                className="bg-white p-8 max-w-[210mm] w-full border border-slate-300 rounded-xs shadow-md print:border-none print:shadow-none print:p-0 flex flex-col justify-between font-sans text-xs text-slate-800"
                style={{ minHeight: '297mm' }} // A4 standard
              >
                
                {/* Header Sheet */}
                <div>
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
                    <div>
                      <h1 className="text-sm font-bold uppercase tracking-wide text-slate-900">KHÁCH SẠN ANTIGRAVITY RESORT & SPA</h1>
                      <p className="text-[10px] text-slate-500 mt-1">Hành lang 5, Đường Antigravity, Cloud, Việt Nam</p>
                      <p className="text-[10px] text-slate-500">Hotline: 1900-555-999 / Email: contact@antigravity-hotel.com</p>
                    </div>

                    <div className="text-right">
                      <h2 className="text-base font-black text-rose-700 tracking-wide">HÓA ĐƠN THANH TOÁN</h2>
                      <p className="text-[10px] font-mono font-semibold text-slate-600 mt-0.5">Số phiếu: <span className="font-bold">{selectedInvoice.code}</span></p>
                      <p className="text-[10px] text-slate-500">Ngày in: {new Date().toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  {/* Core Meta Fields */}
                  <div className="py-5 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">ĐỐI TƯỢNG THANH TOÁN / KHÁCH HÀNG</p>
                      {(() => {
                        const data = getGuestAndRoomLabelsForInvoice(selectedInvoice);
                        return (
                          <>
                            <p className="font-bold text-slate-950 text-xs">{data.guestName}</p>
                            <p className="text-[10px] text-slate-600">Điện thoại liên lạch: {data.phone}</p>
                            <p className="text-[10px] text-slate-600">Hình thức thanh toán: <strong className="text-slate-800">{selectedInvoice.paymentMethod}</strong></p>
                          </>
                        );
                      })()}
                    </div>

                    <div className="space-y-1 text-right">
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">CHỨNG TỪ HOẠT ĐỘNG KHÁCH SẠN</p>
                      {(() => {
                        const data = getGuestAndRoomLabelsForInvoice(selectedInvoice);
                        return (
                          <>
                            <p className="text-[11px] text-slate-900">Số phòng thuê: <strong className="text-slate-950">Phòng {data.roomNum}</strong></p>
                            <p className="text-[10px] text-slate-600">Thời gian lưu lại: {data.datesLabel}</p>
                            <p className="text-[10px] text-slate-600">Nhân viên thu ngân lập: {selectedInvoice.createdBy}</p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Pricing Sheet Table */}
                  <table className="w-full text-left border-collapse border border-slate-300 mt-2">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-300">
                        <th className="p-2.5 border-r border-slate-300">STT</th>
                        <th className="p-2.5 border-r border-slate-300">Nội dung chi phí chi tiết</th>
                        <th className="p-2.5 text-right border-r border-slate-300">Đơn vị thanh toán</th>
                        <th className="p-2.5 text-center border-r border-slate-300">Số lượng</th>
                        <th className="p-2.5 text-right">Thành tiền (VNĐ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {/* Room row */}
                      <tr className="align-top">
                        <td className="p-2.5 text-center border-r border-slate-300">01</td>
                        <td className="p-2.5 border-r border-slate-300">
                          <p className="font-semibold text-slate-900">Chi phí phòng nghỉ</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Tiền thuê phòng khách sạn tính theo chu kỳ lưu trú qua đêm.</p>
                        </td>
                        <td className="p-2.5 text-right border-r border-slate-300 font-mono">Tính theo chu kỳ</td>
                        <td className="p-2.5 text-center border-r border-slate-300 font-mono">1</td>
                        <td className="p-2.5 text-right font-mono font-semibold">{formatVND(selectedInvoice.roomCharge)}</td>
                      </tr>

                      {/* Services fee row */}
                      <tr className="align-top">
                        <td className="p-2.5 text-center border-r border-slate-300">02</td>
                        <td className="p-2.5 border-r border-slate-300">
                          <p className="font-semibold text-slate-900">Dịch vụ gia tăng phát sinh</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Tiền đồ uống minibar, cơm đĩa phục vụ tại phòng, giặt là.</p>
                        </td>
                        <td className="p-2.5 text-right border-r border-slate-300 font-mono">Cộng dồn dịch vụ</td>
                        <td className="p-2.5 text-center border-r border-slate-300 font-mono">Tổng hợp</td>
                        <td className="p-2.5 text-right font-mono font-semibold">{formatVND(selectedInvoice.servicesCharge)}</td>
                      </tr>

                      {/* Surcharge row */}
                      {selectedInvoice.surcharge > 0 && (
                        <tr className="align-top">
                          <td className="p-2.5 text-center border-r border-slate-300">03</td>
                          <td className="p-2.5 border-r border-slate-300">
                            <p className="font-semibold text-indigo-600">Phụ thu nhận phòng sớm / các bổ trợ khác</p>
                          </td>
                          <td className="p-2.5 text-right border-r border-slate-300 font-mono">Cổ định</td>
                          <td className="p-2.5 text-center border-r border-slate-300 font-mono">1</td>
                          <td className="p-2.5 text-right font-mono font-semibold text-indigo-600">{formatVND(selectedInvoice.surcharge)}</td>
                        </tr>
                      )}

                      {/* Discount row */}
                      {selectedInvoice.discount > 0 && (
                        <tr className="align-top">
                          <td className="p-2.5 text-center border-r border-slate-300">04</td>
                          <td className="p-2.5 border-r border-slate-300">
                            <p className="font-semibold text-rose-600">Khấu trừ khuyến mãi / Giảm trừ voucher quà tặng</p>
                          </td>
                          <td className="p-2.5 text-right border-r border-slate-300 font-mono">Khấu trừ</td>
                          <td className="p-2.5 text-center border-r border-slate-300 font-mono">1</td>
                          <td className="p-2.5 text-right font-mono font-semibold text-rose-600">- {formatVND(selectedInvoice.discount)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Summary row */}
                  <div className="mt-5 flex justify-end">
                    <div className="w-1/2 space-y-2 text-right">
                      <div className="flex justify-between text-[11px]">
                        <span>Cộng tổng thành tiền:</span>
                        <span className="font-mono">{formatVND(selectedInvoice.roomCharge + selectedInvoice.servicesCharge)}</span>
                      </div>
                      {selectedInvoice.surcharge > 0 && (
                        <div className="flex justify-between text-[11px] text-indigo-600">
                          <span>Phụ thu liên đới:</span>
                          <span className="font-mono">+ {formatVND(selectedInvoice.surcharge)}</span>
                        </div>
                      )}
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between text-[11px] text-rose-600">
                          <span>Khấu trừ voucher ưu đãi:</span>
                          <span className="font-mono">- {formatVND(selectedInvoice.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm font-black border-t-2 border-slate-900 pt-2 shrink-0">
                        <span>Tổng tiền thanh toán cuối:</span>
                        <span className="font-mono text-base text-rose-700">{formatVND(selectedInvoice.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Standard Notes */}
                  {selectedInvoice.note && (
                    <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                      <p className="font-bold text-[10px] uppercase text-slate-500">Ghi chú kèm theo chứng từ:</p>
                      <p className="text-[10px] text-slate-700 mt-1 leading-normal">{selectedInvoice.note}</p>
                    </div>
                  )}
                </div>

                {/* Sign Sheet Footer */}
                <div className="mt-12 select-none">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="font-bold text-slate-900 uppercase">Khách hàng thanh toán</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">(Ký và ghi rõ họ tên)</p>
                      <div className="h-16" />
                      <p className="font-semibold text-slate-700 font-sans">
                        {getGuestAndRoomLabelsForInvoice(selectedInvoice).guestName}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 uppercase">Nhân viên lập biên lai</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">(Ký đóng dấu thu tiền)</p>
                      <div className="h-16" />
                      <p className="font-semibold text-slate-700 font-sans">
                        {selectedInvoice.createdBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-12 pt-6 border-t border-slate-200">
                    <p className="text-[9px] text-slate-400 font-mono tracking-wider">CÁM ƠN QUÝ KHÁCH ĐÃ CHUYÊN TẦM LỰA CHỌN ANTIGRAVITY HOTEL &bull; CHÚC QUÝ KHÁCH HẠNH TRÌNH VUI VẺ!</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
