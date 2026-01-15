import { ItineraryItem, ChecklistItem, WishlistItem } from './types';

export const INITIAL_ITINERARY: ItineraryItem[] = [
  // 1/22 Thursday
  { id: '1', date: '2026-01-22', time: '16:50', activity: '虎航 IT606 起飛 (T1)', location: '桃園機場', category: 'transport', notes: '23E, 23F' },
  { id: '2', date: '2026-01-22', time: '20:05', activity: '抵達金海國際機場', location: '金海機場', category: 'transport', notes: '機場接送' },
  { id: '3', date: '2026-01-22', time: '21:30', activity: '晚餐', location: '海雲台', category: 'food', notes: '韓式炸雞 / 豬肉湯飯 / 布帳馬車' },
  
  // 1/23 Friday
  { id: '4', date: '2026-01-23', time: '08:30', activity: '出發', location: '海雲台地鐵站', category: 'transport', notes: '公車 3006 (KRW2100)' },
  { id: '5', date: '2026-01-23', time: '09:30', activity: 'Momos Coffee', location: '影島', category: 'food', notes: '影島大橋' },
  { id: '6', date: '2026-01-23', time: '12:00', activity: '富平罐頭市場', location: '札嘎其 (橘110)', category: 'food', notes: '炸豬排、蒸餃、醬蝦、生章魚' },
  { id: '7', date: '2026-01-23', time: '13:00', activity: '甘川洞文化村', location: '土城 (橘109)', category: 'activity', notes: '手翻書、自畫像' },
  { id: '8', date: '2026-01-23', time: '15:00', activity: '松島海上纜車', location: '松島', category: 'activity', notes: '水晶車廂、龍宮空中步道' },
  { id: '9', date: '2026-01-23', time: '17:00', activity: '釜山塔', location: '龍頭山公園', category: 'activity', notes: '' },
  { id: '10', date: '2026-01-23', time: '18:00', activity: '晚餐', location: '南浦洞', category: 'food', notes: '李在饃披薩 or 雪濃湯' },
  { id: '11', date: '2026-01-23', time: '19:00', activity: 'BIFF 廣場', location: '南浦洞', category: 'activity', notes: '' },

  // 1/24 Saturday
  { id: '12', date: '2026-01-24', time: '09:00', activity: '買麵包', location: '自然島鹽麵包', category: 'food', notes: '9點開門' },
  { id: '13', date: '2026-01-24', time: '10:00', activity: '樂天世界 (換票)', location: '機張', category: 'activity', notes: '釜山 Pass' },
  { id: '14', date: '2026-01-24', time: '10:30', activity: 'Skyline Luge 滑車', location: '機張', category: 'activity', notes: '' },
  { id: '15', date: '2026-01-24', time: '11:30', activity: '海東龍宮寺', location: '機張', category: 'activity', notes: '' },
  { id: '16', date: '2026-01-24', time: '13:00', activity: '午餐 + Outlet + 超市', location: '樂天 Outlet', category: 'shopping', notes: '' },
  { id: '17', date: '2026-01-24', time: '16:00', activity: '樂天世界', location: '樂天世界', category: 'activity', notes: '' },
  { id: '18', date: '2026-01-24', time: '17:00', activity: '貝殼倉庫 (晚餐)', location: '機張', category: 'food', notes: '推薦！' },
  { id: '19', date: '2026-01-24', time: '20:00', activity: 'The Bay 101', location: '海雲台', category: 'activity', notes: '夜景、炸魚薯條' },

  // 1/25 Sunday
  { id: '20', date: '2026-01-25', time: '09:00', activity: '影島天空展望台', location: '影島', category: 'activity', notes: '南浦站轉公車' },
  { id: '21', date: '2026-01-25', time: '10:00', activity: '海女村美食 / 文化館', location: '影島', category: 'food', notes: '' },
  { id: '22', date: '2026-01-25', time: '12:00', activity: 'THRILL ON THE MUG', location: '影島', category: 'food', notes: '咖啡廳' },
  { id: '23', date: '2026-01-25', time: '14:00', activity: '白淺灘文化村', location: '影島', category: 'activity', notes: '小店、足浴' },
  { id: '24', date: '2026-01-25', time: '18:00', activity: '新世界百貨 Centum City', location: 'Centum City', category: 'shopping', notes: '3樓辦會員, Shake Shack' },

  // 1/26 Monday
  { id: '25', date: '2026-01-26', time: '10:00', activity: 'Klook 行程 / 滑雪', location: '伊甸園山谷', category: 'activity', notes: '自由時間' },
  { id: '26', date: '2026-01-26', time: '19:00', activity: '西面下車', location: '西面', category: 'transport', notes: '' },

  // 1/27 Tuesday
  { id: '27', date: '2026-01-27', time: '09:30', activity: '膠囊列車', location: '青沙浦車站', category: 'activity', notes: '韓版櫻木花道平交道' },
  { id: '28', date: '2026-01-27', time: '11:30', activity: '烤貝午餐', location: '青沙浦', category: 'food', notes: '超好吃' },
  { id: '29', date: '2026-01-27', time: '13:30', activity: '海岸列車 (回程)', location: '尾浦站', category: 'transport', notes: '換票' },
  { id: '30', date: '2026-01-27', time: '14:00', activity: 'Busan X the SKY', location: '海雲台', category: 'activity', notes: '' },
  { id: '31', date: '2026-01-27', time: '15:00', activity: 'Club D Oasis Spa', location: '海雲台', category: 'activity', notes: '' },
  { id: '32', date: '2026-01-27', time: '17:00', activity: '廣安里船 (Yacht Holic)', location: '廣安里', category: 'activity', notes: '日落場' },
  { id: '33', date: '2026-01-27', time: '19:00', activity: '83獬豸 (晚餐)', location: '廣安里', category: 'food', notes: '' },
  
  // 1/28 Wednesday
  { id: '34', date: '2026-01-28', time: '08:30', activity: 'Spa Land', location: '新世界百貨', category: 'activity', notes: '08:00開' },
  { id: '35', date: '2026-01-28', time: '10:00', activity: '西面商圈 / 田浦咖啡街', location: '西面', category: 'shopping', notes: '' },
  { id: '36', date: '2026-01-28', time: '11:30', activity: 'Running Man', location: '西面', category: 'activity', notes: '' },
  { id: '37', date: '2026-01-28', time: '13:00', activity: '31公分刀削麵', location: '西面/海雲台', category: 'food', notes: '' },
  { id: '38', date: '2026-01-28', time: '16:00', activity: '前往機場', location: '金海機場', category: 'transport', notes: '退稅' },
  { id: '39', date: '2026-01-28', time: '20:50', activity: '虎航 IT607 起飛', location: '金海機場', category: 'transport', notes: '21A, 21B' },
];

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', text: '護照', checked: false, category: 'essential' },
  { id: 'c2', text: 'WOWPASS', checked: false, category: 'essential' },
  { id: 'c3', text: '高回饋信用卡', checked: false, category: 'essential' },
  { id: 'c4', text: '林大貓咪', checked: false, category: 'other' },
  { id: 'c5', text: '釜山 Pass (已訂)', checked: true, category: 'booking' },
  { id: 'c6', text: '膠囊列車 (已訂)', checked: true, category: 'booking' },
  { id: 'c7', text: '滑雪行程 (已訂)', checked: true, category: 'booking' },
  { id: 'c8', text: '行程單 PDF', checked: false, category: 'essential' },
  { id: 'c9', text: '電子收據 PDF', checked: false, category: 'essential' },
];

