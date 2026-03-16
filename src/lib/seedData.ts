// Seed / dummy data for testing and demo purposes
import { Customer, ApplicationFile, Payment, Expense, Document } from '@/types';

// Fixed IDs so we can reference them across entities
const CUSTOMER_IDS = {
  ramesh: 'seed-cust-ramesh',
  priya: 'seed-cust-priya',
  suresh: 'seed-cust-suresh',
  anita: 'seed-cust-anita',
  vikram: 'seed-cust-vikram',
  meena: 'seed-cust-meena',
  rajesh: 'seed-cust-rajesh',
  kavita: 'seed-cust-kavita',
};

const FILE_IDS = {
  f1: 'seed-file-001', f2: 'seed-file-002', f3: 'seed-file-003',
  f4: 'seed-file-004', f5: 'seed-file-005', f6: 'seed-file-006',
  f7: 'seed-file-007', f8: 'seed-file-008', f9: 'seed-file-009',
  f10: 'seed-file-010', f11: 'seed-file-011', f12: 'seed-file-012',
};

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

export const seedCustomers: Customer[] = [
  { id: CUSTOMER_IDS.ramesh, name: 'Ramesh Kumar', mobile: '9876543210', address: 'Sector 12, Jaipur', vehicleNumber: 'RJ14AB1234', createdAt: daysAgo(60) },
  { id: CUSTOMER_IDS.priya, name: 'Priya Sharma', mobile: '9876501234', address: 'Malviya Nagar, Jaipur', dlNumber: 'RJ14-2019-0045678', createdAt: daysAgo(45) },
  { id: CUSTOMER_IDS.suresh, name: 'Suresh Patel', mobile: '9988776655', address: 'Vaishali Nagar, Jaipur', vehicleNumber: 'RJ14CD5678', createdAt: daysAgo(30) },
  { id: CUSTOMER_IDS.anita, name: 'Anita Gupta', mobile: '9871234567', address: 'Tonk Road, Jaipur', vehicleNumber: 'RJ14EF9012', dlNumber: 'RJ14-2020-0067890', createdAt: daysAgo(25) },
  { id: CUSTOMER_IDS.vikram, name: 'Vikram Singh', mobile: '9765432100', address: 'Jodhpur', vehicleNumber: 'RJ19GH3456', createdAt: daysAgo(20) },
  { id: CUSTOMER_IDS.meena, name: 'Meena Devi', mobile: '9654321098', address: 'Ajmer Road, Jaipur', createdAt: daysAgo(15) },
  { id: CUSTOMER_IDS.rajesh, name: 'Rajesh Verma', mobile: '9543210987', address: 'Sanganer, Jaipur', vehicleNumber: 'RJ14JK7890', createdAt: daysAgo(10) },
  { id: CUSTOMER_IDS.kavita, name: 'Kavita Mehra', mobile: '9432109876', address: 'C-Scheme, Jaipur', dlNumber: 'RJ14-2021-0089012', createdAt: daysAgo(5) },
];

