import axios from "axios";

interface OHLCParams {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  Volume: number;
  closeTime: number;
}

const Symbol: string = "BTCUSDT";
const Interval: string = "1m";
const Limit: number = 5000;

export async function fetchOHLCData(
  symbol: string = Symbol,
  interval: string = Interval,
  limit: number = Limit
): Promise<OHLCParams[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await axios.get(url);

  const resMap = res.data.map((item: any) => ({
    openTime: item[0],
    open: parseFloat(item[1]),
    high: parseFloat(item[2]),
    low: parseFloat(item[3]),
    close: parseFloat(item[4]),
    volume: parseFloat(item[5]),
    closeTime: item[6],
  }));

  return resMap;
}

async function main() {
  try {
    const data = await fetchOHLCData();
    console.log("Fetched data:", JSON.stringify(data.slice(0, 5), null, 2));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

main();