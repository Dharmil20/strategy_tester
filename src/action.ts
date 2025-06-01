import { OHLCParams } from "./fetchBinance";
import { calculateEMA, calculateRSI, calculateMACD } from "./calculations";

export interface TradeSignal {
  action: "buy" | "sell" | "hold";
  price: number;
  time: number;
  rsi?: number;
  ema?: number;
}

export function rsiEmaStrategy(data: OHLCParams[]): TradeSignal[] {
  const signals: TradeSignal[] = [];
  const closingPrices = data.map((data) => data.close);

  const rsiPeriod = 14;
  const emaPeriod = 21;
  const rsiValues = calculateRSI(closingPrices, rsiPeriod);
  const emaValues = calculateEMA(closingPrices, emaPeriod);

  for (let i = Math.max(rsiPeriod, emaPeriod); i < data.length; i++) {
    const currPrice = data[i].close;
    const currRsi = rsiValues[i];
    const prevRsi = rsiValues[i - 1];
    const currEma = emaValues[i];

        let action: "buy" | "sell" | "hold" = "hold";

    // Check if we have valid RSI values
    if (!isNaN(currRsi) && !isNaN(prevRsi)) {
      // Strong Buy when rsi >= 30 and prevRsi < 30 (meaning rsi crossing val 30) and currP > ema (Meaning price crossing above ema) 
      if (currRsi >= 45 && prevRsi < 45 && currPrice > currEma) {
        action = "buy";
      }
      // Strong Buy when rsi >= 30 and prevRsi < 30 (meaning rsi crossing val 30) and currP > ema (Meaning price crossing above ema) 
      else if ((currRsi <= 70 && prevRsi > 70) || currPrice < currEma) {
        action = "sell";
      }
    }

    signals.push({
      action,
      price: currPrice,
      time: data[i].closeTime,
      rsi: !isNaN(currRsi) ? Number(currRsi.toFixed(2)) : undefined,
      ema: Number(currEma.toFixed(2)),
    });
  }
  return signals;
}

export function macdStrategy(data: OHLCParams[]): TradeSignal[]{
  const signals: TradeSignal[] = [];
  const closingPrices = data.map(d => d.close);
  const { macdLine, signalLine } = calculateMACD(closingPrices);

  for(let i = 1; i < data.length; i++){
    const prevMACD = macdLine[i - 1];
    const currMACD = macdLine[i];
    const prevSignal = signalLine[i - 1];
    const currSignal = signalLine[i];

    let action: "buy" | "sell" | "hold" = "hold";

    // 12Ema line crossing 26Ema from bottom --> Buy 
    if(prevMACD < prevSignal && currMACD > currSignal)
      action = "buy";
    // 12Ema line crossing 26Ema from above --> Sell 
    else if (prevMACD > prevSignal && currMACD < currSignal)
      action = "sell";
    else
      action = "hold";

    signals.push({
      action,
      price: data[i].close,
      time: data[i].closeTime,
    })
  }

  return signals
}