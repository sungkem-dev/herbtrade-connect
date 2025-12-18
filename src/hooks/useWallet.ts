import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  ethBalance: string | null;
  tokenBalances: TokenBalance[];
}

interface TokenBalance {
  symbol: string;
  balance: string;
  name: string;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

const WALLET_KEY = "herblocx_wallet";

// Mock token balances for demonstration
const mockTokenBalances: TokenBalance[] = [
  { symbol: "USDT", balance: "1,250.00", name: "Tether USD" },
  { symbol: "USDC", balance: "850.50", name: "USD Coin" },
  { symbol: "HERB", balance: "5,000.00", name: "HerBlocX Token" },
];

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    ethBalance: null,
    tokenBalances: [],
  });

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchBalance = useCallback(async (address: string) => {
    if (!window.ethereum) return;

    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      }) as string;

      // Convert from Wei to ETH
      const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
      
      setWallet((prev) => ({
        ...prev,
        ethBalance,
        tokenBalances: mockTokenBalances,
      }));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, []);

  const checkIfWalletIsConnected = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;

      if (accounts.length > 0) {
        setWallet((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          chainId,
        }));
        localStorage.setItem(WALLET_KEY, accounts[0]);
        fetchBalance(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  }, [fetchBalance]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension to connect your wallet.",
        variant: "destructive",
      });
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;

      if (accounts.length > 0) {
        setWallet((prev) => ({
          ...prev,
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          chainId,
        }));
        localStorage.setItem(WALLET_KEY, accounts[0]);
        fetchBalance(accounts[0]);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${shortenAddress(accounts[0])}`,
        });
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      setWallet((prev) => ({ ...prev, isConnecting: false }));
      
      if (err.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "You rejected the wallet connection request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      chainId: null,
      ethBalance: null,
      tokenBalances: [],
    });
    localStorage.removeItem(WALLET_KEY);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[];
        if (accs.length === 0) {
          disconnectWallet();
        } else {
          setWallet((prev) => ({
            ...prev,
            address: accs[0],
            isConnected: true,
          }));
          localStorage.setItem(WALLET_KEY, accs[0]);
          fetchBalance(accs[0]);
        }
      };

      const handleChainChanged = (chainId: unknown) => {
        setWallet((prev) => ({ ...prev, chainId: chainId as string }));
        if (wallet.address) {
          fetchBalance(wallet.address);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkIfWalletIsConnected, fetchBalance, wallet.address]);

  return {
    ...wallet,
    connectWallet,
    disconnectWallet,
    shortenAddress,
  };
};
