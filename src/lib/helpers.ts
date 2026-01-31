import { FileStatus } from '@/types';

export function generateRefNo(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RTO${year}${month}${random}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

export function getStatusLabel(status: FileStatus): string {
  const labels: Record<FileStatus, string> = {
    SUBMITTED: 'Submitted',
    IN_PROCESS: 'In Process',
    APPROVED: 'Approved',
    READY: 'Ready',
    DELIVERED: 'Delivered',
    REJECTED: 'Rejected',
  };
  return labels[status];
}

export function getStatusColor(status: FileStatus): string {
  const colors: Record<FileStatus, string> = {
    SUBMITTED: 'status-submitted',
    IN_PROCESS: 'status-processing',
    APPROVED: 'status-approved',
    READY: 'status-ready',
    DELIVERED: 'status-delivered',
    REJECTED: 'status-rejected',
  };
  return colors[status];
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function getDaysUntil(date: Date | string): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    VEHICLE_SERVICES: 'Vehicle Services',
    LICENSE_SERVICES: 'License Services',
    PERMIT_SERVICES: 'Permit Services',
    TRANSFER_CHANGE_SERVICES: 'Transfer & Change',
    OTHER_RTO_SERVICES: 'Other RTO Services',
  };
  return labels[category] || category;
}