// We need service IDs at runtime since they're generated. This function takes the actual services array.
export function generateSeedFiles(serviceIds: string[]): ApplicationFile[] {
  // Pick services by index for variety
  const s = (i: number) => serviceIds[i % serviceIds.length];

  return [
    // Ramesh - 4 files (most frequent)
    { id: FILE_IDS.f1, refNo: 'RTO2503ABCD', customerId: CUSTOMER_IDS.ramesh, serviceId: s(0), status: 'DELIVERED', govtFee: 3500, agentCharge: 1500, totalAmount: 5000, paidAmount: 5000, isUrgent: false, expectedDeliveryDate: daysAgo(5), createdAt: daysAgo(30), updatedAt: daysAgo(5), deliveredAt: daysAgo(5), deliveryNote: 'Handed over at counter' },
    { id: FILE_IDS.f2, refNo: 'RTO2503EFGH', customerId: CUSTOMER_IDS.ramesh, serviceId: s(1), status: 'IN_PROCESS', govtFee: 500, agentCharge: 800, totalAmount: 1300, paidAmount: 500, isUrgent: false, expectedDeliveryDate: daysFromNow(10), createdAt: daysAgo(5), updatedAt: daysAgo(2) },
    { id: FILE_IDS.f3, refNo: 'RTO2503IJKL', customerId: CUSTOMER_IDS.ramesh, serviceId: s(4), status: 'SUBMITTED', govtFee: 300, agentCharge: 500, totalAmount: 800, paidAmount: 0, isUrgent: false, expectedDeliveryDate: daysFromNow(8), createdAt: daysAgo(2), updatedAt: daysAgo(2) },
    { id: FILE_IDS.f4, refNo: 'RTO2503MNOP', customerId: CUSTOMER_IDS.ramesh, serviceId: s(10), status: 'READY', govtFee: 1200, agentCharge: 1000, totalAmount: 2200, paidAmount: 2200, isUrgent: true, expectedDeliveryDate: daysFromNow(2), createdAt: daysAgo(15), updatedAt: daysAgo(1) },

    // Priya - 3 files (frequent)
    { id: FILE_IDS.f5, refNo: 'RTO2503QRST', customerId: CUSTOMER_IDS.priya, serviceId: s(10), status: 'DELIVERED', govtFee: 1200, agentCharge: 1000, totalAmount: 2200, paidAmount: 2200, isUrgent: false, expectedDeliveryDate: daysAgo(10), createdAt: daysAgo(40), updatedAt: daysAgo(10), deliveredAt: daysAgo(10) },
    { id: FILE_IDS.f6, refNo: 'RTO2503UVWX', customerId: CUSTOMER_IDS.priya, serviceId: s(11), status: 'APPROVED', govtFee: 600, agentCharge: 600, totalAmount: 1200, paidAmount: 600, isUrgent: false, expectedDeliveryDate: daysFromNow(5), createdAt: daysAgo(10), updatedAt: daysAgo(3) },
    { id: FILE_IDS.f7, refNo: 'RTO2503YZAB', customerId: CUSTOMER_IDS.priya, serviceId: s(14), status: 'SUBMITTED', govtFee: 200, agentCharge: 500, totalAmount: 700, paidAmount: 700, isUrgent: false, expectedDeliveryDate: daysFromNow(5), createdAt: daysAgo(3), updatedAt: daysAgo(3) },

    // Suresh - 2 files (frequent threshold)
    { id: FILE_IDS.f8, refNo: 'RTO2503CDEF', customerId: CUSTOMER_IDS.suresh, serviceId: s(5), status: 'IN_PROCESS', govtFee: 600, agentCharge: 800, totalAmount: 1400, paidAmount: 1400, isUrgent: true, expectedDeliveryDate: daysFromNow(3), createdAt: daysAgo(7), updatedAt: daysAgo(4) },
    { id: FILE_IDS.f9, refNo: 'RTO2503GHIJ', customerId: CUSTOMER_IDS.suresh, serviceId: s(0), status: 'SUBMITTED', govtFee: 3500, agentCharge: 2000, totalAmount: 5500, paidAmount: 2000, isUrgent: true, expectedDeliveryDate: daysFromNow(5), createdAt: daysAgo(1), updatedAt: daysAgo(1) },

    // Anita - 1 file (recent)
    { id: FILE_IDS.f10, refNo: 'RTO2503KLMN', customerId: CUSTOMER_IDS.anita, serviceId: s(7), status: 'READY', govtFee: 400, agentCharge: 600, totalAmount: 1000, paidAmount: 500, isUrgent: false, expectedDeliveryDate: daysFromNow(1), createdAt: daysAgo(8), updatedAt: daysAgo(2), followUpDate: daysFromNow(0), followUpNote: 'Customer will collect tomorrow' },

    // Vikram - 1 file (recent)
    { id: FILE_IDS.f11, refNo: 'RTO2503OPQR', customerId: CUSTOMER_IDS.vikram, serviceId: s(6), status: 'SUBMITTED', govtFee: 0, agentCharge: 500, totalAmount: 500, paidAmount: 500, isUrgent: false, expectedDeliveryDate: daysFromNow(2), createdAt: daysAgo(1), updatedAt: daysAgo(1) },

    // Kavita - 1 file (today)
    { id: FILE_IDS.f12, refNo: 'RTO2503STUV', customerId: CUSTOMER_IDS.kavita, serviceId: s(13), status: 'SUBMITTED', govtFee: 400, agentCharge: 500, totalAmount: 900, paidAmount: 900, isUrgent: false, expectedDeliveryDate: daysFromNow(10), createdAt: daysAgo(0), updatedAt: daysAgo(0) },
  ];
}

