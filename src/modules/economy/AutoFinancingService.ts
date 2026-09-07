/**
 * ============================================================================
 * REALDRIVE ECONOMY — AUTO FINANCING & LOAN AMORTIZATION SERVICE
 * ============================================================================
 * Vehicle financing contracts:
 * - Fixed APR amortization schedules with monthly compounding
 * - Credit score approval rating requirements
 * - Automated payment collections & default delinquency warnings
 */

import { DatabaseClient, db } from '../../database/DatabaseClient.js';
import { LoanContractEntity } from '../../database/entities/LoanContractEntity.js';
import { BankAccountEntity } from '../../database/entities/BankAccountEntity.js';
import { HttpError } from '../../core/HttpTypes.js';

export interface FinancingQuote {
  vehicleId: string;
  vehiclePrice: number;
  downPayment: number;
  financedAmount: number;
  aprPct: number;
  termMonths: number;
  monthlyInstallment: number;
  totalInterestPaid: number;
  totalRepayment: number;
}

export class AutoFinancingService {
  constructor(private database: DatabaseClient = db) {}

  public calculateQuote(
    vehiclePrice: number,
    downPayment: number,
    termMonths: number = 36,
    creditScore: number = 720
  ): FinancingQuote {
    if (downPayment < vehiclePrice * 0.10) {
      throw HttpError.badRequest('Minimum 10% down payment required.');
    }

    // Determine APR based on credit score
    let apr = 5.9;
    if (creditScore < 600) apr = 14.5;
    else if (creditScore < 680) apr = 9.8;
    else if (creditScore < 750) apr = 5.9;
    else apr = 3.2;

    const principal = vehiclePrice - downPayment;
    const monthlyRate = apr / 100 / 12;
    const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalRepayment = monthlyPayment * termMonths;
    const totalInterest = totalRepayment - principal;

    return {
      vehicleId: '',
      vehiclePrice,
      downPayment,
      financedAmount: Math.round(principal),
      aprPct: apr,
      termMonths,
      monthlyInstallment: Math.round(monthlyPayment),
      totalInterestPaid: Math.round(totalInterest),
      totalRepayment: Math.round(totalRepayment),
    };
  }

  public async getPlayerLoans(userId: string): Promise<LoanContractEntity[]> {
    return this.database.findMany<LoanContractEntity>('loan_contracts', { userId });
  }

  public async payInstallment(loanId: string, userId: string): Promise<LoanContractEntity> {
    const loan = await this.database.findById<LoanContractEntity>('loan_contracts', loanId);
    if (!loan) throw HttpError.notFound('Loan contract not found');
    if (loan.userId !== userId) throw HttpError.forbidden('Unauthorized access to loan');
    if (loan.status === 'PAID_IN_FULL') throw HttpError.badRequest('Loan is already paid in full.');

    const bankAcc = await this.database.findOne<BankAccountEntity>('bank_accounts', { userId });
    if (!bankAcc || bankAcc.availableBalance < loan.monthlyInstallment) {
      throw HttpError.badRequest('Insufficient bank balance to pay monthly installment.');
    }

    // Deduct installment
    const newBankBalance = bankAcc.balance - loan.monthlyInstallment;
    await this.database.update<BankAccountEntity>('bank_accounts', bankAcc.id, {
      balance: newBankBalance,
      availableBalance: newBankBalance,
    });

    const newPaid = loan.totalAmountPaid + loan.monthlyInstallment;
    const newRemaining = Math.max(0, loan.remainingBalance - loan.monthlyInstallment);
    const newCompleted = loan.installmentsCompleted + 1;
    const newRemInstallments = Math.max(0, loan.installmentsRemaining - 1);
    const isFinished = newRemaining === 0 || newRemInstallments === 0;

    const updated = await this.database.update<LoanContractEntity>('loan_contracts', loanId, {
      totalAmountPaid: newPaid,
      remainingBalance: newRemaining,
      installmentsCompleted: newCompleted,
      installmentsRemaining: newRemInstallments,
      status: isFinished ? 'PAID_IN_FULL' : 'ACTIVE',
      lastPaymentDate: new Date().toISOString(),
      nextDueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    });

    return updated!;
  }
}
