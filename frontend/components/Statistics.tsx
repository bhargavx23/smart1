import React, { useEffect, useState } from "react";
import { fetchCryptoData } from "../utils/cryptoData";

interface Crypto {
  id: string;
  name: string;
  current_price: number;
  market_cap: number;
}

const Statistics = () => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCryptoData();
        setCryptoData(data);
      } catch (error) {
        console.error("Failed to fetch crypto data:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cryptoData.map((coin) => (
        <div key={coin.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-white">{coin.name}</h2>
          <p className="text-2xl text-green-400">${coin.current_price}</p>
          <p className="text-sm text-gray-400">Market Cap: ${coin.market_cap}</p>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
