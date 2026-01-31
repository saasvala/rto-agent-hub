import React from 'react';
import { ApplicationFile } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDateShort, getDaysUntil } from '@/lib/helpers';
import StatusBadge from './StatusBadge';
import { Clock, User, FileText, ChevronRight } from 'lucide-react';

interface FileCardProps {
  file: ApplicationFile;
  onClick?: () => void;
}

export default function FileCard({ file, onClick }: FileCardProps) {
  const { getCustomerById, getServiceById } = useApp();
  const customer = getCustomerById(file.customerId);
  const service = getServiceById(file.serviceId);
  const daysUntil = getDaysUntil(file.expectedDeliveryDate);
  const pendingAmount = file.totalAmount - file.paidAmount;

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{file.refNo}</p>
            <p className="text-xs text-muted-foreground">{service?.name}</p>
          </div>
        </div>
        <StatusBadge status={file.status} />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <User className="w-4 h-4" />
        <span>{customer?.name || 'Unknown'}</span>
        {customer?.mobile && (
          <span className="text-xs">• {customer.mobile}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-semibold">{formatCurrency(file.totalAmount)}</p>
          </div>
          {pendingAmount > 0 && (
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-sm font-semibold text-destructive">{formatCurrency(pendingAmount)}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {file.status !== 'DELIVERED' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{daysUntil > 0 ? `${daysUntil}d left` : 'Due'}</span>
            </div>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