export const INITIAL_WISHLIST: WishlistItem[] = [
  { id: 'w1', name: '樂天超市', note: '10:30-22:00', category: 'shopping', checked: false },
  { id: 'w2', name: 'The Bay 101', note: 'Klook 攻略', category: 'fun', checked: false },
  { id: 'w3', name: '31公分刀削麵', note: '松亭週一休', category: 'food', checked: false },
  { id: 'w4', name: '貝殼倉庫', note: '機張，推薦！565元吃到飽', category: 'food', checked: false },
  { id: 'w5', name: '秀敏家炭火烤蛤蠣', note: '青沙浦 11:30-05:00', category: 'food', checked: false },
  { id: 'w6', name: '廣安 All Sunday Bagel', note: '08:00-21:50', category: 'food', checked: false },
  { id: 'w7', name: '83獬豸', note: '烤肉 Catch Table 預約', category: 'food', checked: false },
  { id: 'w8', name: 'Egg Drop', note: '早餐', category: 'food', checked: false },
  { id: 'w9', name: '自然島鹽麵包', note: '海雲台 09:00-22:00', category: 'food', checked: false },
  { id: 'w10', name: '李在饃披薩', note: '南浦/西面 週日休', category: 'food', checked: false },
  { id: 'w11', name: '螞蟻家', note: '章魚鍋', category: 'food', checked: false },
  { id: 'w12', name: '釜山宅', note: '烤肉', category: 'food', checked: false },
  { id: 'w13', name: 'Shake Shack', note: '西面/Centum City', category: 'food', checked: false },
];