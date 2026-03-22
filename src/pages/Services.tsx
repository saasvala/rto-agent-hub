import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { formatCurrency, getCategoryLabel } from '@/lib/helpers';
import { ArrowLeft, Plus, Search, Car, CreditCard, FileText, Truck, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceCategory } from '@/types';

const categoryIcons: Record<ServiceCategory, React.ReactNode> = {
  VEHICLE_SERVICES: <Car className="w-5 h-5" />,
  LICENSE_SERVICES: <CreditCard className="w-5 h-5" />,
  PERMIT_SERVICES: <FileText className="w-5 h-5" />,
  TRANSFER_CHANGE_SERVICES: <Truck className="w-5 h-5" />,
  OTHER_RTO_SERVICES: <MoreHorizontal className="w-5 h-5" />,
};

export default function Services() {
  const navigate = useNavigate();
  const { services, updateService } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');

  const categories: (ServiceCategory | 'ALL')[] = [
    'ALL',
    'VEHICLE_SERVICES',
    'LICENSE_SERVICES',
    'PERMIT_SERVICES',
    'TRANSFER_CHANGE_SERVICES',
    'OTHER_RTO_SERVICES',
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.nameHindi && service.nameHindi.includes(searchQuery));
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<ServiceCategory, typeof services>);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Services & Pricing</h1>
          <button 
            onClick={() => {/* TODO: Add service modal */}}
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
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {cat === 'ALL' ? 'All Services' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="space-y-6">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <section key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {categoryIcons[category as ServiceCategory]}
                </div>
                <h2 className="text-sm font-semibold text-foreground">
                  {getCategoryLabel(category)}
                </h2>
                <span className="text-xs text-muted-foreground">({categoryServices.length})</span>
              </div>

              <div className="space-y-2">
                {categoryServices.map(service => (
                  <div
                    key={service.id}
                    className="bg-card rounded-xl p-4 border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{service.name}</h3>
                        {service.nameHindi && (
                          <p className="text-sm text-muted-foreground">{service.nameHindi}</p>
                        )}
                      </div>
                      <button
                        onClick={() => updateService(service.id, { isActive: !service.isActive })}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          service.isActive
                            ? 'bg-success/20 text-success'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Govt Fee: </span>
                        <span className="font-medium">{formatCurrency(service.govtFee)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Agent: </span>
                        <span className="font-medium text-primary">{formatCurrency(service.agentCharge)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{service.processingDays}d</span>
                      </div>
                    </div>

                    {service.urgentCharge && (
                      <div className="mt-2 text-xs text-accent">
                        Urgent/Tatkal: +{formatCurrency(service.urgentCharge)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No services found</p>
          </div>
        )}
      </main>
    </div>
  );
}
