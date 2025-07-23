import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { login } from '../apis/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [secure, setSecure] = useState(true);
     const [loading, setLoading] = useState(false);

     const handleLogin = async () => {
          setLoading(true);
          try {
            const data = await login(email, password);
               if (data.access_token) {
                    await AsyncStorage.setItem('token', data.access_token)

                    const token = await AsyncStorage.getItem('token')
                //  Alert.alert('Token đã lưu:', token || 'Không có token')
                 console.log(token)
                    navigation.navigate('Root')
               }
          } catch (e) {
               Alert.alert('Lỗi', 'Đăng nhập thất bại')
          }
          setLoading(false)
     }

     return (
          <KeyboardAvoidingView
               style={{ flex: 1, backgroundColor: '#fff' }}
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
               <StatusBar barStyle="light-content" backgroundColor="#ef4444" />
               <View style={styles.header}>
                    <MaterialCommunityIcons name="fire" size={32} color="#fff" />
                    <Text style={styles.logo}>StockIntel</Text>
               </View>
               <View style={styles.formCard}>
                    <Text style={styles.title}>Đăng nhập</Text>
                    <Text style={styles.subtitle}>Chào mừng bạn quay lại! Hãy đăng nhập để tiếp tục.</Text>
                    <View style={styles.inputGroup}>
                         <Ionicons name="mail-outline" size={20} color="#ef4444" style={styles.inputIcon} />
                         <TextInput
                              style={styles.input}
                              placeholder="Email"
                              placeholderTextColor="#bbb"
                              value={email}
                              onChangeText={setEmail}
                              autoCapitalize="none"
                              keyboardType="email-address"
                         />
                    </View>
                    <View style={styles.inputGroup}>
                         <Ionicons name="lock-closed-outline" size={20} color="#ef4444" style={styles.inputIcon} />
                         <TextInput
                              style={styles.input}
                              placeholder="Mật khẩu"
                              placeholderTextColor="#bbb"
                              value={password}
                              onChangeText={setPassword}
                              secureTextEntry={secure}
                         />
                         <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
                              <Ionicons name={secure ? "eye-off-outline" : "eye-outline"} size={20} color="#bbb" />
                         </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.forgotBtn}>
                         <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
                         {loading ? (
                              <ActivityIndicator color="#fff" />
                         ) : (
                              <Text style={styles.loginText}>Đăng nhập</Text>
                         )}
                    </TouchableOpacity>
                    <View style={styles.dividerRow}>
                         <View style={styles.divider} />
                         <Text style={styles.dividerText}>hoặc</Text>
                         <View style={styles.divider} />
                    </View>
                    <TouchableOpacity style={styles.socialBtn}>
                         <Ionicons name="logo-google" size={20} color="#ef4444" />
                         <Text style={styles.socialText}>Đăng nhập với Google</Text>
                    </TouchableOpacity>
                    <View style={styles.signupRow}>
                         <Text style={{ color: '#888' }}>Chưa có tài khoản?</Text>
                         <TouchableOpacity>
                              <Text style={styles.signupText}>Đăng ký</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          </KeyboardAvoidingView>
     );
}

const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#fff' },
     header: {
          backgroundColor: '#ef4444',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 60,
          paddingBottom: 36,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
     },
     logo: { color: '#fff', fontWeight: 'bold', fontSize: 26, marginLeft: 10, letterSpacing: 1 },
     formCard: {
          backgroundColor: '#fff',
          marginHorizontal: 18,
          marginTop: -48,
          borderRadius: 22,
          padding: 26,
          elevation: 4,
          shadowColor: '#ef4444',
          shadowOpacity: 0.09,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 4 },
     },
     title: { fontSize: 22, fontWeight: 'bold', color: '#ef4444', marginBottom: 6, textAlign: 'center' },
     subtitle: { color: '#888', fontSize: 14, marginBottom: 18, textAlign: 'center' },
     inputGroup: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f9fafb',
          borderRadius: 12,
          marginBottom: 14,
          paddingHorizontal: 12,
          borderWidth: 1,
          borderColor: '#f3f4f6',
     },
     inputIcon: { marginRight: 8 },
     input: { flex: 1, fontSize: 15, color: '#222', paddingVertical: 12 },
     eyeBtn: { padding: 4 },
     forgotBtn: { alignSelf: 'flex-end', marginBottom: 10 },
     forgotText: { color: '#ef4444', fontWeight: 'bold', fontSize: 13 },
     loginBtn: {
          backgroundColor: '#ef4444',
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 4,
          marginBottom: 8,
          elevation: 1,
          shadowColor: '#ef4444',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
     },
     loginText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
     dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
     divider: { flex: 1, height: 1, backgroundColor: '#f3f4f6' },
     dividerText: { marginHorizontal: 10, color: '#bbb', fontWeight: 'bold' },
     socialBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.2,
          borderColor: '#ef4444',
          borderRadius: 12,
          paddingVertical: 12,
          marginBottom: 8,
          backgroundColor: '#fff',
     },
     socialText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 8, fontSize: 15 },
     signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
     signupText: { color: '#ef4444', fontWeight: 'bold', marginLeft: 6, fontSize: 15 },
});