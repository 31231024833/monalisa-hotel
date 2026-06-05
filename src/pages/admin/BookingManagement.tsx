/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, UserCheck, Coffee, AlertTriangle, CheckCircle, Clock
} from 'lucide-react';
import type { Booking, Room, Guest, BookingServiceUsage } from '../../types'; // Đã sửa đường dẫn
import { INITIAL_GUESTS, INITIAL_SERVICES } from '../../data'; // Đã sửa đường dẫn

interface BookingManagementProps {
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

export default function BookingManagement({
  bookings,
  setBookings,
  rooms,
  setRooms
}: BookingManagementProps) {
  // Modals state
  const [showCheckInModal, setShowCheckInModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
  const [selectedBookingForServices, setSelectedBookingForServices] = useState<Booking | null>(null);

  // Form check-in inputs
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestIdentity, setGuestIdentity] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>('2026-06-05');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-06-08');

  // Service Order inputs
  const [selectedServiceId, setSelectedServiceId] = useState<string>('S-01');
  const [serviceQuantity, setServiceQuantity] = useState<number>(1);

  // Alerts feedback
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const showTempAlert = (type: 'error' | 'success', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  const vacantRooms = rooms.filter(r => r.status === 'Trống');

  // Submit Check-In
  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) {
      showTempAlert('error', 'Vui lòng chọn phòng trống cần nhận!');
      return;
    }
    if (!guestName.trim() || !guestPhone.trim() || !guestIdentity.trim()) {
      showTempAlert('error', 'Vui lòng điền họ tên, số điện thoại và CMND/CCCD của khách!');
      return;
    }

    // 1. Create guest
    const guestId = `G-${Date.now()}`;
    const newGuest: Guest = {
      id: guestId,
      fullName: guestName.trim(),
      phone: guestPhone.trim(),
      email: guestEmail.trim() || 'khachrecept@gmail.com',
      identityNo: guestIdentity.trim()
    };
    INITIAL_GUESTS.push(newGuest); // Sync to mock pool

    // 2. Create Booking
    const newBooking: Booking = {
      id: `B-${Date.now()}`,
      code: `BK-0${Math.floor(10000 + Math.random() * 90000)}`,
      roomId: selectedRoomId,
      guestId: guestId,
      checkInDate,
      checkOutDate,
      status: 'Đang lưu trú',
      servicesUsed: []
    };

    // 3. Persist state
    setBookings(prev => [newBooking, ...prev]);
    setRooms(prevRooms => prevRooms.map(r => r.id === selectedRoomId ? { ...r, status: 'Đang sử dụng' } : r));

    setShowCheckInModal(false);
    showTempAlert('success', `Làm thủ tục Check-In nhận phòng thành công cho khách ${newGuest.fullName}!`);
  };

