/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, RefreshCw, Eye, Edit3, Trash2, X, AlertTriangle, 
  CheckCircle, ShieldAlert, Home, Users, Layers, Info, Layers3
} from 'lucide-react';
import type { Room, RoomType, RoomStatus } from '../../types';
import SequenceVisualizer from './SequenceVisualizer';

interface RoomManagementProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onTriggerSequence: (id: string) => void;
  syncSelectedDiagramId: string | null;
}

export default function RoomManagement({ 
  rooms, 
  setRooms, 
  onTriggerSequence,
  syncSelectedDiagramId
}: RoomManagementProps) {
  // Filters & Search
  const [searchNumber, setSearchNumber] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Results
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Selected operational items
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // Forms Inputs
  const [formNumber, setFormNumber] = useState<string>('');
  const [formName, setFormName] = useState<string>(''); // BỔ SUNG: Tên phòng mới
  const [formType, setFormType] = useState<RoomType>('Đơn');
  const [formFloor, setFormFloor] = useState<number>(1);
  const [formPrice, setFormPrice] = useState<number>(350000);
  const [formCapacity, setFormCapacity] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<RoomStatus>('Trống');
  const [formDescription, setFormDescription] = useState<string>('');

  // Alerts
  const [alertMsg, setAlertMsg] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Split-screen sequence support
  const [activeDiagId, setActiveDiagId] = useState<string>('SD9.1');
  const [showDiagPanel, setShowDiagPanel] = useState<boolean>(true);

  // Search logic handler (formTimPhong boundary)
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Trigger SD9.1 sequence visually
    onTriggerSequence('SD9.1');
    setActiveDiagId('SD9.1');

    let result = rooms;
    if (searchNumber.trim() !== '') {
      result = result.filter(r => r.number.includes(searchNumber.trim()));
    }
    if (filterType !== '') {
      result = result.filter(r => r.type === filterType);
    }
    if (filterStatus !== '') {
      result = result.filter(r => r.status === filterStatus);
    }
    setFilteredRooms(result);
    showTempAlert('success', `Đã lọc tìm thấy ${result.length} phòng phù hợp!`);
  };

  const handleResetFilters = () => {
    setSearchNumber('');
    setFilterType('');
    setFilterStatus('');
    setFilteredRooms(rooms);
    onTriggerSequence('SD9.1');
    setActiveDiagId('SD9.1');
    showTempAlert('success', 'Đã đặt lại bộ lọc danh sách phòng.');
  };

  // Sync state on general room items changes
  useEffect(() => {
    let result = rooms;
    if (searchNumber.trim() !== '') {
      result = result.filter(r => r.number.includes(searchNumber.trim()));
    }
    if (filterType !== '') {
      result = result.filter(r => r.type === filterType);
    }
    if (filterStatus !== '') {
      result = result.filter(r => r.status === filterStatus);
    }
    setFilteredRooms(result);
  }, [rooms]);

  // Alert dismiss helper
  const showTempAlert = (type: 'error' | 'success', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  // Open Add Room Modal (formThemPhong)
  const openAddRoom = () => {
    setFormNumber('');
    setFormName(''); // Reset tên phòng
    setFormType('Đơn');
    setFormFloor(1);
    setFormPrice(350000);
    setFormCapacity(1);
    setFormStatus('Trống');
    setFormDescription('');
    setShowAddModal(true);
    
    onTriggerSequence('SD9.2');
    setActiveDiagId('SD9.2');
  };

  // Submit Add Room Logic
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validations
    if (!formNumber.trim()) {
      showTempAlert('error', 'Vui lòng nhập Số phòng!');
      return;
    }
    if (!formName.trim()) {
      showTempAlert('error', 'Vui lòng nhập Tên phòng sang trọng!');
      return;
    }
    if (formPrice <= 0 || isNaN(formPrice)) {
      showTempAlert('error', 'Giá phòng phải lớn hơn 0!');
      return;
    }
    if (formCapacity <= 0 || isNaN(formCapacity)) {
      showTempAlert('error', 'Sức chứa phải lớn hơn 0!');
      return;
    }

    // 2. Check room number duplicate
    const duplicated = rooms.find(r => r.number === formNumber.trim());
    if (duplicated) {
      showTempAlert('error', `Số phòng ${formNumber.trim()} đã tồn tại trong hệ thống!`);
      return;
    }

    // 3. Save new room (Đã bổ sung trường name)
    const newRoom: Room = {
      id: `R-${Date.now()}`,
      number: formNumber.trim(),
      name: formName.trim(), // Đồng bộ thêm tên phòng
      type: formType,
      floor: Number(formFloor),
      price: Number(formPrice),
      capacity: Number(formCapacity),
      status: formStatus,
      description: formDescription.trim() || 'Chưa cập nhật mô tả phòng.'
    };

    setRooms(prev => [newRoom, ...prev]);
    setShowAddModal(false);
    showTempAlert('success', `Thêm thành công phòng số ${newRoom.number}!`);
  };

  // Open Room Details View (formChiTietPhong)
  const viewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setShowDetailsModal(true);
    
    // Trigger SD9.3
    onTriggerSequence('SD9.3');
    setActiveDiagId('SD9.3');
  };

  // Open Edit form (formSuaPhong)
  const openEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setFormNumber(room.number);
    setFormName(room.name || `Phòng ${room.number}`); // Load tên cũ hoặc tên mặc định
    setFormType(room.type);
    setFormFloor(room.floor);
    setFormPrice(room.price);
    setFormCapacity(room.capacity);
    setFormStatus(room.status);
    setFormDescription(room.description);
    
    setShowEditModal(true);
    // SD9.4
    onTriggerSequence('SD9.4');
    setActiveDiagId('SD9.4');
  };

  // Submit Edit Room Logic
  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    // Validations
    if (!formNumber.trim()) {
      showTempAlert('error', 'Số phòng không được bỏ trống!');
      return;
    }
    if (!formName.trim()) {
      showTempAlert('error', 'Tên phòng không được bỏ trống!');
      return;
    }
    if (formPrice <= 0) {
      showTempAlert('error', 'Giá phòng phải lớn hơn 0!');
      return;
    }

    // Check duplicate with OTHER rooms
    const duplicated = rooms.find(r => r.number === formNumber.trim() && r.id !== selectedRoom.id);
    if (duplicated) {
      showTempAlert('error', `Số phòng ${formNumber} đã được sử dụng bởi phòng khác!`);
      return;
    }

    // Save (Đã bổ sung trường name)
    const updatedRoom: Room = {
      ...selectedRoom,
      number: formNumber.trim(),
      name: formName.trim(), // Sửa tên phòng
      type: formType,
      floor: Number(formFloor),
      price: Number(formPrice),
      capacity: Number(formCapacity),
      status: formStatus,
      description: formDescription.trim()
    };

    setRooms(prev => prev.map(r => r.id === selectedRoom.id ? updatedRoom : r));
    setSelectedRoom(updatedRoom);
    setShowEditModal(false);
    showTempAlert('success', `Cập nhật thành công phòng số ${updatedRoom.number}!`);
  };

  // Open delete warning dialog (hopThoaiXacNhanXoaPhong)
  const openDeleteConfirmDialog = (room: Room) => {
    setSelectedRoom(room);
    setShowDeleteConfirm(true);
    
    // Trigger SD9.5
    onTriggerSequence('SD9.5');
    setActiveDiagId('SD9.5');
  };

  // Submit Delete Room Logic
  const handleDeleteRoom = () => {
    if (!selectedRoom) return;

    // Check bounds: Nếu phòng đang có khách hoặc đang được thuê thì hạn chế xóa
    if (selectedRoom.status === 'Đang sử dụng') {
      showTempAlert('error', `Không thể xóa phòng ${selectedRoom.number} do đang có khách đang sử dụng thuê phòng!`);
      setShowDeleteConfirm(false);
      return;
    }

    setRooms(prev => prev.filter(r => r.id !== selectedRoom.id));
    setShowDeleteConfirm(false);
    setShowDetailsModal(false);
    setSelectedRoom(null);
    showTempAlert('success', `Đã xóa phòng thành công khỏi cơ sở dữ liệu khách sạn!`);
  };

  // Help format pricing
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

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

      {/* LEFT: Management Form + Grid Layout */}
      <div className={`transition-all duration-300 ${showDiagPanel ? 'xl:col-span-7' : 'xl:col-span-12'} grid grid-cols-1 gap-6`}>
        
        {/* Search & Controller Card (formTimPhong) */}
        <div id="hotel-rooms-search-card" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <Layers3 className="w-4 h-4 text-emerald-500" /> Boundary: formTimPhong
              </div>
              <h2 className="font-sans font-semibold text-lg text-slate-900 mt-1">
                9.1 Tra cứu & Tìm kiếm phòng khách sạn
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
                {showDiagPanel ? 'Ẩn Sơ đồ Sequence' : 'Xem Sơ đồ Sequence'}
              </button>

              <button
                onClick={openAddRoom}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-semibold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Thêm phòng mới
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="Nhập số phòng... (Ví dụ: 101)"
                className="pl-9 pr-3 py-2 w-full text-xs md:text-sm bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 font-sans transition-colors"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-indigo-500 font-sans transition-colors"
            >
              <option value="">-- Tất cả loại phòng --</option>
              <option value="Đơn">Phòng Đơn</option>
              <option value="Đôi">Phòng Đôi</option>
              <option value="VIP">Phòng VIP cao cấp</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 outline-none focus:bg-white focus:border-indigo-500 font-sans transition-colors"
            >
              <option value="">-- Tất cả trạng thái --</option>
              <option value="Trống">Trống (Sẵn sàng)</option>
              <option value="Đang sử dụng">Đang sử dụng</option>
              <option value="Bảo trì">Bảo trì sửa chữa</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-semibold py-2.5 rounded-xl cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" /> Lọc Tìm
              </button>
              
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl cursor-pointer transition-colors"
                title="Làm mới bộ lọc"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Room Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
              <span>Danh sách kết quả</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                {filteredRooms.length} phòng
              </span>
            </h3>
            
            <div className="text-[10px] font-mono text-slate-400">
              Control: PhongControl &bull; Entity: Phong
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Số phòng</th>
                  <th className="py-3 px-4">Tên phòng nghỉ</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4 text-right">Giá / đêm</th>
                  <th className="py-3 px-4 text-center">Sức chứa</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm text-slate-700 font-sans">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 font-sans">
                      Không tìm thấy phòng nào phù hợp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold font-mono text-slate-900">
                        Phòng {room.number}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {room.name || `Phòng ${room.number}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                          room.type === 'VIP' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                          room.type === 'Đôi' ? 'bg-indigo-50 text-indigo-800' : 'bg-slate-50 text-slate-800'
                        }`}>
                          {room.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800">
                        {formatVND(room.price)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-600">
                          <Users className="w-3 h-3 text-slate-400" /> {room.capacity} khách
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          room.status === 'Trống' ? 'bg-emerald-50 text-emerald-700' :
                          room.status === 'Đang sử dụng' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            room.status === 'Trống' ? 'bg-emerald-500' :
                            room.status === 'Đang sử dụng' ? 'bg-indigo-500' : 'bg-rose-500'
                          }`} />
                          {room.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => viewRoomDetails(room)}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditRoom(room)}
                            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                            title="Sửa phòng"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteConfirmDialog(room)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
                            title="Xóa phòng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RIGHT: Visualizer Panel */}
      {showDiagPanel && (
        <div className="xl:col-span-5">
          <div className="sticky top-6">
            <SequenceVisualizer 
              activeDiagramId={syncSelectedDiagramId || activeDiagId} 
              titleSuffix="[HOTEL OPERATIONS]" 
            />
          </div>
        </div>
      )}

      {/* ----------------- MODALS ----------------- */}

      {/* 1. Add Room Modal (formThemPhong) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Boundary: formThemPhong</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  9.2 Thêm phòng khách sạn mới
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddRoom} className="p-5 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số phòng *</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    placeholder="Nhập số... ví dụ: 204"
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên phòng sang trọng *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ví dụ: Phòng Deluxe City View"
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loại phòng</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RoomType)}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-sans"
                  >
                    <option value="Đơn">Đơn (Single)</option>
                    <option value="Đôi">Đôi (Double)</option>
                    <option value="VIP">VIP (Premium Suite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tầng</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sức chứa tối đa (Khách)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái khởi tạo</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RoomStatus)}
                    className="w-full text-[11px] md:text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 font-sans"
                  >
                    <option value="Trống">Trống (Sẵn sàng)</option>
                    <option value="Bảo trì">Bảo trì nâng cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá thuê theo đêm (VNĐ) *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs font-mono">₫</span>
                    </span>
                    <input
                      type="number"
                      step={10000}
                      min={10000}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full pl-7 text-xs md:text-sm border border-slate-200 rounded-lg pr-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết phòng</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả trang thiết bị, hướng phòng, ban công..."
                  rows={3}
                  className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-sans resize-none"
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-3 flex gap-2 border border-slate-200/50">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  Chương trình sẽ tự động kích hoạt tiến trình kiểm tra nghiệp vụ và đảm bảo Số phòng không bị trùng trước khi viết bản ghi vào cơ sở dữ liệu.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy thao tác
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Xác nhận lưu phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Room Details Modal (formChiTietPhong) */}
      {showDetailsModal && selectedRoom && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden flex flex-col animate-scale-up">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Boundary: formChiTietPhong</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  9.3 Chi tiết phòng khách sạn: {selectedRoom.name}
                </h3>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 space-y-4 font-sans text-xs md:text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Mã thực thể phòng</span>
                  <span className="text-slate-800 font-mono font-bold mt-1 inline-block">{selectedRoom.id}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Số phòng hoạt động</span>
                  <span className="text-slate-800 font-bold mt-1 inline-block text-sm">Phòng {selectedRoom.number}</span>
                </div>
              </div>

              {/* Specs Bento Box */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                  <Layers className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
                  <span className="text-[10px] text-slate-400 block">Vị trí</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono mt-0.5 inline-block">Tầng {selectedRoom.floor}</span>
                </div>

                <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
                  <span className="text-[10px] text-slate-400 block">Sức chứa</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 inline-block">{selectedRoom.capacity} người</span>
                </div>

                <div className="p-3 text-center rounded-xl bg-slate-50 border border-slate-100">
                  <Home className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <span className="text-[10px] text-slate-400 block">Loại phòng</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 inline-block">{selectedRoom.type}</span>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-center justify-between border-y border-slate-100 py-3 px-1">
                <span className="font-semibold text-slate-700">Giá phòng theo đêm:</span>
                <span className="font-mono font-bold text-lg text-emerald-700">{formatVND(selectedRoom.price)}</span>
              </div>

              {/* Description */}
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Mô tả dịch vụ phòng:</span>
                <p className="p-3 bg-slate-50 rounded-xl leading-relaxed text-slate-600 border border-slate-200/40 text-xs text-justify">
                  {selectedRoom.description}
                </p>
              </div>

              {/* Active Status indicator */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Trạng thái phòng:</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none ${
                  selectedRoom.status === 'Trống' ? 'bg-emerald-100 text-emerald-800' :
                  selectedRoom.status === 'Đang sử dụng' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedRoom.status === 'Trống' ? 'bg-emerald-500' :
                    selectedRoom.status === 'Đang sử dụng' ? 'bg-indigo-500' : 'bg-rose-500'
                  }`} />
                  {selectedRoom.status}
                </span>
              </div>

              {/* Operations redirect */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">Thao tác liên kết (Extend)</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sửa hoặc Xóa từ form Chi tiết phòng</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openEditRoom(selectedRoom);
                    }}
                    className="p-2 border border-slate-200 bg-white hover:bg-slate-50 hover:text-amber-600 rounded-xl text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Sửa
                  </button>
                  <button
                    onClick={() => {
                      openDeleteConfirmDialog(selectedRoom);
                    }}
                    className="p-2 border border-rose-100 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa phòng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Room Modal (formSuaPhong) */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-medium">Boundary: formSuaPhong</span>
                <h3 className="font-sans font-semibold text-slate-800 text-sm md:text-base mt-0.5">
                  9.4 Sửa và Cập nhật thông tin phòng số {selectedRoom.number}
                </h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleEditRoom} className="p-5 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số phòng</label>
                  <input
                    type="text"
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên phòng sang trọng *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loại phòng</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as RoomType)}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                  >
                    <option value="Đơn">Đơn</option>
                    <option value="Đôi">Đôi</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tầng</label>
                  <input
                    type="number"
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sức chứa</label>
                  <input
                    type="number"
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái phòng</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as RoomStatus)}
                    className="w-full text-[11px] md:text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 font-sans"
                  >
                    <option value="Trống">Trống</option>
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Bảo trì">Bảo trì</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giá thuê đêm (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-xs font-mono">₫</span>
                    </span>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full pl-7 text-xs md:text-sm border border-slate-200 rounded-lg pr-3 py-1.5 outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả phòng</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full text-xs md:text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 font-sans resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Đóng Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Xác nhận sửa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirm Modal (hopThoaiXacNhanXoaPhong) */}
      {showDeleteConfirm && selectedRoom && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-rose-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="text-[9px] font-mono text-rose-500 block uppercase font-medium">Boundary: hopThoaiXacNhanXoaPhong</span>
                <h3 className="font-sans font-bold text-slate-800 text-sm md:text-base mt-0.5">
                  Xác nhận xóa phòng số {selectedRoom.number}
                </h3>
              </div>
            </div>

            <div className="p-5 font-sans space-y-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="text-xs text-rose-800 leading-normal">
                  <p className="font-bold">Cảnh báo nghiêm trọng:</p>
                  <p className="mt-0.5">Bản ghi phòng và các định dạng liên quan sẽ bị xóa vĩnh viễn khỏi Database khách sạn. Hành động này không thể hoàn tác.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                Lớp điều khiển <span className="font-mono bg-slate-100 px-1 py-0.5 text-rose-600 font-bold rounded">PhongControl</span> sẽ tự động xác định các giao dịch đặt phòng, hóa đơn ràng buộc và chỉ cho phép xóa nếu không tồn tại bất kỳ ràng buộc vật lý nào!
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleDeleteRoom}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Đồng ý xóa vĩnh viễn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}