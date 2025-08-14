import { WalletSelector } from "./WalletSelector";
import { ThemeToggle } from "./ThemeToggle";
import { TrendingUp, Zap, Globe, ArrowUpDown, Users, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-white dark:bg-black backdrop-blur-sm rounded-b-2xl shadow-lg">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-lg">
              <div className="relative">
                <ArrowUpDown className="h-7 w-7 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                Smart Mirror Trading
              </h1>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">AI-Powered Trading Automation</p>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2 font-semibold text-lg"
              >
                <Brain className="h-5 w-5" />
                <span>Mirror Trading</span>
              </Link>
              <Link
                to="/live-trading"
                className="text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 flex items-center space-x-2 font-semibold text-lg"
              >
                <Users className="h-5 w-5" />
                <span>Live Trading</span>
              </Link>
            </nav>

            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <WalletSelector />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
