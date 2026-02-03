# Google Sheets Waitlist Setup Instructions

Follow these steps to connect your UTAN waiting list to a Google Sheet.

## 1. Create a Google Sheet
1. Open [Google Sheets](https://sheets.new).
2. Give it a name (e.g., "UTAN Waitlist").
3. In the first row, add headers: `Email` and `Timestamp`.

## 2. Add Google Apps Script
1. In your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data;
  
  try {
    // Robust parsing: check for standard form params OR JSON
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
  } catch (err) {
    data = e.parameter;
  }
  
  var email = data.email || e.parameter.email;
  var timestamp = data.timestamp || e.parameter.timestamp || new Date().toISOString();
  
  if (email) {
    sheet.appendRow([email, timestamp]);
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } else {
    return ContentService.createTextOutput("Error: No email").setMimeType(ContentService.MimeType.TEXT);
  }
}
```

3. Click the **Save** icon (💾) and name it "UTAN_Waitlist_Backend".

## 3. Deploy as a Web App
1. Click the **Deploy** button (top right) > **New deployment**.
2. Select type: **Web app**.
3. **Description**: UTAN Waitlist API.
4. **Execute as**: Me.
5. **Who has access**: **Anyone** (This is important for the form to work).
6. Click **Deploy**. 
7. You may need to "Authorize access" (it might say the app isn't verified, click 'Advanced' > 'Go to UTAN_Waitlist_Backend (unsafe)').
8. **Copy the "Web App URL"**. It should look like `https://script.google.com/macros/s/.../exec`.

## 4. Final Step: Add the URL to your Code
1. Open your project's `src/main.js` file.
2. Find the line: `const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your actual Web App URL.

Your waitlist is now live! Every signup will appear in your Google Sheet automatically.
