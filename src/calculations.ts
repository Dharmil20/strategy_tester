/*
For ema 21 day window is given
In ema more weight is given to the recent price

ema[i] = (data[i] * (smoothing/1 + 21)) + (ema[i-1] * (1 - (smoothing/1 + 21))
this is the formula for ema 
smoothing is by default considered 2
*/

export function calculateEMA(data: number[], period: number): number[] {
  const weight = 2 / (1 + period);
  const ema: number[] = [];
  ema[0] = data[0];
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * weight + ema[i - 1] * (1 - weight);
  }

  return ema;
}

/*
For RSI a 14 day window is considered
we calculate Average Gain and Average Loss over the 14 day period
rsi < 30 --> Oversold
rsi cross 30--> Buy
rsi > 70 --> Overbought
rsi crosses 70 --> sell
*/

export function calculateRSI(data: number[], period: number): number[] {
  const rsi: number[] = new Array(data.length).fill(NaN);
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i <= period; i++) {
    const change: number = data[i] - data[i - 1];
    gains.push(Math.max(change, 0));
    losses.push(Math.max(-change, 0));
  }

  let avgGain: number = gains.reduce((a, b) => a + b, 0) / period;
  let avgLoss: number = losses.reduce((a, b) => a + b, 0) / period;

  // if only gains --> rsi=100 (highly overbought)
  if (avgLoss === 0) 
    // if gains and losses both zero (market sideways) --> rsi=50 (neutral)
    rsi[period] = avgGain === 0 ? 50 : 100;
  else 
    rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));
  
  for(let i = period + 1; i < data.length; i++){
    const change: number = data[i] - data[i - 1];
    const currentGain = Math.max(change, 0);
    const currentLoss = Math.max(-change, 0);

    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;

    if (avgLoss === 0) 
        rsi[i] = avgGain === 0 ? 50 : 100;
    else 
        rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  return rsi;
}

// function main(){
//     const testData = [44, 44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.85, 46.08, 45.89, 46.03, 46.83, 46.69, 46.45, 46.59, 45.69];

//     console.log("Test Data",testData);
//     console.log("EMA",calculateEMA(testData, 21));
//     const rsiVal = calculateRSI(testData, 14);
//     const val = rsiVal.filter(val => !isNaN(val));
//     console.log("RSI", val);
// }

// main();