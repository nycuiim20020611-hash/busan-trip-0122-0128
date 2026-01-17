export interface ExchangeRate {
    rate: number;
    lastUpdate: string;
}

export const getExchangeRate = async (): Promise<ExchangeRate | null> => {
    try {
        // Using exchangerate-api.com (free, no key needed for base functionality)
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/TWD');
        const data = await res.json();

        if (data && data.rates && data.rates.KRW) {
            return {
                rate: data.rates.KRW,
                lastUpdate: data.date
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch exchange rate", error);
        return null;
    }
};
