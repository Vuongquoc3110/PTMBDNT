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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chỉ cho phép nhập đúng số và tối đa 10 ký tự cho số điện thoại VN
  const handlePhoneChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhone(numericText);
    if (error) setError('');
  };

  const handleRegister = async () => {
    setError('');

    // 1. Kiểm tra họ và tên
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (name.trim().length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự');
      return;
    }

    // 2. Kiểm tra email
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Địa chỉ email không đúng định dạng (VD: example@gmail.com)');
      return;
    }

    // 3. Kiểm tra số điện thoại Việt Nam chuẩn (10 chữ số, đầu 03, 05, 07, 08, 09)
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      setError('Số điện thoại không hợp lệ (phải gồm 10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09)');
      return;
    }

    // 4. Kiểm tra mật khẩu
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có độ dài tối thiểu 6 ký tự');
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
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      // Auto login sau khi tạo tài khoản thành công
      await login(email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Đăng ký không thành công, email hoặc số điện thoại có thể đã tồn tại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <Pressable style={styles.backToStoreBtn} onPress={() => router.push('/(tabs)')}>
          <Ionicons name="arrow-back" size={16} color="#2563eb" style={{ marginRight: 6 }} />
          <Text style={styles.backToStoreText}>Về trang chủ xem sản phẩm</Text>
        </Pressable>

        <Pressable style={styles.logoWrap} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.logo}>DANGVINHPC</Text>
        </Pressable>

        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới tại DANGVINHPC</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#dc2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* FIELD 1: HỌ VÀ TÊN */}
        <Text style={styles.label}>Họ và tên *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập họ và tên đầy đủ"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={name}
            onChangeText={(val) => {
              setName(val);
              if (error) setError('');
            }}
          />
        </View>

        {/* FIELD 2: EMAIL */}
        <Text style={styles.label}>Email *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập địa chỉ email"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              if (error) setError('');
            }}
          />
        </View>

        {/* FIELD 3: SỐ ĐIỆN THOẠI (CHUẨN 10 SỐ) */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <Text style={styles.phoneCounter}>{phone.length}/10 số</Text>
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Số điện thoại di động (10 chữ số)"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={handlePhoneChange}
          />
          {phone.length === 10 && /^(0[3|5|7|8|9])[0-9]{8}$/.test(phone) && (
            <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
          )}
        </View>

        {/* FIELD 4: MẬT KHẨU */}
        <Text style={styles.label}>Mật khẩu *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Tối thiểu 6 ký tự"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (error) setError('');
            }}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* FIELD 5: XÁC NHẬN MẬT KHẨU */}
        <Text style={styles.label}>Xác nhận mật khẩu *</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={(val) => {
              setConfirmPassword(val);
              if (error) setError('');
            }}
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={8}>
            <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94a3b8" />
          </Pressable>
        </View>

        {/* NÚT TẠO TÀI KHOẢN */}
        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.primaryText}>Tạo tài khoản</Text>
          )}
        </Pressable>

        {/* LIÊN KẾT ĐĂNG NHẬP */}
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
    backgroundColor: '#f4f8ff',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#dfeafc',
  },
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
  logoWrap: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: {
    color: '#2563eb',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 14,
    marginBottom: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  phoneCounter: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#f8fafc',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    outlineStyle: 'none',
    outlineWidth: 0,
    borderWidth: 0,
  } as any,
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    gap: 6,
  },
  mutedText: {
    color: '#64748b',
    fontSize: 14,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
});
