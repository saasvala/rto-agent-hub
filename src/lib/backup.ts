import { STORAGE_KEYS } from './storage';

interface BackupData {
  version: string;
  timestamp: string;
  data: Record<string, unknown>;
}

const BACKUP_VERSION = '1.0.0';

export function createBackup(): string {
  const data: Record<string, unknown> = {};

  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) data[storageKey] = JSON.parse(raw);
    } catch {
      // skip corrupted keys
    }
  });

  const backup: BackupData = {
    version: BACKUP_VERSION,
    timestamp: new Date().toISOString(),
    data,
  };

  return JSON.stringify(backup, null, 2);
}

export function downloadBackup() {
  const json = createBackup();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rto-agent-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreBackup(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const backup: BackupData = JSON.parse(text);

        if (!backup.version || !backup.data) {
          resolve({ success: false, message: 'Invalid backup file format.' });
          return;
        }

        Object.entries(backup.data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });

        resolve({ success: true, message: `Backup restored from ${new Date(backup.timestamp).toLocaleString()}.` });
      } catch {
        resolve({ success: false, message: 'Failed to parse backup file.' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: 'Failed to read file.' });
    };

    reader.readAsText(file);
  });
}
