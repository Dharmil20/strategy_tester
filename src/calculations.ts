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
