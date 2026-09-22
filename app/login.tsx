import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { apiService } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

export default function LoginScreen() {
  const { login } = useAppContext();
  const [email, setEmail] = useState('nguyenvana@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);
      if (loggedUser) {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError('Email hoặc mật khẩu không đúng');
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
        <Text style={styles.subtitle}>Chào mừng bạn quay lại</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập mật khẩu"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94a3b8" />
          </Pressable>
        </View>

        <Pressable style={[styles.primaryButton, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryText}>Đăng nhập</Text>
          )}
        </Pressable>

        {/* NÚT XEM KHÔNG CẦN ĐĂNG NHẬP (GUEST BROWSE) */}
        <Pressable style={styles.guestButton} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="storefront-outline" size={18} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.guestButtonText}>Khám phá mua sắm không cần đăng nhập</Text>
          <Ionicons name="arrow-forward" size={16} color="#2563eb" style={{ marginLeft: 4 }} />
        </Pressable>

        <View style={styles.row}>
          <Text style={styles.mutedText}>Chưa có tài khoản?</Text>
          <Link href={'/register' as any} style={styles.linkText}>
            Đăng ký
          </Link>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>HOẶC</Text>
          <View style={styles.divider} />
        </View>

        <Pressable style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color="#ea4335" />
          <Text style={styles.socialText}>Đăng nhập với Google</Text>
        </Pressable>

        <View style={{ marginTop: 18, padding: 12, backgroundColor: '#f8fafc', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0' }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚡ Thử nghiệm phân quyền tài khoản
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={{ flex: 1, backgroundColor: '#eff6ff', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#bfdbfe' }}
              onPress={() => {
                setEmail('nguyenvana@gmail.com');
                setPassword('123456');
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#2563eb' }}>Khách hàng</Text>
              <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>nguyenvana@gmail.com</Text>
            </Pressable>

            <Pressable
              style={{ flex: 1, backgroundColor: '#fef2f2', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#fecaca' }}
              onPress={() => {
                setEmail('admin@promart.vn');
                setPassword('admin123');
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '800', color: '#dc2626' }}>Quản trị (Admin)</Text>
              <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>admin@promart.vn</Text>
            </Pressable>
          </View>
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
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
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  orText: { marginHorizontal: 12, color: '#94a3b8', fontWeight: '700', fontSize: 12 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  socialText: { color: '#0f172a', fontWeight: '700', fontSize: 15 },
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
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#bfdbfe',
    borderRadius: 12,
    paddingVertical: 13,
    marginTop: 12,
  },
  guestButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '800',
  },
});
