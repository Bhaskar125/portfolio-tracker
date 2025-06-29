import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.patternElement, styles.pattern1]} />
        <View style={[styles.patternElement, styles.pattern2]} />
        <View style={[styles.patternElement, styles.pattern3]} />
        <View style={[styles.patternElement, styles.pattern4]} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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

          {/* Buttons Section */}
          <View style={styles.buttonsSection}>
            {/* Quick Sign In Section (only for sign in mode) */}
            {!isSignUp && (
              <TouchableOpacity 
                style={styles.quickSignInButton}
                onPress={() => {
                  setEmail(TEST_USER.email);
                  setPassword(TEST_USER.password);
                  // Auto sign in after a short delay
                  setTimeout(() => {
                    handleLogin();
                  }, 500);
                }}
                disabled={isLoading}
              >
                <View style={styles.quickSignInContent}>
                  <Text style={styles.quickSignInIcon}>⚡</Text>
                  <Text style={styles.quickSignInText}>Quick Sign In with Demo</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Main Action Button */}
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
                    {isSignUp ? '🚀 Create Account' : '🔑 Sign In Now'}
                  </Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Alternative Sign In Button for emphasis */}
            {!isSignUp && !isLoading && (
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.secondaryButtonText}>
                  💻 Sign In to Dashboard
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer Section */}
          <View style={styles.footerSection}>
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
      </ScrollView>
    </KeyboardAvoidingView>
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
    width: width * 0.75,
    height: width * 0.75,
    top: -width * 0.375,
    right: -width * 0.375,
  },
  pattern2: {
    width: width * 0.5,
    height: width * 0.5,
    bottom: -width * 0.25,
    left: -width * 0.25,
  },
  pattern3: {
    width: width * 0.375,
    height: width * 0.375,
    top: height * 0.4,
    right: -width * 0.1875,
  },
  pattern4: {
    width: width * 0.3,
    height: width * 0.3,
    bottom: height * 0.3,
    left: -width * 0.15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: width * 0.06, // 6% of screen width
    paddingTop: height * 0.08, // 8% of screen height
    paddingBottom: height * 0.05, // 5% of screen height
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: height * 0.04, // 4% of screen height
  },
  logoContainer: {
    marginBottom: height * 0.025, // 2.5% of screen height
  },
  logoOuter: {
    width: width * 0.25, // 25% of screen width
    height: width * 0.25,
    borderRadius: width * 0.125,
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
    width: width * 0.1875, // 18.75% of screen width
    height: width * 0.1875,
    borderRadius: width * 0.09375,
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
    fontSize: Math.min(width * 0.09, 36), // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
  },
  appTitle: {
    fontSize: Math.min(width * 0.08, 32), // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: width * 0.05,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    borderRadius: Math.min(width * 0.08, 32), // Responsive border radius
    padding: width * 0.06, // 6% of screen width
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 15,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: height * 0.025, // 2.5% of screen height
  },
  cardTitle: {
    fontSize: Math.min(width * 0.07, 28), // Responsive font size
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: Math.min(width * 0.0375, 15), // Responsive font size
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: width * 0.02,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: Math.min(width * 0.05, 20),
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000000',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  demoIconContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
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
    fontSize: Math.min(width * 0.05, 20),
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  demoText: {
    fontSize: Math.min(width * 0.0325, 13),
    color: '#666666',
  },
  demoArrow: {
    fontSize: Math.min(width * 0.045, 18),
    color: '#000000',
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: height * 0.02,
  },
  inputGroup: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: Math.min(width * 0.04, 16),
    paddingHorizontal: width * 0.05,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIconContainer: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIcon: {
    fontSize: Math.min(width * 0.045, 18),
  },
  textInput: {
    flex: 1,
    fontSize: Math.min(width * 0.04, 16),
    color: '#000000',
    paddingVertical: height * 0.02,
  },
  passwordToggle: {
    padding: 8,
  },
  passwordToggleText: {
    fontSize: Math.min(width * 0.045, 18),
  },
  buttonsSection: {
    marginBottom: height * 0.02,
  },
  quickSignInButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: Math.min(width * 0.04, 16),
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06,
    marginBottom: height * 0.015,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  quickSignInContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSignInIcon: {
    fontSize: Math.min(width * 0.045, 18),
    marginRight: 10,
  },
  quickSignInText: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: '600',
    color: '#333333',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: Math.min(width * 0.04, 16),
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.08,
    marginBottom: height * 0.015,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonLoading: {
    backgroundColor: '#666666',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: Math.min(width * 0.04, 16),
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    marginBottom: height * 0.02,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: Math.min(width * 0.04, 16),
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
  },
  buttonArrow: {
    fontSize: Math.min(width * 0.045, 18),
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
    fontSize: Math.min(width * 0.04, 16),
    color: '#ffffff',
  },
  footerSection: {
    marginTop: height * 0.01,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: Math.min(width * 0.035, 14),
    color: '#999999',
    fontWeight: '500',
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: height * 0.02,
    marginBottom: height * 0.015,
  },
  switchText: {
    fontSize: Math.min(width * 0.0375, 15),
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: Math.min(width * 0.04, 16),
    padding: width * 0.05,
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
    fontSize: Math.min(width * 0.04, 16),
    marginRight: 8,
  },
  infoTitle: {
    fontSize: Math.min(width * 0.035, 14),
    fontWeight: '600',
    color: '#000000',
  },
  infoContent: {
    marginLeft: width * 0.06,
  },
  infoText: {
    fontSize: Math.min(width * 0.0325, 13),
    color: '#666666',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
}); 