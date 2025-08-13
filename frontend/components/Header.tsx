import { WalletSelector } from "./WalletSelector";
import { TrendingUp, Zap } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Smart Mirror Trading</h1>
              <p className="text-sm text-gray-400">Follow successful traders automatically</p>
            </div>
          </div>
          <WalletSelector />
        </div>
      </div>
    </header>
  );
}
