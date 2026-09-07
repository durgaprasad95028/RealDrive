/**
 * ============================================================================
 * REALDRIVE ENTITY — AUTO LOAN & FINANCING CONTRACT ENTITY
 * ============================================================================
 * Vehicle financing contracts, down payments, fixed APR amortization schedules,
 * installment terms, delinquency warnings, and repossession triggers.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface LoanContractEntity {
  id: string;
  contractNumber: string;
  userId: string;
  vehicleId: string;
  principalAmount: number;
  downPaymentAmount: number;
  financedAmount: number;
  annualPercentageRatePct: number; // e.g. 5.9%
  loanTermMonths: number; // 12, 24, 36, 48, 60
  monthlyInstallment: number;
  totalRepaymentExpected: number;
  totalAmountPaid: number;
  remainingBalance: number;
  installmentsCompleted: number;
  installmentsRemaining: number;
  nextDueDate: string;
  status: 'ACTIVE' | 'PAID_IN_FULL' | 'DELINQUENT' | 'DEFAULTED_REPOSSESSED';
  missedPaymentsCount: number;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const LoanContractSchema: TableSchema<LoanContractEntity> = {
  name: 'loan_contracts',
  primaryKey: 'id',
  indexes: ['userId', 'vehicleId', 'status', 'nextDueDate'],
  uniqueKeys: ['contractNumber'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
    {
      field: 'vehicleId',
      referencesTable: 'vehicles',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
