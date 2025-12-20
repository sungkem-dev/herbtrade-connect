import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
}

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 gradient-bg">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
        <LoadingSpinner size="lg" className="relative z-10" />
      </div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: CardSkeletonProps) {
  return (
    <div className={cn("glass-card border-border/50 rounded-lg overflow-hidden", className)}>
      {/* Image skeleton */}
      <div className="aspect-square bg-muted/50 animate-pulse" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-muted/50 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted/50 rounded animate-pulse w-1/2" />
        
        {/* Price box skeleton */}
        <div className="glass p-3 rounded-lg border border-border/50 space-y-2">
          <div className="h-3 bg-muted/50 rounded animate-pulse w-1/3" />
          <div className="h-7 bg-muted/50 rounded animate-pulse w-1/2" />
          <div className="h-3 bg-muted/50 rounded animate-pulse w-2/3" />
        </div>
        
        <div className="h-3 bg-muted/50 rounded animate-pulse w-1/3" />
      </div>
      
      {/* Footer skeleton */}
      <div className="px-4 pb-4 flex gap-2">
        <div className="h-10 bg-muted/50 rounded animate-pulse flex-1" />
        <div className="h-10 w-10 bg-muted/50 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card border-border/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-4 bg-muted/50 rounded animate-pulse" />
        <div className="h-4 bg-muted/50 rounded animate-pulse w-20" />
      </div>
      <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border/50">
      <div className="h-10 w-10 bg-muted/50 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted/50 rounded animate-pulse w-1/3" />
        <div className="h-3 bg-muted/50 rounded animate-pulse w-1/4" />
      </div>
      <div className="h-5 bg-muted/50 rounded animate-pulse w-16" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card border-border/50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="h-5 bg-muted/50 rounded animate-pulse w-32" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-muted/50 rounded animate-pulse" />
          <div className="h-8 w-16 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-[200px] bg-muted/30 rounded-lg animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/20 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
