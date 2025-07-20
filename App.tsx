
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType } from './types';
import Header from './components/Header';
import Balance from './components/Balance';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error("無法從localStorage讀取交易紀錄:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error("無法將交易紀錄存入localStorage:", error);
    }
  }, [transactions]);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now(),
      date: new Date().toISOString(),
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(transaction => transaction.id !== id)
    );
  };
  
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <Header />
        <main className="space-y-8">
          <Balance income={totalIncome} expense={totalExpense} balance={balance} />
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={transactions} onDeleteTransaction={handleDeleteTransaction} />
        </main>
      </div>
    </div>
  );
};

export default App;
