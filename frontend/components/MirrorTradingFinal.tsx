import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import { TrendingUp, Wallet, Settings, Zap } from "lucide-react";

const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const MIRROR_TRADING_ADDRESS = "0x2f86cffa28b74ff5b04142c5c328368a6ce4763ae70137022a393d84a4ab3003"; // Properly padded 64 hex chars

const client = new AptosClient(APTOS_NODE_URL);

interface FollowerRules {
  max_trade_size: number;
  allowed_tokens: string[];
  delay_seconds: number;
  stop_loss_percent: number;
  enabled: boolean;
}

export function MirrorTradingFinal() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [leaderAddress, setLeaderAddress] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [rules, setRules] = useState<FollowerRules>({
    max_trade_size: 100,
    allowed_tokens: ["APT", "USDC", "USDT"],
    delay_seconds: 5,
    stop_loss_percent: 10,
    enabled: true,
  });
  const [loading, setLoading] = useState(false);

  const handleFollowLeader = async () => {
    if (!leaderAddress || !account?.address) {
      toast({
        title: "Error",
        description: "Please enter a leader address and connect your wallet",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: `${MIRROR_TRADING_ADDRESS}::mirror_trading::follow_leader`,
          typeArguments: [],
          functionArguments: [
            leaderAddress,
            rules.max_trade_size,
            rules.allowed_tokens,
            rules.delay_seconds,
            rules.stop_loss_percent,
            rules.enabled,
          ],
        },
      });
      await client.waitForTransaction(response.hash);

      setIsFollowing(true);
      toast({
        title: "Success",
        description: `Now following leader: ${leaderAddress}`,
      });
    } catch (error) {
      console.error("Error following leader:", error);
      toast({
        title: "Error",
        description: "Failed to follow leader",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowLeader = async () => {
    if (!account?.address) return;

    setLoading(true);
    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: `${MIRROR_TRADING_ADDRESS}::mirror_trading::unfollow_leader`,
          typeArguments: [],
          functionArguments: [leaderAddress],
        },
      });
      await client.waitForTransaction(response.hash);

      setIsFollowing(false);
      toast({
        title: "Success",
        description: "Stopped following leader",
      });
    } catch (error) {
      console.error("Error unfollowing leader:", error);
      toast({
        title: "Error",
        description: "Failed to unfollow leader",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Smart Wallet Mirror Trading
        </h2>
        <p className="text-gray-400">Automate your trading by following successful traders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <Wallet className="h-5 w-5" />
              Leader Configuration
            </CardTitle>
            <CardDescription className="text-gray-400">Set up which trader to follow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Leader Wallet Address</Label>
              <Input
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                value={leaderAddress}
                onChange={(e) => setLeaderAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>

            <div>
              <Label className="text-gray-300">Max Trade Size ($)</Label>
              <Input
                className="bg-gray-700 border-gray-600 text-white"
                type="number"
                value={rules.max_trade_size}
                onChange={(e) => setRules({ ...rules, max_trade_size: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label className="text-gray-300">Stop Loss (%)</Label>
              <Input
                className="bg-gray-700 border-gray-600 text-white"
                type="number"
                value={rules.stop_loss_percent}
                onChange={(e) => setRules({ ...rules, stop_loss_percent: Number(e.target.value) })}
              />
            </div>

            <div>
              <Label className="text-gray-300">Delay (seconds)</Label>
              <Input
                className="bg-gray-700 border-gray-600 text-white"
                type="number"
                value={rules.delay_seconds}
                onChange={(e) => setRules({ ...rules, delay_seconds: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label className="text-gray-300">Enabled</Label>
              <input
                type="checkbox"
                checked={rules.enabled}
                onChange={(e) => setRules({ ...rules, enabled: e.target.checked })}
                className="accent-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleFollowLeader}
                disabled={loading || isFollowing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Processing..." : "Follow Leader"}
              </Button>
              <Button
                onClick={handleUnfollowLeader}
                disabled={loading || !isFollowing}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? "Processing..." : "Unfollow Leader"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Settings className="h-5 w-5" />
              Trading Rules
            </CardTitle>
            <CardDescription className="text-gray-400">Configure your mirror trading preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Allowed Tokens</span>
                <span className="text-blue-400">{rules.allowed_tokens.join(", ")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Max Trade Size</span>
                <span className="text-green-400">${rules.max_trade_size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Stop Loss</span>
                <span className="text-red-400">{rules.stop_loss_percent}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Delay</span>
                <span className="text-yellow-400">{rules.delay_seconds}s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:scale-105 transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-400">Execute mirror trades instantly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300">Status: {isFollowing ? "Following" : "Not Following"}</p>
              <p className="text-sm text-gray-400">
                {account?.address
                  ? `Connected: ${String(account.address).slice(0, 6)}...${String(account.address).slice(-4)}`
                  : "Connect wallet to start"}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleFollowLeader}
                disabled={loading || isFollowing || !account?.address}
                className="bg-green-600 hover:bg-green-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Follow
              </Button>
              <Button
                onClick={handleUnfollowLeader}
                disabled={loading || !isFollowing || !account?.address}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
