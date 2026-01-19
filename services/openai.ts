// 透過 Google Apps Script Proxy 呼叫 OpenAI API
// 確保 API Key 永遠不會暴露在前端程式碼中

const GAS_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

export const getKoreanLocation = async (chineseName: string): Promise<{ koreanName: string; address: string }> => {
    if (!GAS_URL) {
        console.error("Google Sheets API URL is missing. Please set VITE_GOOGLE_SHEETS_API_URL in .env");
        return { koreanName: chineseName, address: '' };
    }

    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'translate_location',
                location: chineseName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            console.error("Translation error from GAS:", result.error);
            return { koreanName: chineseName, address: '' };
        }

        return {
            koreanName: result.koreanName || chineseName,
            address: result.address || ''
        };
    } catch (error) {
        console.error("Error calling GAS translation endpoint:", error);
        return { koreanName: chineseName, address: '' };
    }
};
