// This service now acting as a proxy to Google Apps Script
// To prevent API Key leakage in client-side code.

const GAS_API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

export const getKoreanLocation = async (chineseName: string): Promise<{ koreanName: string; address: string }> => {
    if (!GAS_API_URL) {
        console.error("Google Sheets API URL is missing");
        return { koreanName: chineseName, address: '' };
    }

    try {
        // Send request to Google Apps Script proxy
        // The detailed prompt wrapping is handled in the backend (GAS)
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'translate_location',
                location: chineseName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error("GAS Proxy Error:", data.error);
            return { koreanName: chineseName, address: '' };
        }

        return {
            koreanName: data.koreanName || chineseName,
            address: data.address || ''
        };

    } catch (error) {
        console.error("Error translating location via GAS:", error);
        return { koreanName: chineseName, address: '' };
    }
};
