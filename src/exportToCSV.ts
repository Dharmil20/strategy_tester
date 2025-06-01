import { Trade } from "./simulation";
import { stringify } from "csv-stringify/sync";
import fs from 'fs'

export function csvTrades(trades: Trade[], filename: string){
    const csvData = trades.map(trade => ({
        'Entry Time': new Date(trade.entryTime).toLocaleString(),
        'Entry Price': trade.entryPrice.toFixed(4),
        'Exit Time': trade.exitTime ? new Date(trade.exitTime).toLocaleString() : '',
        'Exit Price': trade.exitPrice || '',
        'Strategy': trade.strategy,
        'PnL': trade.pnl?.toFixed(4) || '',
        'Status': trade.status
    }))

    const csvString = stringify(csvData, {
    header: true,
    columns: ['Entry Time', 'Entry Price', 'Exit Time', 'Exit Price', 'Strategy', 'PnL', 'Status']
  });

  fs.writeFileSync(filename, csvString);
  console.log(`Results exported to ${filename}`);

    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = trades.filter(t => t.status === 'profit').length;
    console.log(`\n=== Export Summary ===`);
    console.log(`Total trades exported: ${trades.length}`);
    console.log(`Winning trades: ${winningTrades} (${((winningTrades/trades.length)*100).toFixed(1)}%)`);
    console.log(`Total PnL: $${totalPnL.toFixed(2)}`);
}
