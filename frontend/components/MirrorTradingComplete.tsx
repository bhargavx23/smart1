import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

const APTOS_NODE_URL = "https://fullnode.testnet.aptoslabs.com";
const MIRROR_TRADING_ADDRESS = "0x2f86cffa28b74ff5b04142c5c328368a6ce4763ae70137022a393d84a4ab3003"; // Replace with actual contract address

const client = new AptosClient(APTOS_NODE_URL);

interface FollowerRules {
  max_trade_size: number;
  allowed_tokens: string[];
  delay_seconds: number;
  stop_loss_percent: number;
  enabled: boolean;
}

export function MirrorTradingComplete() {
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
    if (!leaderAddress || !account) return;

    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MIRROR_TRADING_ADDRESS}::mirror_trading::follow_leader`,
        type_arguments: [],
        arguments: [
          leaderAddress,
          rules.max_trade_size * 100000000,
          rules.allowed_tokens,
          rules.delay_seconds,
          rules.stop_loss_percent,
        ],
      };

      await signAndSubmitTransaction(payload);
      setIsFollowing(true);
      toast({
        title: "Success!",
        description: `Now following wallet ${leaderAddress.slice(0, 6)}...${leaderAddress.slice(-4)}`,
      });
    } catch (error) {
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
    if (!account) return;

    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MIRROR_TRADING_ADDRESS}::mirror_trading::unfollow_leader`,
        type_arguments: [],
        arguments: [leaderAddress],
      };

      await signAndSubmitTransaction(payload);
      setIsFollowing(false);
      toast({
        title: "Success!",
        description: "Stopped following leader",
      });
    } catch (error) {
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mirror Trading</CardTitle>
          <CardDescription>Automatically copy trades from successful traders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="leader-address">Leader Wallet Address</Label>
              <Input
                id="leader-address"
                placeholder="0x1234...5678"
                value={leaderAddress}
                onChange={(e) => setLeaderAddress(e.target.value)}
                disabled={isFollowing}
              />
            </div>

            {!isFollowing ? (
              <Button onClick={handleFollowLeader} disabled={!leaderAddress || loading} className="w-full">
                {loading ? "Following..." : "Follow Leader"}
              </Button>
            ) : (
              <Button onClick={handleUnfollowLeader} disabled={loading} variant="destructive" className="w-full">
                {loading ? "Unfollowing..." : "Unfollow Leader"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trading Rules</CardTitle>
          <CardDescription>Configure your mirror trading preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Max Trade Size: {rules.max_trade_size} APT</Label>
              <input
                type="range"
                min="1"
                max="1000"
                value={rules.max_trade_size}
                onChange={(e) => setRules({ ...rules, max_trade_size: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <Label>Delay Before Copy: {rules.delay_seconds}s</Label>
              <input
                type="range"
                min="0"
                max="60"
                value={rules.delay_seconds}
                onChange={(e) => setRules({ ...rules, delay_seconds: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <Label>Stop Loss: {rules.stop_loss_percent}%</Label>
              <input
                type="range"
                min="1"
                max="50"
                value={rules.stop_loss_percent}
                onChange={(e) => setRules({ ...rules, stop_loss_percent: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <Button onClick={() => setRules({ ...rules, enabled: !rules.enabled })}>
              {rules.enabled ? "Disable" : "Enable"} Mirror Trading
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
