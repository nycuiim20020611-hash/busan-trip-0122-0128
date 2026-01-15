import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const getKoreanLocation = async (chineseName: string): Promise<{ koreanName: string; address: string }> => {
    if (!API_KEY) {
        console.error("OpenAI API Key is missing");
        return { koreanName: chineseName, address: '' };
    }

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an expert AI assistant specialized in Korean tourism and location services. 
                    Your task is to identify the **official Korean name** (as registered on Naver Map) and the address for a given location name provided in Chinese.
                    
                    CRITICAL INSTRUCTIONS:
                    1. Do NOT simply translate the Chinese characters literally. You must identify the actual business or location entity.
                    2. If the location is a famous restaurant or tourist spot, return its specific brand name (e.g., '秀敏家' -> '수민이네').
                    3. Always respond with valid JSON.`
                },
                {
                    role: "user",
                    content: `Find the official Korean name and address for the following location.
                    
                    Input: ${chineseName}
                    
                    Output format: JSON with keys "koreanName" (the search query for Naver Map) and "address".
                    
                    Examples:
                    Input: 海雲台
                    Output: {"koreanName": "해운대", "address": "부산광역시 해운대구"}
                    
                    Input: 秀敏家炭火烤蛤蠣
                    Output: {"koreanName": "수민이네", "address": "부산 해운대구 청사포로58번길 118"}
                    
                    Input: 明洞餃子
                    Output: {"koreanName": "명동교자", "address": "서울 중구 명동10길 29"}
                    `
                }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (content) {
            return JSON.parse(content);
        }

        return { koreanName: chineseName, address: '' };
    } catch (error) {
        console.error("Error translating location:", error);
        return { koreanName: chineseName, address: '' };
    }
};
