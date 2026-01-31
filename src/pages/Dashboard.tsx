import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import AppHeader from '@/components/AppHeader';
import BottomNav from '@/components/BottomNav';
import MetricCard from '@/components/MetricCard';
import QuickAction from '@/components/QuickAction';
import FileCard from '@/components/FileCard';
import { formatCurrency, isToday } from '@/lib/helpers';
import { 
  FileText, 
  Clock, 
  IndianRupee, 
  AlertCircle,
  CheckCircle,
  FileWarning,
  TrendingUp,
  Plus,
  Settings,
  CreditCard,
  BarChart2
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { files, payments, expenses, documents } = useApp();

  const metrics = useMemo(() => {
    const todayFiles = files.filter(f => isToday(f.createdAt));
    const pendingFiles = files.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status));
    const readyFiles = files.filter(f => f.status === 'READY');
    
    const todayPayments = payments.filter(p => isToday(p.date));
    const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const pendingPayments = files.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
    
    const docsMissing = documents.filter(d => !d.received).length;
    
    const todayExpenses = expenses
      .filter(e => isToday(e.date))
      .reduce((sum, e) => sum + e.amount, 0);
    
    const agentIncome = files.reduce((sum, f) => sum + f.agentCharge, 0);

    return {
      filesToday: todayFiles.length,
      pendingFiles: pendingFiles.length,
      todayCollection,
      paymentPending: pendingPayments,
      readyForDelivery: readyFiles.length,
      documentMissing: docsMissing,
      agentIncome,
      todayExpenses,
    };
  }, [files, payments, expenses, documents]);

  const recentFiles = useMemo(() => {
    return [...files]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [files]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader />

      <main className="px-4 py-4 space-y-6">
        {/* Primary Metrics */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Files Today"
              value={metrics.filesToday}
              icon={FileText}
              variant="primary"
              onClick={() => navigate('/files')}
            />
            <MetricCard
              title="Pending Files"
              value={metrics.pendingFiles}
              icon={Clock}
              variant="warning"
              pulse={metrics.pendingFiles > 10}
              onClick={() => navigate('/files?status=pending')}
            />
            <MetricCard
              title="Today Collection"
              value={formatCurrency(metrics.todayCollection)}
              icon={IndianRupee}
              variant="success"
              onClick={() => navigate('/payments')}
            />
            <MetricCard
              title="Payment Pending"
              value={formatCurrency(metrics.paymentPending)}
              icon={AlertCircle}
              variant="accent"
              pulse={metrics.paymentPending > 10000}
              onClick={() => navigate('/payments?filter=pending')}
            />
          </div>
        </section>

        {/* Secondary Metrics */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Ready for Delivery"
              value={metrics.readyForDelivery}
              icon={CheckCircle}
              onClick={() => navigate('/files?status=ready')}
            />
            <MetricCard
              title="Documents Missing"
              value={metrics.documentMissing}
              icon={FileWarning}
              onClick={() => navigate('/documents')}
            />
            <MetricCard
              title="Agent Income"
              value={formatCurrency(metrics.agentIncome)}
              icon={TrendingUp}
              subtitle="This month"
              onClick={() => navigate('/summary')}
            />
            <MetricCard
              title="Today Expenses"
              value={formatCurrency(metrics.todayExpenses)}
              icon={IndianRupee}
              onClick={() => navigate('/expenses')}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2">
            <QuickAction
              icon={Plus}
              label="New File"
              onClick={() => navigate('/new-file')}
              variant="primary"
            />
            <QuickAction
              icon={Settings}
              label="Services"
              onClick={() => navigate('/services')}
            />
            <QuickAction
              icon={CreditCard}
              label="Payments"
              onClick={() => navigate('/payments')}
            />
            <QuickAction
              icon={BarChart2}
              label="Summary"
              onClick={() => navigate('/summary')}
            />
          </div>
        </section>

        {/* Recent Files */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Files
            </h2>
            <button 
              onClick={() => navigate('/files')}
              className="text-xs text-primary font-medium"
            >
              View All
            </button>
          </div>
          
          {recentFiles.length > 0 ? (
            <div className="space-y-3">
              {recentFiles.map(file => (
                <FileCard
                  key={file.id}
                  file={file}
                  onClick={() => navigate(`/file/${file.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-8 text-center border border-border">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No files yet</p>
              <button
                onClick={() => navigate('/new-file')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
              >
                Create First File
              </button>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
