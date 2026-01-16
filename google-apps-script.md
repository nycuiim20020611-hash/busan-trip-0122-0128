# Google Sheets Data Persistence Setup

To enable dynamic data saving without a backend server, we will use Google Sheets and Google Apps Script.

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it "Busan Trip Data" (or anything you like).
3. Rename the first sheet (tab) to `itinerary`.
4. Add a second sheet and name it `wishlist`.
5. Add a third sheet and name it `checklist`.

## Step 2: Add the Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any code in the `Code.gs` file and paste the following code:

```javascript
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const itinerarySheet = ss.getSheetByName('itinerary');
  const wishlistSheet = ss.getSheetByName('wishlist');
  const checklistSheet = ss.getSheetByName('checklist');

  const data = {
    itinerary: getDataFromSheet(itinerarySheet),
    wishlist: getDataFromSheet(wishlistSheet),
    checklist: getDataFromSheet(checklistSheet)
  };

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const body = JSON.parse(e.postData.contents);

    if (body.itinerary) saveDataToSheet(ss.getSheetByName('itinerary'), body.itinerary);
    if (body.wishlist) saveDataToSheet(ss.getSheetByName('wishlist'), body.wishlist);
    if (body.checklist) saveDataToSheet(ss.getSheetByName('checklist'), body.checklist);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getDataFromSheet(sheet) {
  const rows = sheet.getDataRange().getDisplayValues();
  if (rows.length <= 1) return []; // Only header or empty
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function saveDataToSheet(sheet, data) {
  if (!data || data.length === 0) return;
  
  // Clear existing content except header? Or just clear all.
  // Let's clear all and rewrite headers + data to be safe and handle schema changes.
  sheet.clear();
  
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  sheet.appendRow(headers);

  const rows = data.map(item => headers.map(header => item[header] || ''));
  
  // Batch write for performance
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}
```

## Step 3: Deploy as Web App
1. Click the **Deploy** button (blue button top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configuration:
    - **Description**: Busan Trip API
    - **Execute as**: `Me` (your email)
    - **Who has access**: `Anyone` (This is important for the app to access it without login prompts)
4. Click **Deploy**.
5. **Authorize access**: You will be asked to review permissions. Click "Review permissions", choose your account. You might see a "Google hasn't verified this app" warning. Click "Advanced" > "Go to ... (unsafe)" to proceed.
6. **Copy the Web App URL**: You will get a URL ending in `/exec`. Copy this URL.

## Step 4: Configure Environment Variable
1. In your project, open `.env`.
2. Add the following line:
   ```env
   VITE_GOOGLE_SHEETS_API_URL=your_web_app_url_here
   ```
