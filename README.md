# Strategy Tester

A TypeScript-based cryptocurrency trading strategy backtester that implements RSI-EMA and MACD trading strategies using real-time data from Binance API.

## Features

- **RSI-EMA Strategy**: Combines Relative Strength Index (RSI) and Exponential Moving Average (EMA) indicators
- **MACD Strategy**: Uses Moving Average Convergence Divergence for buy/sell signals
- **Real-time Data**: Fetches live OHLC data from Binance API
- **CSV Export**: Exports trade results to CSV files for analysis

## Prerequisites

Before running the strategy tester, ensure your machine has Node.js and npm installed.

If not installed, visit: [Installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd strategy_tester
   ```

2. **Install project dependencies**
   ```bash
   npm install
   ```

   This command installs the following dependencies:
   - [axios](https://www.npmjs.com/package/axios) - HTTP client for API requests
   - [typescript](https://www.npmjs.com/package/typescript) - TypeScript compiler
   - [csv-stringify](https://www.npmjs.com/package/csv-stringify) - CSV file generation

## Usage

### Step 1: Compile TypeScript Files
```bash
tsc -b
```
This command compiles all TypeScript files into the `./dist` folder containing JavaScript files.

### Step 2: Run the Strategy Tester
```bash
cd dist
node main.js
```

## Output

The strategy tester generates three CSV files:

1. **`RSI_trade_results.csv`** - Contains all RSI-EMA strategy trades
2. **`MACD_trade_results.csv`** - Contains all MACD strategy trades  
3. **`trade_results.csv`** - Contains combined results from both strategies

### CSV File Structure
Each CSV file includes the following columns:
- Entry Time
- Entry Price
- Exit Time
- Exit Price
- Strategy
- PnL (Profit/Loss)
- Status

## Configuration

You can modify the following parameters in the source files:

- **Symbol**: Default is `BTCUSDT` (in `fetchBinance.ts`)
- **Interval**: Default is `1m` (1-minute candles)
- **Limit**: Default is `5000` data points
- **Initial Capital**: Default is `$10,000`

## Project Structure

```
strategy_tester/
├── src/
│   ├── main.ts              # Main execution file
│   ├── fetchBinance.ts      # Binance API data fetching
│   ├── calculations.ts      # Technical indicator calculations
│   ├── action.ts           # Trading strategy implementations
│   ├── simulation.ts       # Trade simulation logic
│   └── exportToCSV.ts      # CSV export functionality
├── dist/                   # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

## Example Output

The console will display:
- Sample RSI and MACD signals
- Trade summaries for each strategy
- Export confirmation with statistics
- Total PnL and win rate for each strategy

![image](https://github.com/user-attachments/assets/598966b2-8c0c-443a-adee-72a51177f069)<br>
![image](https://github.com/user-attachments/assets/f3c478cf-9828-4b8b-a3f3-0eec4f0a099c)
![image](https://github.com/user-attachments/assets/c0b32438-a496-4846-9e36-1d9d7fc832e4)
![image](https://github.com/user-attachments/assets/a4c61ceb-85f0-4622-b4fc-f4aab661a49b)