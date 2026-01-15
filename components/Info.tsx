import React from 'react';
import { Home, Plane, AlertCircle, FileText, Map } from 'lucide-react';

const Info: React.FC = () => {
  return (
    <div className="pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-ocean-800 mb-6">重要資訊</h2>

      {/* Accommodation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-ocean-50 p-4 border-b border-ocean-100 flex items-center text-ocean-700 font-bold">
          <Home className="mr-2" size={20} /> 住宿資訊
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold mb-1">地址</div>
            <p className="text-slate-800 font-medium select-all">釜山市海雲臺區九南路 21 號 6 Elbonder Stay</p>
          </div>
          <div className="flex gap-4">
             <div className="flex-1 p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">入住</div>
                <div className="text-ocean-600 font-bold text-lg">16:00</div>
             </div>
             <div className="flex-1 p-3 bg-slate-50 rounded-lg text-center">
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">退房</div>
                <div className="text-ocean-600 font-bold text-lg">12:00</div>
             </div>
          </div>
          <div className="text-sm text-slate-500 bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-100">
            <AlertCircle size={14} className="inline mr-1" />
            密碼將於入住前 1 小時發送
          </div>
          <a 
            href="https://www.airbnb.com.tw/rooms/858989327478193289" 
            target="_blank" 
            rel="noreferrer"
            className="block w-full text-center py-2 bg-white border border-ocean-200 text-ocean-600 rounded-lg hover:bg-ocean-50 transition-colors font-medium"
          >
            開啟 Airbnb
          </a>
        </div>
      </div>

      {/* Flights */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-ocean-50 p-4 border-b border-ocean-100 flex items-center text-ocean-700 font-bold">
          <Plane className="mr-2" size={20} /> 航班資訊 (臺灣虎航)
        </div>
        <div className="p-5 space-y-6">
          <div className="relative pl-4 border-l-2 border-ocean-200">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-ocean-400"></div>
            <h4 className="font-bold text-slate-800">去程 IT606</h4>
            <div className="text-sm text-slate-500 mb-2">1/22 (四)</div>
            <div className="flex justify-between items-center text-sm">
                <span>16:50 桃園 T1</span>
                <span className="text-slate-300">➜</span>
                <span>20:05 金海機場</span>
            </div>
            <div className="mt-2 text-xs bg-slate-100 inline-block px-2 py-1 rounded text-slate-600">座位: 23E, 23F</div>
          </div>

          <div className="relative pl-4 border-l-2 border-ocean-200">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-ocean-400"></div>
            <h4 className="font-bold text-slate-800">回程 IT607</h4>
            <div className="text-sm text-slate-500 mb-2">1/28 (三)</div>
            <div className="flex justify-between items-center text-sm">
                <span>20:50 金海機場</span>
                <span className="text-slate-300">➜</span>
                <span>22:30 桃園 T1</span>
            </div>
             <div className="mt-2 text-xs bg-slate-100 inline-block px-2 py-1 rounded text-slate-600">座位: 21A, 21B</div>
          </div>
        </div>
      </div>

       {/* Refund Info */}
       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-ocean-50 p-4 border-b border-ocean-100 flex items-center text-ocean-700 font-bold">
          <FileText className="mr-2" size={20} /> 退稅資訊
        </div>
        <div className="p-5">
           <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-slate-600">
             <li><strong className="text-ocean-700">機場退稅：</strong> 入關前退稅、查驗、蓋章。</li>
             <li><strong className="text-ocean-700">市區退稅：</strong> 西面 Olive Young 地鐵外一樓有機器。</li>
             <li>需保留所有收據及護照。</li>
           </ul>
        </div>
      </div>
      
      {/* Map Links */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-ocean-50 p-4 border-b border-ocean-100 flex items-center text-ocean-700 font-bold">
          <Map className="mr-2" size={20} /> 地圖連結
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
           <a href="https://map.naver.com" target="_blank" className="bg-green-50 text-green-700 p-3 rounded-xl text-center font-bold hover:bg-green-100">Naver Map</a>
           <a href="https://map.kakao.com" target="_blank" className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-center font-bold hover:bg-yellow-100">Kakao Map</a>
        </div>
      </div>

    </div>
  );
};

export default Info;