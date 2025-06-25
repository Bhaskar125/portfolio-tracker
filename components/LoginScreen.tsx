import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'John Doe'
};

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login } = useAuth();
  
  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill test user credentials for demo
  const fillTestUser = () => {
    setEmail(TEST_USER.email);
    setPassword(TEST_USER.password);
    setName(TEST_USER.name);
  };

  // Mock login function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !name) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check test user credentials
      if (email === TEST_USER.email && password === TEST_USER.password) {
        login({ email, name: TEST_USER.name });
      } else if (isSignUp && email && password && name) {
        // For sign up, accept any valid inputs
        login({ email, name });
      } else {
        Alert.alert('Error', 'Invalid credentials. Use test@example.com / password123 or sign up with new details.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.patternElement, styles.pattern1]} />
        <View style={[styles.patternElement, styles.pattern2]} />
        <View style={[styles.patternElement, styles.pattern3]} />
        <View style={[styles.patternElement, styles.pattern4]} />
      </View>

      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Text style={styles.logoIcon}>₹</Text>
              </View>
            </View>
          </View>
          <Text style={styles.appTitle}>Portfolio Tracker</Text>
          <Text style={styles.appSubtitle}>
            {isSignUp ? 'Create your financial account' : 'Welcome back to your finances'}
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isSignUp 
                ? 'Join thousands managing their money' 
                : 'Access your financial dashboard'
              }
            </Text>
          </View>

          {/* Quick Demo Card */}
          {!isSignUp && (
            <TouchableOpacity style={styles.demoCard} onPress={fillTestUser}>
              <View style={styles.demoIconContainer}>
                <Text style={styles.demoIcon}>⚡</Text>
              </View>
              <View style={styles.demoContent}>
                <Text style={styles.demoTitle}>Quick Demo Access</Text>
                <Text style={styles.demoText}>Try with test credentials</Text>
              </View>
              <Text style={styles.demoArrow}>→</Text>
            </TouchableOpacity>
          )}

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Name Input for Sign Up */}
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>✉️</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999999"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconContainer}>
                  <Text style={styles.inputIcon}>🔐</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999999"
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.passwordToggleText}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={[styles.primaryButton, isLoading && styles.primaryButtonLoading]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingDot}>⚫</Text>
                <Text style={styles.loadingText}>Authenticating...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Text>
                <Text style={styles.buttonArrow}>→</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Mode Switch */}
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => {
              setIsSignUp(!isSignUp);
              setEmail('');
              setPassword('');
              setName('');
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Create one"
              }
            </Text>
          </TouchableOpacity>

          {/* Demo Info */}
          {!isSignUp && (
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoIcon}>🔬</Text>
                <Text style={styles.infoTitle}>Demo Credentials</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>Email: test@example.com</Text>
                <Text style={styles.infoText}>Password: password123</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternElement: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#ffffff',
    opacity: 0.03,
  },
  pattern1: {
    width: 300,
    height: 300,
    top: -150,
    right: -150,
  },
  pattern2: {
    width: 200,
    height: 200,
    bottom: -100,
    left: -100,
  },
  pattern3: {
    width: 150,
    height: 150,
    top: '40%',
    right: -75,
  },
  pattern4: {
    width: 120,
    height: 120,
    bottom: '30%',
    left: -60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  logoInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  demoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  demoIcon: {
    fontSize: 20,
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  demoText: {
    fontSize: 13,
    color: '#666666',
  },
  demoArrow: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIcon: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  passwordToggleText: {
    fontSize: 18,
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonLoading: {
    backgroundColor: '#666666',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
  },
  buttonArrow: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    fontSize: 8,
    color: '#ffffff',
    marginRight: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  switchText: {
    fontSize: 15,
    color: '#000000',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  infoContent: {
    marginLeft: 24,
  },
  infoText: {
    fontSize: 13,
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
}); 