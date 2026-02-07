import React, { useRef, useState } from 'react';
import { downloadBackup, restoreBackup } from '@/lib/backup';
import { Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackupRestore() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBackup = () => {
    downloadBackup();
    setStatus({ type: 'success', message: 'Backup downloaded successfully.' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await restoreBackup(file);
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });

    if (result.success) {
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setTimeout(() => setStatus(null), 4000);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleBackup}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Backup Data</span>
          <span className="text-xs text-muted-foreground text-center">Export as JSON file</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-accent" />
          </div>
          <span className="text-sm font-medium text-foreground">Restore Data</span>
          <span className="text-xs text-muted-foreground text-center">Import from backup</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleRestore}
        className="hidden"
      />

      {status && (
        <div
          className={cn(
            'flex items-center gap-2 p-3 rounded-lg text-sm animate-fade-in',
            status.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          )}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
