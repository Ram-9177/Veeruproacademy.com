import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'primary' | 'success' | 'accent' | 'warning';
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, variant = 'primary' }: StatsCardProps) {
  const variantStyles = {
    primary: {
      bg: 'bg-primary/5 border-primary/20',
      icon: 'bg-primary/10 text-primary',
      text: 'text-primary',
    },
    success: {
      bg: 'bg-success/5 border-success/20',
      icon: 'bg-success/10 text-success',
      text: 'text-success',
    },
    accent: {
      bg: 'bg-accent/5 border-accent/20',
      icon: 'bg-accent/10 text-accent',
      text: 'text-accent',
    },
    warning: {
      bg: 'bg-warning/5 border-warning/20',
      icon: 'bg-warning/10 text-warning',
      text: 'text-warning',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border-2 ${styles.bg} hover:shadow-xl transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground mb-2 font-medium">{title}</p>
          <h3 className={`text-4xl font-bold mb-3 ${styles.text}`}>{value}</h3>
          {trend && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trendUp ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`${styles.icon} p-4 rounded-xl shadow-sm`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
