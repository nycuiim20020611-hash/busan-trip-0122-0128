import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MapPin, Coffee, Train, Star, X, Save, ShoppingBag, CalendarDays, Clock } from 'lucide-react';
import { ItineraryItem } from '../types';
import ConfirmModal from './ConfirmModal';
import { getKoreanLocation } from '../services/openai';

interface ItineraryProps {
  items: ItineraryItem[];
  setItems: (items: ItineraryItem[]) => void;
}

const Itinerary: React.FC<ItineraryProps> = ({ items, setItems }) => {
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('all');

  // Group items by date
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, ItineraryItem[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedItems).sort();

  // Filter dates based on selection
  const displayDates = selectedDate === 'all'
    ? sortedDates
    : sortedDates.filter(d => d === selectedDate);

  const handleEdit = (item: ItineraryItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    const newItem: ItineraryItem = {
      id: Date.now().toString(),
      date: selectedDate === 'all' ? '2026-01-22' : selectedDate,
      time: '12:00',
      activity: '新行程',
      category: 'activity',
      location: '',
      notes: ''
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setItems(items.filter(i => i.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleSave = () => {
    if (!editingItem) return;

    // Check if updating or adding new
    const exists = items.find(i => i.id === editingItem.id);
    if (exists) {
      setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
    } else {
      setItems([...items, editingItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'food': return <Coffee className="w-4 h-4 text-orange-500" />;
      case 'transport': return <Train className="w-4 h-4 text-blue-500" />;
      case 'activity': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4 text-pink-500" />;
      default: return <MapPin className="w-4 h-4 text-gray-500" />;
    }
  };

  const getDayOfWeek = (dateStr: string) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const d = new Date(dateStr);
    return `星期${days[d.getDay()]}`;
  };

  // Generate 24h time options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const updateTime = (type: 'hour' | 'minute', val: string) => {
    if (!editingItem) return;
    const [h, m] = editingItem.time.split(':');
    if (type === 'hour') {
      setEditingItem({ ...editingItem, time: `${val}:${m}` });
    } else {
      setEditingItem({ ...editingItem, time: `${h}:${val}` });
    }
  };

  const handleOpenMap = async (location: string) => {
    if (!location) return;

    // 1. 【關鍵】先打開一個空白分頁
    // 這必須在點擊的第一時間執行，才能避開瀏覽器的 Popup 攔截
    const newWindow = window.open('', '_blank');

    // 2. 在新分頁中給予使用者反饋 (Loading 狀態)
    // 這樣使用者知道系統正在運作，而不是當機
    if (newWindow) {
      newWindow.document.title = "Naver Map 搜尋中...";
      newWindow.document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
        <h3>正在搜尋 Naver Map...</h3>
        <p>正在將「${location}」轉換為韓文精準定位</p>
        <div style="margin-top:10px; color: #666;">請稍候...</div>
      </div>
    `;
    }

    try {
      // 3. 執行 AI 轉換
      const result = await getKoreanLocation(location);

      // 解析結果 (根據你 System Prompt 設定的 JSON key)
      // 優先順序：韓文店名 > 韓文地址 > 原文中
      const query = result.koreanName || result.address || location;

      // 4. 拿到結果後，將剛剛那個空白分頁轉址到 Naver Map
      if (newWindow) {
        newWindow.location.href = `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
      }

    } catch (error) {
      console.error("Failed to translate", error);

      // 5. 如果 AI 失敗或超時，還是要將分頁導向 (Fallback)
      // 直接用中文搜尋
      if (newWindow) {
        newWindow.location.href = `https://map.naver.com/p/search/${encodeURIComponent(location)}`;
      }
    }
  };

  return (
    <div className="pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ocean-800">行程表</h2>
        <button
          onClick={handleAddNew}
          className="bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg transition-all active:scale-95"
        >
          <Plus size={18} className="mr-1" /> 新增
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
        <button
          onClick={() => setSelectedDate('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedDate === 'all'
            ? 'bg-ocean-600 text-white shadow-md'
            : 'bg-white text-slate-500 border border-slate-200 hover:bg-ocean-50'
            }`}
        >
          全部
        </button>
        {sortedDates.map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedDate === date
              ? 'bg-ocean-600 text-white shadow-md'
              : 'bg-white text-slate-500 border border-slate-200 hover:bg-ocean-50'
              }`}
          >
            {date.split('-')[1]}/{date.split('-')[2]} ({getDayOfWeek(date)})
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {displayDates.map(date => (
          <div key={date} className="relative">
            <div className="sticky top-0 bg-ocean-50/95 backdrop-blur-sm z-10 py-3 border-b border-ocean-200 mb-4 flex items-baseline">
              <span className="text-2xl font-bold text-ocean-700 mr-2">{date.split('-')[1]}/{date.split('-')[2]}</span>
              <span className="text-sm text-slate-500 font-medium">{getDayOfWeek(date)}</span>
            </div>

            <div className="space-y-4 pl-4 border-l-2 border-ocean-200 ml-2">
              {groupedItems[date]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => (
                  <div key={item.id} className="relative bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">

                    {/* Timeline Dot */}
                    <div className="absolute -left-[25px] top-6 w-4 h-4 bg-white border-4 border-ocean-400 rounded-full"></div>

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-ocean-600 font-bold mb-1">
                          {item.time}
                          <span className="mx-2 text-slate-300">|</span>
                          <span className="flex items-center gap-1 uppercase text-xs tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {getIcon(item.category)}
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{item.activity}</h3>
                        {item.location && (
                          <div className="flex items-center text-slate-500 text-sm mb-1">
                            <MapPin size={14} className="mr-1" />
                            <span className="mr-2">{item.location}</span>
                            <button
                              onClick={() => handleOpenMap(item.location!)}
                              className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full hover:bg-green-600 transition-colors flex items-center gap-1"
                              title="在 Naver Map 開啟"
                            >
                              <MapPin size={10} /> Naver Map
                            </button>
                          </div>
                        )}
                        {item.notes && (
                          <p className="text-sm text-slate-500 mt-2 bg-ocean-50 p-2 rounded-lg inline-block">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-2 relative z-20">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="p-2 text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-full transition-colors cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-ocean-50">
              <h3 className="font-bold text-lg text-ocean-800">
                {items.find(i => i.id === editingItem.id) ? '編輯行程' : '新增行程'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">日期</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                      value={editingItem.date}
                      min="2026-01-22"
                      max="2026-01-28"
                      onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    />
                    <CalendarDays size={18} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">時間 (24h)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400 appearance-none text-center font-bold text-lg"
                        value={editingItem.time.split(':')[0]}
                        onChange={(e) => updateTime('hour', e.target.value)}
                      >
                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                    <span className="font-bold text-slate-400">:</span>
                    <div className="relative flex-1">
                      <select
                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400 appearance-none text-center font-bold text-lg"
                        value={editingItem.time.split(':')[1]}
                        onChange={(e) => updateTime('minute', e.target.value)}
                      >
                        {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">活動名稱</label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={editingItem.activity}
                  onChange={(e) => setEditingItem({ ...editingItem, activity: e.target.value })}
                  placeholder="例如: 吃烤肉"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">地點</label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="例如: 海雲台"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">類別</label>
                <div className="flex gap-2">
                  {['food', 'activity', 'transport', 'shopping', 'other'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setEditingItem({ ...editingItem, category: cat as any })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${editingItem.category === cat
                        ? 'bg-ocean-500 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                      {cat === 'food' ? '美食' : cat === 'activity' ? '景點' : cat === 'transport' ? '交通' : cat === 'shopping' ? '購物' : '其他'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">備註</label>
                <textarea
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-400 min-h-[100px]"
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  placeholder="備註事項..."
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-ocean-600 text-white font-bold rounded-xl shadow-lg shadow-ocean-200 hover:bg-ocean-700 hover:shadow-xl transition-all flex justify-center items-center gap-2"
              >
                <Save size={18} /> 儲存
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="刪除行程"
        message="確定要刪除這個行程嗎？此動作無法復原。"
        confirmText="刪除"
        isDangerous={true}
      />
    </div>
  );
};

export default Itinerary;