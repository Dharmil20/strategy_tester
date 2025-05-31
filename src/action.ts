import { OHLCParams } from "./fetchBinance";
import { calculateEMA, calculateRSI } from "./calculations";

export interface TradeSignal {
    action: 'buy' | 'sell' | 'hold';
    price: number;
    time: number;
    rsi?: number;
    ema?: number;
}

export function rsiEmaStrategy(data: OHLCParams[]): TradeSignal[] {
    const signals: TradeSignal[] = [];
    const closingPrices = data.map(data => data.close);

    const rsiPeriod = 14, emaPeriod = 21;
    const rsiValues = calculateRSI(closingPrices, rsiPeriod);
    const emaValues = calculateEMA(closingPrices, emaPeriod);

    for(let i = Math.max(rsiPeriod, emaPeriod); i < data.length; i++){
        const currPrice = data[i].close;
        const prevPrice = data[i - 1].close;
        const currRsi = rsiValues[i];
        const prevRsi = rsiValues[i - 1];
        const currEma = emaValues[i];
        const prevEma = emaValues[i - 1];

        let action: 'buy' | 'sell' | 'hold' = 'hold';

        if(isNaN(currRsi) || isNaN(prevRsi) || isNaN(currEma))
            action = 'hold';
        // Strong Buy when rsi >= 30 and prevRsi < 30 (meaning rsi crossing val 30) and currP > ema and prevP <= prevEma (Meaning price crossing above ema) 
        else if(currRsi >= 30 && prevRsi < 30 && currPrice > currEma && prevPrice <= prevEma)
            action = 'buy';

        else if(currRsi >= 30 && prevRsi < 30 && currPrice > currEma)
            action = 'buy';

        // strong Sell when rsi <= 70 and prevRsi > 70 (meaning rsi crossing val 70) and currP < ema and prevP >= prevEma (Meaning price crossing below ema)
        else if(currRsi <= 70 && prevRsi > 70 && currPrice < currEma && prevPrice >= prevEma)
            action = 'sell';

        else if(currRsi <= 70 && prevRsi > 70 && currPrice < currEma)
            action = 'sell';

        else
            action = 'hold';

        signals.push({
            action,
            price: currPrice,
            time: data[i].openTime,
            rsi: currRsi,
            ema: currEma
        })
    }
    return signals;
}
