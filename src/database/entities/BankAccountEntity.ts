/**
 * ============================================================================
 * REALDRIVE ENTITY — BANK ACCOUNT ENTITY
 * ============================================================================
 * First National City Bank accounts, checking/savings, interest yields,
 * routing numbers, credit scoring, overdraft protection limits.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface BankAccountEntity {
  id: string;
  userId: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'CHECKING' | 'HIGH_YIELD_SAVINGS' | 'INVESTMENT_PORTFOLIO' | 'ESCROW';
  currency: 'RDC'; // RealDrive Credits
  balance: number;
  availableBalance: number;
  escrowLockedBalance: number;
  annualInterestRatePct: number; // e.g. 3.5%
  overdraftLimit: number;
  creditScore: number; // 300 to 850
  isFrozen: boolean;
  freezeReason?: string;
  openedAt: string;
  updatedAt: string;
}

export const BankAccountSchema: TableSchema<BankAccountEntity> = {
  name: 'bank_accounts',
  primaryKey: 'id',
  indexes: ['userId', 'accountType', 'creditScore'],
  uniqueKeys: ['accountNumber', 'userId'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: true,
  softDeletes: false,
};
