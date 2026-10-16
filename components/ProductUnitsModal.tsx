import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { apiService, type ProductUnit } from '@/services/api';

export function ProductUnitsModal({ product, codes, onClose, onSaved, isDark = false }: {
  product: { id: string; name: string } | null;
  codes?: string[];
  onClose: () => void;
  onSaved: () => void;
  isDark?: boolean;
}) {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  useEffect(() => {
    let active = true;
    if (!product) return;
    setLoading(true); setMessage(''); setQuery(''); setUnits([]);
    apiService.getProductUnits(product.id).then(data => {
      if (!active) return;
      setUnits(data);
      setDrafts(Object.fromEntries(data.map(unit => [unit.code, unit.manufacturerSerial || ''])));
    }).catch(error => { if (active) setMessage(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [product]);
  const save = async (unit: ProductUnit) => {
    setSaving(unit.code); setMessage('');
    try {
      await apiService.updateUnitSerial(unit.code, drafts[unit.code] || '');
      setUnits(prev => prev.map(row => row.code === unit.code ? { ...row, manufacturerSerial: drafts[unit.code].trim().toUpperCase() || null } : row));
      setMessage('Đã lưu serial trên tem máy.'); onSaved();
    } catch (error: any) { setMessage(error.message); }
    finally { setSaving(null); }
  };
  const color = isDark ? '#f8fafc' : '#0f172a';
  const statusLabels = { available: 'Trong kho', allocated: 'Đã gắn đơn hàng', removed: 'Đã xuất kho thủ công', retired: 'Đơn cũ đã hủy' };
  const filtered = units.filter(unit => (!codes || codes.includes(unit.code)) &&
    `${unit.code} ${unit.manufacturerSerial || ''} ${unit.orderId || ''}`.toLowerCase().includes(query.toLowerCase()));
  return <Modal visible={!!product} transparent animationType="fade" onRequestClose={onClose}>
    <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
      <View style={{ backgroundColor: isDark ? '#1e293b' : '#fff', borderRadius: 16, padding: 20, width: '100%', maxWidth: 800, maxHeight: '90%', gap: 12 }}>
        <Text style={{ color, fontSize: 20, fontWeight: '700' }}>Mã máy / Bảo hành</Text>
        <Text style={{ color }}>{product?.name}</Text>
        <Text style={{ color }}>Mỗi chiếc có một mã BH riêng. Nhập S/N hoặc IMEI thật trên tem máy để đối chiếu khi bảo hành. Với đơn cũ, cần đối chiếu máy thực tế trước khi dán mã.</Text>
        <TextInput accessibilityLabel="Tìm mã máy" placeholder="Tìm mã BH, serial hoặc mã đơn" placeholderTextColor="#64748b" value={query} onChangeText={setQuery} style={{ borderWidth: 1, borderColor: '#94a3b8', borderRadius: 8, padding: 10, color }} />
        {loading && <ActivityIndicator />}
        {!!message && <Text accessibilityRole="alert" style={{ color }}>{message}</Text>}
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          {!loading && !filtered.length && <Text style={{ color }}>Không có máy phù hợp.</Text>}
          {filtered.map(unit => <View key={unit.code} style={{ borderWidth: 1, borderColor: '#94a3b8', borderRadius: 10, padding: 12, gap: 8 }}>
            <Text selectable style={{ color, fontWeight: '700' }}>{unit.code}</Text>
            <Text style={{ color }}>{statusLabels[unit.status]}{unit.orderId ? ` • Đơn #${unit.orderId}` : ''}</Text>
            <TextInput accessibilityLabel={`Serial thực tế ${unit.code}`} placeholder="S/N hoặc IMEI thật trên tem máy" placeholderTextColor="#64748b" maxLength={100} value={drafts[unit.code] || ''} onChangeText={value => setDrafts(prev => ({ ...prev, [unit.code]: value }))} style={{ color, borderWidth: 1, borderColor: '#94a3b8', borderRadius: 8, padding: 10 }} />
            <Pressable disabled={!!saving} onPress={() => save(unit)} style={{ alignSelf: 'flex-start', backgroundColor: '#2563eb', padding: 10, borderRadius: 8, opacity: saving ? 0.5 : 1 }}>
              <Text style={{ color: '#fff' }}>{saving === unit.code ? 'Đang lưu...' : 'Lưu serial'}</Text>
            </Pressable>
          </View>)}
        </ScrollView>
        <Pressable disabled={!!saving} onPress={onClose} style={{ padding: 12, alignItems: 'center' }}><Text style={{ color }}>Đóng</Text></Pressable>
      </View>
    </View>
  </Modal>;
}
