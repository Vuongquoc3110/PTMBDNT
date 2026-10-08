import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { apiService } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

export default function LoginScreen() {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const router = useRouter();

  const handleLogin = async (customEmail?: string, customPass?: string) => {
    const targetEmail = (customEmail ?? email).trim();
    const targetPass = (customPass ?? password).trim();

    if (!targetEmail || !targetPass) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(targetEmail, targetPass);
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
          router.replace('/admin' as any);
        } else if (loggedUser.role === 'staff') {
          router.replace('/staff' as any);
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* NÚT QUAY LẠI CỬA HÀNG */}
        <Pressable style={styles.backToStoreBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="arrow-back" size={16} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.backToStoreText}>Về trang chủ xem sản phẩm</Text>
        </Pressable>

        <Pressable style={styles.logoWrap} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.logo}>DANGVINHPC</Text>
        </Pressable>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào mừng bạn quay lại hệ thống</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
          <Ionicons name="mail-outline" size={18} color={emailFocused ? '#2563eb' : '#94a3b8'} style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={[styles.inputWrap, passwordFocused && styles.inputWrapFocused]}>
          <Ionicons name="lock-closed-outline" size={18} color={passwordFocused ? '#2563eb' : '#94a3b8'} style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <Pressable style={[styles.primaryButton, loading && styles.buttonDisabled]} onPress={() => handleLogin()} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryText}>Đăng nhập</Text>
          )}
        </Pressable>

        <View style={styles.row}>
          <Text style={styles.mutedText}>Chưa có tài khoản?</Text>
          <Link href={'/register' as any} style={styles.linkText}>
            Đăng ký
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8ff',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#dfeafc',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    color: '#2563eb',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 6, color: '#64748b', fontSize: 15, marginBottom: 20 },
  label: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 8,
  },
  inputWrapFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    outlineStyle: 'none',
    outlineWidth: 0,
    borderWidth: 0,
  } as any,
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, gap: 6 },
  mutedText: { color: '#64748b' },
  linkText: { color: '#2563eb', fontWeight: '700' },
  backToStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  backToStoreText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
  },
});
