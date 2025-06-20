import { Audio } from 'expo-av';
import { useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface VoiceTransaction {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  confidence: number;
}

export const useVoiceTransaction = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingTimer = useRef<number | null>(null);

  // Enhanced category mapping with more keywords
  const categoryMap = {
    'Food': [
      'food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'coffee', 'snack', 
      'meal', 'eating', 'cafe', 'pizza', 'burger', 'sandwich', 'drink', 'tea',
      'grocery', 'groceries', 'supermarket', 'kitchen', 'cooking', 'recipe'
    ],
    'Travel': [
      'travel', 'uber', 'taxi', 'bus', 'train', 'flight', 'petrol', 'gas',
      'car', 'vehicle', 'transport', 'metro', 'auto', 'rickshaw', 'ola',
      'fuel', 'trip', 'journey', 'commute', 'ticket'
    ],
    'Bills': [
      'bill', 'electricity', 'water', 'internet', 'phone', 'rent', 'wifi',
      'mobile', 'landline', 'cable', 'insurance', 'loan', 'emi', 'payment',
      'utility', 'gas', 'maintenance', 'society'
    ],
    'Shopping': [
      'shopping', 'clothes', 'amazon', 'store', 'purchase', 'buy', 'bought',
      'dress', 'shirt', 'shoes', 'accessories', 'online', 'flipkart', 'mall',
      'clothing', 'fashion', 'gadget', 'electronics'
    ],
    'Entertainment': [
      'movie', 'entertainment', 'games', 'music', 'netflix', 'youtube', 'spotify',
      'cinema', 'theatre', 'concert', 'show', 'party', 'fun', 'gaming',
      'subscription', 'streaming', 'book'
    ],
    'Healthcare': [
      'doctor', 'medicine', 'hospital', 'health', 'medical', 'pharmacy',
      'checkup', 'treatment', 'clinic', 'dentist', 'surgery', 'prescription',
      'therapy', 'consultation', 'lab', 'test'
    ],
    'Salary': ['salary', 'paycheck', 'wages', 'income', 'job', 'work', 'office'],
    'Freelance': ['freelance', 'client', 'project', 'contract', 'gig', 'side', 'hustle'],
    'Investment': ['investment', 'stock', 'mutual', 'fund', 'dividend', 'interest', 'profit'],
    'Refund': ['refund', 'return', 'cashback', 'reimbursement']
  };

  // Enhanced parsing with better number recognition
  const parseVoiceToTransaction = (text: string): VoiceTransaction | null => {
    const lowerText = text.toLowerCase().trim();
    console.log('🎤 Parsing voice input:', text);
    
    // Enhanced amount extraction patterns for Indian context
    const amountPatterns = [
      /(?:spent|paid|cost|earned|received|got|made)\s+(?:me\s+)?(?:about\s+)?(?:around\s+)?(\d+(?:,?\d{3})*(?:\.\d{1,2})?)\s*(?:rupees?|₹|rs\.?)/i,
      /(\d+(?:,?\d{3})*(?:\.\d{1,2})?)\s*(?:rupees?|₹|rs\.?)/i,
      /(?:rupees?|₹|rs\.?)\s*(\d+(?:,?\d{3})*(?:\.\d{1,2})?)/i,
      /(?:for|of|about|around)\s+(\d+(?:,?\d{3})*(?:\.\d{1,2})?)/i,
      /(\d+(?:,?\d{3})*(?:\.\d{1,2})?)\s*(?:bucks?|paisa)/i,
    ];
    
    let amount = 0;
    for (const pattern of amountPatterns) {
      const match = lowerText.match(pattern);
      if (match && match[1]) {
        try {
          amount = parseFloat(match[1].replace(/,/g, ''));
          if (amount > 0) break;
        } catch (error) {
          console.log('🎤 Error parsing amount:', error);
          continue;
        }
      }
    }
    
    if (!amount || amount <= 0) {
      console.log('🎤 No valid amount found');
      return null;
    }

    // Enhanced transaction type detection
    const expenseKeywords = [
      'spent', 'paid', 'bought', 'cost', 'expense', 'bill', 'purchase',
      'spend', 'pay', 'buy', 'shopping', 'ordered', 'charged'
    ];
    const incomeKeywords = [
      'earned', 'received', 'got', 'income', 'salary', 'freelance',
      'earn', 'receive', 'get', 'made', 'profit', 'bonus', 'commission'
    ];
    
    let type: 'income' | 'expense' = 'expense'; // Default to expense
    let confidence = 0.6; // Base confidence
    
    // Check for income indicators
    if (incomeKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'income';
      confidence += 0.1;
    } else if (expenseKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'expense';
      confidence += 0.1;
    }
    
    // Enhanced category detection with scoring
    let category = 'Other';
    let bestScore = 0;
    
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      const score = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (score > bestScore) {
        bestScore = score;
        category = cat;
        confidence += score * 0.05; // Increase confidence based on keyword matches
      }
    }
    
    // Extract and clean description
    let description = text ? text.trim() : '';
    
    try {
      // Remove amount and currency from description
      description = description.replace(/\d+(?:,\d{3})*(?:\.\d{1,2})?\s*(?:rupees?|₹|rs\.?|dollars?|\$|bucks?|paisa)/gi, '');
      
      // Remove transaction type words
      const allTransactionWords = [...expenseKeywords, ...incomeKeywords, 'on', 'for', 'from', 'to', 'at', 'in'];
      allTransactionWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        description = description.replace(regex, '');
      });
      
      // Clean up description
      description = description
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/[.,!?]+$/, '') // Remove trailing punctuation
        .trim();
    } catch (error) {
      console.log('🎤 Error cleaning description:', error);
      description = text || '';
    }
    
    // Generate fallback description if empty
    if (!description || description.length < 3) {
      description = type === 'income' 
        ? `${category} income` 
        : `${category} expense`;
    }
    
    // Ensure confidence doesn't exceed 1.0
    confidence = Math.min(confidence, 0.95);
    
    const result = {
      type,
      amount,
      description,
      category,
      confidence
    };
    
    console.log('🎤 Parsed result:', result);
    return result;
  };

  // Enhanced simulation with more realistic examples
  const simulateVoiceInput = (): Promise<VoiceTransaction | null> => {
    return new Promise((resolve) => {
      const examples = [
        {
          text: 'I spent 250 rupees on lunch',
          result: { type: 'expense' as const, amount: 250, description: 'Lunch', category: 'Food', confidence: 0.95 }
        },
        {
          text: 'Earned 5000 from freelance project',
          result: { type: 'income' as const, amount: 5000, description: 'Freelance project', category: 'Freelance', confidence: 0.92 }
        },
        {
          text: 'Paid 1500 for phone bill',
          result: { type: 'expense' as const, amount: 1500, description: 'Phone bill payment', category: 'Bills', confidence: 0.88 }
        },
        {
          text: 'Bought groceries for 800 rupees',
          result: { type: 'expense' as const, amount: 800, description: 'Groceries', category: 'Food', confidence: 0.90 }
        },
        {
          text: 'Received salary of 45000',
          result: { type: 'income' as const, amount: 45000, description: 'Salary', category: 'Salary', confidence: 0.94 }
        }
      ];

      Alert.alert(
        'Voice Input Simulation 🎤',
        'Select a sample voice command to test the parsing:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null)
          },
          ...examples.map((example, index) => ({
            text: `${example.text}`,
            onPress: () => {
              // Simulate the parsing process
              const parsed = parseVoiceToTransaction(example.text);
              resolve(parsed);
            }
          }))
        ],
        { cancelable: true }
      );
    });
  };

  const requestPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      console.log('🎤 Permission status:', permission.status);
      
      if (permission.status !== 'granted') {
        Alert.alert(
          'Microphone Permission Required',
          'To use voice input, please enable microphone permissions in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Would open settings') }
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  };

  const startTimer = () => {
    setRecordingDuration(0);
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
    setRecordingDuration(0);
  };

  const startRecording = async () => {
    try {
      console.log('🎤 Starting voice input...');
      
      // Check if we should use simulation mode
      if (Platform.OS === 'web') {
        console.log('🎤 Using voice simulation mode (web platform)');
        setIsRecording(true);
        startTimer();
        return;
      }
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        // Fall back to simulation
        setIsRecording(true);
        startTimer();
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('🎤 Creating recording...');
      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      });
      
      setRecording(recording);
      setIsRecording(true);
      startTimer();
      console.log('🎤 Recording started successfully!');
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert(
        'Using Voice Simulation', 
        'Real voice recording is not available. Switching to simulation mode for testing.'
      );
      
      // Fall back to simulation mode
      setIsRecording(true);
      startTimer();
    }
  };

  const stopRecording = async (): Promise<VoiceTransaction | null> => {
    try {
      setIsRecording(false);
      stopTimer();
      setIsProcessing(true);

      if (!recording && Platform.OS === 'web') {
        // We're in simulation mode
        console.log('🎤 Processing simulated voice input...');
        const result = await simulateVoiceInput();
        setIsProcessing(false);
        return result;
      }

      if (!recording) {
        setIsProcessing(false);
        return null;
      }

      console.log('🎤 Stopping recording...');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('🎤 Recording stopped. File:', uri);

      // In a real app, you would send this audio to a speech-to-text service
      // For now, we'll simulate the processing with more realistic examples
      const simulatedTexts = [
        "I spent 250 rupees on lunch today",
        "Paid 1500 for electricity bill",
        "Earned 5000 from freelance project",
        "Bought groceries for 800 rupees",
        "Received salary of 45000 rupees"
      ];
      
      const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)];
      const transaction = parseVoiceToTransaction(randomText);

      setRecording(null);
      setIsProcessing(false);
      
      return transaction;
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      stopTimer();
      setIsProcessing(false);
      setRecording(null);
      return null;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    recordingDuration,
    formatDuration: formatDuration(recordingDuration),
    isVoiceAvailable: Platform.OS !== 'web'
  };
}; 