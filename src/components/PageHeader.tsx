import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function PageHeader({ title, description, action, icon }: PageHeaderProps) {
  return (
    <div className="bg-white border-b-2 border-border shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start gap-4">
            {icon && (
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center shadow-lg flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
              {description && (
                <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">{description}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
