import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface InitialLoaderProps {
  onComplete: () => void;
}

export const InitialLoader = ({ onComplete }: InitialLoaderProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center gradient-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
      onAnimationComplete={onComplete}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated rings */}
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            style={{ width: 80, height: 80, margin: "auto", left: -20, top: -20 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-secondary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
            style={{ width: 80, height: 80, margin: "auto", left: -20, top: -20 }}
          />
          
          {/* Logo */}
          <motion.div
            className="relative z-10 p-4 bg-primary/20 rounded-full glow-primary"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <img src="/icon.png" alt="HerBlocX" className="h-8 w-6" />
          </motion.div>
        </div>

        {/* Brand name */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-gradient-hero">HerbalChain</h1>
          <p className="text-sm text-muted-foreground mt-1">Web3 Marketplace</p>
        </motion.div>

        {/* Loading bar */}
        <motion.div 
          className="mt-8 w-48 h-1 bg-muted/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          className="mt-4 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          Connecting to blockchain...
        </motion.p>
      </div>
    </motion.div>
  );
};
