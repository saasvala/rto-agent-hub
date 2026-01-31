import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { formatCurrency, isToday } from '@/lib/helpers';
import { ArrowLeft, FileText, IndianRupee, TrendingUp, Receipt, Calendar } from 'lucide-react';

export default function Summary() {
  const navigate = useNavigate();
  const { files, payments, expenses, services } = useApp();

  const dailySummary = useMemo(() => {
    const todayFiles = files.filter(f => isToday(f.createdAt));
    const todayPayments = payments.filter(p => isToday(p.date));
    const todayExpenses = expenses.filter(e => isToday(e.date));
    
    const collection = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const expenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netEarning = collection - expenseTotal;
    
    return {
      filesHandled: todayFiles.length,
      collection,
      expenses: expenseTotal,
      netEarning,
    };
  }, [files, payments, expenses]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthFiles = files.filter(f => new Date(f.createdAt) >= monthStart);
    const monthPayments = payments.filter(p => new Date(p.date) >= monthStart);
    const monthExpenses = expenses.filter(e => new Date(e.date) >= monthStart);
    
    const totalCollection = monthPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const agentIncome = monthFiles.reduce((sum, f) => sum + f.agentCharge, 0);
    const pendingAmount = files.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
    const pendingFiles = files.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status)).length;
    
    return {
      totalFiles: monthFiles.length,
      totalCollection,
      totalExpenses,
      agentIncome,
      pendingAmount,
      pendingFiles,
      netEarning: totalCollection - totalExpenses,
    };
  }, [files, payments, expenses]);

  const topServices = useMemo(() => {
    const serviceCounts: Record<string, number> = {};
    files.forEach(f => {
      serviceCounts[f.serviceId] = (serviceCounts[f.serviceId] || 0) + 1;
    });
    
    return Object.entries(serviceCounts)
      .map(([id, count]) => ({
        service: services.find(s => s.id === id),
        count,
      }))
      .filter(item => item.service)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [files, services]);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Summary</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Today's Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Today's Summary
            </h2>
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

        {/* Monthly Summary */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            This Month
          </h2>
          
          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-xl font-bold text-foreground">{monthlySummary.totalFiles}</p>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Pending Files</p>
                <p className="text-xl font-bold text-warning">{monthlySummary.pendingFiles}</p>
              </div>
            </div>
            
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

        {/* Top Services */}
        {topServices.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Top Services
            </h2>
            
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {topServices.map((item, index) => (
                <div key={item.service?.id} className="flex items-center gap-4 p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.service?.name}</p>
                    <p className="text-sm text-muted-foreground">{item.count} files</p>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatCurrency((item.service?.agentCharge || 0) * item.count)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
