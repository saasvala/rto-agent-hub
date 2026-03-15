import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, User, Phone, MapPin, Car, CreditCard, StickyNote } from 'lucide-react';

export default function AddCustomer() {
  const navigate = useNavigate();
  const { addCustomer } = useApp();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    vehicleNumber: '',
    dlNumber: '',
    notes: '',
  });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.mobile.trim()) return;
    const customer = addCustomer({
      name: form.name.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim() || undefined,
      vehicleNumber: form.vehicleNumber.trim() || undefined,
      dlNumber: form.dlNumber.trim() || undefined,
      notes: form.notes.trim() || undefined,
    });
    navigate(`/customer/${customer.id}`);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const fields = [
    { key: 'name', label: 'Customer Name *', icon: User, type: 'text', placeholder: 'Enter full name' },
    { key: 'mobile', label: 'Mobile Number *', icon: Phone, type: 'tel', placeholder: '10-digit mobile number' },
    { key: 'address', label: 'Address', icon: MapPin, type: 'text', placeholder: 'Full address' },
    { key: 'vehicleNumber', label: 'Vehicle Number', icon: Car, type: 'text', placeholder: 'e.g. MH12AB1234', uppercase: true },
    { key: 'dlNumber', label: 'DL Number', icon: CreditCard, type: 'text', placeholder: 'Driving License number', uppercase: true },
    { key: 'notes', label: 'Notes', icon: StickyNote, type: 'text', placeholder: 'Any additional notes' },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add Customer</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {fields.map(({ key, label, icon: Icon, type, placeholder, uppercase }) => (
          <div key={key} className="animate-fade-in">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {label}
            </label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => update(key, uppercase ? e.target.value.toUpperCase() : e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!form.name.trim() || !form.mobile.trim()}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50 touch-target mt-6"
        >
          Save Customer
        </button>
      </main>
    </div>
  );
}
