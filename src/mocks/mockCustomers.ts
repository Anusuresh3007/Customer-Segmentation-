import { Customer } from '../types';

const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Priya', 'Aditya', 'Sneha', 'Vikram', 'Pooja', 'Rahul', 'Neha',
  'Kabir', 'Tanvi', 'Siddharth', 'Divya', 'Arjun', 'Ishita', 'Karan', 'Rhea', 'Manish', 'Kavita',
  'Alex', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'James', 'Isabella', 'William', 'Mia',
  'David', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Kapoor', 'Singh', 'Gupta', 'Iyer',
  'Chopra', 'Malhotra', 'Bhat', 'Deshmukh', 'Saxena', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
  'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'
];

// Seeded random helper for reproducible realistic distributions
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateRealisticCustomers(count: number = 600): Customer[] {
  const customers: Customer[] = [];

  for (let i = 1; i <= count; i++) {
    const seed = i * 42.17;
    const r1 = pseudoRandom(seed);
    const r2 = pseudoRandom(seed + 1);
    const r3 = pseudoRandom(seed + 2);
    const r4 = pseudoRandom(seed + 3);
    const r5 = pseudoRandom(seed + 4);

    const firstName = FIRST_NAMES[Math.floor(r1 * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(r2 * LAST_NAMES.length)];
    const gender = r3 > 0.52 ? 'Female' : (r3 > 0.04 ? 'Male' : 'Other');

    // Cluster distribution probabilities:
    // Cluster 1: 22% (High Value)
    // Cluster 2: 29% (Loyal Regulars)
    // Cluster 3: 18% (Potential Loyalists)
    // Cluster 4: 17% (At-Risk)
    // Cluster 5: 14% (Budget)
    let cluster = 2;
    let clusterName = 'Loyal Regulars';
    let age = 35;
    let annualIncome = 55000;
    let spendingScore = 60;
    let purchaseFrequency = 5;
    let averageOrderValue = 20000;
    let recency = 25;
    let tenure = 24;

    if (r4 < 0.22) {
      // Cluster 1: High Value
      cluster = 1;
      clusterName = 'High Value Champions';
      age = Math.round(28 + r5 * 30);
      annualIncome = Math.round(80000 + r1 * 45000);
      spendingScore = Math.round(80 + r2 * 19);
      purchaseFrequency = Math.round(7 + r3 * 7);
      averageOrderValue = Math.round(35000 + r5 * 22000);
      recency = Math.round(2 + r1 * 20);
      tenure = Math.round(20 + r2 * 30);
    } else if (r4 < 0.51) {
      // Cluster 2: Loyal Regulars
      cluster = 2;
      clusterName = 'Loyal Regulars';
      age = Math.round(30 + r5 * 32);
      annualIncome = Math.round(48000 + r1 * 25000);
      spendingScore = Math.round(55 + r2 * 20);
      purchaseFrequency = Math.round(4 + r3 * 4);
      averageOrderValue = Math.round(18000 + r5 * 9000);
      recency = Math.round(10 + r1 * 35);
      tenure = Math.round(15 + r2 * 28);
    } else if (r4 < 0.69) {
      // Cluster 3: Potential Loyalists
      cluster = 3;
      clusterName = 'Potential Loyalists';
      age = Math.round(21 + r5 * 18);
      annualIncome = Math.round(38000 + r1 * 22000);
      spendingScore = Math.round(45 + r2 * 22);
      purchaseFrequency = Math.round(3 + r3 * 3);
      averageOrderValue = Math.round(12000 + r5 * 7000);
      recency = Math.round(5 + r1 * 28);
      tenure = Math.round(4 + r2 * 16);
    } else if (r4 < 0.86) {
      // Cluster 4: At-Risk
      cluster = 4;
      clusterName = 'At-Risk / Inactive';
      age = Math.round(35 + r5 * 30);
      annualIncome = Math.round(50000 + r1 * 30000);
      spendingScore = Math.round(15 + r2 * 25);
      purchaseFrequency = Math.round(1 + r3 * 2);
      averageOrderValue = Math.round(9000 + r5 * 6000);
      recency = Math.round(90 + r1 * 120);
      tenure = Math.round(12 + r2 * 24);
    } else {
      // Cluster 5: Budget Conscious
      cluster = 5;
      clusterName = 'Budget Conscious';
      age = Math.round(20 + r5 * 35);
      annualIncome = Math.round(20000 + r1 * 18000);
      spendingScore = Math.round(25 + r2 * 25);
      purchaseFrequency = Math.round(1 + r3 * 3);
      averageOrderValue = Math.round(4500 + r5 * 4500);
      recency = Math.round(20 + r1 * 60);
      tenure = Math.round(6 + r2 * 22);
    }

    const totalPurchases = Math.round(purchaseFrequency * Math.max(1, tenure / 12));

    customers.push({
      id: `CUST-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      age,
      gender,
      annualIncome,
      spendingScore,
      purchaseFrequency,
      averageOrderValue,
      totalPurchases,
      recency,
      tenure,
      cluster,
      clusterName
    });
  }

  return customers;
}

export const INITIAL_CUSTOMERS: Customer[] = generateRealisticCustomers(600);
