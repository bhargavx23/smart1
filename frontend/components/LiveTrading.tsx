import React, { useEffect, useState } from "react";

interface TradingData {
  asset: string;
  price: number;
  volume: number;
  change: number;
  timestamp: string;
}

const LiveTrading: React.FC = () => {
  const [tradingData, setTradingData] = useState<TradingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradingData = async () => {
      try {
        const response = await fetch(
          "https://api.groww.in/v1/live-data/ltp?segment=CASH&exchange_symbols=NSE_RELIANCE,BSE_SENSEX",
        ); // Replace with actual API endpoint
        const data: TradingData[] = await response.json();
        setTradingData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trading data:", error);
        setLoading(false);
      }
    };

    fetchTradingData();
    const interval = setInterval(fetchTradingData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Live Global Trading</h1>
        <p className="text-gray-400">Real-time trading data from markets worldwide</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Active Markets</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Asset Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tradingData.map((trade, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{trade.asset}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${trade.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trade.change >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {trade.change >= 0 ? "+" : ""}
                        {trade.change.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${trade.volume.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Total Volume</h3>
            <p className="text-2xl font-bold text-purple-400">
              ${tradingData.reduce((sum, trade) => sum + trade.volume, 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Active Pairs</h3>
            <p className="text-2xl font-bold text-blue-400">{tradingData.length}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Avg Change</h3>
            <p className="text-2xl font-bold text-green-400">
              {(tradingData.reduce((sum, trade) => sum + trade.change, 0) / tradingData.length).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrading;
