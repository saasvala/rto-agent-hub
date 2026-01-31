import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency, formatDate, getStatusLabel, getDaysUntil } from '@/lib/helpers';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  FileText, 
  Clock, 
  Check,
  CreditCard,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileStatus, PaymentMode } from '@/types';

const statusOrder: FileStatus[] = ['SUBMITTED', 'IN_PROCESS', 'APPROVED', 'READY', 'DELIVERED'];

export default function FileDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { files, getCustomerById, getServiceById, getFileDocuments, getFilePayments, updateFile, updateDocument, addPayment } = useApp();
  
  const file = files.find(f => f.id === id);
  const customer = file ? getCustomerById(file.customerId) : null;
  const service = file ? getServiceById(file.serviceId) : null;
  const documents = file ? getFileDocuments(file.id) : [];
  const payments = file ? getFilePayments(file.id) : [];
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [expandDocs, setExpandDocs] = useState(true);
  const [expandPayments, setExpandPayments] = useState(true);

  if (!file || !customer || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">File not found</p>
      </div>
    );
  }

  const pendingAmount = file.totalAmount - file.paidAmount;
  const daysUntil = getDaysUntil(file.expectedDeliveryDate);
  const currentStatusIndex = statusOrder.indexOf(file.status);

  const handleStatusChange = (newStatus: FileStatus) => {
    updateFile(file.id, { status: newStatus });
  };

  const handleDocumentToggle = (docId: string, received: boolean) => {
    updateDocument(docId, { received });
  };

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    addPayment({
      fileId: file.id,
      amount,
      mode: paymentMode,
      isGovtFee: false,
      date: new Date(),
    });

    setPaymentAmount('');
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{file.refNo}</h1>
            <p className="text-xs opacity-80">{service.name}</p>
          </div>
          <StatusBadge status={file.status} size="md" />
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{customer.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <a href={`tel:${customer.mobile}`} className="text-primary">{customer.mobile}</a>
              </div>
            </div>
            {file.isUrgent && (
              <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Urgent
              </div>
            )}
          </div>
        </div>

        {/* Status Progress */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-medium text-foreground mb-4">Status Progress</h3>
          <div className="relative">
            <div className="absolute top-3 left-0 right-0 h-1 bg-muted rounded-full" />
            <div 
              className="absolute top-3 left-0 h-1 bg-primary rounded-full transition-all"
              style={{ width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%` }}
            />
            <div className="relative flex justify-between">
              {statusOrder.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="flex flex-col items-center"
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs mb-2 transition-all',
                      isCompleted 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground',
                      isCurrent && 'ring-4 ring-primary/20'
                    )}>
                      {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className={cn(
                      'text-[10px] text-center leading-tight',
                      isCurrent ? 'text-primary font-medium' : 'text-muted-foreground'
                    )}>
                      {getStatusLabel(status)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {file.status !== 'DELIVERED' && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expected:</span>
              <span className={cn(
                'font-medium',
                daysUntil < 0 ? 'text-destructive' : daysUntil <= 2 ? 'text-warning' : 'text-foreground'
              )}>
                {formatDate(file.expectedDeliveryDate)}
                {daysUntil < 0 ? ' (Overdue)' : daysUntil === 0 ? ' (Today)' : ` (${daysUntil} days)`}
              </span>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Payment</h3>
            {pendingAmount > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                + Add Payment
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(file.totalAmount)}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{formatCurrency(file.paidAmount)}</p>
              <p className="text-xs text-muted-foreground">Paid</p>
            </div>
            <div>
              <p className={cn('text-2xl font-bold', pendingAmount > 0 ? 'text-destructive' : 'text-muted-foreground')}>
                {formatCurrency(pendingAmount)}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>

          <div className="text-sm space-y-1 border-t border-border pt-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Govt Fee</span>
              <span>{formatCurrency(file.govtFee)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Agent Charge</span>
              <span>{formatCurrency(file.agentCharge)}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setExpandDocs(!expandDocs)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">Documents</h3>
              <span className="text-xs text-muted-foreground">
                ({documents.filter(d => d.received).length}/{documents.length})
              </span>
            </div>
            {expandDocs ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </button>
          
          {expandDocs && (
            <div className="px-4 pb-4 space-y-2">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <button
                    onClick={() => handleDocumentToggle(doc.id, !doc.received)}
                    className={cn(
                      'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors',
                      doc.received 
                        ? 'bg-success border-success text-success-foreground' 
                        : 'border-muted-foreground'
                    )}
                  >
                    {doc.received && <Check className="w-4 h-4" />}
                  </button>
                  <span className={cn(
                    'flex-1',
                    doc.received ? 'text-muted-foreground line-through' : 'text-foreground'
                  )}>
                    {doc.name}
                  </span>
                  {!doc.received && (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setExpandPayments(!expandPayments)}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-foreground">Payment History</h3>
                <span className="text-xs text-muted-foreground">({payments.length})</span>
              </div>
              {expandPayments ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
            </button>
            
            {expandPayments && (
              <div className="px-4 pb-4 space-y-2">
                {payments.map(payment => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded text-xs font-medium',
                      payment.mode === 'CASH' ? 'bg-green-100 text-green-700' :
                      payment.mode === 'UPI' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {payment.mode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-card rounded-t-2xl p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Amount</label>
                <input
                  type="number"
                  placeholder={`Max: ${formatCurrency(pendingAmount)}`}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-lg"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Payment Mode</label>
                <div className="flex gap-2">
                  {(['CASH', 'UPI', 'BANK_TRANSFER'] as PaymentMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={cn(
                        'flex-1 py-3 rounded-xl font-medium transition-colors',
                        paymentMode === mode
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {mode.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
