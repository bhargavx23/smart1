import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { toast } from "./ui/use-toast";
import { APTOS_NODE_URL, MIRROR_TRADING_ADDRESS } from "../constants";

const client = new AptosClient(APTOS_NODE_URL);

interface FollowerRules {
  max_trade_size: number;
  allowed_tokens: string[];
  delay_seconds: number;
  stop_loss_percent: number;
  enabled: boolean;
}

interface MirrorTrade {
  leader: string;
  follower: string;
  token_in: string;
  token_out: string;
  amount_in: number;
  amount_out: number;
  timestamp: number;
}

export function MirrorTrading() {
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
  const [recentTrades, setRecentTrades] = useState<MirrorTrade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account?.address) {
      checkFollowingStatus();
      loadRecentTrades();
    }
  }, [account?.address]);

  const checkFollowingStatus = async () => {
    try {
      const resource = await client.getAccountResource(
        MIRROR_TRADING_ADDRESS,
        `${MIRROR_TRADING_ADDRESS}::mirror_trading::MirrorState`,
      );

      if (resource) {
        const followers = resource.data.followers || {};
        setIsFollowing(followers[account!.address] !== undefined);
      }
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const loadRecentTrades = async () => {
    // This would fetch from your backend service
    // For demo purposes, we'll use mock data
    setRecentTrades([
      {
        leader: "0x1234...5678",
        follower: account!.address,
        token_in: "APT",
        token_out: "USDC",
        amount_in: 10,
        amount_out: 95,
        timestamp: Date.now() - 300000,
      },
    ]);
  };

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
          rules.max_trade_size * 100000000, // Convert to octas
          rules.allowed_tokens,
          rules.delay_seconds,
          rules.stop_loss_percent,
        ],
      };

      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);

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

      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);

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

  const handleUpdateRules = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const payload = {
        type: "entry_function_payload",
        function: `${MIRROR_TRADING_ADDRESS}::mirror_trading::update_rules`,
        type_arguments: [],
        arguments: [
          rules.max_trade_size * 100000000,
          rules.allowed_tokens,
          rules.delay_seconds,
          rules.stop_loss_percent,
        ],
      };

      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);

      toast({
        title: "Success!",
        description: "Rules updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rules",
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

      {isFollowing && (
        <Card>
          <CardHeader>
            <CardTitle>Trading Rules</CardTitle>
            <CardDescription>Configure your mirror trading preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label>Max Trade Size: {rules.max_trade_size} APT</Label>
                <Slider
                  value={[rules.max_trade_size]}
                  onValueChange={([value]) => setRules({ ...rules, max_trade_size: value })}
                  max={1000}
                  min={1}
                  step={1}
                />
              </div>

              <div>
                <Label>Delay Before Copy: {rules.delay_seconds}s</Label>
                <Slider
                  value={[rules.delay_seconds]}
                  onValueChange={([value]) => setRules({ ...rules, delay_seconds: value })}
                  max={60}
                  min={0}
                  step={1}
                />
              </div>

              <div>
                <Label>Stop Loss: {rules.stop_loss_percent}%</Label>
                <Slider
                  value={[rules.stop_loss_percent]}
                  onValueChange={([value]) => setRules({ ...rules, stop_loss_percent: value })}
                  max={50}
                  min={1}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Mirror Trading Enabled</Label>
                <Switch
                  id="enabled"
                  checked={rules.enabled}
                  onCheckedChange={(checked) => setRules({ ...rules, enabled: checked })}
                />
              </div>

              <Button onClick={handleUpdateRules} disabled={loading}>
                {loading ? "Updating..." : "Update Rules"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Latest mirrored trades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTrades.map((trade, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">
                    {trade.token_in} → {trade.token_out}
                  </p>
                  <p className="text-sm text-gray-600">
                    {trade.amount_in} → {trade.amount_out}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{new Date(trade.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
