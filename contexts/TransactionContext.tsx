import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'expense',
      amount: 1200,
      category: 'Food',
      description: 'Grocery shopping at Whole Foods',
      date: '2024-01-15',
    },
    {
      id: '2',
      type: 'expense',
      amount: 800,
      category: 'Bills',
      description: 'Electricity bill - January',
      date: '2024-01-14',
    },
    {
      id: '3',
      type: 'income',
      amount: 45000,
      category: 'Salary',
      description: 'Monthly salary from TechCorp',
      date: '2024-01-01',
    },
    {
      id: '4',
      type: 'expense',
      amount: 2500,
      category: 'Shopping',
      description: 'Winter clothes from Zara',
      date: '2024-01-10',
    },
    {
      id: '5',
      type: 'expense',
      amount: 1500,
      category: 'Entertainment',
      description: 'Movie tickets and dinner',
      date: '2024-01-08',
    },
    {
      id: '6',
      type: 'income',
      amount: 5000,
      category: 'Freelance',
      description: 'Web development project',
      date: '2024-01-05',
    },
  ]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, transactionData: Omit<Transaction, 'id'>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...transactionData, id } : t)
    );
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}; 