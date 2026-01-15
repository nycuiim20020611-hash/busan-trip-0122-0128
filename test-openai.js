import OpenAI from 'openai';

const API_KEY = "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";

const openai = new OpenAI({
    apiKey: API_KEY,
});

async function testTranslation() {
    try {
        console.log("Sending request to OpenAI...");
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that translates location names from Chinese to Korean. You always respond with valid JSON."
                },
                {
                    role: "user",
                    content: `Translate the following location name from Chinese to Korean. Also provide the address in Korean if possible.
          Input: 海雲台
          Output format: JSON with keys "koreanName" and "address".
          Example:
          Input: 海雲台
          Output: {"koreanName": "해운대", "address": "부산광역시 해운대구"}
          `
                }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        console.log("Response:", content);
    } catch (error) {
        console.error("Error:", error);
    }
}

testTranslation();
