import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { ArrowLeft, User, Phone, MapPin, Car, CreditCard, FileText, ChevronRight } from 'lucide-react';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { customers, files, payments, services } = useApp();

  const customer = customers.find(c => c.id === id);
  
  const customerFiles = useMemo(() => {
    if (!customer) return [];
    return files
      .filter(f => f.customerId === customer.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [customer, files]);

  const stats = useMemo(() => {
    const totalPaid = payments
      .filter(p => customerFiles.some(f => f.id === p.fileId))
      .reduce((sum, p) => sum + p.amount, 0);
    const totalAmount = customerFiles.reduce((sum, f) => sum + f.totalAmount, 0);
    const pendingFiles = customerFiles.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status)).length;
    return { totalFiles: customerFiles.length, totalPaid, totalPending: totalAmount - totalPaid, pendingFiles };
  }, [customerFiles, payments]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Customer Details</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-card rounded-xl p-4 border border-border animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{customer.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-3 h-3" />
                <a href={`tel:${customer.mobile}`} className="text-primary">{customer.mobile}</a>
              </div>
            </div>
          </div>

          {customer.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{customer.address}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {customer.vehicleNumber && (
              <div className="flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-lg">
                <Car className="w-3 h-3" />
                <span>{customer.vehicleNumber}</span>
              </div>
            )}
            {customer.dlNumber && (
              <div className="flex items-center gap-1 text-xs bg-secondary px-3 py-1.5 rounded-lg">
                <CreditCard className="w-3 h-3" />
                <span>{customer.dlNumber}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-primary">{stats.totalFiles}</p>
            <p className="text-xs text-muted-foreground">Total Files</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-warning">{stats.pendingFiles}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalPaid)}</p>
            <p className="text-xs text-muted-foreground">Total Paid</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.totalPending)}</p>
            <p className="text-xs text-muted-foreground">Pending Amount</p>
          </div>
        </div>

        {/* File History */}
        <section className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
            File History ({customerFiles.length})
          </h3>
          
          {customerFiles.length > 0 ? (
            <div className="space-y-3">
              {customerFiles.map(file => {
                const service = services.find(s => s.id === file.serviceId);
                return (
                  <button
                    key={file.id}
                    onClick={() => navigate(`/file/${file.id}`)}
                    className="w-full bg-card rounded-xl p-4 border border-border text-left hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-primary font-medium">{file.refNo}</span>
                      <StatusBadge status={file.status} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{service?.name || 'Unknown Service'}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{formatDate(file.createdAt)}</span>
                      <span className="font-medium">{formatCurrency(file.totalAmount)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <FileText className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No files for this customer</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
