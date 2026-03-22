import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import { formatCurrency, formatDate, isToday } from '@/lib/helpers';
import { ArrowLeft, IndianRupee, TrendingUp, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Payments() {
  const navigate = useNavigate();
  const { files, payments, getCustomerById, getServiceById } = useApp();
  const [filter, setFilter] = useState<'all' | 'received' | 'pending'>('all');

  const stats = useMemo(() => {
    const todayPayments = payments.filter(p => isToday(p.date));
    const todayCollection = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCollection = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = files.reduce((sum, f) => sum + (f.totalAmount - f.paidAmount), 0);
    
    return { todayCollection, totalCollection, totalPending };
  }, [files, payments]);

  const pendingFiles = useMemo(() => {
    return files
      .filter(f => f.totalAmount - f.paidAmount > 0)
      .sort((a, b) => (b.totalAmount - b.paidAmount) - (a.totalAmount - a.paidAmount));
  }, [files]);

  const recentPayments = useMemo(() => {
    return [...payments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);
  }, [payments]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Payments</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <IndianRupee className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-success">{formatCurrency(stats.todayCollection)}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalCollection)}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <AlertCircle className="w-5 h-5 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold text-destructive">{formatCurrency(stats.totalPending)}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'received', 'pending'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Pending Payments */}
        {(filter === 'all' || filter === 'pending') && pendingFiles.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Pending Payments
            </h2>
            <div className="space-y-2">
              {pendingFiles.map(file => {
                const customer = getCustomerById(file.customerId);
                const service = getServiceById(file.serviceId);
                const pending = file.totalAmount - file.paidAmount;
                
                return (
                  <div
                    key={file.id}
                    onClick={() => navigate(`/file/${file.id}`)}
                    className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{file.refNo}</p>
                          <p className="text-sm text-muted-foreground">{customer?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-destructive">{formatCurrency(pending)}</p>
                        <p className="text-xs text-muted-foreground">pending</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent Payments */}
        {(filter === 'all' || filter === 'received') && recentPayments.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Recent Payments
            </h2>
            <div className="space-y-2">
              {recentPayments.map(payment => {
                const file = files.find(f => f.id === payment.fileId);
                const customer = file ? getCustomerById(file.customerId) : null;
                
                return (
                  <div
                    key={payment.id}
                    onClick={() => file && navigate(`/file/${file.id}`)}
                    className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer?.name || 'Unknown'} • {file?.refNo}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          payment.mode === 'CASH' ? 'bg-success/20 text-success' :
                          payment.mode === 'UPI' ? 'bg-primary/20 text-primary' :
                          'bg-accent/20 text-accent'
                        )}>
                          {payment.mode}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(payment.date)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {pendingFiles.length === 0 && recentPayments.length === 0 && (
          <div className="text-center py-12">
            <IndianRupee className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No payment records yet</p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
