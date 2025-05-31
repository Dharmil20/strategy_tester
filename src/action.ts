import { OHLCParams } from "./fetchBinance";
import { calculateEMA, calculateRSI } from "./calculations";

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

    // Check if we have valid RSI values (not NaN)
    if (!isNaN(currRsi) && !isNaN(prevRsi)) {
      // RSI oversold condition with bullish crossover and price above EMA
      if (currRsi >= 45 && prevRsi < 45 && currPrice > currEma) {
        action = "buy";
      }
      // RSI overbought condition with bearish crossover OR price below EMA
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
