import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Plus, Search, User, Phone, Car, CreditCard, ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/helpers';

export default function Customers() {
  const navigate = useNavigate();
  const { customers, files } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.mobile.includes(query) ||
      (customer.vehicleNumber && customer.vehicleNumber.toLowerCase().includes(query)) ||
      (customer.dlNumber && customer.dlNumber.toLowerCase().includes(query))
    );
  });

  const getCustomerFileCount = (customerId: string) => {
    return files.filter(f => f.customerId === customerId).length;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold flex-1">Customers</h1>
          <button 
            onClick={() => navigate('/add-customer')}
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
            placeholder="Search by name, mobile, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{customers.length}</p>
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{files.length}</p>
              <p className="text-xs text-muted-foreground">Total Files</p>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.map(customer => {
            const fileCount = getCustomerFileCount(customer.id);
            return (
              <div
                key={customer.id}
                onClick={() => navigate(`/customer/${customer.id}`)}
                className="bg-card rounded-xl p-4 border border-border cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{customer.name}</h3>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{customer.mobile}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      {customer.vehicleNumber && (
                        <div className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded">
                          <Car className="w-3 h-3" />
                          <span>{customer.vehicleNumber}</span>
                        </div>
                      )}
                      {customer.dlNumber && (
                        <div className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded">
                          <CreditCard className="w-3 h-3" />
                          <span>{customer.dlNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary">{fileCount}</p>
                      <p className="text-xs text-muted-foreground">files</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/add-customer')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
              >
                Add First Customer
              </button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
