import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, Check, ChevronRight, User, FileText, CreditCard, Zap, Star, Clock } from 'lucide-react';
import { formatCurrency, getCategoryLabel } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Service, Customer } from '@/types';

type Step = 'service' | 'customer' | 'documents' | 'payment';

export default function NewFile() {
  const navigate = useNavigate();
  const { services, customers, files, addCustomer, addFile, addDocument } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    mobile: '',
    address: '',
    vehicleNumber: '',
    dlNumber: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'service', label: 'Service', icon: <FileText className="w-4 h-4" /> },
    { key: 'customer', label: 'Customer', icon: <User className="w-4 h-4" /> },
    { key: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const activeServices = services.filter(s => s.isActive);
  
  const filteredServices = activeServices.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.nameHindi && s.nameHindi.includes(searchQuery))
  );

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery)
  );

  const totalAmount = selectedService 
    ? selectedService.govtFee + selectedService.agentCharge + (isUrgent && selectedService.urgentCharge ? selectedService.urgentCharge : 0)
    : 0;

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSearchQuery('');
    setCurrentStep('customer');
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentStep('documents');
  };

  const handleCreateCustomer = () => {
    if (!customerForm.name || !customerForm.mobile) return;
    
    const newCustomer = addCustomer({
      name: customerForm.name,
      mobile: customerForm.mobile,
      address: customerForm.address,
      vehicleNumber: customerForm.vehicleNumber,
      dlNumber: customerForm.dlNumber,
    });
    setSelectedCustomer(newCustomer);
    setIsNewCustomer(false);
    setCurrentStep('documents');
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedCustomer) return;

    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + selectedService.processingDays);

    const file = addFile({
      customerId: selectedCustomer.id,
      serviceId: selectedService.id,
      status: 'SUBMITTED',
      govtFee: selectedService.govtFee,
      agentCharge: selectedService.agentCharge + (isUrgent && selectedService.urgentCharge ? selectedService.urgentCharge : 0),
      totalAmount,
      paidAmount: 0,
      isUrgent,
      expectedDeliveryDate: expectedDate,
    });

    // Add default documents
    const defaultDocs = ['Aadhar Card', 'Address Proof', 'Photo', 'Application Form'];
    defaultDocs.forEach(docName => {
      addDocument({
        fileId: file.id,
        name: docName,
        received: false,
      });
    });

    navigate(`/file/${file.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="govt-header px-4 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-primary-foreground/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">New File</h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepIndex = steps.findIndex(s => s.key === currentStep);
            const isCompleted = index < stepIndex;
            const isActive = step.key === currentStep;
            
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center mb-1',
                    isCompleted ? 'bg-success text-success-foreground' :
                    isActive ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                  </div>
                  <span className={cn(
                    'text-xs',
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-2',
                    index < stepIndex ? 'bg-success' : 'bg-muted'
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <main className="px-4 py-4 pb-24">
        {/* Step 1: Select Service */}
        {currentStep === 'service' && (
          <div>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground mb-4"
            />

            <div className="space-y-2">
              {filteredServices.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="w-full bg-card rounded-xl p-4 border border-border text-left hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      {service.nameHindi && (
                        <p className="text-sm text-muted-foreground">{service.nameHindi}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {getCategoryLabel(service.category)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {formatCurrency(service.govtFee + service.agentCharge)}
                      </p>
                      <p className="text-xs text-muted-foreground">{service.processingDays} days</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select/Add Customer */}
        {currentStep === 'customer' && (
          <div>
            {!isNewCustomer ? (
              <>
                <input
                  type="text"
                  placeholder="Search customer by name or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground mb-4"
                />

                <button
                  onClick={() => setIsNewCustomer(true)}
                  className="w-full bg-primary/10 rounded-xl p-4 border border-primary/20 text-left mb-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-medium text-primary">+ Add New Customer</span>
                </button>

                <div className="space-y-2">
                  {filteredCustomers.map(customer => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full bg-card rounded-xl p-4 border border-border text-left hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{customer.name}</h3>
                          <p className="text-sm text-muted-foreground">{customer.mobile}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name *"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  value={customerForm.mobile}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={customerForm.address}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                />
                <input
                  type="text"
                  placeholder="Vehicle Number (if applicable)"
                  value={customerForm.vehicleNumber}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                />
                <input
                  type="text"
                  placeholder="DL Number (if applicable)"
                  value={customerForm.dlNumber}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, dlNumber: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsNewCustomer(false)}
                    className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCustomer}
                    disabled={!customerForm.name || !customerForm.mobile}
                    className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Documents (simplified) */}
        {currentStep === 'documents' && (
          <div>
            <div className="bg-card rounded-xl p-4 border border-border mb-4">
              <h3 className="font-medium text-foreground mb-3">Required Documents</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Aadhar Card
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Address Proof
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Passport Photo
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Application Form
                </li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Documents can be marked as received after file creation
              </p>
            </div>

            <button
              onClick={() => setCurrentStep('payment')}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 4: Payment Summary */}
        {currentStep === 'payment' && selectedService && selectedCustomer && (
          <div>
            {/* Summary Card */}
            <div className="bg-card rounded-xl p-4 border border-border mb-4">
              <h3 className="font-medium text-foreground mb-3">File Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium text-foreground">{selectedCustomer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time</span>
                  <span className="text-foreground">{selectedService.processingDays} days</span>
                </div>
              </div>
            </div>

            {/* Urgent Option */}
            {selectedService.urgentCharge && (
              <button
                onClick={() => setIsUrgent(!isUrgent)}
                className={cn(
                  'w-full rounded-xl p-4 border mb-4 flex items-center gap-3 transition-colors',
                  isUrgent 
                    ? 'bg-accent/10 border-accent' 
                    : 'bg-card border-border'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isUrgent ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
                )}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Urgent / Tatkal</p>
                  <p className="text-sm text-muted-foreground">
                    +{formatCurrency(selectedService.urgentCharge)}
                  </p>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center',
                  isUrgent ? 'border-accent bg-accent' : 'border-muted'
                )}>
                  {isUrgent && <Check className="w-4 h-4 text-accent-foreground" />}
                </div>
              </button>
            )}

            {/* Payment Breakdown */}
            <div className="bg-card rounded-xl p-4 border border-border mb-6">
              <h3 className="font-medium text-foreground mb-3">Payment Details</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Government Fee</span>
                  <span className="text-foreground">{formatCurrency(selectedService.govtFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent Charge</span>
                  <span className="text-foreground">{formatCurrency(selectedService.agentCharge)}</span>
                </div>
                {isUrgent && selectedService.urgentCharge && (
                  <div className="flex justify-between">
                    <span className="text-accent">Urgent Charge</span>
                    <span className="text-accent">{formatCurrency(selectedService.urgentCharge)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="font-semibold text-foreground">Total Amount</span>
                  <span className="font-bold text-primary text-lg">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg file-submit-animate"
            >
              Create File
            </button>
          </div>
        )}
      </main>

      {/* Back Button for steps */}
      {currentStep !== 'service' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <button
            onClick={() => {
              const stepOrder: Step[] = ['service', 'customer', 'documents', 'payment'];
              const currentIndex = stepOrder.indexOf(currentStep);
              if (currentIndex > 0) {
                setCurrentStep(stepOrder[currentIndex - 1]);
              }
            }}
            className="w-full py-3 rounded-xl border border-border text-foreground font-medium"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
