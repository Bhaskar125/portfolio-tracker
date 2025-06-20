import { useTransactions } from '@/contexts/TransactionContext';
import { useVoiceTransaction } from '@/hooks/useVoiceTransaction';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface VoiceRecordingModalProps {
  visible: boolean;
  onClose: () => void;
}

interface VoiceTransaction {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  confidence: number;
}

const screenWidth = Dimensions.get('window').width;

export const VoiceRecordingModal: React.FC<VoiceRecordingModalProps> = ({
  visible,
  onClose,
}) => {
  const { startRecording, stopRecording, isRecording, isProcessing, recordingDuration, formatDuration } = useVoiceTransaction();
  const { addTransaction } = useTransactions();
  const [parsedTransaction, setParsedTransaction] = useState<VoiceTransaction | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Audio wave animations
  const [waveAnimations] = useState(() => 
    Array.from({ length: 5 }, () => new Animated.Value(0.3))
  );

  useEffect(() => {
    if (isRecording) {
      // Start wave animations
      const animations = waveAnimations.map((animation, index) => 
        Animated.loop(
          Animated.sequence([
            Animated.timing(animation, {
              toValue: 1,
              duration: 400 + index * 100,
              useNativeDriver: false,
            }),
            Animated.timing(animation, {
              toValue: 0.3,
              duration: 400 + index * 100,
              useNativeDriver: false,
            }),
          ])
        )
      );
      
      animations.forEach(animation => animation.start());
      
      return () => {
        animations.forEach(animation => animation.stop());
      };
    } else {
      // Reset wave animations
      waveAnimations.forEach(animation => animation.setValue(0.3));
    }
  }, [isRecording, waveAnimations]);

  useEffect(() => {
    if (visible && !isRecording && !isProcessing) {
      handleStartRecording();
    }
  }, [visible]);

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
      onClose();
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await stopRecording();
      
      if (result && result.confidence > 0.6) {
        setParsedTransaction(result);
        setShowConfirmation(true);
      } else if (result) {
        Alert.alert(
          'Low Confidence',
          `Voice input understood with ${Math.round(result.confidence * 100)}% confidence. Please try again or add manually.`,
          [
            { text: 'Try Again', onPress: () => handleStartRecording() },
            { text: 'Cancel', onPress: onClose }
          ]
        );
      } else {
        Alert.alert(
          'Recognition Failed',
          'Could not understand the voice input. Please try again.',
          [
            { text: 'Try Again', onPress: () => handleStartRecording() },
            { text: 'Cancel', onPress: onClose }
          ]
        );
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process recording');
      onClose();
    }
  };

  const handleConfirmTransaction = () => {
    if (parsedTransaction) {
      addTransaction({
        type: parsedTransaction.type,
        amount: parsedTransaction.amount,
        category: parsedTransaction.category,
        description: parsedTransaction.description,
        date: new Date().toISOString().split('T')[0],
      });
      
      Alert.alert('Success! 🎉', 'Transaction added successfully!');
      setShowConfirmation(false);
      setParsedTransaction(null);
      onClose();
    }
  };

  const handleEditTransaction = () => {
    setShowConfirmation(false);
    setParsedTransaction(null);
    onClose();
    // This would typically navigate to the add transaction screen with pre-filled data
    Alert.alert('Edit Transaction', 'This would open the add transaction screen with pre-filled data.');
  };

  const renderRecordingScreen = () => (
    <View style={styles.recordingContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Recording 🎤</Text>
        <Text style={styles.headerSubtitle}>
          {isProcessing ? 'Processing your voice...' : 'Speak your transaction clearly'}
        </Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatDuration}</Text>
      </View>

      {/* Audio Waves */}
      <View style={styles.waveContainer}>
        {waveAnimations.map((animation, index) => (
          <Animated.View
            key={index}
            style={[
              styles.wave,
              {
                height: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 60],
                }),
                opacity: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.4, 1],
                }),
              },
            ]}
          />
        ))}
      </View>

      {/* Status Text */}
      <View style={styles.statusContainer}>
        {isProcessing ? (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>🤖 Processing...</Text>
            <Text style={styles.processingSubtext}>Understanding your voice input</Text>
          </View>
        ) : isRecording ? (
          <View style={styles.recordingTextContainer}>
            <Text style={styles.recordingText}>🔴 Recording...</Text>
            <Text style={styles.recordingSubtext}>Say something like: &quot;I spent 250 rupees on lunch&quot;</Text>
          </View>
        ) : (
          <Text style={styles.statusText}>Tap to start recording</Text>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {isRecording ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.stopButton]}
            onPress={handleStopRecording}
            disabled={isProcessing}
          >
            <Text style={styles.controlButtonText}>⏹️ Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={handleStartRecording}
            disabled={isProcessing}
          >
            <Text style={styles.controlButtonText}>🎤 Start</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.controlButton, styles.cancelButton]}
          onPress={onClose}
          disabled={isProcessing}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConfirmationScreen = () => (
    <View style={styles.confirmationContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction Detected! 🎯</Text>
        <Text style={styles.headerSubtitle}>Please review and confirm</Text>
      </View>

      {parsedTransaction && (
        <View style={styles.transactionCard}>
          {/* Confidence Badge */}
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {Math.round(parsedTransaction.confidence * 100)}% confidence
            </Text>
          </View>

          {/* Transaction Type */}
          <View style={[
            styles.typeIndicator,
            { backgroundColor: parsedTransaction.type === 'income' ? '#10B981' : '#EF4444' }
          ]}>
            <Text style={styles.typeText}>
              {parsedTransaction.type === 'income' ? '💰 Income' : '💸 Expense'}
            </Text>
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={[
              styles.amountValue,
              { color: parsedTransaction.type === 'income' ? '#10B981' : '#EF4444' }
            ]}>
              ₹{parsedTransaction.amount.toLocaleString()}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{parsedTransaction.description}</Text>
          </View>

          {/* Category */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{parsedTransaction.category}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditTransaction}
        >
          <Text style={styles.editButtonText}>✏️ Edit Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={handleConfirmTransaction}
        >
          <Text style={styles.confirmButtonText}>✅ Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {showConfirmation ? renderConfirmationScreen() : renderRecordingScreen()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  recordingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  confirmationContainer: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'monospace',
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 32,
    gap: 4,
  },
  wave: {
    width: 6,
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 60,
    justifyContent: 'center',
  },
  processingContainer: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recordingTextContainer: {
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 4,
  },
  recordingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  controlsContainer: {
    width: '100%',
    gap: 12,
  },
  controlButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#3B82F6',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confidenceBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  typeIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  categoryTag: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#3730A3',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  confirmButton: {
    backgroundColor: '#10B981',
  },
  editButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
       confirmButtonText: {
       color: '#FFFFFF',
       fontSize: 16,
       fontWeight: '600',
     },
   });
