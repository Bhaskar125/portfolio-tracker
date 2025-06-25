import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { VoiceRecordingModal } from '@/components/VoiceRecordingModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];

// Generate sample data for the last 7 days
const generateChartData = () => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 3000) + 500, // Random expenses between 500-3500
    });
  }
  return data;
};

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { transactions } = useTransactions();
  const [monthlyBudget] = useState(50000);
  const [chartData] = useState(generateChartData());
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Custom Line Chart Component using React Native Views
  const CustomLineChart = ({ data }: { data: any[] }) => {
    const maxValue = Math.max(...data.map(d => d.amount));
    const minValue = Math.min(...data.map(d => d.amount));
    const range = maxValue - minValue || 1;
    const chartWidth = screenWidth - 80;
    const chartHeight = 100;
    const pointWidth = chartWidth / (data.length - 1);

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {/* Background grid lines */}
          {[0, 1, 2, 3].map((line) => (
            <View
              key={line}
              style={[
                styles.gridLine,
                { bottom: (line * chartHeight) / 3 }
              ]}
            />
          ))}
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = index * pointWidth;
            const y = ((point.amount - minValue) / range) * chartHeight;
            
            return (
              <View key={index}>
                {/* Data point */}
                <View
                  style={[
                    styles.dataPoint,
                    { 
                      left: x - 4, 
                      bottom: y - 4 
                    }
                  ]}
                />
                
                {/* Connecting line to next point */}
                {index < data.length - 1 && (
                  <View
                    style={[
                      styles.connectionLine,
                      {
                        left: x,
                        bottom: y,
                        width: pointWidth,
                        height: 2,
                        transform: [{
                          rotate: `${Math.atan2(
                            ((data[index + 1].amount - minValue) / range) * chartHeight - y,
                            pointWidth
                          )}rad`
                        }]
                      }
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
        
        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {data.map((point, index) => (
            <Text key={index} style={styles.xAxisLabel}>
              {point.day}
            </Text>
          ))}
        </View>
      </View>
    );
  };

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
      {/* Enhanced Header with Profile */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>{getInitials(user?.name || 'U')}</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: logout }
              ]
            );
          }}
        >
          <Text style={styles.logoutText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Credit Card Section */}
        <View style={styles.cardSection}>
          <View style={styles.creditCard}>
            {/* Gradient Overlay Effect */}
            <View style={styles.gradientOverlay} />
            <View style={styles.gradientOverlay2} />
            
            <View style={styles.cardHeaderSection}>
              <Text style={styles.bankName}>PORTFOLIO BANK</Text>
              <Text style={styles.cardType}>VISA</Text>
            </View>
            
            <View style={styles.chipSection}>
              <View style={styles.chip} />
              <Text style={styles.contactless}>📶</Text>
            </View>
            
            <View style={styles.cardNumberSection}>
              <Text style={styles.cardNumber}>•••• •••• •••• 1234</Text>
            </View>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardDetails}>
                <View>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>{user?.name?.toUpperCase() || 'USER NAME'}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>VALID THRU</Text>
                  <Text style={styles.cardValue}>12/28</Text>
                </View>
              </View>
              <View style={styles.cardBalance}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>₹{(getMonthlyIncome() - getMonthlyExpenses()).toLocaleString()}</Text>
              </View>
            </View>
            
            {/* Card Background Pattern */}
            <View style={styles.cardPattern}>
              <View style={[styles.patternCircle, { top: -20, right: -20 }]} />
              <View style={[styles.patternCircle, { bottom: -30, left: -30 }]} />
              <View style={[styles.patternCircle, { top: 60, right: 50, opacity: 0.3 }]} />
            </View>
          </View>
          
          {/* Quick Actions Row */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>💳</Text>
              </View>
              <Text style={styles.quickActionLabel}>Pay Bills</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>💸</Text>
              </View>
              <Text style={styles.quickActionLabel}>Transfer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>📊</Text>
              </View>
              <Text style={styles.quickActionLabel}>Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setVoiceModalVisible(true)}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionEmoji}>🎤</Text>
              </View>
              <Text style={styles.quickActionLabel}>Voice Input</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expense Trend Chart */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <View>
              <ThemedText type="subtitle">Expense Trend</ThemedText>
              <Text style={styles.chartSubtitle}>Last 7 days spending pattern</Text>
            </View>
            <View style={styles.trendBadge}>
              <Text style={styles.trendIcon}>📈</Text>
            </View>
          </View>
          
          <CustomLineChart data={chartData} />
          
          <View style={styles.chartFooter}>
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Daily Expenses</Text>
              </View>
              <Text style={styles.averageText}>
                Avg: ₹{Math.round(chartData.reduce((sum, d) => sum + d.amount, 0) / chartData.length).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Enhanced Budget Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Monthly Overview</ThemedText>
            <View style={styles.monthBadge}>
              <Text style={styles.monthText}>JAN</Text>
            </View>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <View style={styles.overviewIconContainer}>
                <Text style={styles.overviewIcon}>💰</Text>
              </View>
              <ThemedText style={styles.overviewLabel}>Income</ThemedText>
              <ThemedText style={[styles.overviewAmount, { color: '#10B981' }]}>
                ₹{monthlyIncome.toLocaleString()}
              </ThemedText>
              <Text style={styles.overviewChange}>+12.5%</Text>
            </View>
            <View style={styles.overviewCard}>
              <View style={styles.overviewIconContainer}>
                <Text style={styles.overviewIcon}>💸</Text>
              </View>
              <ThemedText style={styles.overviewLabel}>Expenses</ThemedText>
              <ThemedText style={[styles.overviewAmount, { color: '#EF4444' }]}>
                ₹{monthlyExpenses.toLocaleString()}
              </ThemedText>
              <Text style={styles.overviewChange}>+8.3%</Text>
            </View>
          </View>

          <View style={styles.budgetSection}>
            <View style={styles.budgetHeader}>
              <ThemedText style={styles.overviewLabel}>Budget Utilization</ThemedText>
              <Text style={styles.budgetPercentage}>{budgetUtilization.toFixed(1)}%</Text>
            </View>
            <View style={styles.budgetBar}>
              <View
                style={[
                  styles.budgetProgress,
                  {
                    width: `${budgetUtilization}%`,
                    backgroundColor: budgetUtilization > 80 ? '#EF4444' : budgetUtilization > 60 ? '#F59E0B' : '#10B981',
                  },
                ]}
              />
            </View>
            <Text style={styles.budgetText}>
              ₹{(monthlyBudget - monthlyExpenses).toLocaleString()} remaining of ₹{monthlyBudget.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Enhanced Spending Breakdown */}
        {categoryData.length > 0 && (
          <View style={styles.card}>
            <ThemedText type="subtitle">Spending Breakdown</ThemedText>
            <Text style={styles.chartNote}>Top categories this month</Text>
            {categoryData.slice(0, 4).map((item, index) => (
              <View key={item.name} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                  <View style={styles.categoryDetails}>
                    <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                    <Text style={styles.categoryTransactions}>
                      {getCurrentMonthTransactions().filter(t => t.category === item.name).length} transactions
                    </Text>
                  </View>
                </View>
                <View style={styles.categoryAmounts}>
                  <ThemedText style={styles.categoryAmount}>₹{item.amount.toLocaleString()}</ThemedText>
                  <Text style={styles.categoryPercentage}>{item.percentage.toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Enhanced Recent Transactions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <TouchableOpacity
              onPress={() => Alert.alert('Navigation', 'This will navigate to the transactions tab!')}
            >
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          {transactions.slice(0, 3).map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionEmoji}>
                  {transaction.category === 'Food' ? '🍕' : 
                   transaction.category === 'Bills' ? '📱' :
                   transaction.category === 'Shopping' ? '🛒' :
                   transaction.category === 'Salary' ? '💰' : '💳'}
                </Text>
              </View>
              <View style={styles.transactionLeft}>
                <ThemedText style={styles.transactionDescription}>{transaction.description}</ThemedText>
                <Text style={styles.transactionMeta}>
                  {transaction.category} • {new Date(transaction.date).toLocaleDateString('en-IN', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              <View style={styles.transactionRight}>
                <ThemedText
                  style={[
                    styles.transactionAmount,
                    {
                      color: transaction.type === 'income' ? '#10B981' : '#EF4444',
                    },
                  ]}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Voice Recording Modal */}
      <VoiceRecordingModal
        visible={voiceModalVisible}
        onClose={() => setVoiceModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthBadge: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  monthText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  trendBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartArea: {
    width: screenWidth - 80,
    height: 100,
    position: 'relative',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  connectionLine: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    borderRadius: 1,
    transformOrigin: 'left center',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth - 80,
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  chartFooter: {
    marginTop: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  averageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  overviewIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewIcon: {
    fontSize: 24,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewChange: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  budgetSection: {
    marginTop: 8,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  budgetBar: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 12,
  },
  budgetProgress: {
    height: '100%',
    borderRadius: 6,
  },
  budgetText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartNote: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryTransactions: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  categoryAmounts: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 11,
    color: '#6B7280',
  },
  viewAllLink: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 18,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSection: {
    marginBottom: 20,
  },
  creditCard: {
    height: 200,
    backgroundColor: '#6366F1',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bankName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  chipSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chip: {
    width: 30,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  contactless: {
    fontSize: 16,
    transform: [{ rotate: '90deg' }],
  },
  cardNumberSection: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'center',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
    paddingTop: 6,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardBalance: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 8,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  patternCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    opacity: 0.1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '50%',
    bottom: 0,
    backgroundColor: 'rgba(139, 69, 219, 0.3)',
  },
  gradientOverlay2: {
    position: 'absolute',
    top: 0,
    left: '70%',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(219, 39, 119, 0.2)',
  },
});


