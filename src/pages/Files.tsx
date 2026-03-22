import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import FileCard from '@/components/FileCard';
import { ArrowLeft, Plus, Search, Filter, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileStatus } from '@/types';

const statusFilters: { label: string; value: FileStatus | 'ALL' | 'PENDING' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'In Process', value: 'IN_PROCESS' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Ready', value: 'READY' },
  { label: 'Delivered', value: 'DELIVERED' },
];

export default function Files() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { files, getCustomerById, getServiceById } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FileStatus | 'ALL' | 'PENDING'>(
    (searchParams.get('status')?.toUpperCase() as FileStatus) || 'ALL'
  );

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const query = searchQuery.toLowerCase();
      const customer = getCustomerById(file.customerId);
      const service = getServiceById(file.serviceId);
      const matchesSearch = !query ||
        file.refNo.toLowerCase().includes(query) ||
        (customer?.name.toLowerCase().includes(query)) ||
        (customer?.mobile.includes(query)) ||
        (service?.name.toLowerCase().includes(query));
      
      if (statusFilter === 'ALL') return matchesSearch;
      if (statusFilter === 'PENDING') {
        return matchesSearch && !['DELIVERED', 'REJECTED'].includes(file.status);
      }
      return matchesSearch && file.status === statusFilter;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [files, searchQuery, statusFilter, getCustomerById, getServiceById]);

  const statusCounts = useMemo(() => {
    return files.reduce((acc, file) => {
      acc[file.status] = (acc[file.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [files]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Files</h1>
          <button 
            onClick={() => navigate('/new-file')}
            className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by reference number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {statusFilters.map(filter => {
            const count = filter.value === 'ALL' 
              ? files.length 
              : filter.value === 'PENDING'
                ? files.filter(f => !['DELIVERED', 'REJECTED'].includes(f.status)).length
                : statusCounts[filter.value] || 0;
            
            return (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2',
                  statusFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {filter.label}
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  statusFilter === filter.value
                    ? 'bg-primary-foreground/20'
                    : 'bg-muted'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Files List */}
        <div className="space-y-3">
          {filteredFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onClick={() => navigate(`/file/${file.id}`)}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'ALL' ? 'No files found' : 'No files yet'}
            </p>
            {!searchQuery && statusFilter === 'ALL' && (
              <button
                onClick={() => navigate('/new-file')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
              >
                Create First File
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
