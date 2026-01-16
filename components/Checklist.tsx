import React, { useState } from 'react';
import { Check, Plus, Trash2, Edit2, X, Save } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
  setItems: (items: ChecklistItem[]) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, setItems }) => {
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('other');

  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  const toggleCheck = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `c${Date.now()}`,
      text: newItemText,
      checked: false,
      category: newItemCategory
    };
    setItems([...items, newItem]);
    setNewItemText('');
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
    setEditingItem(null);
  };

  const categories: Record<string, string> = {
    essential: '必要證件 & 錢',
    booking: '預訂項目',
    clothes: '衣物',
    other: '其他物品',
  };

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="pb-24">
      <h2 className="text-2xl font-bold text-ocean-800 mb-6">行李清單</h2>

      <form onSubmit={addItem} className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="新增待辦事項..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />
            <button
              type="submit"
              className="bg-ocean-500 text-white px-4 rounded-xl hover:bg-ocean-600 transition-colors shadow-md"
            >
              <Plus size={24} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setNewItemCategory(key as any)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${newItemCategory === key
                    ? 'bg-ocean-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {Object.entries(categories).map(([catKey, catLabel]) => {
          const catItems = groupedItems[catKey] || [];
          if (catItems.length === 0) return null;

          return (
            <div key={catKey} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-ocean-600 font-bold mb-4 flex items-center">
                <span className="w-2 h-2 bg-ocean-400 rounded-full mr-2"></span>
                {catLabel}
              </h3>
              <div className="space-y-3">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-center group">
                    <button
                      onClick={() => toggleCheck(item.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all ${item.checked
                          ? 'bg-ocean-500 border-ocean-500 text-white'
                          : 'border-slate-300 text-transparent hover:border-ocean-400'
                        }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <span className={`flex-grow text-slate-700 font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-slate-300 hover:text-ocean-500 p-2"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-slate-300 hover:text-red-400 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-lg text-ocean-800">編輯項目</h3>

            <input
              type="text"
              value={editingItem.text}
              onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-700 text-white placeholder-slate-400 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-ocean-400"
            />

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categories).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditingItem({ ...editingItem, category: key as any })}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${editingItem.category === key
                      ? 'bg-ocean-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 text-slate-500 font-bold bg-slate-100 rounded-xl"
              >
                取消
              </button>
              <button
                onClick={handleUpdateItem}
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

export default Checklist;