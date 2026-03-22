import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, isToday } from '@/lib/helpers';
import { ArrowLeft, Plus, Receipt, Truck, FileText, Wrench, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpenseType } from '@/types';

const expenseTypeConfig: Record<ExpenseType, { icon: typeof Receipt; label: string; color: string }> = {
  TRANSPORT: { icon: Truck, label: 'Transport', color: 'bg-primary/10 text-primary' },
  FORM_PRINTING: { icon: FileText, label: 'Form/Printing', color: 'bg-accent/10 text-accent' },
  RTO_RUNNING: { icon: Wrench, label: 'RTO Running', color: 'bg-warning/10 text-warning' },
  MISCELLANEOUS: { icon: HelpCircle, label: 'Miscellaneous', color: 'bg-muted text-muted-foreground' },
};

export default function Expenses() {
  const navigate = useNavigate();
  const { expenses, addExpense } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    type: 'TRANSPORT' as ExpenseType,
    amount: '',
    reference: '',
    notes: '',
  });

  const stats = useMemo(() => {
    const todayExpenses = expenses.filter(e => isToday(e.date));
    const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    return { todayTotal, totalExpenses };
  }, [expenses]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses]);

  const handleAddExpense = () => {
    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) return;

    addExpense({
      type: newExpense.type,
      amount,
      date: new Date(),
      reference: newExpense.reference,
      notes: newExpense.notes,
    });

    setNewExpense({ type: 'TRANSPORT', amount: '', reference: '', notes: '' });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Expenses</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Receipt className="w-6 h-6 text-warning mx-auto mb-1" />
            <p className="text-xl font-bold text-warning">{formatCurrency(stats.todayTotal)}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Receipt className="w-6 h-6 text-destructive mx-auto mb-1" />
            <p className="text-xl font-bold text-destructive">{formatCurrency(stats.totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Expenses List */}
        <div className="space-y-2">
          {sortedExpenses.map(expense => {
            const config = expenseTypeConfig[expense.type];
            const Icon = config.icon;
            
            return (
              <div
                key={expense.id}
                className="bg-card rounded-xl p-4 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{config.label}</p>
                    {expense.reference && (
                      <p className="text-sm text-muted-foreground">{expense.reference}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                  </div>
                  <p className="font-bold text-destructive">{formatCurrency(expense.amount)}</p>
                </div>
                {expense.notes && (
                  <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border">
                    {expense.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {sortedExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No expenses recorded</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
            >
              Add Expense
            </button>
          </div>
        )}
      </main>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-card rounded-t-2xl p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Expense</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(expenseTypeConfig) as ExpenseType[]).map(type => {
                    const config = expenseTypeConfig[type];
                    return (
                      <button
                        key={type}
                        onClick={() => setNewExpense(prev => ({ ...prev, type }))}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-colors',
                          newExpense.type === type
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        )}
                      >
                        <span className="text-sm font-medium">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Fuel, Photocopy"
                  value={newExpense.reference}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, reference: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddExpense}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
