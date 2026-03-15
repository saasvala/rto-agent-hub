import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { AlertTriangle, TrendingUp, Clock, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  icon: React.ElementType;
  title: string;
  message: string;
  severity: 'warning' | 'info' | 'danger';
}

export default function SmartAlerts() {
  const { files, payments, services } = useApp();

  const alerts = useMemo(() => {
    const result: Alert[] = [];

    // Delay risk: files older than expected delivery
    const now = new Date();
    const delayedFiles = files.filter(f => {
      if (['DELIVERED', 'REJECTED'].includes(f.status)) return false;
      return new Date(f.expectedDeliveryDate) < now;
    });
    if (delayedFiles.length > 0) {
      result.push({
        id: 'delay',
        icon: Clock,
        title: 'Delay Risk',
        message: `${delayedFiles.length} file${delayedFiles.length > 1 ? 's' : ''} past expected delivery date`,
        severity: 'danger',
      });
    }

    // Pending file overload (>15 pending)
    const pendingFiles = files.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status));
    if (pendingFiles.length > 15) {
      result.push({
        id: 'overload',
        icon: AlertTriangle,
        title: 'Pending Overload',
        message: `${pendingFiles.length} files pending — consider prioritizing`,
        severity: 'warning',
      });
    }

    // High pending payments (>₹20,000)
    const pendingAmount = files.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
    if (pendingAmount > 20000) {
      result.push({
        id: 'payment',
        icon: IndianRupee,
        title: 'Payment Pending',
        message: `₹${pendingAmount.toLocaleString('en-IN')} pending — follow up with customers`,
        severity: 'warning',
      });
    }

    // High demand service insight
    const serviceCounts: Record<string, number> = {};
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    files.filter(f => new Date(f.createdAt) >= thisMonth).forEach(f => {
      serviceCounts[f.serviceId] = (serviceCounts[f.serviceId] || 0) + 1;
    });
    const topEntry = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];
    if (topEntry && topEntry[1] >= 3) {
      const svc = services.find(s => s.id === topEntry[0]);
      if (svc) {
        result.push({
          id: 'demand',
          icon: TrendingUp,
          title: 'High Demand',
          message: `${svc.name} — ${topEntry[1]} files this month`,
          severity: 'info',
        });
      }
    }

    // Low pricing warning: services with agent charge below ₹300
    const lowPricedServices = services.filter(s => s.isActive && s.agentCharge < 300 && s.agentCharge > 0);
    if (lowPricedServices.length > 0) {
      result.push({
        id: 'low-pricing',
        icon: AlertTriangle,
        title: 'Low Pricing Warning',
        message: `${lowPricedServices.length} service${lowPricedServices.length > 1 ? 's' : ''} with agent charge below ₹300 — ${lowPricedServices.map(s => s.name).slice(0, 2).join(', ')}`,
        severity: 'warning',
      });
    }

    // Follow-up reminders
    const followUps = files.filter(f => {
      if (['DELIVERED', 'REJECTED'].includes(f.status)) return false;
      if (!f.followUpDate) return false;
      return new Date(f.followUpDate) <= now;
    });
    if (followUps.length > 0) {
      result.push({
        id: 'followup',
        icon: Clock,
        title: 'Follow-up Due',
        message: `${followUps.length} file${followUps.length > 1 ? 's' : ''} need follow-up today`,
        severity: 'warning',
      });
    }

    return result;
  }, [files, payments, services]);

  if (alerts.length === 0) return null;

  const severityStyles = {
    danger: 'bg-destructive/10 border-destructive/30 text-destructive',
    warning: 'bg-warning/10 border-warning/30 text-warning',
    info: 'bg-info/10 border-info/30 text-info',
  };

  return (
    <section>
      <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        🤖 Smart Alerts
      </h2>
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-xl border animate-fade-in',
              severityStyles[alert.severity]
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <alert.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">{alert.title}</p>
              <p className="text-xs opacity-80">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