export function generateSeedDocuments(): Document[] {
  const docNames = ['Aadhar Card', 'Address Proof', 'Photo', 'Application Form'];
  const docs: Document[] = [];
  Object.values(FILE_IDS).forEach(fileId => {
    docNames.forEach((name, i) => {
      docs.push({
        id: `seed-doc-${fileId}-${i}`,
        fileId,
        name,
        received: Math.random() > 0.3,
        pendingReason: Math.random() > 0.7 ? 'Customer will bring tomorrow' : undefined,
      });
    });
  });
  return docs;
}

export function generateSeedPayments(): Payment[] {
  return [
    { id: 'seed-pay-001', fileId: FILE_IDS.f1, amount: 3500, mode: 'CASH', isGovtFee: true, date: daysAgo(30) },
    { id: 'seed-pay-002', fileId: FILE_IDS.f1, amount: 1500, mode: 'UPI', isGovtFee: false, date: daysAgo(28) },
    { id: 'seed-pay-003', fileId: FILE_IDS.f2, amount: 500, mode: 'CASH', isGovtFee: true, date: daysAgo(5) },
    { id: 'seed-pay-004', fileId: FILE_IDS.f4, amount: 2200, mode: 'UPI', isGovtFee: false, date: daysAgo(15) },
    { id: 'seed-pay-005', fileId: FILE_IDS.f5, amount: 2200, mode: 'CASH', isGovtFee: false, date: daysAgo(40) },
    { id: 'seed-pay-006', fileId: FILE_IDS.f6, amount: 600, mode: 'UPI', isGovtFee: true, date: daysAgo(10) },
    { id: 'seed-pay-007', fileId: FILE_IDS.f7, amount: 700, mode: 'CASH', isGovtFee: false, date: daysAgo(3) },
    { id: 'seed-pay-008', fileId: FILE_IDS.f8, amount: 1400, mode: 'BANK_TRANSFER', isGovtFee: false, date: daysAgo(7) },
    { id: 'seed-pay-009', fileId: FILE_IDS.f9, amount: 2000, mode: 'CASH', isGovtFee: true, date: daysAgo(1) },
    { id: 'seed-pay-010', fileId: FILE_IDS.f10, amount: 500, mode: 'UPI', isGovtFee: true, date: daysAgo(8) },
    { id: 'seed-pay-011', fileId: FILE_IDS.f11, amount: 500, mode: 'CASH', isGovtFee: false, date: daysAgo(1) },
    { id: 'seed-pay-012', fileId: FILE_IDS.f12, amount: 900, mode: 'UPI', isGovtFee: false, date: daysAgo(0) },
  ];
}

export const seedExpenses: Expense[] = [
  { id: 'seed-exp-001', type: 'TRANSPORT', amount: 200, date: daysAgo(0), notes: 'RTO office visit' },
  { id: 'seed-exp-002', type: 'FORM_PRINTING', amount: 150, date: daysAgo(1), notes: 'Application forms' },
  { id: 'seed-exp-003', type: 'RTO_RUNNING', amount: 500, date: daysAgo(3), notes: 'Speed money' },
  { id: 'seed-exp-004', type: 'TRANSPORT', amount: 300, date: daysAgo(5) },
  { id: 'seed-exp-005', type: 'MISCELLANEOUS', amount: 100, date: daysAgo(7), notes: 'Photocopies' },
  { id: 'seed-exp-006', type: 'FORM_PRINTING', amount: 200, date: daysAgo(10) },
  { id: 'seed-exp-007', type: 'RTO_RUNNING', amount: 400, date: daysAgo(15) },
  { id: 'seed-exp-008', type: 'TRANSPORT', amount: 250, date: daysAgo(20) },
];
