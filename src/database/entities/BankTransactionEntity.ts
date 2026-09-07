/**
 * ============================================================================
 * REALDRIVE ENTITY — BANK TRANSACTION ENTITY
 * ============================================================================
 * Double-entry general ledger records for all in-game currency movements:
 * vehicle sales, dyno tuning, racing prizes, freight contracts, gas fill-ups,
 * traffic fines, and stock market settlements.
 */

import { TableSchema } from '../DatabaseClient.js';

export interface BankTransactionEntity {
  id: string;
  transactionRef: string;
  sourceAccountId?: string;
  destinationAccountId?: string;
  userId: string;
  category:
    | 'VEHICLE_PURCHASE'
    | 'VEHICLE_SALE'
    | 'TUNING_UPGRADE'
    | 'LIVERY_COMMISSION'
    | 'RACE_ENTRY_FEE'
    | 'RACE_PRIZE_PAYOUT'
    | 'RIDESHARE_FARE'
    | 'FREIGHT_HAUL_PAYOUT'
    | 'DELIVERY_PAYOUT'
    | 'PROPERTY_ACQUISITION'
    | 'RENTAL_INCOME'
    | 'STOCK_PURCHASE'
    | 'STOCK_DIVIDEND'
    | 'LOAN_DISBURSEMENT'
    | 'LOAN_INSTALLMENT'
    | 'POLICE_FINE'
    | 'GASOLINE_EXPENSE'
    | 'MAINTENANCE_REPAIR';
  amount: number;
  feeAmount: number;
  balanceAfter: number;
  status: 'PENDING' | 'SETTLED' | 'REJECTED' | 'REVERSED';
  description: string;
  metadataJson?: string;
  createdAt: string;
}

export const BankTransactionSchema: TableSchema<BankTransactionEntity> = {
  name: 'bank_transactions',
  primaryKey: 'id',
  indexes: ['userId', 'category', 'status', 'createdAt'],
  uniqueKeys: ['transactionRef'],
  foreignKeys: [
    {
      field: 'userId',
      referencesTable: 'users',
      referencesField: 'id',
      onDelete: 'RESTRICT',
    },
  ],
  timestamps: false,
  softDeletes: false,
};
