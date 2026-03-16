import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { formatCurrency, isToday } from '@/lib/helpers';
import SmartAlerts from '@/components/SmartAlerts';
import { ArrowLeft, FileText, IndianRupee, TrendingUp, Receipt, Calendar, BarChart2, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Clock, Package } from 'lucide-react';

export default function Summary() {
  const navigate = useNavigate();
  const { files, payments, expenses, services, user } = useApp();
  const isAssistant = user?.role === 'assistant';

  // Month selector state
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const monthLabel = new Date(selectedMonth.year, selectedMonth.month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setSelectedMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 });
  };
  const nextMonth = () => {
    const now = new Date();
    if (selectedMonth.year === now.getFullYear() && selectedMonth.month === now.getMonth()) return;
    setSelectedMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 });
  };
  const isCurrentMonth = selectedMonth.year === new Date().getFullYear() && selectedMonth.month === new Date().getMonth();

  const dailySummary = useMemo(() => {
    const todayFiles = files.filter(f => isToday(f.createdAt));
    const todayPayments = payments.filter(p => isToday(p.date));
    const todayExpenses = expenses.filter(e => isToday(e.date));
    const collection = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const expenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    return { filesHandled: todayFiles.length, collection, expenses: expenseTotal, netEarning: collection - expenseTotal };
  }, [files, payments, expenses]);

  const monthlySummary = useMemo(() => {
    const monthStart = new Date(selectedMonth.year, selectedMonth.month, 1);
    const monthEnd = new Date(selectedMonth.year, selectedMonth.month + 1, 0, 23, 59, 59);

    const monthFiles = files.filter(f => { const d = new Date(f.createdAt); return d >= monthStart && d <= monthEnd; });
    const monthPayments = payments.filter(p => { const d = new Date(p.date); return d >= monthStart && d <= monthEnd; });
    const monthExpenses = expenses.filter(e => { const d = new Date(e.date); return d >= monthStart && d <= monthEnd; });

    const totalCollection = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const agentIncome = monthFiles.reduce((sum, f) => sum + f.agentCharge, 0);

    // Pending workload breakdown
    const allPending = files.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status));
    const pendingAmount = allPending.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
    const submitted = allPending.filter(f => f.status === 'SUBMITTED').length;
    const inProcess = allPending.filter(f => f.status === 'IN_PROCESS').length;
    const approved = allPending.filter(f => f.status === 'APPROVED').length;
    const ready = allPending.filter(f => f.status === 'READY').length;

    const delivered = monthFiles.filter(f => f.status === 'DELIVERED').length;
    const rejected = monthFiles.filter(f => f.status === 'REJECTED').length;

    return {
      totalFiles: monthFiles.length, totalCollection, totalExpenses, agentIncome,
      pendingAmount, pendingFiles: allPending.length, netEarning: totalCollection - totalExpenses,
      delivered, rejected, submitted, inProcess, approved, ready,
    };
  }, [files, payments, expenses, selectedMonth]);

  const topServices = useMemo(() => {
    const monthStart = new Date(selectedMonth.year, selectedMonth.month, 1);
    const monthEnd = new Date(selectedMonth.year, selectedMonth.month + 1, 0, 23, 59, 59);
    const monthFiles = files.filter(f => { const d = new Date(f.createdAt); return d >= monthStart && d <= monthEnd; });

    const serviceCounts: Record<string, { count: number; revenue: number }> = {};
    monthFiles.forEach(f => {
      if (!serviceCounts[f.serviceId]) serviceCounts[f.serviceId] = { count: 0, revenue: 0 };
      serviceCounts[f.serviceId].count++;
      serviceCounts[f.serviceId].revenue += f.agentCharge;
    });

    return Object.entries(serviceCounts)
      .map(([id, data]) => ({ service: services.find(s => s.id === id), ...data }))
      .filter(item => item.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [files, services, selectedMonth]);

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Summary</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {isAssistant && (
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-center text-warning text-sm font-medium">
            Summary is restricted to Owner access only
          </div>
        )}

        {!isAssistant && (
          <>
            <SmartAlerts />

            {/* Today's Summary */}
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Today's Summary</h2>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{dailySummary.filesHandled}</p>
                    <p className="text-xs text-muted-foreground">Files Handled</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <IndianRupee className="w-6 h-6 text-success mx-auto mb-1" />
                    <p className="text-2xl font-bold text-success">{formatCurrency(dailySummary.collection)}</p>
                    <p className="text-xs text-muted-foreground">Collection</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Receipt className="w-6 h-6 text-destructive mx-auto mb-1" />
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(dailySummary.expenses)}</p>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-primary">{formatCurrency(dailySummary.netEarning)}</p>
                    <p className="text-xs text-muted-foreground">Net Earning</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Monthly Summary with Month Selector */}
            <section className="animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Monthly Report</h2>
                </div>
              </div>

              {/* Month Selector */}
              <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3 mb-3">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-secondary">
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <span className="font-semibold text-foreground">{monthLabel}</span>
                <button onClick={nextMonth} disabled={isCurrentMonth} className="p-2 rounded-lg hover:bg-secondary disabled:opacity-30">
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Files Overview */}
              <div className="bg-card rounded-xl border border-border p-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold text-foreground">{monthlySummary.totalFiles}</p>
                    <p className="text-xs text-muted-foreground">Total Files</p>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <p className="text-2xl font-bold text-success">{monthlySummary.delivered}</p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                  <div className="text-center p-3 bg-warning/10 rounded-lg">
                    <p className="text-2xl font-bold text-warning">{monthlySummary.pendingFiles}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Collection</span>
                    <span className="font-semibold text-success">{formatCurrency(monthlySummary.totalCollection)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Expenses</span>
                    <span className="font-semibold text-destructive">{formatCurrency(monthlySummary.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Amount</span>
                    <span className="font-semibold text-warning">{formatCurrency(monthlySummary.pendingAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-muted-foreground">Agent Income</span>
                    <span className="font-bold text-primary">{formatCurrency(monthlySummary.agentIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Net Earning</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(monthlySummary.netEarning)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Pending Workload Breakdown */}
            <section className="animate-fade-in" style={{ animationDelay: '225ms', animationFillMode: 'both' }}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Workload</h2>
              </div>
              <div className="bg-card rounded-xl border border-border divide-y divide-border">
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Submitted</p>
                    <p className="text-xs text-muted-foreground">Awaiting processing</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">{monthlySummary.submitted}</span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">In Process</p>
                    <p className="text-xs text-muted-foreground">At RTO office</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">{monthlySummary.inProcess}</span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Approved</p>
                    <p className="text-xs text-muted-foreground">Approved, awaiting ready</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">{monthlySummary.approved}</span>
                </div>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Ready for Delivery</p>
                    <p className="text-xs text-muted-foreground">Customer pickup pending</p>
                  </div>
                  <span className="text-lg font-bold text-foreground">{monthlySummary.ready}</span>
                </div>
              </div>
            </section>

            {/* Top Services */}
            {topServices.length > 0 && (
              <section className="animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                  Top Services — {monthLabel}
                </h2>
                <div className="bg-card rounded-xl border border-border divide-y divide-border">
                  {topServices.map((item, index) => (
                    <div key={item.service?.id} className="flex items-center gap-4 p-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.service?.name}</p>
                        <p className="text-sm text-muted-foreground">{item.count} files</p>
                      </div>
                      <p className="font-semibold text-primary">{formatCurrency(item.revenue)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
