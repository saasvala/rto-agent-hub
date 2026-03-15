// RTO Agent App Types

export type UserRole = 'owner' | 'assistant';

export interface User {
  id: string;
  pin: string;
  role: UserRole;
  name: string;
  deviceId: string;
  licenseExpiry: Date;
  status: 'active' | 'expired' | 'locked';
}

export type ServiceCategory = 
  | 'VEHICLE_SERVICES'
  | 'LICENSE_SERVICES'
  | 'PERMIT_SERVICES'
  | 'TRANSFER_CHANGE_SERVICES'
  | 'OTHER_RTO_SERVICES';

export type ServiceSubCategory = 
  | 'NEW_REGISTRATION' | 'RC_TRANSFER' | 'DUPLICATE_RC' | 'ADDRESS_CHANGE' | 'HYPOTHECATION'
  | 'FITNESS_CERTIFICATE' | 'ROAD_TAX' | 'NOC' | 'INSURANCE' | 'PUC'
  | 'NEW_DL' | 'DL_RENEWAL' | 'DUPLICATE_DL' | 'DL_ADDRESS_CHANGE' | 'INTERNATIONAL_DL'
  | 'LEARNING_LICENSE' | 'DL_ENDORSEMENT'
  | 'NATIONAL_PERMIT' | 'STATE_PERMIT' | 'TEMPORARY_PERMIT' | 'PERMIT_RENEWAL' | 'TOURIST_PERMIT'
  | 'OWNERSHIP_TRANSFER' | 'VEHICLE_CONVERSION' | 'NAME_CHANGE'
  | 'FANCY_NUMBER' | 'CHALLAN' | 'RC_CANCELLATION';

export type ServiceType = 
  | 'FRESH_APPLICATION'
  | 'RENEWAL'
  | 'CORRECTION'
  | 'REPRINT'
  | 'STATUS_CHECK';

export interface Service {
  id: string;
  name: string;
  nameHindi?: string;
  category: ServiceCategory;
  subCategory?: ServiceSubCategory;
  type?: ServiceType;
  govtFee: number;
  agentCharge: number;
  urgentCharge?: number;
  processingDays: number;
  documentRequired: boolean;
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  vehicleNumber?: string;
  dlNumber?: string;
  notes?: string;
  createdAt: Date;
}

export type FileStatus = 
  | 'SUBMITTED'
  | 'IN_PROCESS'
  | 'APPROVED'
  | 'READY'
  | 'DELIVERED'
  | 'REJECTED';

export interface ApplicationFile {
  id: string;
  refNo: string;
  customerId: string;
  serviceId: string;
  status: FileStatus;
  govtFee: number;
  agentCharge: number;
  totalAmount: number;
  paidAmount: number;
  isUrgent: boolean;
  expectedDeliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  deliveredAt?: Date;
  deliveryNote?: string;
  followUpDate?: Date;
  followUpNote?: string;
}

export interface Document {
  id: string;
  fileId: string;
  name: string;
  received: boolean;
  pendingReason?: string;
}

export type PaymentMode = 'CASH' | 'UPI' | 'BANK_TRANSFER';

export interface Payment {
  id: string;
  fileId: string;
  amount: number;
  mode: PaymentMode;
  isGovtFee: boolean;
  date: Date;
  notes?: string;
}

export type ExpenseType = 
  | 'TRANSPORT'
  | 'FORM_PRINTING'
  | 'RTO_RUNNING'
  | 'MISCELLANEOUS';

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  date: Date;
  reference?: string;
  notes?: string;
}

export interface DashboardMetrics {
  filesToday: number;
  pendingFiles: number;
  todayCollection: number;
  paymentPending: number;
  readyForDelivery: number;
  documentMissing: number;
  agentIncome: number;
}

export interface DailySummary {
  date: Date;
  filesHandled: number;
  collection: number;
  expenses: number;
  netEarning: number;
}
