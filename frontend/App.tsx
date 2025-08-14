import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { MirrorTradingFinal } from "./components/MirrorTradingFinal";
import TestComponent from "./components/TestComponent";
import { WalletSelector } from "./components/WalletSelector";
import { Card } from "./components/ui/card";
import { ThemeProvider } from "./components/ThemeProvider";
import { ChatBot } from "./components/ChatBot";
import { ArrowUpDown } from "lucide-react"; // <-- Add this import

function App() {
  const { connected } = useWallet();

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-black relative overflow-hidden">
          {/* Motion Background Elements */}
          <div className="motion-bg">
            <div className="motion-element"></div>
            <div className="motion-element"></div>
            <div className="motion-element"></div>
            <div className="motion-element"></div>
          </div>

          <Header />

          <main className="container mx-auto px-4 py-8 relative z-10">
            <Routes>
              <Route
                path="/"
                element={
                  !connected ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                      <Card className="bg-white/80 dark:bg-white/20 backdrop-blur-sm p-8 text-center max-w-md border border-gray-200 dark:border-white/20 shadow-2xl rounded-2xl">
                        <div className="mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ArrowUpDown className="w-10 h-10 text-white" />
                          </div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            Smart Mirror Trading
                          </h2>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            Connect your wallet to start following successful traders and automate your trading strategy
                            with AI-powered insights
                          </p>
                        </div>
                        <WalletSelector />
                      </Card>
                    </div>
                  ) : (
                    <MirrorTradingFinal />
                  )
                }
              />
              <Route path="/live-trading" element={<TestComponent />} />
            </Routes>
          </main>
          <ChatBot />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
// ...existing code...
