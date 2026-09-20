import { Cluster } from '../types';

export const INITIAL_CLUSTERS: Cluster[] = [
  {
    id: 1,
    name: 'High Value Champions',
    tagline: 'High income, high spending frequency, brand advocates',
    customerCount: 5408,
    percentage: 22,
    averageIncome: 94500,
    averageSpendingScore: 88.4,
    averagePurchaseFrequency: 8.2,
    averageOrderValue: 42300,
    averageAge: 38,
    averageRecency: 12,
    averageTenure: 34,
    color: '#2563EB', // Blue
    description: 'Affluent customers who make frequent purchases with high basket values. They expect premium concierge service, early product access, and dedicated support.',
    traits: ['Top 10% Lifetime Value', 'Low Price Sensitivity', 'High Brand Loyalty', 'Frequent Engagements'],
    recommendedAction: 'Enroll in VIP Tier, provide exclusive pre-orders, assign dedicated relationship managers, avoid discount-heavy promotions.'
  },
  {
    id: 2,
    name: 'Loyal Regulars',
    tagline: 'Steady purchase cadence, consistent brand engagement',
    customerCount: 7129,
    percentage: 29,
    averageIncome: 58200,
    averageSpendingScore: 64.1,
    averagePurchaseFrequency: 5.1,
    averageOrderValue: 21400,
    averageAge: 42,
    averageRecency: 24,
    averageTenure: 28,
    color: '#16A34A', // Green
    description: 'Reliable core customer base. They purchase predictably each month and have strong satisfaction rates. Good candidates for upsell and cross-sell campaigns.',
    traits: ['Consistent Repeat Orders', 'Moderate Basket Size', 'High Review Submission Rate', 'Responsive to Loyalty Points'],
    recommendedAction: 'Target with loyalty milestones, bundle offers, and product recommendations matching previous order categories.'
  },
  {
    id: 3,
    name: 'Potential Loyalists',
    tagline: 'Recent buyers with high engagement and growing basket size',
    customerCount: 4425,
    percentage: 18,
    averageIncome: 46800,
    averageSpendingScore: 52.6,
    averagePurchaseFrequency: 3.8,
    averageOrderValue: 14800,
    averageAge: 29,
    averageRecency: 18,
    averageTenure: 11,
    color: '#F59E0B', // Amber
    description: 'Younger or recently onboarded customers who have had several positive transactions. They show high click-through rates and high conversion potential.',
    traits: ['High Category Exploration', 'Mobile App Active', 'Price-Quality Balanced', 'Social Media Engaged'],
    recommendedAction: 'Deliver personalized onboarding sequences, app-exclusive gamified challenges, and community perks.'
  },
  {
    id: 4,
    name: 'At-Risk / Inactive',
    tagline: 'Previously active customers whose engagement has decayed',
    customerCount: 4179,
    percentage: 17,
    averageIncome: 62400,
    averageSpendingScore: 28.3,
    averagePurchaseFrequency: 1.9,
    averageOrderValue: 11200,
    averageAge: 47,
    averageRecency: 140,
    averageTenure: 22,
    color: '#DC2626', // Red
    description: 'Customers with historically decent spend who have not purchased in over 90-180 days. Churn risk is elevated unless proactive win-back steps are taken.',
    traits: ['High Recency Gap', 'Declining Open Rates', 'Prior Solid Spenders', 'Sensitive to Relevance'],
    recommendedAction: 'Launch multi-channel win-back campaigns with "We miss you" incentives, feedback surveys, and limited-time reactivation coupons.'
  },
  {
    id: 5,
    name: 'Budget Conscious',
    tagline: 'Price-sensitive shoppers driven by promotions and clearance',
    customerCount: 3441,
    percentage: 14,
    averageIncome: 29100,
    averageSpendingScore: 35.8,
    averagePurchaseFrequency: 2.4,
    averageOrderValue: 6800,
    averageAge: 33,
    averageRecency: 45,
    averageTenure: 16,
    color: '#8B5CF6', // Purple
    description: 'Shoppers looking for optimal value, seasonal discounts, and clearance items. They have lower disposable income but high volume potential during sales.',
    traits: ['Deal Driven', 'High Coupon Usage', 'Cart Abandonment Sensitive', 'Sale Season Spike'],
    recommendedAction: 'Notify of flash sales, clearance events, free shipping thresholds, and entry-level bundle discounts.'
  }
];
