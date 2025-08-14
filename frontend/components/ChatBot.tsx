import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X } from "lucide-react"; // Removed unused imports
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "trade" | "crypto" | "stock";
}

interface TradeInfo {
  symbol: string;
  price: number;
  change: number;
  volume: string;
}

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your trading assistant. I can help you with:\n• Stock market information\n• Cryptocurrency data\n• Trading strategies\n• Market analysis\n• Portfolio insights\n\nWhat would you like to know?",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText.toLowerCase());
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): Message => {
    let responseText = "";
    let responseType: Message["type"] = "text";

    if (userInput.includes("stock") || userInput.includes("price")) {
      responseText = `📈 **Stock Information**\n\nHere are some popular stocks:\n\n**AAPL** - $175.43 (+2.1%)\n**GOOGL** - $2,847.63 (+1.8%)\n**MSFT** - $378.85 (+1.2%)\n**TSLA** - $248.50 (-0.8%)\n\nWould you like detailed analysis on any specific stock?`;
      responseType = "stock";
    } else if (userInput.includes("crypto") || userInput.includes("bitcoin")) {
      responseText = `₿ **Cryptocurrency Data**\n\n**Bitcoin (BTC)**: $43,250 (+3.2%)\n**Ethereum (ETH)**: $2,650 (+2.8%)\n**Solana (SOL)**: $98.75 (+5.1%)\n**Aptos (APT)**: $8.45 (+1.5%)\n\nMarket cap: $1.68T (+2.4%)\n24h volume: $89.5B`;
      responseType = "crypto";
    } else if (userInput.includes("trade") || userInput.includes("strategy")) {
      responseText = `📊 **Trading Strategies**\n\n**Popular Strategies:**\n• Day Trading: Short-term positions\n• Swing Trading: Medium-term trends\n• Position Trading: Long-term holds\n• Scalping: Quick small profits\n\n**Risk Management:**\n• Never risk more than 2% per trade\n• Use stop-loss orders\n• Diversify your portfolio`;
      responseType = "trade";
    } else if (userInput.includes("portfolio") || userInput.includes("balance")) {
      responseText = `💼 **Portfolio Overview**\n\n**Your Holdings:**\n• BTC: 0.5 ($21,625)\n• ETH: 2.3 ($6,095)\n• APT: 150 ($1,267)\n• USDC: $5,000\n\n**Total Value**: $33,987\n**24h Change**: +$487 (+1.5%)`;
      responseType = "trade";
    } else {
      responseText = `🤖 **I can help you with:**\n\n• Stock prices and analysis\n• Cryptocurrency data\n• Trading strategies\n• Market trends\n• Portfolio management\n\nTry asking: "Show me Bitcoin price" or "Best trading strategies"`;
    }

    return {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: "bot",
      timestamp: new Date(),
      type: responseType,
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl"
      >
        <Bot className="h-6 w-6 transition-transform duration-300 ease-in-out" />
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop blur effect with smooth transition */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-6 right-6 w-[500px] h-[600px] z-50 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <Card className="h-full flex flex-col bg-black dark:bg-white border border-gray-700 dark:border-gray-300 shadow-2xl transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-300">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-400 transition-transform duration-200 hover:scale-110" />
              <h3 className="font-semibold text-white dark:text-black">Trading Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white dark:text-gray-600 dark:hover:text-black transition-all duration-200 hover:scale-110"
            >
              <X className="h-4 w-4 transition-transform duration-200" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} transition-all duration-300 ease-in-out`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 transition-all duration-300 ease-in-out hover:scale-105 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 dark:bg-gray-100 text-white dark:text-black"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "bot" && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
                    )}
                    <div className="whitespace-pre-line text-sm">{message.text}</div>
                  </div>
                  <div className="text-xs opacity-70 mt-1 transition-opacity duration-200">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-700 dark:border-gray-300">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask about stocks, crypto, or trading..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-gray-800 dark:bg-gray-100 border-gray-600 dark:border-gray-300 text-white dark:text-black placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200 focus:scale-105"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-110"
              >
                <Send className="h-4 w-4 transition-transform duration-200" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
