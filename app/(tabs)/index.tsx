import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface User {
  email: string;
  name: string;
}

const CATEGORIES = {
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Refund', 'Other'],
};

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];

export default function DashboardScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(50000);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Mock login function
  const handleLogin = () => {
    if (email && password) {
      setUser({ email, name: name || 'User' });
      setIsLoggedIn(true);
      // Load mock data
      loadMockData();
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const loadMockData = () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 1200,
        category: 'Food',
        description: 'Grocery shopping',
        date: '2024-01-15',
      },
      {
        id: '2',
        type: 'expense',
        amount: 800,
        category: 'Bills',
        description: 'Electricity bill',
        date: '2024-01-14',
      },
      {
        id: '3',
        type: 'income',
        amount: 45000,
        category: 'Salary',
        description: 'Monthly salary',
        date: '2024-01-01',
      },
      {
        id: '4',
        type: 'expense',
        amount: 2500,
        category: 'Shopping',
        description: 'Clothes',
        date: '2024-01-10',
      },
    ];
    setTransactions(mockTransactions);
  };

  const getCurrentMonthTransactions = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });
  };

  const getMonthlyExpenses = () => {
    return getCurrentMonthTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyIncome = () => {
    return getCurrentMonthTransactions()
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryData = () => {
    const categoryTotals: { [key: string]: number } = {};

    getCurrentMonthTransactions()
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, amount], index) => ({
      name,
      amount,
      color: COLORS[index % COLORS.length],
      percentage: 0, // Will calculate below
    }));
  };

  const getBudgetUtilization = () => {
    const expenses = getMonthlyExpenses();
    return Math.min((expenses / monthlyBudget) * 100, 100);
  };

  if (!isLoggedIn) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loginContainer}>
          <ThemedText type="title">Expense Tracker</ThemedText>

          {isSignUp && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#666"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.linkText}>
              {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const monthlyExpenses = getMonthlyExpenses();
  const monthlyIncome = getMonthlyIncome();
  const budgetUtilization = getBudgetUtilization();
  const categoryData = getCategoryData();
  
  // Calculate percentages for category data
  const totalExpenses = categoryData.reduce((sum, item) => sum + item.amount, 0);
  categoryData.forEach(item => {
    item.percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
        <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <ThemedText style={styles.welcomeText}>Welcome, {user?.name}!</ThemedText>

        {/* Budget Overview */}
        <View style={styles.card}>
          <ThemedText type="subtitle">Monthly Overview</ThemedText>
          <View style={styles.overviewRow}>
            <View style={styles.overviewItem}>
              <ThemedText style={styles.overviewLabel}>Income</ThemedText>
              <ThemedText style={[styles.overviewAmount, { color: '#4CAF50' }]}>
                ₹{monthlyIncome.toLocaleString()}
              </ThemedText>
            </View>
            <View style={styles.overviewItem}>
              <ThemedText style={styles.overviewLabel}>Expenses</ThemedText>
              <ThemedText style={[styles.overviewAmount, { color: '#F44336' }]}>
                ₹{monthlyExpenses.toLocaleString()}
              </ThemedText>
            </View>
          </View>

          <View style={styles.budgetSection}>
            <ThemedText style={styles.overviewLabel}>Budget Utilization</ThemedText>
            <View style={styles.budgetBar}>
              <View
                style={[
                  styles.budgetProgress,
                  {
                    width: `${budgetUtilization}%`,
                    backgroundColor: budgetUtilization > 80 ? '#F44336' : '#4CAF50',
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.budgetText}>
              {budgetUtilization.toFixed(1)}% of ₹{monthlyBudget.toLocaleString()}
            </ThemedText>
          </View>
        </View>

        {/* Spending Breakdown - Text Version */}
        {categoryData.length > 0 && (
          <View style={styles.card}>
            <ThemedText type="subtitle">Spending Breakdown</ThemedText>
            <ThemedText style={styles.chartNote}>📊 Chart view available in development build</ThemedText>
            {categoryData.map((item, index) => (
              <View key={item.name} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                </View>
                <View style={styles.categoryAmounts}>
                  <ThemedText style={styles.categoryAmount}>₹{item.amount.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.card}>
          <ThemedText type="subtitle">Recent Transactions</ThemedText>
          {transactions.slice(0, 5).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <ThemedText style={styles.transactionDescription}>{transaction.description}</ThemedText>
                <ThemedText style={styles.transactionCategory}>
                  {transaction.category} • {transaction.date}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.transactionAmount,
                  {
                    color: transaction.type === 'income' ? '#4CAF50' : '#F44336',
                  },
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
              </ThemedText>
            </View>
          ))}
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => Alert.alert('Coming Soon', 'Full transaction list coming soon!')}
          >
            <Text style={styles.viewAllButtonText}>View All Transactions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    color: '#007AFF',
    fontSize: 14,
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  overviewAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  budgetSection: {
    marginTop: 10,
  },
  budgetBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginVertical: 10,
  },
  budgetProgress: {
    height: '100%',
    borderRadius: 4,
  },
  budgetText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chartNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});
