import { fetchOHLCData } from "./fetchBinance";
import { rsiEmaStrategy } from "./action";
import { simulateTrades } from "./simulation";
import { csvTrades } from "./exportToCSV";

async function runBacktester() {
  try {
    const data = await fetchOHLCData();
    const rsiEmaSignals = rsiEmaStrategy(data);
    console.log("RSI Signals");
    console.log(rsiEmaSignals);
    const rsiEmaTrades = simulateTrades(rsiEmaSignals, "RSI-EMA", 10000);
    console.log("RSI Trades");
    console.log(rsiEmaTrades);

    const allTrades = [...rsiEmaTrades];

    csvTrades(allTrades);

    console.table(
      allTrades.map((trade) => ({
        "Entry Time": new Date(trade.entryTime).toISOString(),
        "Entry Price": trade.entryPrice,
        "Exit Time": trade.exitTime
          ? new Date(trade.exitTime).toISOString()
          : null,
        "Exit Price": trade.exitPrice,
        Strategy: trade.strategy,
        PnL: trade.pnl?.toFixed(4),
        Status: trade.status,
      }))
    );
  } catch (error) {
    console.error("Error in backtester:", error);
  }
}

runBacktester();
