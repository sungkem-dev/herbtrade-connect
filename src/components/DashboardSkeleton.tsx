import { Card, CardContent } from "@/components/ui/card";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/loading-spinner";

export const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-24 relative z-10">
      {/* Welcome Section Skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-muted/30 rounded-lg animate-pulse w-80 mb-2" />
        <div className="h-6 bg-muted/30 rounded animate-pulse w-96" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="mb-8">
        <div className="h-7 bg-muted/30 rounded animate-pulse w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-16 w-16 bg-muted/30 rounded-xl animate-pulse" />
                  <div className="space-y-2 w-full">
                    <div className="h-5 bg-muted/30 rounded animate-pulse mx-auto w-24" />
                    <div className="h-4 bg-muted/30 rounded animate-pulse mx-auto w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Portfolio Section Skeleton */}
      <div className="mb-8">
        <div className="h-7 bg-muted/30 rounded animate-pulse w-40 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <Card className="glass-card border-border/50 p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted/30 rounded-full animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 bg-muted/30 rounded animate-pulse w-24" />
                      <div className="h-3 bg-muted/30 rounded animate-pulse w-16" />
                    </div>
                  </div>
                  <div className="h-5 bg-muted/30 rounded animate-pulse w-16" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Blockchain Stats Skeleton */}
      <div>
        <div className="h-7 bg-muted/30 rounded animate-pulse w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
