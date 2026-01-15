import React, { useState } from 'react';
import { ShoppingBag, UtensilsCrossed, Camera, CheckSquare, Square, Trash2, Plus, BedDouble, Bus, Edit2, X, Save } from 'lucide-react';
import { WishlistItem, WishlistCategory } from '../types';

interface WishlistProps {
  items: WishlistItem[];
  setItems: (items: WishlistItem[]) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<WishlistCategory>('food');
  const [filter, setFilter] = useState<WishlistCategory | 'all'>('all');
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  
  const toggleCheck = (id: string) => {
    setItems(items.map(item => item.id === id ? {...item, checked: !item.checked} : item));
  };

  const deleteItem = (id: string, e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     if(window.confirm('移除這個願望？')) {
        setItems(items.filter(i => i.id !== id));
     }
  };

  const addItem = (e: React.FormEvent) => {
      e.preventDefault();
      if(!newItemName) return;
      setItems([...items, {
          id: Date.now().toString(),
          name: newItemName,
          note: '',
          category: newItemCategory,
          checked: false
      }]);
      setNewItemName('');
  };

  const updateItem = () => {
    if (!editingItem) return;
    setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
    setEditingItem(null);
  };

  const categories: {key: WishlistCategory, label: string, icon: any, color: string, bg: string}[] = [
      { key: 'food', label: '食', icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-50' },
      { key: 'shopping', label: '衣', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-50' },
      { key: 'stay', label: '住', icon: BedDouble, color: 'text-purple-500', bg: 'bg-purple-50' },
      { key: 'transport', label: '行', icon: Bus, color: 'text-blue-500', bg: 'bg-blue-50' },
      { key: 'fun', label: '育樂', icon: Camera, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const getIcon = (cat: string) => {
     const found = categories.find(c => c.key === cat);
     const Icon = found ? found.icon : UtensilsCrossed;
     const color = found ? found.color : 'text-slate-500';
     return <Icon size={16} className={color} />;
  };

  const renderItem = (item: WishlistItem) => (
    <div key={item.id} className={`bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-all group ${item.checked ? 'opacity-60 bg-slate-50' : 'hover:shadow-md'}`}>
        <div className="flex items-center gap-4 overflow-hidden flex-1 cursor-pointer" onClick={() => toggleCheck(item.id)}>
            <div className={`text-ocean-500 shrink-0 transition-transform ${item.checked ? '' : 'group-hover:scale-110'}`}>
                {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {filter !== 'all' && (
                        <span className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">{getIcon(item.category)}</span>
                    )}
                    <h4 className={`font-bold text-slate-800 truncate ${item.checked ? 'line-through' : ''}`}>{item.name}</h4>
                </div>
                {item.note && <p className="text-sm text-slate-500 truncate">{item.note}</p>}
            </div>
        </div>
        <div className="flex gap-1 relative z-10">
             <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingItem(item); }}
                className="text-slate-300 hover:text-ocean-500 p-2 shrink-0 transition-colors cursor-pointer"
            >
                <Edit2 size={18} />
            </button>
            <button 
                type="button"
                onClick={(e) => deleteItem(item.id, e)} 
                className="text-slate-300 hover:text-red-400 p-2 shrink-0 transition-colors cursor-pointer"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
  );

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-bold text-ocean-800 mb-4">願望清單</h2>

      {/* Filter Bar (Sticky) */}
      {/* Top offset adjusted to match header height approx 56px */}
      <div className="sticky top-[56px] z-30 bg-ocean-50/95 backdrop-blur-sm -mx-6 px-6 py-2 pb-4 mb-2 flex gap-2 overflow-x-auto scrollbar-hide border-b border-ocean-100/50">
         <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                filter === 'all' 
                ? 'bg-ocean-600 text-white shadow-ocean-200 ring-2 ring-ocean-100' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
         >
            全部
         </button>
         {categories.map(cat => (
             <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1 shadow-sm ${
                    filter === cat.key 
                    ? 'bg-ocean-600 text-white shadow-ocean-200 ring-2 ring-ocean-100' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
             >
                <cat.icon size={14} />
                {cat.label}
             </button>
         ))}
      </div>

      <form onSubmit={addItem} className="mb-6 bg-ocean-50 p-4 rounded-2xl border border-ocean-100">
        <div className="flex gap-2 mb-3">
            <input 
                className="flex-1 p-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border-none focus:outline-none focus:ring-2 focus:ring-ocean-400"
                placeholder="新增願望..."
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
            />
            <button type="submit" className="bg-ocean-500 text-white p-3 rounded-xl shadow-md hover:bg-ocean-600 transition-colors">
                <Plus size={24} />
            </button>
        </div>
        <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
                <button
                    key={cat.key}
                    type="button"
                    onClick={() => setNewItemCategory(cat.key)}
                    className={`flex-1 min-w-[60px] py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                        newItemCategory === cat.key 
                        ? 'bg-white border-ocean-500 text-ocean-600 ring-2 ring-ocean-200' 
                        : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white'
                    }`}
                >
                    <cat.icon size={18} className={newItemCategory === cat.key ? cat.color : ''} />
                    {cat.label}
                </button>
            ))}
        </div>
      </form>

      {/* Grouped Lists or Filtered List */}
      <div className="grid grid-cols-1 gap-4">
        {filter === 'all' ? (
             categories.map(cat => {
                 const catItems = items.filter(i => i.category === cat.key);
                 if (catItems.length === 0) return null;
                 return (
                     <div key={cat.key} className="mb-2">
                         <div className={`flex items-center gap-2 mb-3 px-1 ${cat.color}`}>
                             <cat.icon size={18} />
                             <h3 className="font-bold text-lg">{cat.label}</h3>
                             <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">{catItems.length}</span>
                         </div>
                         <div className="space-y-3">
                            {catItems.map(renderItem)}
                         </div>
                     </div>
                 )
             })
        ) : (
            <>
                {items.filter(item => item.category === filter).length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        沒有符合的願望項目
                    </div>
                )}
                {items.filter(item => item.category === filter).map(renderItem)}
            </>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg text-ocean-800">編輯願望</h3>
                    <button onClick={() => setEditingItem(null)}><X size={20} className="text-slate-400" /></button>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">名稱</label>
                    <input
                        type="text"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">分類</label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                type="button"
                                onClick={() => setEditingItem({...editingItem, category: cat.key})}
                                className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                                    editingItem.category === cat.key 
                                    ? 'bg-white border-ocean-500 text-ocean-600 ring-2 ring-ocean-200' 
                                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white'
                                }`}
                            >
                                <cat.icon size={16} className={editingItem.category === cat.key ? cat.color : ''} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">備註</label>
                    <textarea 
                        className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-400 min-h-[80px]"
                        value={editingItem.note}
                        onChange={(e) => setEditingItem({...editingItem, note: e.target.value})}
                        placeholder="新增備註..."
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => setEditingItem(null)} 
                        className="flex-1 py-2 text-slate-500 font-bold bg-slate-100 rounded-xl"
                    >
                        取消
                    </button>
                    <button 
                        onClick={updateItem} 
                        className="flex-1 py-2 text-white font-bold bg-ocean-500 rounded-xl hover:bg-ocean-600 flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> 儲存
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Wishlist;