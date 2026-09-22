import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { apiService } from '@/services/api';
import { useAppContext } from '@/context/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await apiService.registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      // Auto login after registration
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* NÚT QUAY LẠI */}
        <Pressable style={styles.backToStoreBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="arrow-back" size={16} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.backToStoreText}>Về trang chủ xem sản phẩm</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)')}>
          <Text style={styles.title}>Đăng ký</Text>
        </Pressable>
        <Text style={styles.subtitle}>Tạo tài khoản mới tại DANGVINHPC</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          placeholder="Họ và tên *"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email *"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Số điện thoại"
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          placeholder="Mật khẩu *"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Xác nhận mật khẩu *"
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Pressable
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryText}>Tạo tài khoản</Text>
          )}
        </Pressable>

        {/* NÚT XEM KHÔNG CẦN ĐĂNG KÝ (GUEST BROWSE) */}
        <Pressable style={styles.guestButton} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="storefront-outline" size={18} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.guestButtonText}>Khám phá mua sắm không cần đăng ký</Text>
          <Ionicons name="arrow-forward" size={16} color="#2563eb" style={{ marginLeft: 4 }} />
        </Pressable>

        <View style={styles.row}>
          <Text style={styles.mutedText}>Đã có tài khoản?</Text>
          <Link href={'/login' as any} style={styles.linkText}>
            Đăng nhập
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  subtitle: { marginTop: 6, color: '#6b7280', fontSize: 14, marginBottom: 20 },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: { color: '#dc2626', fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 18, gap: 6 },
  mutedText: { color: '#6b7280' },
  linkText: { color: '#2563eb', fontWeight: '700' },
  backToStoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 14,
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
    marginTop: 10,
  },
  guestButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '800',
  },
});