  // Submit Service Order
  const handleOrderService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForServices) return;

    const service = INITIAL_SERVICES.find((s: any) => s.id === selectedServiceId);
    if (!service) return;

    const newUsage: BookingServiceUsage = {
      serviceId: selectedServiceId,
      quantity: Number(serviceQuantity),
      dateRef: new Date().toISOString().split('T')[0]
    };

    setBookings(prevBookings => prevBookings.map(b => {
      if (b.id === selectedBookingForServices.id) {
        // Find if this service is already used today in this booking to consolidate
        const existingIdx = b.servicesUsed.findIndex((s: any) => s.serviceId === selectedServiceId);
        if (existingIdx !== -1) {
          const updatedServices = [...b.servicesUsed];
          updatedServices[existingIdx].quantity += Number(serviceQuantity);
          return { ...b, servicesUsed: updatedServices };
        } else {
          return { ...b, servicesUsed: [...b.servicesUsed, newUsage] };
        }
      }
      return b;
    }));

    showTempAlert('success', `Đã gọi thành công ${serviceQuantity} ${service.unit} ${service.name} chuyển lên phòng.`);
    setShowServiceModal(false);
    setSelectedBookingForServices(null);
  };

  const getGuestDetails = (guestId: string) => {
    return INITIAL_GUESTS.find((g: any) => g.id === guestId) || { fullName: 'Khách lẻ vãng lai', phone: 'Chưa cập nhật' };
  };

  const getRoomDetails = (roomId: string) => {
    return rooms.find((r: any) => r.id === roomId) || { number: 'N/A', type: 'Đơn' };
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Informational Alerts */}
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

      {/* Header and trigger details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">Quy trình tiền phòng</span>
          <h2 className="font-sans font-bold text-lg text-slate-900 mt-1">
            Quản lý nhận phòng lưu trú (Check-In) & Gọi dịch vụ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Nơi tiếp nhận khách hàng vãng lai tại quầy lễ tân, cấp phòng hoạt động, và đặt đơn hàng Minibar/Cơm tối trước khi thực hiện viết biên nhận checkout.
          </p>
        </div>

        <button
          onClick={() => {
            if (vacantRooms.length === 0) {
              showTempAlert('error', 'Hiện không còn phòng trống nào! Vui lòng dọn dẹp hoặc dọn trống phòng bảo trì.');
              return;
            }
            setSelectedRoomId(vacantRooms[0].id);
            setGuestName('');
            setGuestPhone('');
            setGuestIdentity('');
            setShowCheckInModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <UserCheck className="w-4.5 h-4.5" /> Check-In tiếp nhận phòng mới
        </button>
      </div>

      {/* Booking Records Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mb-4 flex items-center gap-2">
          Hợp đồng thuê phòng đang kích hoạt
          <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
            {bookings.filter((b: any) => b.status === 'Đang lưu trú').length} khách đang ở
          </span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Mã Booking</th>
                <th className="py-3 px-4">Số Phòng Cấp</th>
                <th className="py-3 px-4">Hồ sơ khách hàng</th>
                <th className="py-3 px-4">Kỳ hạn lưu trú</th>
                <th className="py-3 px-4 text-center">Số DV đã gọi</th>
                <th className="py-3 px-4">Bảo chứng trạng thái</th>
                <th className="py-3 px-4 text-center">Gọi dịch vụ phòng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs md:text-sm text-slate-700 font-sans">
              {bookings.filter((b: any) => b.status === 'Đang lưu trú').length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Không có lưu trú dở dang nào đang chờ thanh toán check-out lúc này.
                  </td>
                </tr>
              ) : (
                bookings.filter((b: any) => b.status === 'Đang lưu trú').map((b) => {
                  const guest = getGuestDetails(b.guestId);
                  const room = getRoomDetails(b.roomId);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {b.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono">
                        Phòng {room.number}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{guest.fullName}</p>
                        <p className="text-[10px] text-slate-400">SĐT: {guest.phone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {b.checkInDate} &rarr; {b.checkOutDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-indigo-600">
                        {b.servicesUsed.reduce((sum: number, s: any) => sum + s.quantity, 0)} sản phẩm
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 text-[11px] px-2 py-0.5 rounded border border-yellow-100 font-medium animate-pulse">
                          <Clock className="w-3 h-3 text-yellow-600 shrink-0" /> Đang ở dịch vụ
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedBookingForServices(b);
                            setSelectedServiceId('S-01');
                            setServiceQuantity(1);
                            setShowServiceModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 font-sans text-xs font-semibold rounded-lg border border-slate-200 inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Coffee className="w-3.5 h-3.5 text-indigo-500" /> Gọi đồ &bull; Phục vụ phòng
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------- MODALS ------------------- */}

      {/* 1. Modal Check-In tiếp nhận phòng mới */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono text-indigo-500 block uppercase font-semibold">TẬP NGHIỆP VỤ: LỄ TÂN</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  Check-In Tiếp nhận và Cấp phòng cho khách mới
                </h3>
              </div>
              <button onClick={() => setShowCheckInModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCheckIn} className="p-5 space-y-4 text-xs md:text-sm font-sans flex-1">
              
              {/* Select available rooms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cấp phòng hoạt động *</label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 font-mono"
                  required
                >
                  {vacantRooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.number} - {r.type} (Đài giá: {formatVND(r.price)} /đêm)
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Detail Fields */}
              <div className="space-y-3.5 border-t border-slate-100 pt-3">
                <p className="font-bold text-slate-700 text-xs">Hồ sơ khách đại diện:</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Họ và tên khách đại diện *</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Nguyễn Hồng Phúc,..."
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs text-slate-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Số điện thoại khách *</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="09xx..."
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs text-slate-700 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Định danh CMND / CCCD *</label>
                    <input
                      type="text"
                      value={guestIdentity}
                      onChange={(e) => setGuestIdentity(e.target.value)}
                      placeholder="030..."
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs text-slate-700 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Hộp thư Email liên hệ (Nếu có)</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="mail@gmail.com"
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-slate-100 pt-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời điểm nhận phòng *</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dự định Check-out *</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Ẩn Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Đồng ý phát hành chìa khóa
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Phục vụ phòng / Gọi dịch vụ */}
      {showServiceModal && selectedBookingForServices && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 block uppercase font-bold">Thao tác: minibar & phục vụ xe dắt</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  Ghi thêm mặt hàng phục vụ phòng {getRoomDetails(selectedBookingForServices.roomId).number}
                </h3>
              </div>
              <button onClick={() => { setShowServiceModal(false); setSelectedBookingForServices(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOrderService} className="p-5 space-y-4 font-sans text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase font-mono text-[9px] block">Khách hàng đại diện thụ hưởng:</p>
                <p className="text-slate-800 font-bold text-xs mt-1">
                  {getGuestDetails(selectedBookingForServices.guestId).fullName} &bull; SĐT: {getGuestDetails(selectedBookingForServices.guestId).phone}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn dịch vụ, vật tư *</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500"
                >
                  {INITIAL_SERVICES.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.name} - {formatVND(s.price)} /{s.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng / Suất *</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={serviceQuantity}
                  onChange={(e) => setServiceQuantity(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              {/* Subtotal real-time computation helper */}
              {(() => {
                const s = INITIAL_SERVICES.find((srv: any) => srv.id === selectedServiceId);
                if (!s) return null;
                return (
                  <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-100 flex justify-between font-mono font-bold text-emerald-800 text-[11px]">
                    <span>Ước lượng cộng dồn:</span>
                    <span>{formatVND(s.price * serviceQuantity)}</span>
                  </div>
                );
              })()}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setShowServiceModal(false); setSelectedBookingForServices(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Bỏ qua
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Xác nhận gọi, chuyển đồ lên phòng
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}