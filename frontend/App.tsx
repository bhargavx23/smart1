import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Header } from "./components/Header";
import { MirrorTradingFinal } from "./components/MirrorTradingFinal";
import { WalletSelector } from "./components/WalletSelector";
import { Card } from "./components/ui/card";

function App() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-8 text-center max-w-md">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Smart Wallet Mirror Trading</h2>
                <p className="text-gray-400 mb-6">
                  Connect your wallet to start following successful traders and automate your trading strategy
                </p>
              </div>
              <WalletSelector />
            </Card>
          </div>
        ) : (
          <MirrorTradingFinal />
        )}
      </main>
    </div>
  );
}

export default App;
