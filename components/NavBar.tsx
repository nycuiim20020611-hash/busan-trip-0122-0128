import React from 'react';
import { Home, Calendar, CheckSquare, Info, Heart } from 'lucide-react';
import { TabView } from '../types';

interface NavBarProps {
  currentTab: TabView;
  setTab: (tab: TabView) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: TabView.HOME, label: '首頁', icon: Home },
    { id: TabView.ITINERARY, label: '行程', icon: Calendar },
    { id: TabView.CHECKLIST, label: '清單', icon: CheckSquare },
    { id: TabView.WISHLIST, label: '願望', icon: Heart },
    { id: TabView.INFO, label: '資訊', icon: Info },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-ocean-200 px-4 py-2 pb-safe z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center justify-center w-full py-1 transition-colors duration-200 ${
                isActive ? 'text-ocean-600' : 'text-slate-400 hover:text-ocean-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NavBar;