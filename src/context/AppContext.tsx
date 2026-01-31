import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Service, Customer, ApplicationFile, Document, Payment, Expense, UserRole } from '@/types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '@/lib/storage';
import { generateId } from '@/lib/helpers';

// Default services
const defaultServices: Service[] = [
  {
    id: generateId(),
    name: 'New Vehicle Registration',
    nameHindi: 'नया वाहन पंजीकरण',
    category: 'VEHICLE_SERVICES',
    subCategory: 'NEW_REGISTRATION',
    govtFee: 3500,
    agentCharge: 1500,
    urgentCharge: 500,
    processingDays: 7,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'RC Transfer',
    nameHindi: 'RC ट्रांसफर',
    category: 'VEHICLE_SERVICES',
    subCategory: 'RC_TRANSFER',
    govtFee: 500,
    agentCharge: 800,
    urgentCharge: 300,
    processingDays: 15,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Duplicate RC',
    nameHindi: 'डुप्लीकेट RC',
    category: 'VEHICLE_SERVICES',
    subCategory: 'DUPLICATE_RC',
    govtFee: 300,
    agentCharge: 500,
    processingDays: 10,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Hypothecation Add/Remove',
    nameHindi: 'हाइपोथिकेशन',
    category: 'VEHICLE_SERVICES',
    subCategory: 'HYPOTHECATION',
    govtFee: 200,
    agentCharge: 400,
    processingDays: 5,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'New Driving License',
    nameHindi: 'नया ड्राइविंग लाइसेंस',
    category: 'LICENSE_SERVICES',
    subCategory: 'NEW_DL',
    govtFee: 1200,
    agentCharge: 1000,
    urgentCharge: 400,
    processingDays: 30,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'DL Renewal',
    nameHindi: 'DL रिन्यूअल',
    category: 'LICENSE_SERVICES',
    subCategory: 'DL_RENEWAL',
    govtFee: 600,
    agentCharge: 600,
    processingDays: 15,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'Duplicate DL',
    nameHindi: 'डुप्लीकेट DL',
    category: 'LICENSE_SERVICES',
    subCategory: 'DUPLICATE_DL',
    govtFee: 400,
    agentCharge: 500,
    processingDays: 10,
    documentRequired: true,
    isActive: true,
  },
  {
    id: generateId(),
    name: 'International DL',
    nameHindi: 'इंटरनेशनल DL',
    category: 'LICENSE_SERVICES',
    subCategory: 'INTERNATIONAL_DL',
    govtFee: 1000,
    agentCharge: 800,
    processingDays: 7,
    documentRequired: true,
    isActive: true,
  },
];

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  services: Service[];
  customers: Customer[];
  files: ApplicationFile[];
  documents: Document[];
  payments: Payment[];
  expenses: Expense[];
}

interface AppContextType extends AppState {
  login: (pin: string) => boolean;
  logout: () => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addFile: (file: Omit<ApplicationFile, 'id' | 'refNo' | 'createdAt' | 'updatedAt'>) => ApplicationFile;
  updateFile: (id: string, file: Partial<ApplicationFile>) => void;
  addDocument: (doc: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getServiceById: (id: string) => Service | undefined;
  getFileDocuments: (fileId: string) => Document[];
  getFilePayments: (fileId: string) => Payment[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Demo user for development
const demoUser: User = {
  id: 'demo-user',
  pin: '1234',
  role: 'owner',
  name: 'RTO Agent Demo',
  deviceId: 'demo-device',
  licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  status: 'active',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    isAuthenticated: false,
    user: null,
    services: loadFromStorage(STORAGE_KEYS.SERVICES, defaultServices),
    customers: loadFromStorage(STORAGE_KEYS.CUSTOMERS, []),
    files: loadFromStorage(STORAGE_KEYS.FILES, []),
    documents: loadFromStorage(STORAGE_KEYS.DOCUMENTS, []),
    payments: loadFromStorage(STORAGE_KEYS.PAYMENTS, []),
    expenses: loadFromStorage(STORAGE_KEYS.EXPENSES, []),
  }));

  // Save to storage when data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SERVICES, state.services);
  }, [state.services]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CUSTOMERS, state.customers);
  }, [state.customers]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FILES, state.files);
  }, [state.files]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DOCUMENTS, state.documents);
  }, [state.documents]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PAYMENTS, state.payments);
  }, [state.payments]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, state.expenses);
  }, [state.expenses]);

  const login = (pin: string): boolean => {
    if (pin === demoUser.pin) {
      setState(prev => ({ ...prev, isAuthenticated: true, user: demoUser }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ ...prev, isAuthenticated: false, user: null }));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: generateId() };
    setState(prev => ({ ...prev, services: [...prev.services, newService] }));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setState(prev => ({
      ...prev,
      services: prev.services.map(s => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCustomer = { ...customer, id: generateId(), createdAt: new Date() };
    setState(prev => ({ ...prev, customers: [...prev.customers, newCustomer] }));
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setState(prev => ({
      ...prev,
      customers: prev.customers.map(c => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const addFile = (file: Omit<ApplicationFile, 'id' | 'refNo' | 'createdAt' | 'updatedAt'>): ApplicationFile => {
    const now = new Date();
    const refNo = `RTO${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newFile = { ...file, id: generateId(), refNo, createdAt: now, updatedAt: now };
    setState(prev => ({ ...prev, files: [...prev.files, newFile] }));
    return newFile;
  };

  const updateFile = (id: string, updates: Partial<ApplicationFile>) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(f => (f.id === id ? { ...f, ...updates, updatedAt: new Date() } : f)),
    }));
  };

  const addDocument = (doc: Omit<Document, 'id'>) => {
    const newDoc = { ...doc, id: generateId() };
    setState(prev => ({ ...prev, documents: [...prev.documents, newDoc] }));
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(d => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: generateId() };
    setState(prev => ({ ...prev, payments: [...prev.payments, newPayment] }));
    
    // Update file paid amount
    const filePayments = [...state.payments, newPayment].filter(p => p.fileId === payment.fileId);
    const totalPaid = filePayments.reduce((sum, p) => sum + p.amount, 0);
    updateFile(payment.fileId, { paidAmount: totalPaid });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setState(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  };

  const getCustomerById = (id: string) => state.customers.find(c => c.id === id);
  const getServiceById = (id: string) => state.services.find(s => s.id === id);
  const getFileDocuments = (fileId: string) => state.documents.filter(d => d.fileId === fileId);
  const getFilePayments = (fileId: string) => state.payments.filter(p => p.fileId === fileId);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addService,
        updateService,
        addCustomer,
        updateCustomer,
        addFile,
        updateFile,
        addDocument,
        updateDocument,
        addPayment,
        addExpense,
        getCustomerById,
        getServiceById,
        getFileDocuments,
        getFilePayments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
