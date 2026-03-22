import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, FileText, AlertCircle, Check, Search, Filter, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type DocFilter = 'all' | 'missing' | 'received';

export default function Documents() {
  const navigate = useNavigate();
  const { documents, files, getCustomerById, getServiceById, updateDocument } = useApp();
  const [filter, setFilter] = useState<DocFilter>('missing');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrich documents with file/customer/service info
  const enrichedDocs = useMemo(() => {
    return documents.map(doc => {
      const file = files.find(f => f.id === doc.fileId);
      const customer = file ? getCustomerById(file.customerId) : null;
      const service = file ? getServiceById(file.serviceId) : null;
      return { ...doc, file, customer, service };
    });
  }, [documents, files, getCustomerById, getServiceById]);

  const filteredDocs = useMemo(() => {
    return enrichedDocs.filter(doc => {
      // Exclude delivered/rejected files
      if (doc.file && ['DELIVERED', 'REJECTED'].includes(doc.file.status)) return false;

      const matchesFilter =
        filter === 'all' ? true :
        filter === 'missing' ? !doc.received :
        doc.received;

      const query = searchQuery.toLowerCase();
      const matchesSearch = !query ||
        doc.name.toLowerCase().includes(query) ||
        (doc.customer?.name.toLowerCase().includes(query)) ||
        (doc.file?.refNo.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [enrichedDocs, filter, searchQuery]);

  // Group by file
  const groupedByFile = useMemo(() => {
    const groups: Record<string, typeof filteredDocs> = {};
    filteredDocs.forEach(doc => {
      const key = doc.fileId;
      if (!groups[key]) groups[key] = [];
      groups[key].push(doc);
    });
    return Object.entries(groups);
  }, [filteredDocs]);

  const stats = useMemo(() => {
    const activeDocs = enrichedDocs.filter(d => d.file && !['DELIVERED', 'REJECTED'].includes(d.file.status));
    return {
      total: activeDocs.length,
      missing: activeDocs.filter(d => !d.received).length,
      received: activeDocs.filter(d => d.received).length,
    };
  }, [enrichedDocs]);

  const handleToggle = (docId: string, received: boolean) => {
    updateDocument(docId, { received });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Documents</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <AlertCircle className="w-5 h-5 text-destructive mx-auto mb-1" />
            <p className="text-2xl font-bold text-destructive">{stats.missing}</p>
            <p className="text-xs text-muted-foreground">Missing</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Check className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-bold text-success">{stats.received}</p>
            <p className="text-xs text-muted-foreground">Received</p>
          </div>
        </div>

        {/* Alert banner */}
        {stats.missing > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">
              {stats.missing} document{stats.missing > 1 ? 's' : ''} missing across active files — follow up!
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by document, customer, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {([
            { key: 'missing' as DocFilter, label: 'Missing', count: stats.missing },
            { key: 'received' as DocFilter, label: 'Received', count: stats.received },
            { key: 'all' as DocFilter, label: 'All', count: stats.total },
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              {f.label}
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                filter === f.key ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Grouped Documents List */}
        <div className="space-y-4">
          {groupedByFile.map(([fileId, docs]) => {
            const file = docs[0]?.file;
            const customer = docs[0]?.customer;
            const service = docs[0]?.service;
            const missingCount = docs.filter(d => !d.received).length;

            return (
              <div key={fileId} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* File header */}
                <button
                  onClick={() => navigate(`/file/${fileId}`)}
                  className="w-full px-4 py-3 bg-secondary/50 flex items-center gap-3 hover:bg-secondary transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {file?.refNo} — {customer?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{service?.name}</p>
                  </div>
                  {missingCount > 0 && (
                    <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-medium">
                      {missingCount} missing
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>

                {/* Document items */}
                <div className="divide-y divide-border">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
                      <button
                        onClick={() => handleToggle(doc.id, !doc.received)}
                        className={cn(
                          'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0',
                          doc.received
                            ? 'bg-success border-success text-success-foreground'
                            : 'border-muted-foreground hover:border-primary'
                        )}
                      >
                        {doc.received && <Check className="w-4 h-4" />}
                      </button>
                      <span className={cn(
                        'flex-1 text-sm',
                        doc.received ? 'text-muted-foreground line-through' : 'text-foreground font-medium'
                      )}>
                        {doc.name}
                      </span>
                      {!doc.received && doc.pendingReason && (
                        <span className="text-xs text-warning max-w-[120px] truncate">{doc.pendingReason}</span>
                      )}
                      {!doc.received && !doc.pendingReason && (
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {groupedByFile.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {filter === 'missing' ? 'No missing documents — all clear! ✅' : 'No documents found'}
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}