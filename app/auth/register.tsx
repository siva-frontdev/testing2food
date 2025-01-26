import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db, persistAuth } from '@/config/firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '@/config/firebase';
import { validateEmail, validatePhone, validatePassword } from '@/utils/validation';
import { StatusBar } from 'expo-status-bar';

export default function CustomerRegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const recaptchaVerifier = useRef(null);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
    };

    if (!fullName || fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
      isValid = false;
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with numbers and letters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'customers', userCredential.user.uid), {
        fullName,
        email,
        phone,
        createdAt: new Date().toISOString(),
        type: 'customer'
      });

      await persistAuth(userCredential.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient 
        colors={['#FF416C', '#FF4B2B']}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.appName}>FoodieHub</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
              />
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/auth/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
          />
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: '#FF416C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#4CAF50',
    fontSize: 16,
  },
}); 