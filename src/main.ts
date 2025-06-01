import { fetchOHLCData } from "./fetchBinance";
import { macdStrategy, rsiEmaStrategy } from "./action";
import { simulateTrades } from "./simulation";
import { csvTrades } from "./exportToCSV";

async function runBacktester() {
  try {
    const data = await fetchOHLCData();
    const rsiEmaSignals = rsiEmaStrategy(data);
    console.log("RSI Signals");
    console.log(rsiEmaSignals.slice(0,5));
    const rsiEmaTrades = simulateTrades(rsiEmaSignals, "RSI-EMA", 10000);
    console.log("RSI Trades");
    console.log(rsiEmaTrades.slice(0,5));

    const macdSignals = macdStrategy(data);
    console.log("MACD Signals");
    console.log(macdSignals.slice(0,5));
    const macdTrades = simulateTrades(macdSignals, "MACD", 10000);
    console.log("MACD Trades");
    console.log(macdTrades.slice(0,5));


    const allRsiTrades = [...rsiEmaTrades];
    const allMacdTrades = [...macdTrades];
    const allTrades = [...rsiEmaTrades, ...macdTrades];

    csvTrades(allRsiTrades, 'RSI_trade_results.csv');
    csvTrades(allMacdTrades, 'MACD_trade_results.csv');
    csvTrades(allTrades, 'trade_results.csv');

    console.log("RSI Trades");
    console.table(
      allRsiTrades.slice(0,5).map((trade) => ({
        "Entry Time": new Date(trade.entryTime).toLocaleString(),
        "Entry Price": trade.entryPrice,
        "Exit Time": trade.exitTime
        ? new Date(trade.exitTime).toLocaleString()
        : null,
        "Exit Price": trade.exitPrice,
        Strategy: trade.strategy,
        PnL: trade.pnl?.toFixed(4),
        Status: trade.status,
      }))
    );
    
    console.log("MACD Trades");
    console.table(
      allMacdTrades.slice(0,5).map((trade) => ({
        "Entry Time": new Date(trade.entryTime).toLocaleString(),
        "Entry Price": trade.entryPrice,
        "Exit Time": trade.exitTime
          ? new Date(trade.exitTime).toLocaleString()
          : null,
        "Exit Price": trade.exitPrice,
        Strategy: trade.strategy,
        PnL: trade.pnl?.toFixed(4),
        Status: trade.status,
      }))
    );

    console.log("All Trades");
    console.table(
      allTrades.slice(0,5).map((trade) => ({
        "Entry Time": new Date(trade.entryTime).toLocaleString(),
        "Entry Price": trade.entryPrice,
        "Exit Time": trade.exitTime
          ? new Date(trade.exitTime).toLocaleString()
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
