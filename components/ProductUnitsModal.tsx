import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiService, type ProductUnit } from '@/services/api';

export function ProductUnitsModal({
  product,
  codes,
  onClose,
  onSaved,
  isDark = false,
}: {
  product: { id: string; name: string } | null;
  codes?: string[];
  onClose: () => void;
  onSaved: () => void;
  isDark?: boolean;
}) {
  const [units, setUnits] = useState<ProductUnit[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    if (!product) return;
    setLoading(true);
    setMessage(null);
    setQuery('');
    setUnits([]);
    apiService
      .getProductUnits(product.id)
      .then((data) => {
        if (!active) return;
        setUnits(data);
        setDrafts(Object.fromEntries(data.map((unit) => [unit.code, unit.manufacturerSerial || ''])));
      })
      .catch((error) => {
        if (active) setMessage({ text: error.message || 'Lỗi tải danh sách mã máy', type: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [product]);

  const handleSave = async (unit: ProductUnit) => {
    const rawVal = drafts[unit.code] || '';
    setSavingCode(unit.code);
    setMessage(null);
    try {
      await apiService.updateUnitSerial(unit.code, rawVal);
      const cleanVal = rawVal.trim().toUpperCase() || null;
      setUnits((prev) =>
        prev.map((row) => (row.code === unit.code ? { ...row, manufacturerSerial: cleanVal } : row))
      );
      setMessage({
        text: cleanVal
          ? `Đã lưu IMEI/Serial: ${cleanVal} cho mã ${unit.code}`
          : `Đã xóa số IMEI cho mã ${unit.code}`,
        type: 'success',
      });
      onSaved();
    } catch (error: any) {
      setMessage({
        text: error.message || 'Không thể lưu serial máy',
        type: 'error',
      });
    } finally {
      setSavingCode(null);
    }
  };

  const handleAutoFillAll = async () => {
    if (!product) return;
    setIsAutoFilling(true);
    setMessage(null);
    try {
      const res: any = await apiService.autoFillProductSerials(product.id);
      const data = await apiService.getProductUnits(product.id);
      setUnits(data);
      setDrafts(Object.fromEntries(data.map((unit) => [unit.code, unit.manufacturerSerial || ''])));
      setMessage({
        text: res.message || 'Đã tự sinh IMEI/Serial cho toàn bộ máy chưa có',
        type: 'success',
      });
      onSaved();
    } catch (error: any) {
      setMessage({
        text: error.message || 'Lỗi tự sinh serial',
        type: 'error',
      });
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleAutoGenerateOne = async (unit: ProductUnit) => {
    setSavingCode(unit.code);
    setMessage(null);
    try {
      const res: any = await apiService.autoGenerateUnitSerial(unit.code);
      const newSerial = res.manufacturerSerial;
      setUnits((prev) =>
        prev.map((row) => (row.code === unit.code ? { ...row, manufacturerSerial: newSerial } : row))
      );
      setDrafts((prev) => ({ ...prev, [unit.code]: newSerial || '' }));
      setMessage({
        text: `Đã tự sinh IMEI/Serial: ${newSerial} cho mã ${unit.code}`,
        type: 'success',
      });
      onSaved();
    } catch (error: any) {
      setMessage({
        text: error.message || 'Lỗi tự sinh serial',
        type: 'error',
      });
    } finally {
      setSavingCode(null);
    }
  };

  const statusConfig = {
    available: { label: 'Trong kho', bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
    allocated: { label: 'Đã gắn đơn', bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
    removed: { label: 'Đã xuất kho', bg: '#f4f4f5', text: '#71717a', border: '#e4e4e7' },
    retired: { label: 'Đơn đã hủy', bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  };

  const filteredUnits = useMemo(() => {
    const q = query.trim().toLowerCase();
    return units.filter((unit) => {
      const matchScope = !codes || codes.includes(unit.code);
      if (!matchScope) return false;
      if (!q) return true;
      return (
        unit.code.toLowerCase().includes(q) ||
        (unit.manufacturerSerial || '').toLowerCase().includes(q) ||
        String(unit.orderId || '').includes(q)
      );
    });
  }, [units, codes, query]);

  const totalCount = units.length;
  const hasSerialCount = units.filter((u) => !!u.manufacturerSerial).length;
  const missingSerialCount = totalCount - hasSerialCount;

  if (!product) return null;

  return (
    <Modal visible={!!product} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.dialogCard, isDark && styles.dialogCardDark]}>
          {/* HEADER */}
          <View style={[styles.headerRow, isDark && styles.headerRowDark]}>
            <View style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <View style={styles.headerIconWrap}>
                  <Ionicons name="hardware-chip-outline" size={18} color="#2563eb" />
                </View>
                <Text style={[styles.title, isDark && styles.textDark]}>
                  Quản lý IMEI & Mã Bảo Hành (S/N)
                </Text>
                {codes && codes.length > 0 ? (
                  <View style={styles.filteredBadge}>
                    <Text style={styles.filteredBadgeText}>Đang lọc theo đơn hàng ({codes.length} máy)</Text>
                  </View>
                ) : null}
              </View>
              <Text style={[styles.productName, isDark && styles.textMutedDark]} numberOfLines={1}>
                {product.name} <Text style={{ fontWeight: '400', fontSize: 11 }}>• SKU: {product.id}</Text>
              </Text>
            </View>

            <Pressable
              style={({ hovered }: any) => [
                styles.closeBtn,
                hovered && (isDark ? styles.closeBtnHoverDark : styles.closeBtnHover),
              ]}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
            </Pressable>
          </View>

          {/* EXPLANATORY HINT BOX */}
          <View style={[styles.guideBox, isDark && styles.guideBoxDark]}>
            <Ionicons name="lock-closed" size={17} color="#059669" style={{ marginTop: 1 }} />
            <Text style={[styles.guideText, isDark && styles.guideTextDark]}>
              Mỗi thiết bị có một mã bảo hành nội bộ (<Text style={{ fontWeight: '700' }}>BH-...</Text>) và số{' '}
              <Text style={{ fontWeight: '700' }}>IMEI / Serial phần cứng</Text> cố định vĩnh viễn theo máy.
              Khi đã cấp IMEI, hệ thống tự động khóa niêm phong để đảm bảo tính xác thực khi khách tra cứu bảo hành.
            </Text>
          </View>

          {/* STATS CHIPS & SEARCH */}
          <View style={styles.toolbarRow}>
            <View style={styles.statsWrap}>
              <View style={[styles.statChip, isDark && styles.statChipDark]}>
                <Text style={[styles.statChipLabel, isDark && styles.textMutedDark]}>Tổng máy:</Text>
                <Text style={[styles.statChipVal, isDark && styles.textDark]}>{totalCount}</Text>
              </View>
              <View style={[styles.statChip, { backgroundColor: isDark ? '#064e3b33' : '#ecfdf5' }]}>
                <Text style={[styles.statChipLabel, { color: '#059669' }]}>Đã có IMEI:</Text>
                <Text style={[styles.statChipVal, { color: '#059669' }]}>{hasSerialCount}</Text>
              </View>
              {missingSerialCount > 0 ? (
                <View style={[styles.statChip, { backgroundColor: isDark ? '#78350f33' : '#fffbeb' }]}>
                  <Text style={[styles.statChipLabel, { color: '#d97706' }]}>Chưa nhập:</Text>
                  <Text style={[styles.statChipVal, { color: '#d97706' }]}>{missingSerialCount}</Text>
                </View>
              ) : null}

              {missingSerialCount > 0 && !codes ? (
                <Pressable
                  disabled={isAutoFilling}
                  style={[styles.btnAutoFillAll, isAutoFilling && { opacity: 0.6 }]}
                  onPress={handleAutoFillAll}
                >
                  {isAutoFilling ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="flash" size={11} color="#ffffff" style={{ marginRight: 3 }} />
                      <Text style={styles.btnAutoFillAllText}>Tự sinh ({missingSerialCount})</Text>
                    </>
                  )}
                </Pressable>
              ) : null}
            </View>

            <View style={[styles.searchBox, isDark && styles.searchBoxDark]}>
              <Ionicons name="search-outline" size={15} color="#94a3b8" />
              <TextInput
                placeholder="Tìm mã BH, số IMEI hoặc đơn hàng..."
                placeholderTextColor="#94a3b8"
                value={query}
                onChangeText={setQuery}
                style={[styles.searchInput, isDark && styles.textDark]}
              />
              {query ? (
                <Pressable onPress={() => setQuery('')}>
                  <Ionicons name="close-circle" size={15} color="#94a3b8" />
                </Pressable>
              ) : null}
            </View>
          </View>

          {/* ALERT MESSAGE */}
          {message && (
            <View
              style={[
                styles.messageAlert,
                message.type === 'success' ? styles.messageSuccess : styles.messageError,
              ]}
            >
              <Ionicons
                name={message.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
                size={16}
                color={message.type === 'success' ? '#15803d' : '#b91c1c'}
              />
              <Text
                style={[
                  styles.messageText,
                  { color: message.type === 'success' ? '#15803d' : '#b91c1c' },
                ]}
              >
                {message.text}
              </Text>
            </View>
          )}

          {/* UNIT LIST */}
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={[styles.loadingText, isDark && styles.textMutedDark]}>
                Đang tải danh sách thiết bị và mã bảo hành...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flexGrow: 1, flexShrink: 1 }}
              contentContainerStyle={styles.scrollList}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredUnits.length === 0 ? (
                <View style={styles.emptyWrap}>
                  <Ionicons name="cube-outline" size={40} color="#94a3b8" />
                  <Text style={[styles.emptyTitle, isDark && styles.textDark]}>
                    Không tìm thấy máy nào
                  </Text>
                  <Text style={styles.emptySub}>
                    {query ? 'Thử tìm với từ khóa khác hoặc xóa bộ lọc' : 'Sản phẩm này hiện chưa có chiếc nào trong kho'}
                  </Text>
                </View>
              ) : (
                filteredUnits.map((unit) => {
                  const cfg = statusConfig[unit.status] || statusConfig.available;
                  const currentDraft = drafts[unit.code] ?? (unit.manufacturerSerial || '');
                  const isDirty = currentDraft.trim().toUpperCase() !== (unit.manufacturerSerial || '').trim().toUpperCase();
                  const isSavingThis = savingCode === unit.code;

                  return (
                    <View key={unit.code} style={[styles.unitCard, isDark && styles.unitCardDark]}>
                      {/* UNIT CARD TOP */}
                      <View style={styles.unitCardTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                          <View style={styles.unitCodeBadge}>
                            <Ionicons name="barcode-outline" size={13} color="#2563eb" />
                            <Text selectable style={styles.unitCodeText}>
                              {unit.code}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.statusTag,
                              { backgroundColor: cfg.bg, borderColor: cfg.border },
                            ]}
                          >
                            <Text style={[styles.statusTagText, { color: cfg.text }]}>
                              {cfg.label}
                            </Text>
                          </View>

                          {unit.orderId ? (
                            <View style={styles.orderTag}>
                              <Ionicons name="receipt-outline" size={11} color="#475569" />
                              <Text style={styles.orderTagText}>Đơn #{unit.orderId}</Text>
                            </View>
                          ) : null}
                        </View>

                        {unit.manufacturerSerial ? (
                          <View style={styles.syncedCheck}>
                            <Ionicons name="lock-closed" size={13} color="#059669" />
                            <Text style={styles.syncedCheckText}>IMEI Cố định</Text>
                          </View>
                        ) : (
                          <View style={styles.unSyncedCheck}>
                            <Ionicons name="alert-circle-outline" size={13} color="#d97706" />
                            <Text style={styles.unSyncedCheckText}>Chờ gán IMEI</Text>
                          </View>
                        )}
                      </View>

                      {/* UNIT CARD: NẾU ĐÃ CÓ IMEI THÌ CỐ ĐỊNH KHÓA VĨNH VIỄN, KHÔNG ĐƯỢC PHÉP SỬA */}
                      {unit.manufacturerSerial ? (
                        <View style={[styles.lockedSerialBox, isDark && styles.lockedSerialBoxDark]}>
                          <View style={styles.lockedSerialIconWrap}>
                            <Ionicons name="lock-closed" size={15} color="#059669" />
                          </View>
                          <View style={{ flex: 1, minWidth: 0 }}>
                            <Text style={[styles.lockedSerialTitle, isDark && styles.textMutedDark]}>
                              IMEI / Serial máy (Đã cố định & niêm phong):
                            </Text>
                            <Text selectable style={styles.lockedSerialValue}>
                              {unit.manufacturerSerial}
                            </Text>
                          </View>
                          <View style={styles.lockedPillBadge}>
                            <Ionicons name="shield-checkmark" size={12} color="#059669" />
                            <Text style={styles.lockedPillText}>Đã niêm phong</Text>
                          </View>
                        </View>
                      ) : (
                        /* CHƯA CÓ IMEI: CHO PHÉP NHẬP TAY HOẶC BẤM TỰ SINH LẦN ĐẦU TIÊN */
                        <View style={styles.unitInputRow}>
                          <View style={[styles.inputBox, isDark && styles.inputBoxDark]}>
                            <Ionicons name="pricetag-outline" size={15} color="#94a3b8" style={{ marginRight: 6 }} />
                            <TextInput
                              placeholder="Nhập số IMEI / Serial từ tem máy (VD: SN-LP-4F8A91)..."
                              placeholderTextColor="#94a3b8"
                              maxLength={100}
                              value={currentDraft}
                              onChangeText={(value) =>
                                setDrafts((prev) => ({ ...prev, [unit.code]: value }))
                              }
                              style={[styles.inputField, isDark && styles.textDark]}
                            />
                            {currentDraft ? (
                              <Pressable onPress={() => setDrafts((prev) => ({ ...prev, [unit.code]: '' }))} style={{ paddingHorizontal: 3 }}>
                                <Ionicons name="close-circle" size={15} color="#94a3b8" />
                              </Pressable>
                            ) : null}
                            <Pressable
                              disabled={isSavingThis}
                              onPress={() => handleAutoGenerateOne(unit)}
                              style={styles.btnQuickGenerate}
                            >
                              <Ionicons name="sparkles" size={11} color="#2563eb" />
                              <Text style={styles.btnQuickGenerateText}>Tự sinh</Text>
                            </Pressable>
                          </View>

                          <Pressable
                            disabled={isSavingThis || !currentDraft.trim()}
                            style={({ hovered }: any) => [
                              styles.saveBtn,
                              styles.saveBtnHighlight,
                              hovered && !isSavingThis && styles.saveBtnHover,
                              (isSavingThis || !currentDraft.trim()) && { opacity: 0.5 },
                            ]}
                            onPress={() => handleSave(unit)}
                          >
                            {isSavingThis ? (
                              <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                              <>
                                <Ionicons name="lock-closed-outline" size={13} color="#ffffff" style={{ marginRight: 4 }} />
                                <Text style={styles.saveBtnText}>Lưu & Khóa</Text>
                              </>
                            )}
                          </Pressable>
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* FOOTER */}
          <View style={[styles.footerRow, isDark && styles.footerRowDark]}>
            <Text style={[styles.footerHint, isDark && styles.textMutedDark]}>
              Khách hàng có thể tra cứu hạn bảo hành tại trang <Text style={{ fontWeight: '700' }}>/warranty</Text> bằng IMEI này.
            </Text>
            <Pressable
              style={({ hovered }: any) => [
                styles.closeFooterBtn,
                hovered && (isDark ? styles.closeBtnHoverDark : styles.closeBtnHover),
              ]}
              onPress={onClose}
            >
              <Text style={[styles.closeFooterBtnText, isDark && styles.textDark]}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    width: '100%',
    maxWidth: 780,
    maxHeight: '90%',
    flexDirection: 'column',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dialogCardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerRowDark: {
    borderBottomColor: '#1e293b',
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  filteredBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  filteredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  closeBtnHover: {
    backgroundColor: '#f1f5f9',
  },
  closeBtnHoverDark: {
    backgroundColor: '#1e293b',
  },
  guideBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 14,
  },
  guideBoxDark: {
    backgroundColor: '#082f4944',
    borderColor: '#0369a144',
  },
  guideText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#0369a1',
  },
  guideTextDark: {
    color: '#7dd3fc',
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  statsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statChipDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  statChipLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  statChipVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
    flex: 1,
    minWidth: 200,
  },
  searchBoxDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    paddingHorizontal: 6,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  messageAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  messageSuccess: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  messageError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  loadingWrap: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748b',
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    gap: 10,
  },
  emptyWrap: {
    padding: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  unitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  unitCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  unitCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  unitCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unitCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  statusTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  orderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  orderTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  syncedCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  syncedCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  unSyncedCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  unSyncedCheckText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d97706',
  },
  lockedSerialBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lockedSerialBoxDark: {
    backgroundColor: '#064e3b22',
    borderColor: '#065f46',
  },
  lockedSerialIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedSerialTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  lockedSerialValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  lockedPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  unitInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  inputBoxDark: {
    backgroundColor: '#0f172a',
    borderColor: '#334155',
  },
  inputField: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveBtnHighlight: {
    backgroundColor: '#059669',
  },
  saveBtnHover: {
    opacity: 0.9,
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnAutoFillAll: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  btnAutoFillAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnQuickGenerate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  btnQuickGenerateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563eb',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  footerRowDark: {
    borderTopColor: '#1e293b',
    backgroundColor: '#0b1120',
  },
  footerHint: {
    fontSize: 11,
    color: '#64748b',
    flex: 1,
    paddingRight: 10,
  },
  closeFooterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  closeFooterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  textDark: {
    color: '#f8fafc',
  },
  textMutedDark: {
    color: '#94a3b8',
  },
});
