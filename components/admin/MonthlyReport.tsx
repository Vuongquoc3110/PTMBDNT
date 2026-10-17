import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiService } from '@/services/api';
import { formatPrice } from '@/data/products';

type Row = { productId: string; name: string; category: string; sold: number; salesAmount: number; opening: number | null; openingSource?: string; incoming: number; outgoing: number; closing: number | null };
type Report = { month: string; totalOrders: number; orderCount: number; sold: number; salesAmount: number; rows: Row[]; asOf: string };
const bangkokMonth = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit' }).format(new Date());

export function MonthlyReport() {
  const [month, setMonth] = useState(bangkokMonth);
  const [periodPicker, setPeriodPicker] = useState<'month' | 'year' | null>(null);
  const [openingQuantity, setOpeningQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    let active = true;
    setReport(null);
    setDrafts({});
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) { setError('Nhập tháng dạng YYYY-MM, ví dụ 2026-10'); setLoading(false); return; }
    setLoading(true); setError('');
    apiService.request<Report>(`/admin/monthly-report?month=${month}`)
      .then(data => { if (active) setReport(data); })
      .catch(e => { if (active) setError(e.message || 'Không tải được báo cáo'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [month, refresh]);
  const shiftMonth = (delta: number) => {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return;
    const [year, value] = month.split('-').map(Number);
    const date = new Date(Date.UTC(year, value - 1 + delta, 1));
    setMonth(date.toISOString().slice(0, 7));
  };
  const rows = report?.rows.filter(r => `${r.name} ${r.productId} ${r.category}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi'))) || [];
  const categories = new Map<string, number>();
  const saveOpenings = async (entries: { productId: string; quantity: number }[]) => {
    if (!entries.length || entries.some(e => !Number.isInteger(e.quantity) || e.quantity < 0)) { setError('Nhập tồn đầu là số nguyên không âm'); return; }
    setSaving(true); setError('');
    try {
      await apiService.request('/admin/monthly-openings', { method: 'PUT', body: JSON.stringify({ month, entries }) });
      setRefresh(v => v + 1);
    } catch (e: any) { setError(e.message || 'Không lưu được tồn đầu'); }
    finally { setSaving(false); }
  };
  for (const row of report?.rows || []) if (row.sold) categories.set(row.category, (categories.get(row.category) || 0) + row.sold);
  return <View style={s.card}>
    <Text style={s.title}>Báo cáo bán hàng & tồn kho theo tháng</Text>
    <View style={s.toolbar}>
      <Pressable accessibilityRole="button" accessibilityLabel="Tháng trước" style={s.button} onPress={() => shiftMonth(-1)}><Text>←</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Chọn tháng báo cáo" style={s.button} onPress={() => setPeriodPicker('month')}><Text>Tháng {Number(month.slice(5))} ▾</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Chọn năm báo cáo" style={s.button} onPress={() => setPeriodPicker('year')}><Text>Năm {month.slice(0, 4)} ▾</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Tháng sau" style={s.button} onPress={() => shiftMonth(1)}><Text>→</Text></Pressable>
      <Pressable accessibilityRole="button" style={s.button} onPress={() => setRefresh(v => v + 1)}><Text>Làm mới báo cáo</Text></Pressable>
    </View>
    <Text style={s.note}>Số bán tính theo ngày đặt của đơn đã hoàn thành, loại đơn hủy và trả hàng được duyệt. Tiền hàng theo giá bán, chưa trừ voucher và không gồm phí giao hàng.</Text>
    <Text style={s.note}>Tồn đầu có thể nhập theo kiểm kê từng tháng. Số nhập không thay đổi tồn kho hiện tại. Nhập / xuất trước thời điểm lưu lịch sử chưa đầy đủ; tồn đầu cộng nhập trừ xuất có thể chưa khớp tồn cuối. “—” là thiếu dữ liệu.</Text>
    {loading && <ActivityIndicator color="#2563eb" />}
    {!!error && <Text accessibilityRole="alert" style={{ color: '#dc2626' }}>{error}</Text>}
    {report && <>
      <View style={s.toolbar}>
        {[['Tổng đơn trong tháng', report.totalOrders ?? report.orderCount], ['Đơn hoàn thành', report.orderCount], ['Sản phẩm bán được', report.sold], ['Tiền hàng đã bán', formatPrice(report.salesAmount)]].map(([label, value]) => <View style={s.kpi} key={label}><Text style={s.note}>{label}</Text><Text style={s.summary}>{value}</Text></View>)}
      </View>
      <Text style={s.note}>Chốt tồn đến {report.asOf} (GMT+7). Với kỳ thiếu tồn đầu, nhập / xuất chỉ gồm phần lịch sử đã ghi nhận.</Text>
      <View style={s.toolbar}>{[...categories].map(([name, count]) => <View style={s.chip} key={name}><Text>{name}: {count} sản phẩm</Text></View>)}</View>
      <TextInput accessibilityLabel="Tìm sản phẩm hoặc danh mục trong báo cáo" style={[s.input, { width: '100%' }]} value={search} onChangeText={setSearch} placeholder="Tìm tên sản phẩm, mã hoặc danh mục..." />
      <View style={s.toolbar}>
        <TextInput accessibilityLabel="Tồn đầu áp dụng cho các sản phẩm đang hiển thị" style={s.input} value={openingQuantity} onChangeText={setOpeningQuantity} keyboardType="number-pad" placeholder="Tồn đầu" />
        <Pressable accessibilityRole="button" disabled={saving || !openingQuantity.trim() || !rows.length} style={s.button} onPress={() => saveOpenings(rows.map(r => ({ productId: r.productId, quantity: Number(openingQuantity) })))}><Text>{saving ? 'Đang lưu...' : `Lưu tồn đầu ${month} cho ${rows.length} sản phẩm đang hiển thị`}</Text></Pressable>
      </View>
      <Text style={s.note}>Có thể sửa riêng từng sản phẩm ở cột Tồn đầu rồi bấm Lưu. Tiền hàng 0 ₫ nghĩa là chưa có đơn hoàn thành của sản phẩm trong tháng.</Text>
      <ScrollView horizontal>
        <View>
          <View style={[s.row, s.head]}>{['Sản phẩm / Mã', 'Danh mục', 'Đã bán', 'Tiền hàng', 'Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối'].map((label, i) => <Text key={label} style={[s.cell, i === 0 ? s.name : i === 1 ? s.category : null, { fontWeight: '700' }]}>{label}</Text>)}</View>
          {rows.map(row => <View key={row.productId} style={s.row}>
            <View style={[s.cell, s.name]}><Text style={{ fontWeight: '600', color: '#0f172a' }}>{row.name}</Text><Text style={s.note}>{row.productId}</Text></View>
            <Text style={[s.cell, s.category]}>{row.category}</Text>
            <Text style={s.cell}>{row.sold}</Text>
            <Text style={s.cell}>{formatPrice(row.salesAmount)}</Text>
            <View style={s.cell}>
              <TextInput accessibilityLabel={`Tồn đầu ${row.name}`} style={{ borderWidth: 1, borderColor: '#cbd5e1', padding: 6, borderRadius: 6, minHeight: 40 }} keyboardType="number-pad" value={drafts[row.productId] ?? (row.opening === null ? '' : String(row.opening))} placeholder="—" onChangeText={value => setDrafts(d => ({ ...d, [row.productId]: value }))} />
              {drafts[row.productId] !== undefined && <Pressable accessibilityRole="button" disabled={saving || !drafts[row.productId].trim()} onPress={() => saveOpenings([{ productId: row.productId, quantity: Number(drafts[row.productId]) }])}><Text style={{ color: '#2563eb', paddingVertical: 8 }}>Lưu</Text></Pressable>}
              {row.openingSource === 'manual' && <Text style={s.note}>Đã nhập</Text>}
            </View>
            {[row.incoming, row.outgoing, row.closing ?? '—'].map((value, i) => <Text key={i} style={s.cell}>{value}</Text>)}
          </View>)}
        </View>
      </ScrollView>
      {!rows.length && <Text style={s.note}>Không có sản phẩm phù hợp.</Text>}
    </>}
    <Modal visible={periodPicker !== null} transparent animationType="fade" onRequestClose={() => setPeriodPicker(null)}>
      <View style={s.backdrop}>
        <View style={s.picker}>
          <Text style={s.title}>{periodPicker === 'month' ? 'Chọn tháng báo cáo' : 'Chọn năm báo cáo'}</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {(periodPicker === 'month' ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: Number(bangkokMonth().slice(0, 4)) - 1999 }, (_, i) => Number(bangkokMonth().slice(0, 4)) - i)).map(value => {
              const selected = periodPicker === 'month' ? Number(month.slice(5)) === value : Number(month.slice(0, 4)) === value;
              return <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected }} style={[s.pickerOption, selected && { backgroundColor: '#dbeafe' }]} onPress={() => {
                setMonth(periodPicker === 'month' ? `${month.slice(0, 4)}-${String(value).padStart(2, '0')}` : `${value}-${month.slice(5)}`);
                setPeriodPicker(null);
              }}><Text>{periodPicker === 'month' ? `Tháng ${value}` : `Năm ${value}`}{selected ? ' ✓' : ''}</Text></Pressable>;
            })}
          </ScrollView>
          <Pressable accessibilityRole="button" style={s.button} onPress={() => setPeriodPicker(null)}><Text>Đóng</Text></Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}
const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#dbe4f0', padding: 20, gap: 12, marginBottom: 24 },
  title: { fontSize: 21, fontWeight: '800', color: '#0f172a' },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, minHeight: 44, width: 120, color: '#0f172a' },
  button: { padding: 12, minHeight: 44, borderRadius: 8, backgroundColor: '#eff6ff' },
  note: { fontSize: 12, color: '#64748b', lineHeight: 19 },
  summary: { fontSize: 17, fontWeight: '700', color: '#2563eb' },
  chip: { padding: 8, borderRadius: 8, backgroundColor: '#f1f5f9' },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 12 },
  head: { backgroundColor: '#eff6ff' },
  cell: { width: 110, paddingHorizontal: 8, color: '#334155', fontSize: 12 },
  name: { width: 300 },
  category: { width: 180 },
  kpi: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, flexGrow: 1, minWidth: 160, gap: 8 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  picker: { width: '100%', maxWidth: 360, backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 14 },
  pickerOption: { padding: 14, minHeight: 44, borderRadius: 8 },
});
