import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  Calendar, 
  Search,
  CheckCircle2,
  Zap,
  ShoppingBag,
  Fuel,
  Wrench,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { PageContainer, PageHeader } from '../../components/layout/PageContainer';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Tabs } from '../../components/common/Tabs';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Transaction } from '../../types';

interface WalletPageProps {
  onNavigate: (path: string) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ onNavigate }) => {
  const { wallet, transactions } = useGame();
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(txn => {
    const matchesType = filterType === 'ALL' || txn.type === filterType;
    const matchesSearch = txn.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          txn.receiptId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getCategoryIcon = (category: Transaction['category'], type: Transaction['type']) => {
    if (type === 'INCOME') return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
    switch (category) {
      case 'FUEL': return <Fuel className="w-4 h-4 text-sky-400" />;
      case 'REPAIR': return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'INSURANCE': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'FINE': return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'CAR_PURCHASE': return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      default: return <ArrowUpRight className="w-4 h-4 text-danger" />;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Economy & Bank Ledger"
        subtitle="Track simulated income from jobs and contracts against automotive fuel, maintenance, insurance, and fine expenditures"
      />

      {/* High-level Financial Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Available Balance"
          value={`₹${wallet.balance.toLocaleString()}`}
          subtext="Liquid simulated currency"
          icon={<WalletIcon className="w-5 h-5" />}
          highlight
        />

        <StatCard
          title="Today's Total Income"
          value={`₹${wallet.todayIncome.toLocaleString()}`}
          subtext="From jobs & completed bonuses"
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Today's Expenditures"
          value={`₹${wallet.todayExpenses.toLocaleString()}`}
          subtext="Fuel, parts, and daily fees"
          icon={<TrendingDown className="w-5 h-5 text-danger" />}
        />

        <StatCard
          title="Lifetime Gross Earnings"
          value={`₹${wallet.totalEarnings.toLocaleString()}`}
          subtext={`Spent: ₹${wallet.totalSpent.toLocaleString()}`}
          icon={<Zap className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Transaction History & Filter Section */}
      <Card variant="default">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border">
          <div>
            <h3 className="text-base font-bold text-primary-text">Transaction History & Receipts</h3>
            <p className="text-xs text-secondary-text">All financial operations are logged to the local ledger</p>
          </div>

          <div className="flex items-center gap-3">
            <Tabs
              tabs={[
                { id: 'ALL', label: 'All', count: transactions.length },
                { id: 'INCOME', label: 'Income', count: transactions.filter(t => t.type === 'INCOME').length },
                { id: 'EXPENSE', label: 'Expenses', count: transactions.filter(t => t.type === 'EXPENSE').length },
              ]}
              activeTab={filterType}
              onChange={(t) => setFilterType(t as any)}
            />

            <div className="w-48">
              <Input
                placeholder="Search receipt or note..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>

        {/* Transaction Rows */}
        <div className="divide-y divide-app-border/60 mt-2">
          {filteredTransactions.map(txn => {
            const isIncome = txn.type === 'INCOME';

            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="py-3.5 px-3 rounded-xl hover:bg-surface-elevated/70 cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl border ${
                    isIncome 
                      ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400' 
                      : 'bg-red-950/70 border-red-800 text-danger'
                  }`}>
                    {getCategoryIcon(txn.category, txn.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-primary-text truncate">{txn.description}</p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-text mt-0.5">
                      <span>{txn.date}</span>
                      <span>•</span>
                      <span className="text-sky-400">{txn.receiptId}</span>
                      <span>•</span>
                      <span className="uppercase">{txn.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`font-mono text-base font-extrabold ${isIncome ? 'text-emerald-400' : 'text-danger'}`}>
                    {isIncome ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </span>
                  <Badge variant={isIncome ? 'success' : 'neutral'} size="sm" className="block w-fit ml-auto mt-1">
                    SETTLED
                  </Badge>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center text-secondary-text text-sm font-mono">
              No transactions found matching your criteria.
            </div>
          )}
        </div>
      </Card>

      {/* Transaction Receipt Modal */}
      {selectedTxn && (
        <Modal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Electronic Transaction Receipt"
          subtitle="RealDrive Simulated Banking & Commerce Audit"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-background-secondary border border-app-border space-y-3 font-mono text-xs">
              <div className="flex justify-between pb-2 border-b border-app-border">
                <span className="text-muted-text uppercase">Receipt Number</span>
                <span className="font-bold text-sky-400">{selectedTxn.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Timestamp</span>
                <span className="text-primary-text">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Transaction Type</span>
                <Badge variant={selectedTxn.type === 'INCOME' ? 'success' : 'danger'} size="sm">
                  {selectedTxn.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Category</span>
                <span className="text-primary-text">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Description</span>
                <span className="text-primary-text font-sans max-w-[200px] text-right">{selectedTxn.description}</span>
              </div>

              <div className="pt-3 border-t border-app-border flex justify-between items-baseline text-sm">
                <span className="text-secondary-text">Total Settled:</span>
                <span className={`text-lg font-bold font-mono ${selectedTxn.type === 'INCOME' ? 'text-emerald-400' : 'text-danger'}`}>
                  {selectedTxn.type === 'INCOME' ? '+' : '-'}₹{selectedTxn.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedTxn(null)}>
                Close Receipt
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};
