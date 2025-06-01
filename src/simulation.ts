import { TradeSignal } from "./action";

export interface Trade {
    entryTime: number;
    entryPrice: number;
    exitTime: number | null;
    exitPrice: number | null;
    strategy: string;
    pnl: number | null;
    status: 'open' | 'closed' | 'profit' | 'loss';
}

export function simulateTrades(signals: TradeSignal[], strategyName: string, initCapital: number = 10000): Trade[]{
    const trades: Trade[] = [];
    let currTrade: Trade | null = null;

    for(const signal of signals){
        // we execute the buy order for the buy action
        if(signal.action === 'buy' && !currTrade){
            currTrade = {
                entryTime: signal.time,
                entryPrice: signal.price,
                exitTime: null,
                exitPrice: null,
                strategy: strategyName,
                pnl: null,
                status: 'open'
            };
        // we execute the sell order for the buy action
        } else if(signal.action === 'sell' && currTrade){
            const pnl = ((signal.price - currTrade.entryPrice) / currTrade.entryPrice) * initCapital;
            currTrade.exitTime = signal.time;
            currTrade.exitPrice = signal.price;
            currTrade.pnl = pnl;
            currTrade.status = pnl > 0 ? 'profit' : 'loss'

            trades.push(currTrade);
            currTrade = null;
        }
    }
    // Close the open trades at the end
    if(currTrade && signals.length > 0){
        const lastSignal = signals[signals.length - 1];
        const pnl = ((lastSignal.price - currTrade.entryPrice) / currTrade.entryPrice) * initCapital;
        currTrade.exitTime = lastSignal.time;
        currTrade.exitPrice = lastSignal.price;
        currTrade.pnl = pnl;
        currTrade.status = pnl > 0 ? 'profit' : 'loss'

        trades.push(currTrade);
    }
    return trades;
}

// Example test:
// const testSignals: TradeSignal[] = [
//     { action: 'buy', price: 100, time: 1000, rsi: 41.645422369624846, ema: 103687.80232144438 },
//     { action: 'sell', price: 110, time: 2000, rsi: 41.645422369624846, ema: 103687.80232144438  },
//     { action: 'buy', price: 105, time: 3000, rsi: 41.645422369624846, ema: 103687.80232144438  },
//     { action: 'sell', price: 115, time: 4000, rsi: 41.645422369624846, ema: 103687.80232144438  },
// ];

// const result = simulateTrades(testSignals, 'RSI-EMA', 10000);
// console.log('Trades:', result);
// console.log('Number of trades:', result.length);