import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Itinerary from './components/Itinerary';
import Checklist from './components/Checklist';
import Info from './components/Info';
import Wishlist from './components/Wishlist';
import { TabView, ItineraryItem, ChecklistItem, WishlistItem } from './types';
import { INITIAL_ITINERARY, INITIAL_CHECKLIST, INITIAL_WISHLIST } from './constants';
import { saveToStorage, getFromStorage } from './services/storage';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>(TabView.HOME);

  const [isSynced, setIsSynced] = useState(false);

  // State with LocalStorage Persistence
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(() =>
    getFromStorage('itinerary', INITIAL_ITINERARY)
  );
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() =>
    getFromStorage('checklist', INITIAL_CHECKLIST)
  );
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() =>
    getFromStorage('wishlist', INITIAL_WISHLIST)
  );

  // Save on Change - Only if synced
  useEffect(() => {
    if (isSynced) saveToStorage('itinerary', itineraryItems);
  }, [itineraryItems, isSynced]);

  useEffect(() => {
    if (isSynced) saveToStorage('checklist', checklistItems);
  }, [checklistItems, isSynced]);

  useEffect(() => {
    if (isSynced) saveToStorage('wishlist', wishlistItems);
  }, [wishlistItems, isSynced]);

  // Sync from Cloud on Mount
  useEffect(() => {
    const sync = async () => {
      const storage = await import('./services/storage');
      const cloudData = await storage.syncFromCloud();

      // Check if cloud is effectively empty (new sheet) but we have local data
      // If so, upload local data to initialize the sheet
      // IMPORTANT: Only initialize if cloudData is NOT null (meaning fetch succeeded but returned empty)
      const isCloudEmpty = (cloudData && !cloudData.itinerary?.length && !cloudData.wishlist?.length);
      const hasLocalData = (itineraryItems.length > 0 || wishlistItems.length > 0);

      console.log("Sync Check:", { isCloudEmpty, hasLocalData, cloudData });

      if (cloudData === null) {
        console.error("Sync failed. Keeping local mode.");
        // 同步失敗，不設定 isSynced，保持本地模式 (不會覆蓋雲端)
      } else {
        console.log("Applying cloud data to local state...");
        // 只有當雲端有資料時才覆蓋本地
        // 如果雲端是空的 (cloudData != null 但欄位空)，則保持本地狀態 (例如初始範本)，但開啟同步
        if (cloudData.itinerary && cloudData.itinerary.length > 0) setItineraryItems(cloudData.itinerary);
        if (cloudData.checklist && cloudData.checklist.length > 0) setChecklistItems(cloudData.checklist);
        if (cloudData.wishlist && cloudData.wishlist.length > 0) setWishlistItems(cloudData.wishlist);

        setIsSynced(true); // Sync done, allow saving
      }
    };
    sync();
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case TabView.HOME:
        return <Home setTab={setCurrentTab} />;
      case TabView.ITINERARY:
        return <Itinerary items={itineraryItems} setItems={setItineraryItems} />;
      case TabView.CHECKLIST:
        return <Checklist items={checklistItems} setItems={setChecklistItems} />;
      case TabView.INFO:
        return <Info />;
      case TabView.WISHLIST:
        return <Wishlist items={wishlistItems} setItems={setWishlistItems} />;
      default:
        return <Home setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-ocean-50 text-slate-800 font-sans selection:bg-ocean-200">
      <div className="max-w-lg mx-auto min-h-screen bg-white shadow-2xl relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-ocean-100 flex justify-center">
          <span className="font-bold text-ocean-700 tracking-wider text-sm">BUSAN TRIP 2026</span>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>

        <NavBar currentTab={currentTab} setTab={setCurrentTab} />
      </div>
    </div>
  );
};

export default App;