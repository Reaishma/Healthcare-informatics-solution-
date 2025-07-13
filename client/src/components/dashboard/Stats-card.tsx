import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    isNeutral?: boolean;
  };
  iconBgColor: string;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  iconBgColor 
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            {trend.isNeutral ? (
              <Minus className="h-4 w-4 text-muted-foreground mr-1" />
            ) : trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={
              trend.isNeutral 
                ? "text-muted-foreground" 
                : trend.isPositive 
                  ? "text-green-500" 
                  : "text-red-500"
            }>
              {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

