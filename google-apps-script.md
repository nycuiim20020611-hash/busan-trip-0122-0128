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
    const contents = JSON.parse(e.postData.contents);
    
    // Check if this is a translation request
    if (contents.action === 'translate_location') {
      const result = callOpenAI(contents.location);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Otherwise, assume it's a save data request
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (contents.itinerary) saveDataToSheet(ss.getSheetByName('itinerary'), contents.itinerary);
    if (contents.wishlist) saveDataToSheet(ss.getSheetByName('wishlist'), contents.wishlist);
    if (contents.checklist) saveDataToSheet(ss.getSheetByName('checklist'), contents.checklist);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function callOpenAI(locationName) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) {
    return { error: 'OpenAI API Key not set in Script Properties' };
  }

  const url = 'https://api.openai.com/v1/chat/completions';
  const systemPrompt = `You are an expert AI assistant specialized in Korean tourism. 
  Task: Identify the official Korean name (for Naver Map) and address for the given Chinese location name.
  Rules:
  1. Identify the actual business/location entity, don't just translate literally.
  2. If it's a famous place, use the specific brand name.
  3. Return valid JSON only.`;

  const userPrompt = `Find Korean name and address for: ${locationName}. 
  Output JSON format: {"koreanName": "...", "address": "..."}`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    const content = json.choices[0].message.content;
    return JSON.parse(content);
  } catch (e) {
    return { error: e.toString(), koreanName: locationName, address: '' };
  }
}

function getDataFromSheet(sheet) {
  const rows = sheet.getDataRange().getDisplayValues();
  if (rows.length <= 1) return []; 
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
  if (!data) return;
  sheet.clear();
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  sheet.appendRow(headers);
  const rows = data.map(item => headers.map(header => item[header] || ''));
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
