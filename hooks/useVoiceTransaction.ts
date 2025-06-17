import { Audio } from 'expo-av';
import { useState } from 'react';
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

  // Check if we're in a simulator or if voice input is actually available
  const isVoiceAvailable = () => {
    // In web or if we detect simulator environment, voice input won't work properly
    if (Platform.OS === 'web') return false;
    
    // For now, we'll assume it's available on real devices
    // In a production app, you'd do more sophisticated detection
    return true;
  };

  const simulateVoiceInput = (): Promise<VoiceTransaction | null> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Voice Input Simulation 🎤',
        'Since this is a simulator/web environment, please select a sample voice command:',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null)
          },
          {
            text: '🍕 "Spent 250 rupees on lunch"',
            onPress: () => resolve({
              type: 'expense',
              amount: 250,
              description: 'Lunch',
              category: 'Food',
              confidence: 0.95
            })
          },
          {
            text: '💰 "Earned 5000 from freelance"',
            onPress: () => resolve({
              type: 'income',
              amount: 5000,
              description: 'Freelance work',
              category: 'Freelance',
              confidence: 0.92
            })
          },
          {
            text: '📱 "Paid 1500 for phone bill"',
            onPress: () => resolve({
              type: 'expense',
              amount: 1500,
              description: 'Phone bill payment',
              category: 'Bills',
              confidence: 0.88
            })
          }
        ],
        { cancelable: true }
      );
    });
  };

  const parseVoiceToTransaction = (text: string): VoiceTransaction | null => {
    const lowerText = text.toLowerCase();
    
    // Extract amount
    const amountMatch = lowerText.match(/(\d+(?:\.\d{1,2})?)\s*(?:rupees?|₹|dollars?|\$)?/);
    if (!amountMatch) return null;
    
    const amount = parseFloat(amountMatch[1]);
    
    // Determine transaction type
    const expenseKeywords = ['spent', 'paid', 'bought', 'cost', 'expense', 'bill'];
    const incomeKeywords = ['earned', 'received', 'got', 'income', 'salary', 'freelance'];
    
    let type: 'income' | 'expense' = 'expense';
    if (incomeKeywords.some(keyword => lowerText.includes(keyword))) {
      type = 'income';
    }
    
    // Extract category
    const categoryMap = {
      'Food': ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'coffee', 'snack'],
      'Travel': ['travel', 'uber', 'taxi', 'bus', 'train', 'flight', 'petrol', 'gas'],
      'Bills': ['bill', 'electricity', 'water', 'internet', 'phone', 'rent'],
      'Shopping': ['shopping', 'clothes', 'amazon', 'store', 'purchase'],
      'Entertainment': ['movie', 'entertainment', 'games', 'music', 'netflix'],
      'Healthcare': ['doctor', 'medicine', 'hospital', 'health', 'medical'],
      'Salary': ['salary', 'paycheck', 'wages'],
      'Freelance': ['freelance', 'client', 'project', 'contract']
    };
    
    let category = 'Other';
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    // Extract description
    let description = text.trim();
    // Remove amount and currency from description
    description = description.replace(/\d+(?:\.\d{1,2})?\s*(?:rupees?|₹|dollars?|\$)?/gi, '').trim();
    // Remove common transaction words
    description = description.replace(/\b(spent|paid|bought|earned|received|got|on|for|from)\b/gi, '').trim();
    
    if (!description) {
      description = `${type} for ${category}`;
    }
    
    return {
      type,
      amount,
      description,
      category,
      confidence: 0.8 // Mock confidence for real voice input
    };
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
            { text: 'Open Settings', onPress: () => {
              // On a real device, this would open settings
              console.log('Would open device settings');
            }}
          ]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      Alert.alert(
        'Voice Input Not Available',
        'Voice input is not supported on this device or simulator. Using simulation mode instead.'
      );
      return false;
    }
  };

  const startRecording = async () => {
    try {
      console.log('🎤 Starting voice input...');
      
      // Check if we should use simulation mode
      if (!isVoiceAvailable()) {
        console.log('🎤 Using voice simulation mode');
        setIsRecording(true);
        setTimeout(() => {
          // Auto-stop recording after 3 seconds in simulation mode
          stopRecording();
        }, 3000);
        return;
      }
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        // Fall back to simulation
        setIsRecording(true);
        setTimeout(() => stopRecording(), 3000);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('🎤 Creating recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      console.log('🎤 Recording started successfully!');
      
      Alert.alert(
        'Recording Started! 🎤',
        'Speak your transaction now. Example: "I spent 25 rupees on lunch"',
        [{ text: 'OK' }]
      );
      
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert(
        'Using Voice Simulation', 
        'Real voice recording is not available. Switching to simulation mode for testing.'
      );
      
      // Fall back to simulation mode
      setIsRecording(true);
      setTimeout(() => stopRecording(), 3000);
    }
  };

  const stopRecording = async (): Promise<VoiceTransaction | null> => {
    try {
      setIsRecording(false);
      setIsProcessing(true);

      if (!recording && !isVoiceAvailable()) {
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
      // For now, we'll simulate the processing
      const simulatedText = "I spent 500 rupees on lunch";
      const transaction = parseVoiceToTransaction(simulatedText);

      setRecording(null);
      setIsProcessing(false);
      
      return transaction;
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      setIsProcessing(false);
      setRecording(null);
      return null;
    }
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    isVoiceAvailable: isVoiceAvailable()
  };
}; 