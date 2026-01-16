const STORAGE_KEY_PREFIX = 'busan_trip_';
const GOOGLE_SHEETS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL;

export const saveToStorage = async (key: string, data: any) => {
  // 1. Save to LocalStorage (Immediate feedback)
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }

  // 2. Save to Google Sheets (Async)
  if (GOOGLE_SHEETS_API_URL) {
    try {
      const payload: any = {};
      payload[key] = data;

      await fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error saving to Google Sheets', error);
    }
  }
};

export const getFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

// New function to sync all data from cloud on startup
export const syncFromCloud = async () => {
  if (!GOOGLE_SHEETS_API_URL) {
    console.warn("Google Sheets API URL is missing");
    return null;
  }

  try {
    console.log("Fetching data from cloud...");
    const response = await fetch(GOOGLE_SHEETS_API_URL);
    const data = await response.json();
    console.log("Cloud data received:", data);
    return data;
  } catch (error) {
    console.error('Error syncing from cloud', error);
    return null;
  }
};

export const initializeCloudStorage = async (allData: any) => {
  if (!GOOGLE_SHEETS_API_URL) return;

  try {
    console.log("Initializing cloud storage with local data...", allData);
    await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(allData),
    });
    console.log("Cloud storage initialized successfully");
  } catch (error) {
    console.error('Error initializing cloud storage', error);
  }
};