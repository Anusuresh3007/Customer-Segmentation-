import React, { useState } from 'react';
import { Customer } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { customerApi } from '../../api/customerApi';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

interface CustomerFormProps {
  onSuccess: (customer: Customer) => void;
  onCancel: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess, onCancel }) => {
  const { success, error: toastError } = useToast();
  const { currency, addActivity } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    email: '',
    age: '32',
    gender: 'Female',
    annualIncome: '65000',
    spendingScore: '72',
    purchaseFrequency: '6',
    averageOrderValue: '24000',
    totalPurchases: '18',
    recency: '14',
    tenure: '24',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.id.trim()) {
      errs.id = 'Customer ID is required';
    }

    const age = Number(formData.age);
    if (!formData.age || isNaN(age) || age < 18 || age > 100) {
      errs.age = 'Age must be between 18 and 100';
    }

    const income = Number(formData.annualIncome);
    if (!formData.annualIncome || isNaN(income) || income < 0) {
      errs.annualIncome = 'Annual income must be a positive number';
    }

    const score = Number(formData.spendingScore);
    if (!formData.spendingScore || isNaN(score) || score < 1 || score > 100) {
      errs.spendingScore = 'Spending score must be between 1 and 100';
    }

    const freq = Number(formData.purchaseFrequency);
    if (!formData.purchaseFrequency || isNaN(freq) || freq < 0) {
      errs.purchaseFrequency = 'Purchase frequency must be 0 or greater';
    }

    const aov = Number(formData.averageOrderValue);
    if (!formData.averageOrderValue || isNaN(aov) || aov < 0) {
      errs.averageOrderValue = 'Average order value must be positive';
    }

    const recency = Number(formData.recency);
    if (!formData.recency || isNaN(recency) || recency < 0) {
      errs.recency = 'Recency must be 0 or more days';
    }

    const tenure = Number(formData.tenure);
    if (!formData.tenure || isNaN(tenure) || tenure < 0) {
      errs.tenure = 'Tenure must be positive months';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = await customerApi.createCustomer({
        id: formData.id.trim(),
        name: formData.name.trim() || undefined,
        email: formData.email.trim() || undefined,
        age: Number(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        annualIncome: Number(formData.annualIncome),
        spendingScore: Number(formData.spendingScore),
        purchaseFrequency: Number(formData.purchaseFrequency),
        averageOrderValue: Number(formData.averageOrderValue),
        totalPurchases: Number(formData.totalPurchases),
        recency: Number(formData.recency),
        tenure: Number(formData.tenure),
      });

      success('Customer Added Successfully', `Profile created for ${created.id}. Assigned to Cluster ${created.cluster}.`);
      addActivity('Customer record added', `${created.id} manual entry`, 'customer');
      onSuccess(created);
    } catch (err: any) {
      toastError('Failed to Add Customer', err.message || 'Customer ID might already exist.');
      setErrors((prev) => ({ ...prev, id: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Customer ID"
          required
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          error={errors.id}
          placeholder="e.g. CUST-1099"
        />

        <Select
          label="Gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          options={[
            { value: 'Female', label: 'Female' },
            { value: 'Male', label: 'Male' },
            { value: 'Other', label: 'Other' },
          ]}
        />

        <Input
          label="Full Name (Optional)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Ananya Sharma"
        />

        <Input
          label="Email (Optional)"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="e.g. ananya@example.com"
        />

        <Input
          label="Age"
          type="number"
          required
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          error={errors.age}
          min={18}
          max={100}
        />

        <Input
          label={`Annual Income (${currency})`}
          type="number"
          required
          value={formData.annualIncome}
          onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
          error={errors.annualIncome}
          placeholder="65000"
        />

        <Input
          label="Spending Score (1-100)"
          type="number"
          required
          value={formData.spendingScore}
          onChange={(e) => setFormData({ ...formData, spendingScore: e.target.value })}
          error={errors.spendingScore}
          min={1}
          max={100}
        />

        <Input
          label="Purchase Frequency (orders/yr)"
          type="number"
          required
          value={formData.purchaseFrequency}
          onChange={(e) => setFormData({ ...formData, purchaseFrequency: e.target.value })}
          error={errors.purchaseFrequency}
        />

        <Input
          label={`Average Order Value (${currency})`}
          type="number"
          required
          value={formData.averageOrderValue}
          onChange={(e) => setFormData({ ...formData, averageOrderValue: e.target.value })}
          error={errors.averageOrderValue}
        />

        <Input
          label="Total Lifetime Purchases"
          type="number"
          value={formData.totalPurchases}
          onChange={(e) => setFormData({ ...formData, totalPurchases: e.target.value })}
        />

        <Input
          label="Recency (Days since last purchase)"
          type="number"
          required
          value={formData.recency}
          onChange={(e) => setFormData({ ...formData, recency: e.target.value })}
          error={errors.recency}
        />

        <Input
          label="Tenure (Months as customer)"
          type="number"
          required
          value={formData.tenure}
          onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
          error={errors.tenure}
        />
      </div>

      <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Add Customer
        </Button>
      </div>
    </form>
  );
};
