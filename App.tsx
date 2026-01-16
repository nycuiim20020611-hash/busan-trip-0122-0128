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

  // Save on Change
  useEffect(() => { saveToStorage('itinerary', itineraryItems); }, [itineraryItems]);
  useEffect(() => { saveToStorage('checklist', checklistItems); }, [checklistItems]);
  useEffect(() => { saveToStorage('wishlist', wishlistItems); }, [wishlistItems]);

  // Sync from Cloud on Mount
  useEffect(() => {
    const sync = async () => {
      const storage = await import('./services/storage');
      const cloudData = await storage.syncFromCloud();

      // Check if cloud is effectively empty (new sheet) but we have local data
      // If so, upload local data to initialize the sheet
      const isCloudEmpty = (!cloudData?.itinerary?.length && !cloudData?.wishlist?.length);
      const hasLocalData = (itineraryItems.length > 0 || wishlistItems.length > 0);

      console.log("Sync Check:", { isCloudEmpty, hasLocalData, cloudData });

      if (isCloudEmpty && hasLocalData) {
        console.log("Cloud is empty, initializing with local data...");
        await storage.initializeCloudStorage({
          itinerary: itineraryItems,
          checklist: checklistItems,
          wishlist: wishlistItems
        });
      } else if (cloudData) {
        console.log("Applying cloud data to local state...");
        // Normal sync: use cloud data
        if (cloudData.itinerary && cloudData.itinerary.length > 0) setItineraryItems(cloudData.itinerary);
        if (cloudData.checklist && cloudData.checklist.length > 0) setChecklistItems(cloudData.checklist);
        if (cloudData.wishlist && cloudData.wishlist.length > 0) setWishlistItems(cloudData.wishlist);
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