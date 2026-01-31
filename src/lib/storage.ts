// Local Storage utilities for offline-first data management

const STORAGE_KEYS = {
  USER: 'rto_user',
  SERVICES: 'rto_services',
  CUSTOMERS: 'rto_customers',
  FILES: 'rto_files',
  DOCUMENTS: 'rto_documents',
  PAYMENTS: 'rto_payments',
  EXPENSES: 'rto_expenses',
  APP_STATE: 'rto_app_state',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save error:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (error) {
    console.error('Storage load error:', error);
  }
  return defaultValue;
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
}

export { STORAGE_KEYS };
