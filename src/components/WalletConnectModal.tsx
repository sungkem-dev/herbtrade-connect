import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  installed?: boolean;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletId: string) => void;
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Connect using MetaMask wallet",
    installed: typeof window !== "undefined" && !!(window as any).ethereum?.isMetaMask,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Connect using Coinbase Wallet",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Scan QR code to connect",
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Connect using Trust Wallet",
  },
];

export const WalletConnectModal = ({ isOpen, onClose, onConnect }: WalletConnectModalProps) => {
  const handleWalletSelect = (wallet: WalletOption) => {
    if (wallet.id === "metamask") {
      if (wallet.installed) {
        onConnect(wallet.id);
        onClose();
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to continue.",
          variant: "destructive",
        });
        window.open("https://metamask.io/download/", "_blank");
      }
    } else {
      toast({
        title: "Coming Soon",
        description: `${wallet.name} integration will be available soon.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient-hero">Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your preferred wallet to connect to HerBlocX
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="w-full h-auto p-4 justify-start gap-4 glass border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
              onClick={() => handleWalletSelect(wallet)}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{wallet.name}</span>
                  {wallet.id === "metamask" && wallet.installed && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Detected
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{wallet.description}</span>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          By connecting a wallet, you agree to HerBlocX's Terms of Service
        </p>
      </DialogContent>
    </Dialog>
  );
};
