import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTransactions } from '@/contexts/TransactionContext';
import { useVoiceTransaction } from '@/hooks/useVoiceTransaction';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const CATEGORIES = {
  expense: ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Refund', 'Other'],
};

const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000];

export default function AddTransactionScreen() {
  const { addTransaction } = useTransactions();
  const { startRecording, stopRecording, isRecording, isProcessing, isVoiceAvailable } = useVoiceTransaction();
  
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const handleVoiceInput = async () => {
    try {
      if (isRecording) {
        // Stop recording and process
        const voiceTransaction = await stopRecording();
        
        if (voiceTransaction && voiceTransaction.confidence > 0.6) {
          // Auto-fill form with voice input
          setTransactionType(voiceTransaction.type);
          setAmount(voiceTransaction.amount.toString());
          setDescription(voiceTransaction.description);
          setCategory(voiceTransaction.category);
          
          Alert.alert(
            'Voice Input Processed! 🎉',
            `Detected: ${voiceTransaction.type} of ₹${voiceTransaction.amount} for ${voiceTransaction.category}\n\nConfidence: ${Math.round(voiceTransaction.confidence * 100)}%\n\nReview the details and tap "Add Transaction" to confirm.`,
            [
              { text: 'Edit Details', style: 'default' },
              { 
                text: 'Add Now', 
                style: 'default',
                onPress: () => handleSubmit()
              }
            ]
          );
        } else {
          Alert.alert(
            'Low Confidence',
            'Could not clearly understand the voice input. Please try speaking more clearly or add the transaction manually.'
          );
        }
      } else {
        // Start recording
        await startRecording();
      }
          } catch (error) {
        console.error('Voice input error:', error);
        Alert.alert(
          'Voice Input Error', 
          'There was an error with voice input. Please fill out the form manually.'
        );
      }
  };

  const handleSubmit = () => {
    if (!amount || !description || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addTransaction({
      type: transactionType,
      amount: numericAmount,
      category,
      description,
      date,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    
    Alert.alert('Success', 'Transaction added successfully!');
  };

  const currentCategories = CATEGORIES[transactionType];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Add Transaction</ThemedText>
        <ThemedText style={styles.headerSubtitle}>Record your income or expense</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transaction Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: transactionType === 'expense' ? '#EF4444' : '#F3F4F6' }
              ]}
              onPress={() => {
                setTransactionType('expense');
                setCategory('');
              }}
            >
              <Text style={[
                styles.typeButtonText,
                { color: transactionType === 'expense' ? '#FFFFFF' : '#6B7280' }
              ]}>
                💸 Expense
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                { backgroundColor: transactionType === 'income' ? '#10B981' : '#F3F4F6' }
              ]}
              onPress={() => {
                setTransactionType('income');
                setCategory('');
              }}
            >
              <Text style={[
                styles.typeButtonText,
                { color: transactionType === 'income' ? '#FFFFFF' : '#6B7280' }
              ]}>
                💰 Income
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountCard}>
            <View style={styles.amountInputWrapper}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <Text style={styles.quickAmountLabel}>Quick amounts</Text>
            <View style={styles.quickAmounts}>
              {QUICK_AMOUNTS.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[
                    styles.quickAmountButton,
                    { backgroundColor: amount === quickAmount.toString() ? '#3B82F6' : '#F8FAFC' }
                  ]}
                  onPress={() => handleQuickAmount(quickAmount)}
                >
                  <Text style={[
                    styles.quickAmountText,
                    { color: amount === quickAmount.toString() ? '#FFFFFF' : '#6B7280' }
                  ]}>
                    ₹{quickAmount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter transaction description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {currentCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: category === cat 
                      ? (transactionType === 'income' ? '#10B981' : '#EF4444')
                      : '#F8FAFC',
                    borderColor: category === cat 
                      ? (transactionType === 'income' ? '#10B981' : '#EF4444')
                      : '#E5E7EB'
                  }
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryChipText,
                  { color: category === cat ? '#FFFFFF' : '#6B7280' }
                ]}>
                  {cat === 'Food' ? '🍕' : 
                   cat === 'Travel' ? '✈️' :
                   cat === 'Bills' ? '📱' :
                   cat === 'Shopping' ? '🛒' :
                   cat === 'Entertainment' ? '🎬' :
                   cat === 'Healthcare' ? '🏥' :
                   cat === 'Salary' ? '💰' :
                   cat === 'Freelance' ? '💻' :
                   cat === 'Investment' ? '📈' :
                   cat === 'Refund' ? '💸' : '💳'} {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            { backgroundColor: transactionType === 'income' ? '#10B981' : '#EF4444' }
          ]} 
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            Add {transactionType === 'income' ? 'Income' : 'Expense'}
          </Text>
        </TouchableOpacity>

        {/* Voice Input Button */}
        <TouchableOpacity 
                      style={[
              styles.voiceButton,
              { 
                backgroundColor: !isVoiceAvailable ? '#9CA3AF' : isRecording ? '#EF4444' : '#8B5CF6',
                opacity: isProcessing ? 0.7 : 1
              }
            ]} 
            onPress={handleVoiceInput}
            disabled={isProcessing || !isVoiceAvailable}
        >
          <View style={styles.voiceButtonContent}>
                          <Text style={styles.voiceButtonIcon}>
                {!isVoiceAvailable ? '🚫' : isProcessing ? '🤖' : isRecording ? '⏹️' : '🎤'}
              </Text>
              <Text style={styles.voiceButtonText}>
                {!isVoiceAvailable ? 'Voice Unavailable' : isProcessing ? 'Processing...' : isRecording ? 'Stop Recording' : 'Voice Input'}
              </Text>
          </View>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.pulsingDot} />
            </View>
          )}
        </TouchableOpacity>

        {/* Voice Instructions */}
        <View style={styles.voiceInstructions}>
          <Text style={styles.instructionsTitle}>💡 Voice Input Tips</Text>
          <Text style={styles.instructionText}>
            Try saying: "I spent 25 rupees on lunch" or "Earned 5000 from freelance work"
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionButtons}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                setTransactionType('expense');
                setCategory('Food');
                setDescription('Lunch');
                setAmount('500');
              }}
            >
              <Text style={styles.quickActionEmoji}>🍕</Text>
              <Text style={styles.quickActionText}>Food</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                setTransactionType('expense');
                setCategory('Bills');
                setDescription('Utility bill');
                setAmount('2000');
              }}
            >
              <Text style={styles.quickActionEmoji}>📱</Text>
              <Text style={styles.quickActionText}>Bills</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => {
                setTransactionType('income');
                setCategory('Salary');
                setDescription('Monthly salary');
                setAmount('45000');
              }}
            >
              <Text style={styles.quickActionEmoji}>💰</Text>
              <Text style={styles.quickActionText}>Salary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  currencySymbol: {
    paddingLeft: 16,
    fontSize: 24,
    fontWeight: '600',
    color: '#6B7280',
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  quickAmountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAmountButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#111827',
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  voiceButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  voiceButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voiceButtonIcon: {
    fontSize: 24,
  },
  voiceButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pulsingDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  voiceInstructions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 